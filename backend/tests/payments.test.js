const request = require("supertest")
const app = require("../server")
const User = require("../models/User")
const Tour = require("../models/Tour")
const Booking = require("../models/Booking")
const Payment = require("../models/Payment")

describe("Payment Endpoints", () => {
  let touristToken, hostToken
  let tourist, host
  let tour, booking

  beforeEach(async () => {
    // Create test users
    const touristData = {
      name: "Tourist User",
      email: "tourist@example.com",
      password: "password123",
      role: "tourist",
    }

    const hostData = {
      name: "Host User",
      email: "host@example.com",
      password: "password123",
      role: "host",
    }

    const touristResponse = await request(app).post("/api/auth/register").send(touristData)

    const hostResponse = await request(app).post("/api/auth/register").send(hostData)

    tourist = await User.findById(touristResponse.body.data.user._id)
    host = await User.findById(hostResponse.body.data.user._id)

    tourist.isEmailVerified = true
    host.isEmailVerified = true

    await tourist.save()
    await host.save()

    touristToken = touristResponse.body.data.token
    hostToken = hostResponse.body.data.token

    // Create test tour
    tour = new Tour({
      title: "Lake Tana Fishing Experience",
      description: "Traditional fishing experience",
      price: 150,
      duration: 2,
      location: {
        name: "Lake Tana, Bahir Dar",
        coordinates: [37.3496, 11.5742],
      },
      host: host._id,
      maxGuests: 4,
      difficulty: "easy",
      category: "fishing",
      isActive: true,
    })

    await tour.save()

    // Create test booking
    booking = new Booking({
      tour: tour._id,
      tourist: tourist._id,
      host: host._id,
      startDate: new Date("2024-07-15"),
      endDate: new Date("2024-07-17"),
      guests: 2,
      totalPrice: 300,
      status: "confirmed",
      paymentStatus: "pending",
    })

    await booking.save()
  })

  describe("POST /api/payments/checkout", () => {
    it("should create Stripe payment intent", async () => {
      const paymentData = {
        bookingId: booking._id.toString(),
        paymentMethod: "stripe",
        currency: "usd",
      }

      const response = await request(app)
        .post("/api/payments/checkout")
        .set("Authorization", `Bearer ${touristToken}`)
        .send(paymentData)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.paymentMethod).toBe("stripe")
      expect(response.body.data.clientSecret).toBeDefined()
      expect(response.body.data.amount).toBe(30000) // $300 in cents
    })

    it("should create Chapa payment intent", async () => {
      const paymentData = {
        bookingId: booking._id.toString(),
        paymentMethod: "chapa",
        currency: "etb",
      }

      const response = await request(app)
        .post("/api/payments/checkout")
        .set("Authorization", `Bearer ${touristToken}`)
        .send(paymentData)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.paymentMethod).toBe("chapa")
      expect(response.body.data.checkoutUrl).toBeDefined()
      expect(response.body.data.amount).toBe(16500) // $300 * 55 ETB/USD
    })

    it("should not allow payment for non-existent booking", async () => {
      const paymentData = {
        bookingId: "64f8a1b2c3d4e5f6a7b8c9d0",
        paymentMethod: "stripe",
        currency: "usd",
      }

      const response = await request(app)
        .post("/api/payments/checkout")
        .set("Authorization", `Bearer ${touristToken}`)
        .send(paymentData)
        .expect(404)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain("not found")
    })

    it("should not allow payment for already paid booking", async () => {
      // Update booking to paid status
      booking.paymentStatus = "paid"
      await booking.save()

      const paymentData = {
        bookingId: booking._id.toString(),
        paymentMethod: "stripe",
        currency: "usd",
      }

      const response = await request(app)
        .post("/api/payments/checkout")
        .set("Authorization", `Bearer ${touristToken}`)
        .send(paymentData)
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain("already been paid")
    })

    it("should not allow unauthorized user to pay", async () => {
      const paymentData = {
        bookingId: booking._id.toString(),
        paymentMethod: "stripe",
        currency: "usd",
      }

      const response = await request(app)
        .post("/api/payments/checkout")
        .set("Authorization", `Bearer ${hostToken}`)
        .send(paymentData)
        .expect(403)

      expect(response.body.success).toBe(false)
    })

    it("should require authentication", async () => {
      const paymentData = {
        bookingId: booking._id.toString(),
        paymentMethod: "stripe",
        currency: "usd",
      }

      const response = await request(app).post("/api/payments/checkout").send(paymentData).expect(401)

      expect(response.body.success).toBe(false)
    })
  })

  describe("GET /api/payments/booking/:bookingId", () => {
    let payment

    beforeEach(async () => {
      payment = new Payment({
        booking: booking._id,
        user: tourist._id,
        amount: 300,
        currency: "usd",
        paymentMethod: "stripe",
        status: "completed",
        stripePaymentIntentId: "pi_test123",
        transactionId: "txn_test123",
      })

      await payment.save()
    })

    it("should get payment details for booking owner", async () => {
      const response = await request(app)
        .get(`/api/payments/booking/${booking._id}`)
        .set("Authorization", `Bearer ${touristToken}`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data._id).toBe(payment._id.toString())
      expect(response.body.data.amount).toBe(300)
      expect(response.body.data.status).toBe("completed")
    })

    it("should get payment details for host", async () => {
      const response = await request(app)
        .get(`/api/payments/booking/${booking._id}`)
        .set("Authorization", `Bearer ${hostToken}`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data._id).toBe(payment._id.toString())
    })

    it("should return 404 for booking without payment", async () => {
      // Create booking without payment
      const newBooking = new Booking({
        tour: tour._id,
        tourist: tourist._id,
        host: host._id,
        startDate: new Date("2024-08-15"),
        endDate: new Date("2024-08-17"),
        guests: 1,
        totalPrice: 150,
        status: "confirmed",
        paymentStatus: "pending",
      })

      await newBooking.save()

      const response = await request(app)
        .get(`/api/payments/booking/${newBooking._id}`)
        .set("Authorization", `Bearer ${touristToken}`)
        .expect(404)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain("not found")
    })
  })
})
