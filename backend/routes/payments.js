const express = require("express")
const { body, validationResult } = require("express-validator")
const Payment = require("../models/Payment")
const Booking = require("../models/Booking")
const User = require("../models/User")
const CulturalOffering = require("../models/CulturalOffering")
const PaymentService = require("../utils/paymentService")
const auth = require("../middleware/auth")
const authorize = require("../middleware/authorize")

const router = express.Router()

// @desc    Initialize payment checkout
// @route   POST /api/payments/checkout
// @access  Private (Tourist)
router.post(
  "/checkout",
  [
    auth,
    authorize("tourist", "admin"),
    body("bookingId").isMongoId().withMessage("Valid booking ID is required"),
    body("paymentMethod").isIn(["stripe", "chapa"]).withMessage("Valid payment method is required"),
    body("currency").optional().isIn(["ETB", "USD", "EUR"]).withMessage("Valid currency is required"),
    body("returnUrl").optional().isURL().withMessage("Valid return URL is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        })
      }

      const { bookingId, paymentMethod, currency = "ETB", returnUrl } = req.body

      // Find the booking
      const booking = await Booking.findOne({
        _id: bookingId,
        tourist: req.user.userId,
        status: { $in: ["pending", "confirmed"] },
      }).populate([
        {
          path: "culturalOffering",
          select: "title price currency",
        },
        {
          path: "tourist",
          select: "name email phone",
        },
      ])

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Booking not found or not eligible for payment",
        })
      }

      // Check if payment already exists
      const existingPayment = await Payment.findOne({
        booking: bookingId,
        status: { $in: ["pending", "processing", "completed"] },
      })

      if (existingPayment) {
        return res.status(400).json({
          success: false,
          message: "Payment already exists for this booking",
          paymentId: existingPayment.paymentId,
        })
      }

      // Calculate amounts and fees
      const originalAmount = booking.totalAmount
      const originalCurrency = booking.currency

      // Convert currency if needed
      let finalAmount = originalAmount
      let exchangeRate = 1

      if (currency !== originalCurrency) {
        finalAmount = await PaymentService.convertCurrency(originalAmount, originalCurrency, currency)
        exchangeRate = finalAmount / originalAmount
      }

      // Calculate platform fees (5% platform fee)
      const platformFee = finalAmount * 0.05
      const gatewayFee = paymentMethod === "stripe" ? finalAmount * 0.029 + 0.3 : finalAmount * 0.025 // Stripe: 2.9% + $0.30, Chapa: 2.5%
      const totalFees = platformFee + gatewayFee
      const totalAmount = finalAmount + totalFees

      // Create payment record
      const payment = new Payment({
        booking: bookingId,
        user: req.user.userId,
        amount: totalAmount,
        currency,
        originalAmount,
        originalCurrency,
        exchangeRate,
        paymentMethod,
        paymentGateway: paymentMethod,
        customerInfo: {
          email: booking.tourist.email,
          phone: booking.tourist.phone,
          name: booking.tourist.name,
        },
        fees: {
          platformFee,
          gatewayFee,
          totalFees,
        },
        metadata: {
          ipAddress: req.ip,
          userAgent: req.get("User-Agent"),
          source: "web",
        },
      })

      await payment.save()

      let paymentResponse

      if (paymentMethod === "stripe") {
        // Initialize Stripe payment
        paymentResponse = await PaymentService.createStripePaymentIntent(totalAmount, currency, {
          bookingId: booking.bookingId,
          paymentId: payment.paymentId,
          culturalOffering: booking.culturalOffering.title,
        })

        if (paymentResponse.success) {
          payment.gatewayResponse.paymentIntentId = paymentResponse.paymentIntentId
          payment.status = "processing"
          await payment.save()

          return res.json({
            success: true,
            message: "Payment initialized successfully",
            data: {
              paymentId: payment.paymentId,
              clientSecret: paymentResponse.clientSecret,
              amount: totalAmount,
              currency,
              fees: payment.fees,
            },
          })
        }
      } else if (paymentMethod === "chapa") {
        // Initialize Chapa payment
        const txRef = PaymentService.generateTxRef("HF")
        const callbackUrl = `${process.env.BACKEND_URL}/api/payments/webhook/chapa`
        const finalReturnUrl = returnUrl || `${process.env.FRONTEND_URL}/booking-confirmation`

        paymentResponse = await PaymentService.initializeChapaPayment(
          totalAmount,
          currency,
          booking.tourist.email,
          booking.tourist.name.split(" ")[0],
          booking.tourist.name.split(" ").slice(1).join(" ") || "User",
          booking.tourist.phone,
          txRef,
          callbackUrl,
          finalReturnUrl,
        )

        if (paymentResponse.success) {
          payment.gatewayResponse.txRef = txRef
          payment.status = "processing"
          await payment.save()

          return res.json({
            success: true,
            message: "Payment initialized successfully",
            data: {
              paymentId: payment.paymentId,
              checkoutUrl: paymentResponse.checkoutUrl,
              txRef,
              amount: totalAmount,
              currency,
              fees: payment.fees,
            },
          })
        }
      }

      // If payment initialization failed
      payment.status = "failed"
      payment.gatewayResponse.gatewayMessage = paymentResponse.error
      await payment.save()

      res.status(400).json({
        success: false,
        message: "Failed to initialize payment",
        error: paymentResponse.error,
      })
    } catch (error) {
      console.error("Payment checkout error:", error)
      res.status(500).json({
        success: false,
        message: "Server error during payment initialization",
      })
    }
  },
)

