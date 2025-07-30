const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
const axios = require("axios")
const crypto = require("crypto")

class PaymentService {
  // Stripe payment methods
  static async createStripePaymentIntent(amount, currency = "usd", metadata = {}) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        metadata,
        automatic_payment_methods: {
          enabled: true,
        },
      })

      return {
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      }
    } catch (error) {
      console.error("Stripe payment intent creation error:", error)
      return {
        success: false,
        error: error.message,
      }
    }
  }

  static async confirmStripePayment(paymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

      return {
        success: paymentIntent.status === "succeeded",
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        paymentMethod: paymentIntent.payment_method,
      }
    } catch (error) {
      console.error("Stripe payment confirmation error:", error)
      return {
        success: false,
        error: error.message,
      }
    }
  }

  // Chapa payment methods (Ethiopian payment gateway)
  static async initializeChapaPayment(
    amount,
    currency = "ETB",
    email,
    firstName,
    lastName,
    phone,
    txRef,
    callbackUrl,
    returnUrl,
  ) {
    try {
      const chapaUrl = process.env.CHAPA_BASE_URL || "https://api.chapa.co/v1"

      const payload = {
        amount: amount.toString(),
        currency,
        email,
        first_name: firstName,
        last_name: lastName,
        phone_number: phone,
        tx_ref: txRef,
        callback_url: callbackUrl,
        return_url: returnUrl,
        customization: {
          title: "Hulet Fish Tourism",
          description: "Cultural Experience Booking Payment",
          logo: process.env.FRONTEND_URL + "/images/hulet-fish-logo.png",
        },
      }

      const response = await axios.post(`${chapaUrl}/transaction/initialize`, payload, {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      })

      if (response.data.status === "success") {
        return {
          success: true,
          checkoutUrl: response.data.data.checkout_url,
          txRef: txRef,
        }
      } else {
        return {
          success: false,
          error: response.data.message || "Failed to initialize payment",
        }
      }
    } catch (error) {
      console.error("Chapa payment initialization error:", error)
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      }
    }
  }

  static async verifyChapaPayment(txRef) {
    try {
      const chapaUrl = process.env.CHAPA_BASE_URL || "https://api.chapa.co/v1"

      const response = await axios.get(`${chapaUrl}/transaction/verify/${txRef}`, {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        },
      })

      if (response.data.status === "success") {
        const data = response.data.data
        return {
          success: data.status === "success",
          status: data.status,
          amount: Number.parseFloat(data.amount),
          currency: data.currency,
          txRef: data.tx_ref,
          reference: data.reference,
          paymentMethod: data.method,
        }
      } else {
        return {
          success: false,
          error: response.data.message || "Payment verification failed",
        }
      }
    } catch (error) {
      console.error("Chapa payment verification error:", error)
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      }
    }
  }

  // Currency conversion utility
  static async convertCurrency(amount, fromCurrency, toCurrency) {
    try {
      // For demo purposes, using fixed exchange rates
      // In production, use a real currency conversion API
      const exchangeRates = {
        ETB_USD: 0.018, // 1 ETB = 0.018 USD (approximate)
        USD_ETB: 55.5, // 1 USD = 55.5 ETB (approximate)
        ETB_EUR: 0.016, // 1 ETB = 0.016 EUR (approximate)
        EUR_ETB: 62.5, // 1 EUR = 62.5 ETB (approximate)
      }

      const rateKey = `${fromCurrency}_${toCurrency}`
      const rate = exchangeRates[rateKey]

      if (!rate) {
        // If no direct rate, convert through USD
        if (fromCurrency !== "USD" && toCurrency !== "USD") {
          const toUsd = exchangeRates[`${fromCurrency}_USD`]
          const fromUsd = exchangeRates[`USD_${toCurrency}`]
          if (toUsd && fromUsd) {
            return amount * toUsd * fromUsd
          }
        }
        return amount // Return original amount if no conversion available
      }

      return amount * rate
    } catch (error) {
      console.error("Currency conversion error:", error)
      return amount // Return original amount on error
    }
  }

  // Generate unique transaction reference
  static generateTxRef(prefix = "HF") {
    const timestamp = Date.now().toString()
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    return `${prefix}_${timestamp}_${random}`
  }

  // Validate webhook signature (for Chapa)
  static validateChapaWebhook(payload, signature) {
    try {
      const expectedSignature = crypto
        .createHmac("sha256", process.env.CHAPA_WEBHOOK_SECRET)
        .update(payload)
        .digest("hex")

      return crypto.timingSafeEqual(Buffer.from(signature, "hex"), Buffer.from(expectedSignature, "hex"))
    } catch (error) {
      console.error("Webhook validation error:", error)
      return false
    }
  }

  // Validate Stripe webhook signature
  static validateStripeWebhook(payload, signature) {
    try {
      const event = stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET)
      return { success: true, event }
    } catch (error) {
      console.error("Stripe webhook validation error:", error)
      return { success: false, error: error.message }
    }
  }
}

module.exports = PaymentService
