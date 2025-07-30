const request = require("supertest")
const app = require("../server")
const User = require("../models/User")
const Tour = require("../models/Tour")
const Booking = require("../models/Booking")

describe("Booking Endpoints", () => {
  let touristToken, hostToken, adminToken
  let tourist, host, admin
  let tour

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

    const adminData = {
      name: "Admin User",
      email: "admin@example.com",
      password: "password123",
      role: "admin",
    }

    // Register users
    const touristResponse = await request(app).post("/api/auth/register").send(touristData)

    const hostResponse = await request(app).post("/api/auth/register").send(hostData)

    const adminResponse = await request(app).post("/api/auth/register").send(adminData)

    // Verify emails and get tokens
    tourist = await User.findById(touristResponse.body.data.user._id)
    host = await User.findById(hostResponse.body.data.user._id)
    admin = await User.findById(adminResponse.body.data.user._id)

    tourist.isEmailVerified = true
    host.isEmailVerified = true
    admin.isEmailVerified = true

    await tourist.save()
    await host.save()
    await admin.save()

    touristToken = touristResponse.body.data.token
    hostToken = hostResponse.body.data.token
    adminToken = adminResponse.body.data.token

    // Create a test tour
    tour = new Tour({
      title: "Lake Tana Fishing Experience",
      description: "Traditional fishing experience on Lake Tana",
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
      images: ["image1.jpg", "image2.jpg"],
    })

    await tour.save()
  })

  describe("POST /api/bookings/request", () => {
    it("should create booking request successfully", async () => {
      const bookingData = {
        tourId: tour._id.toString(),
        startDate: "2024-07-15",
        endDate: "2024-07-17",
        guests: 2,
        specialRequests: "Vegetarian meals preferred",
      }

      const response = await request(app)
        .post("/api/bookings/request")
        .set("Authorization", `Bearer ${touristToken}`)
        .send(bookingData)
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.data.tour._id).toBe(tour._id.toString())
      expect(response.body.data.tourist._id).toBe(tourist._id.toString())
      expect(response.body.data.guests).toBe(2)
      expect(response.body.data.status).toBe("pending")
      expect(response.body.data.totalPrice).toBe(300) // 150 * 2 guests
    })

    it("should not allow host to book their own tour", async () => {
      const bookingData = {
        tourId: tour._id.toString(),
        startDate: "2024-07-15",
        guests: 2,
      }

      const response = await request(app)
        .post("/api/bookings/request")
        .set("Authorization", `Bearer ${hostToken}`)
        .send(bookingData)
        .expect(403)

      expect(response.body.success).toBe(false)
    })

    it("should not create booking for non-existent tour", async () => {
      const bookingData = {
        tourId: "64f8a1b2c3d4e5f6a7b8c9d0",
        startDate: "2024-07-15",
        guests: 2,
      }

      const response = await request(app)
        .post("/api/bookings/request")
        .set("Authorization", `Bearer ${touristToken}`)
        .send(bookingData)
        .expect(404)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain("not found")
    })

    it("should not create booking with past date", async () => {
      const bookingData = {
        tourId: tour._id.toString(),
        startDate: "2020-01-01",
        guests: 2,
      }

      const response = await request(app)
        .post("/api/bookings/request")
        .set("Authorization", `Bearer ${touristToken}`)
        .send(bookingData)
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain("past")
    })

    it("should not create booking exceeding max guests", async () => {
      const bookingData = {
        tourId: tour._id.toString(),
        startDate: "2024-07-15",
        guests: 10, // tour.maxGuests is 4
      }

      const response = await request(app)
        .post("/api/bookings/request")
        .set("Authorization", `Bearer ${touristToken}`)
        .send(bookingData)
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain("Maximum")
    })

    it("should require authentication", async () => {
      const bookingData = {
        tourId: tour._id.toString(),
        startDate: "2024-07-15",
        guests: 2,
      }

      const response = await request(app).post("/api/bookings/request").send(bookingData).expect(401)

      expect(response.body.success).toBe(false)
    })
  })

  describe("GET /api/bookings/my-bookings", () => {
    let booking

    beforeEach(async () => {
      booking = new Booking({
        tour: tour._id,
        tourist: tourist._id,
        host: host._id,
        startDate: new Date("2024-07-15"),
        endDate: new Date("2024-07-17"),
        guests: 2,
        totalPrice: 300,
        status: "pending",
      })

      await booking.save()
    })

    it("should get tourist bookings", async () => {
      const response = await request(app)
        .get("/api/bookings/my-bookings")
        .set("Authorization", `Bearer ${touristToken}`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.bookings).toHaveLength(1)
      expect(response.body.data.bookings[0]._id).toBe(booking._id.toString())
      expect(response.body.data.pagination).toBeDefined()
    })

    it("should get host bookings", async () => {
      const response = await request(app)
        .get("/api/bookings/my-bookings")
        .set("Authorization", `Bearer ${hostToken}`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.bookings).toHaveLength(1)
      expect(response.body.data.bookings[0]._id).toBe(booking._id.toString())
    })

    it("should filter bookings by status", async () => {
      const response = await request(app)
        .get("/api/bookings/my-bookings?status=pending")
        .set("Authorization", `Bearer ${touristToken}`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.bookings).toHaveLength(1)
    })

    it("should paginate results", async () => {
      const response = await request(app)
        .get("/api/bookings/my-bookings?page=1&limit=5")
        .set("Authorization", `Bearer ${touristToken}`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.pagination.currentPage).toBe(1)
      expect(response.body.data.pagination.totalBookings).toBe(1)
    })

    it("should require authentication", async () => {
      const response = await request(app).get("/api/bookings/my-bookings").expect(401)

      expect(response.body.success).toBe(false)
    })
  })

  describe("PATCH /api/bookings/:id/respond", () => {
    let booking

    beforeEach(async () => {
      booking = new Booking({
        tour: tour._id,
        tourist: tourist._id,
        host: host._id,
        startDate: new Date("2024-07-15"),
        endDate: new Date("2024-07-17"),
        guests: 2,
        totalPrice: 300,
        status: "pending",
      })

      await booking.save()
    })

    it("should allow host to accept booking", async () => {
      const response = await request(app)
        .patch(`/api/bookings/${booking._id}/respond`)
        .set("Authorization", `Bearer ${hostToken}`)
        .send({
          action: "accept",
          message: "Looking forward to hosting you!",
        })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.status).toBe("confirmed")
      expect(response.body.data.hostResponse.action).toBe("accept")
    })

    it("should allow host to reject booking", async () => {
      const response = await request(app)
        .patch(`/api/bookings/${booking._id}/respond`)
        .set("Authorization", `Bearer ${hostToken}`)
        .send({
          action: "reject",
          message: "Sorry, not available on those dates",
        })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.status).toBe("cancelled")
      expect(response.body.data.hostResponse.action).toBe("reject")
    })

    it("should not allow tourist to respond to booking", async () => {
      const response = await request(app)
        .patch(`/api/bookings/${booking._id}/respond`)
        .set("Authorization", `Bearer ${touristToken}`)
        .send({
          action: "accept",
        })
        .expect(403)

      expect(response.body.success).toBe(false)
    })

    it("should not allow response to already responded booking", async () => {
      // First response
      await request(app)
        .patch(`/api/bookings/${booking._id}/respond`)
        .set("Authorization", `Bearer ${hostToken}`)
        .send({ action: "accept" })

      // Second response should fail
      const response = await request(app)
        .patch(`/api/bookings/${booking._id}/respond`)
        .set("Authorization", `Bearer ${hostToken}`)
        .send({ action: "reject" })
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain("already been responded")
    })
  })

  describe("PATCH /api/bookings/:id/cancel", () => {
    let booking

    beforeEach(async () => {
      booking = new Booking({
        tour: tour._id,
        tourist: tourist._id,
        host: host._id,
        startDate: new Date("2024-07-15"),
        endDate: new Date("2024-07-17"),
        guests: 2,
        totalPrice: 300,
        status: "pending",
      })

      await booking.save()
    })

    it("should allow tourist to cancel their booking", async () => {
      const response = await request(app)
        .patch(`/api/bookings/${booking._id}/cancel`)
        .set("Authorization", `Bearer ${touristToken}`)
        .send({
          reason: "Change of plans",
        })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.status).toBe("cancelled")
      expect(response.body.data.cancellation.reason).toBe("Change of plans")
    })

    it("should allow host to cancel booking", async () => {
      const response = await request(app)
        .patch(`/api/bookings/${booking._id}/cancel`)
        .set("Authorization", `Bearer ${hostToken}`)
        .send({
          reason: "Emergency situation",
        })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.status).toBe("cancelled")
    })

    it("should not allow cancellation of already cancelled booking", async () => {
      // Cancel first
      await request(app)
        .patch(`/api/bookings/${booking._id}/cancel`)
        .set("Authorization", `Bearer ${touristToken}`)
        .send({ reason: "Test" })

      // Try to cancel again
      const response = await request(app)
        .patch(`/api/bookings/${booking._id}/cancel`)
        .set("Authorization", `Bearer ${touristToken}`)
        .send({ reason: "Test again" })
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain("already cancelled")
    })
  })

  describe("GET /api/bookings/:id", () => {
    let booking

    beforeEach(async () => {
      booking = new Booking({
        tour: tour._id,
        tourist: tourist._id,
        host: host._id,
        startDate: new Date("2024-07-15"),
        endDate: new Date("2024-07-17"),
        guests: 2,
        totalPrice: 300,
        status: "pending",
      })

      await booking.save()
    })

    it("should get booking details for tourist", async () => {
      const response = await request(app)
        .get(`/api/bookings/${booking._id}`)
        .set("Authorization", `Bearer ${touristToken}`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data._id).toBe(booking._id.toString())
      expect(response.body.data.tour).toBeDefined()
      expect(response.body.data.tourist).toBeDefined()
      expect(response.body.data.host).toBeDefined()
    })

    it("should get booking details for host", async () => {
      const response = await request(app)
        .get(`/api/bookings/${booking._id}`)
        .set("Authorization", `Bearer ${hostToken}`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data._id).toBe(booking._id.toString())
    })

    it("should not allow unauthorized user to view booking", async () => {
      // Create another tourist
      const otherTouristData = {
        name: "Other Tourist",
        email: "other@example.com",
        password: "password123",
        role: "tourist",
      }

      const otherTouristResponse = await request(app).post("/api/auth/register").send(otherTouristData)

      const otherTourist = await User.findById(otherTouristResponse.body.data.user._id)
      otherTourist.isEmailVerified = true
      await otherTourist.save()

      const response = await request(app)
        .get(`/api/bookings/${booking._id}`)
        .set("Authorization", `Bearer ${otherTouristResponse.body.data.token}`)
        .expect(403)

      expect(response.body.success).toBe(false)
    })
  })
})