// @desc    Verify payment status
// @route   GET /api/payments/:paymentId/verify
// @access  Private
router.get("/:paymentId/verify", auth, async (req, res) => {
  try {
    const payment = await Payment.findOne({
      paymentId: req.params.paymentId,
      user: req.user.userId,
    }).populate([
      {
        path: "booking",
        select: "bookingId status",
      },
    ])

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      })
    }

    let verificationResult

    if (payment.paymentGateway === "stripe" && payment.gatewayResponse.paymentIntentId) {
      verificationResult = await PaymentService.confirmStripePayment(payment.gatewayResponse.paymentIntentId)
    } else if (payment.paymentGateway === "chapa" && payment.gatewayResponse.txRef) {
      verificationResult = await PaymentService.verifyChapaPayment(payment.gatewayResponse.txRef)
    } else {
      return res.json({
        success: true,
        data: {
          paymentId: payment.paymentId,
          status: payment.status,
          amount: payment.amount,
          currency: payment.currency,
        },
      })
    }

    if (verificationResult.success) {
      // Update payment status
      payment.status = "completed"
      payment.gatewayResponse.gatewayStatus = verificationResult.status
      payment.gatewayResponse.reference = verificationResult.reference || verificationResult.paymentMethod
      await payment.save()

      // Update booking payment status
      await Booking.findByIdAndUpdate(payment.booking._id, {
        paymentStatus: "paid",
        status: "confirmed",
      })

      res.json({
        success: true,
        message: "Payment verified successfully",
        data: {
          paymentId: payment.paymentId,
          status: payment.status,
          amount: payment.amount,
          currency: payment.currency,
          bookingId: payment.booking.bookingId,
        },
      })
    } else {
      payment.status = "failed"
      payment.gatewayResponse.gatewayMessage = verificationResult.error
      await payment.save()

      res.status(400).json({
        success: false,
        message: "Payment verification failed",
        error: verificationResult.error,
      })
    }
  } catch (error) {
    console.error("Payment verification error:", error)
    res.status(500).json({
      success: false,
      message: "Server error during payment verification",
    })
  }
})

// @desc    Get payment history
// @route   GET /api/payments/history
// @access  Private
router.get("/history", auth, async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const filter = { user: req.user.userId }

    if (req.query.status) {
      filter.status = req.query.status
    }

    const payments = await Payment.find(filter)
      .populate([
        {
          path: "booking",
          select: "bookingId bookingDate status",
          populate: {
            path: "culturalOffering",
            select: "title category images",
          },
        },
      ])
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Payment.countDocuments(filter)

    res.json({
      success: true,
      data: {
        payments,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      },
    })
  } catch (error) {
    console.error("Payment history error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while fetching payment history",
    })
  }
})

