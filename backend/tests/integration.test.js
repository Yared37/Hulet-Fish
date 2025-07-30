const request = require("supertest")
const app = require("../server")
const User = require("../models/User")
const Tour = require("../models/Tour")
const Booking = require("../models/Booking")

describe("Full Integration Flow", () => {
  describe("Complete Booking Flow", () => {
    let touristToken, hostToken
    let tourist, host
    let tour

    it("should complete full booking and payment flow", async () => {
      // Step 1: Register tourist
      const touristData = {
        name: "John Tourist",
        email: "john.tourist@example.com",
        password: "password123",
        role: "tourist",
      }

      const touristRegisterResponse = await request(app).post("/api/auth/register").send(touristData).expect(201)

      expect(touristRegisterResponse.body.success).toBe(true)
      touristToken = touristRegisterResponse.body.data.token

      // Step 2: Register host
      const hostData = {
        name: "Jane Host",
        email: "jane.host@example.com",
        password: "password123",
        role: "host",
      }

      const hostRegisterResponse = await request(app).post("/api/auth/register").send(hostData).expect(201)

      expect(hostRegisterResponse.body.success).toBe(true)
      hostToken = hostRegisterResponse.body.data.token

      // Step 3: Verify emails (simulate)
      tourist = await User.findById(touristRegisterResponse.body.data.user._id)
      host = await User.findById(hostRegisterResponse.body.data.user._id)

      tourist.isEmailVerified = true
      host.isEmailVerified = true

      await tourist.save()
      await host.save()

      // Step 4: Login users
      const touristLoginResponse = await request(app)
        .post("/api/auth/login")
        .send({
          email: touristData.email,
          password: touristData.password,
        })
        .expect(200)

      const hostLoginResponse = await request(app)
        .post("/api/auth/login")
        .send({
          email: hostData.email,
          password: hostData.password,
        })
        .expect(200)

      expect(touristLoginResponse.body.success).toBe(true)
      expect(hostLoginResponse.body.success).toBe(true)

      // Step 5: Create tour (simulate via direct DB insertion)
      tour = new Tour({
        title: "Lake Tana Fishing Adventure",
        description: "Experience traditional fishing on Ethiopia's largest lake",
        price: 200,
        duration: 3,
        location: {
          name: "Lake Tana, Bahir Dar",
          coordinates: [37.3496, 11.5742],
        },
        host: host._id,
        maxGuests: 6,
        difficulty: "moderate",
        category: "fishing",
        isActive: true,
        images: ["lake-tana-1.jpg", "fishing-boat.jpg"],
      })

      await tour.save()

      // Step 6: Tourist creates booking request
      const bookingData = {
        tourId: tour._id.toString(),
        startDate: "2024-08-15",
        endDate: "2024-08-18",
        guests: 3,
        specialRequests: "Please provide vegetarian meals",
      }

      const bookingResponse = await request(app)
        .post("/api/bookings/request")
        .set("Authorization", `Bearer ${touristToken}`)
        .send(bookingData)
        .expect(201)

      expect(bookingResponse.body.success).toBe(true)
      expect(bookingResponse.body.data.status).toBe("pending")
      expect(bookingResponse.body.data.totalPrice).toBe(600) // 200 * 3 guests

      const bookingId = bookingResponse.body.data._id

      // Step 7: Host views their bookings
      const hostBookingsResponse = await request(app)
        .get("/api/bookings/my-bookings")
        .set("Authorization", `Bearer ${hostToken}`)
        .expect(200)

      expect(hostBookingsResponse.body.success).toBe(true)
      expect(hostBookingsResponse.body.data.bookings).toHaveLength(1)
      expect(hostBookingsResponse.body.data.bookings[0].status).toBe("pending")

      // Step 8: Host accepts booking
      const acceptResponse = await request(app)
        .patch(`/api/bookings/${bookingId}/respond`)
        .set("Authorization", `Bearer ${hostToken}`)
        .send({
          action: "accept",
          message: "Welcome! Looking forward to hosting you on Lake Tana!",
        })
        .expect(200)

      expect(acceptResponse.body.success).toBe(true)
      expect(acceptResponse.body.data.status).toBe("confirmed")

      // Step 9: Tourist views updated booking
      const updatedBookingResponse = await request(app)
        .get(`/api/bookings/${bookingId}`)
        .set("Authorization", `Bearer ${touristToken}`)
        .expect(200)

      expect(updatedBookingResponse.body.success).toBe(true)
      expect(updatedBookingResponse.body.data.status).toBe("confirmed")
      expect(updatedBookingResponse.body.data.hostResponse.action).toBe("accept")

      // Step 10: Tourist initiates payment
      const paymentData = {
        bookingId: bookingId,
        paymentMethod: "stripe",
        currency: "usd",
      }

      const paymentResponse = await request(app)
        .post("/api/payments/checkout")
        .set("Authorization", `Bearer ${touristToken}`)
        .send(paymentData)
        .expect(200)

      expect(paymentResponse.body.success).toBe(true)
      expect(paymentResponse.body.data.paymentMethod).toBe("stripe")
      expect(paymentResponse.body.data.amount).toBe(60000) // $600 in cents
      expect(paymentResponse.body.data.clientSecret).toBeDefined()

      // Step 11: Verify booking payment status updated
      const finalBookingResponse = await request(app)
        .get(`/api/bookings/${bookingId}`)
        .set("Authorization", `Bearer ${touristToken}`)
        .expect(200)

      expect(finalBookingResponse.body.success).toBe(true)
      // Payment status should still be pending until webhook confirms
      expect(finalBookingResponse.body.data.paymentStatus).toBe("pending")
    })

    it("should handle booking rejection flow", async () => {
      // Setup users and tour (reuse from previous test setup)
      const touristData = {
        name: "Alice Tourist",
        email: "alice@example.com",
        password: "password123",
        role: "tourist",
      }

      const hostData = {
        name: "Bob Host",
        email: "bob@example.com",
        password: "password123",
        role: "host",
      }

      // Register and verify users
      const touristResponse = await request(app).post("/api/auth/register").send(touristData)

      const hostResponse = await request(app).post("/api/auth/register").send(hostData)

      const tourist = await User.findById(touristResponse.body.data.user._id)
      const host = await User.findById(hostResponse.body.data.user._id)

      tourist.isEmailVerified = true
      host.isEmailVerified = true
      await tourist.save()
      await host.save()

      const touristToken = touristResponse.body.data.token
      const hostToken = hostResponse.body.data.token

      // Create tour
      const tour = new Tour({
        title: "Cultural Village Tour",
        description: "Visit traditional Ethiopian village",
        price: 100,
        duration: 1,
        location: {
          name: "Gondar Region",
          coordinates: [37.4667, 12.6],
        },
        host: host._id,
        maxGuests: 4,
        difficulty: "easy",
        category: "cultural",
        isActive: true,
      })

      await tour.save()

      // Create booking request
      const bookingData = {
        tourId: tour._id.toString(),
        startDate: "2024-09-01",
        guests: 2,
      }

      const bookingResponse = await request(app)
        .post("/api/bookings/request")
        .set("Authorization", `Bearer ${touristToken}`)
        .send(bookingData)

      const bookingId = bookingResponse.body.data._id

      // Host rejects booking
      const rejectResponse = await request(app)
        .patch(`/api/bookings/${bookingId}/respond`)
        .set("Authorization", `Bearer ${hostToken}`)
        .send({
          action: "reject",
          message: "Sorry, I have a family emergency that week",
        })
        .expect(200)

      expect(rejectResponse.body.success).toBe(true)
      expect(rejectResponse.body.data.status).toBe("cancelled")
      expect(rejectResponse.body.data.hostResponse.action).toBe("reject")

      // Verify tourist can see rejection
      const finalBookingResponse = await request(app)
        .get(`/api/bookings/${bookingId}`)
        .set("Authorization", `Bearer ${touristToken}`)
        .expect(200)

      expect(finalBookingResponse.body.data.status).toBe("cancelled")
      expect(finalBookingResponse.body.data.hostResponse.message).toContain("family emergency")
    })
  })

  describe("Error Handling and Edge Cases", () => {
    it("should handle concurrent booking requests gracefully", async () => {
      // This test would require more complex setup to simulate true concurrency
      // For now, we'll test sequential requests that should conflict

      // Setup users and tour
      const tourist1Data = {
        name: "Tourist One",
        email: "tourist1@example.com",
        password: "password123",
        role: "tourist",
      }

      const tourist2Data = {
        name: "Tourist Two",
        email: "tourist2@example.com",
        password: "password123",
        role: "tourist",
      }

      const hostData = {
        name: "Host User",
        email: "host@example.com",
        password: "password123",
        role: "host",
      }

      const [tourist1Response, tourist2Response, hostResponse] = await Promise.all([
        request(app).post("/api/auth/register").send(tourist1Data),
        request(app).post("/api/auth/register").send(tourist2Data),
        request(app).post("/api/auth/register").send(hostData),
      ])

      // Verify all users
      const tourist1 = await User.findById(tourist1Response.body.data.user._id)
      const tourist2 = await User.findById(tourist2Response.body.data.user._id)
      const host = await User.findById(hostResponse.body.data.user._id)

      tourist1.isEmailVerified = true
      tourist2.isEmailVerified = true
      host.isEmailVerified = true

      await Promise.all([tourist1.save(), tourist2.save(), host.save()])

      // Create tour
      const tour = new Tour({
        title: "Exclusive Private Tour",
        description: "Limited to one booking at a time",
        price: 500,
        duration: 1,
        location: {
          name: "Simien Mountains",
          coordinates: [38.0, 13.0],
        },
        host: host._id,
        maxGuests: 2,
        difficulty: "challenging",
        category: "adventure",
        isActive: true,
      })

      await tour.save()

      const bookingData = {
        tourId: tour._id.toString(),
        startDate: "2024-10-15",
        guests: 2,
      }

      // First booking should succeed
      const booking1Response = await request(app)
        .post("/api/bookings/request")
        .set("Authorization", `Bearer ${tourist1Response.body.data.token}`)
        .send(bookingData)
        .expect(201)

      expect(booking1Response.body.success).toBe(true)

      // Second booking for same dates should fail
      const booking2Response = await request(app)
        .post("/api/bookings/request")
        .set("Authorization", `Bearer ${tourist2Response.body.data.token}`)
        .send(bookingData)
        .expect(400)

      expect(booking2Response.body.success).toBe(false)
      expect(booking2Response.body.message).toContain("not available")
    })
  })
})
