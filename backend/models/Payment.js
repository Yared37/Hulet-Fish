const mongoose = require("mongoose")

const paymentSchema = new mongoose.Schema(
  {
    paymentId: {
      type: String,
      unique: true,
      required: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0, "Amount cannot be negative"],
    },
    currency: {
      type: String,
      required: true,
      enum: ["ETB", "USD", "EUR"],
      default: "ETB",
    },
    originalAmount: {
      type: Number,
      required: true,
    },
    originalCurrency: {
      type: String,
      required: true,
    },
    exchangeRate: {
      type: Number,
      default: 1,
    },
    paymentMethod: {
      type: String,
      enum: ["stripe", "chapa", "bank_transfer", "cash"],
      required: true,
    },
    paymentGateway: {
      type: String,
      enum: ["stripe", "chapa", "manual"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed", "cancelled", "refunded"],
      default: "pending",
    },
    gatewayResponse: {
      transactionId: String,
      paymentIntentId: String, // For Stripe
      txRef: String, // For Chapa
      reference: String,
      gatewayStatus: String,
      gatewayMessage: String,
      paymentMethodDetails: mongoose.Schema.Types.Mixed,
    },
    customerInfo: {
      email: {
        type: String,
        required: true,
      },
      phone: String,
      name: {
        type: String,
        required: true,
      },
      address: {
        country: String,
        city: String,
        line1: String,
        postalCode: String,
      },
    },
    fees: {
      platformFee: {
        type: Number,
        default: 0,
      },
      gatewayFee: {
        type: Number,
        default: 0,
      },
      totalFees: {
        type: Number,
        default: 0,
      },
    },
    refund: {
      refundId: String,
      refundAmount: Number,
      refundDate: Date,
      refundReason: String,
      refundStatus: {
        type: String,
        enum: ["pending", "completed", "failed"],
      },
    },
    metadata: {
      ipAddress: String,
      userAgent: String,
      source: {
        type: String,
        enum: ["web", "mobile", "api"],
        default: "web",
      },
    },
    timestamps: {
      initiatedAt: {
        type: Date,
        default: Date.now,
      },
      completedAt: Date,
      failedAt: Date,
      refundedAt: Date,
    },
    webhookEvents: [
      {
        eventType: String,
        eventData: mongoose.Schema.Types.Mixed,
        processedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
)

// Generate unique payment ID
paymentSchema.pre("save", async function (next) {
  if (!this.paymentId) {
    const date = new Date()
    const year = date.getFullYear().toString().slice(-2)
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const day = date.getDate().toString().padStart(2, "0")

    // Find the last payment of the day
    const lastPayment = await this.constructor
      .findOne({
        paymentId: new RegExp(`^PAY${year}${month}${day}`),
      })
      .sort({ paymentId: -1 })

    let sequence = 1
    if (lastPayment) {
      const lastSequence = Number.parseInt(lastPayment.paymentId.slice(-4))
      sequence = lastSequence + 1
    }

    this.paymentId = `PAY${year}${month}${day}${sequence.toString().padStart(4, "0")}`
  }
  next()
})

// Update timestamps based on status changes
paymentSchema.pre("save", function (next) {
  if (this.isModified("status")) {
    const now = new Date()
    switch (this.status) {
      case "completed":
        if (!this.timestamps.completedAt) {
          this.timestamps.completedAt = now
        }
        break
      case "failed":
        if (!this.timestamps.failedAt) {
          this.timestamps.failedAt = now
        }
        break
      case "refunded":
        if (!this.timestamps.refundedAt) {
          this.timestamps.refundedAt = now
        }
        break
    }
  }
  next()
})

// Indexes for better query performance
paymentSchema.index({ paymentId: 1 })
paymentSchema.index({ booking: 1 })
paymentSchema.index({ user: 1 })
paymentSchema.index({ status: 1 })
paymentSchema.index({ paymentMethod: 1 })
paymentSchema.index({ "gatewayResponse.txRef": 1 })
paymentSchema.index({ "gatewayResponse.paymentIntentId": 1 })
paymentSchema.index({ createdAt: -1 })

module.exports = mongoose.model("Payment", paymentSchema)