// @desc    Stripe webhook handler
// @route   POST /api/payments/webhook/stripe
// @access  Public (webhook)
router.post("/webhook/stripe", express.raw({ type: "application/json" }), async (req, res) => {
  try {
    const signature = req.headers["stripe-signature"]
    const validation = PaymentService.validateStripeWebhook(req.body, signature)

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid webhook signature",
      })
    }

    const event = validation.event

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object

      // Find payment by payment intent ID
      const payment = await Payment.findOne({
        "gatewayResponse.paymentIntentId": paymentIntent.id,
      })

      if (payment) {
        payment.status = "completed"
        payment.gatewayResponse.gatewayStatus = paymentIntent.status
        payment.gatewayResponse.paymentMethodDetails = paymentIntent.payment_method
        payment.webhookEvents.push({
          eventType: event.type,
          eventData: event.data.object,
        })
        await payment.save()

        // Update booking
        await Booking.findByIdAndUpdate(payment.booking, {
          paymentStatus: "paid",
          status: "confirmed",
        })
      }
    }

    res.json({ received: true })
  } catch (error) {
    console.error("Stripe webhook error:", error)
    res.status(500).json({
      success: false,
      message: "Webhook processing failed",
    })
  }
})

// @desc    Chapa webhook handler
// @route   POST /api/payments/webhook/chapa
// @access  Public (webhook)
router.post("/webhook/chapa", async (req, res) => {
  try {
    const signature = req.headers["x-chapa-signature"]
    const isValid = PaymentService.validateChapaWebhook(JSON.stringify(req.body), signature)

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid webhook signature",
      })
    }

    const { tx_ref, status, amount, currency } = req.body

    // Find payment by transaction reference
    const payment = await Payment.findOne({
      "gatewayResponse.txRef": tx_ref,
    })

    if (payment) {
      if (status === "success") {
        payment.status = "completed"
        payment.gatewayResponse.gatewayStatus = status
        payment.gatewayResponse.reference = req.body.reference
        payment.webhookEvents.push({
          eventType: "payment.success",
          eventData: req.body,
        })
        await payment.save()

        // Update booking
        await Booking.findByIdAndUpdate(payment.booking, {
          paymentStatus: "paid",
          status: "confirmed",
        })
      } else {
        payment.status = "failed"
        payment.gatewayResponse.gatewayStatus = status
        payment.gatewayResponse.gatewayMessage = req.body.message
        await payment.save()
      }
    }

    res.json({ success: true })
  } catch (error) {
    console.error("Chapa webhook error:", error)
    res.status(500).json({
      success: false,
      message: "Webhook processing failed",
    })
  }
})

// @desc    Request refund
// @route   POST /api/payments/:paymentId/refund
// @access  Private
router.post(
  "/:paymentId/refund",
  [
    auth,
    body("reason").trim().notEmpty().withMessage("Refund reason is required"),
    body("amount").optional().isFloat({ min: 0 }).withMessage("Valid refund amount is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        })
      }

      const payment = await Payment.findOne({
        paymentId: req.params.paymentId,
        user: req.user.userId,
        status: "completed",
      }).populate("booking")

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: "Payment not found or not eligible for refund",
        })
      }

      // Check if booking can be cancelled
      const booking = payment.booking
      const bookingDate = new Date(booking.bookingDate)
      const now = new Date()
      const hoursUntilBooking = (bookingDate - now) / (1000 * 60 * 60)

      if (hoursUntilBooking < 24) {
        return res.status(400).json({
          success: false,
          message: "Cannot refund bookings within 24 hours of the experience",
        })
      }

      const refundAmount = req.body.amount || payment.amount

      // For demo purposes, we'll mark as refund pending
      // In production, integrate with actual gateway refund APIs
      payment.status = "refunded"
      payment.refund = {
        refundAmount,
        refundDate: new Date(),
        refundReason: req.body.reason,
        refundStatus: "pending",
      }
      await payment.save()

      // Update booking status
      await Booking.findByIdAndUpdate(booking._id, {
        status: "cancelled",
        cancellationReason: req.body.reason,
        paymentStatus: "refunded",
      })

      res.json({
        success: true,
        message: "Refund request submitted successfully",
        data: {
          paymentId: payment.paymentId,
          refundAmount,
          refundStatus: "pending",
        },
      })
    } catch (error) {
      console.error("Refund request error:", error)
      res.status(500).json({
        success: false,
        message: "Server error while processing refund request",
      })
    }
  },
)

module.exports = router
