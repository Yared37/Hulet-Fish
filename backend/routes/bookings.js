const express = require("express")
const { body, validationResult, query } = require("express-validator")
const Booking = require("../models/Booking")
const Tour = require("../models/Tour")
const User = require("../models/User")
const auth = require("../middleware/auth")
const authorize = require("../middleware/authorize")

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Tour booking management
 */

/**
 * @swagger
 * /api/bookings/request:
 *   post:
 *     summary: Create a new booking request
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tourId
 *               - startDate
 *               - guests
 *             properties:
 *               tourId:
 *                 type: string
 *                 example: "64f8a1b2c3d4e5f6a7b8c9d0"
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-07-15"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-07-17"
 *               guests:
 *                 type: number
 *                 minimum: 1
 *                 example: 2
 *               specialRequests:
 *                 type: string
 *                 example: "Vegetarian meals preferred"
 *     responses:
 *       201:
 *         description: Booking request created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Booking request submitted successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Validation error or tour not available
 *       404:
 *         description: Tour not found
 */
router.post(
  "/request",
  [
    auth,
    authorize("tourist"),
    body("tourId").isMongoId().withMessage("Valid tour ID is required"),
    body("startDate").isISO8601().withMessage("Valid start date is required"),
    body("endDate").optional().isISO8601().withMessage("Valid end date is required"),
    body("guests").isInt({ min: 1, max: 20 }).withMessage("Guests must be between 1 and 20"),
    body("specialRequests")
      .optional()
      .isLength({ max: 500 })
      .withMessage("Special requests must be less than 500 characters"),
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

      const { tourId, startDate, endDate, guests, specialRequests } = req.body
      const touristId = req.user.userId

      // Check if tour exists and is active
      const tour = await Tour.findById(tourId).populate("host", "name email")
      if (!tour) {
        return res.status(404).json({
          success: false,
          message: "Tour not found",
        })
      }

      if (!tour.isActive) {
        return res.status(400).json({
          success: false,
          message: "This tour is currently not available for booking",
        })
      }

      // Check if guests exceed maximum
      if (guests > tour.maxGuests) {
        return res.status(400).json({
          success: false,
          message: `Maximum ${tour.maxGuests} guests allowed for this tour`,
        })
      }

      // Check for date conflicts
      const startDateObj = new Date(startDate)
      const endDateObj = endDate
        ? new Date(endDate)
        : new Date(startDateObj.getTime() + tour.duration * 24 * 60 * 60 * 1000)

      if (startDateObj < new Date()) {
        return res.status(400).json({
          success: false,
          message: "Start date cannot be in the past",
        })
      }

      // Check for existing bookings on the same dates
      const conflictingBookings = await Booking.find({
        tour: tourId,
        status: { $in: ["pending", "confirmed"] },
        $or: [
          {
            startDate: { $lte: endDateObj },
            endDate: { $gte: startDateObj },
          },
        ],
      })

      if (conflictingBookings.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Tour is not available for the selected dates",
        })
      }

      // Calculate total price
      const totalPrice = tour.price * guests

      // Create booking
      const booking = new Booking({
        tour: tourId,
        tourist: touristId,
        host: tour.host._id,
        startDate: startDateObj,
        endDate: endDateObj,
        guests,
        totalPrice,
        specialRequests,
        status: "pending",
        paymentStatus: "pending",
      })

      await booking.save()

      // Populate booking details for response
      await booking.populate([
        { path: "tour", select: "title location price duration" },
        { path: "tourist", select: "name email profile.phone" },
        { path: "host", select: "name email profile.phone" },
      ])

      res.status(201).json({
        success: true,
        message: "Booking request submitted successfully",
        data: booking,
      })
    } catch (error) {
      console.error("Booking request error:", error)
      res.status(500).json({
        success: false,
        message: "Server error while creating booking request",
      })
    }
  },
)

/**
 * @swagger
 * /api/bookings/my-bookings:
 *   get:
 *     summary: Get current user's bookings
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, cancelled, completed]
 *         description: Filter by booking status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Number of bookings per page
 *     responses:
 *       200:
 *         description: Bookings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     bookings:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Booking'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         currentPage:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *                         totalBookings:
 *                           type: integer
 *                         hasNext:
 *                           type: boolean
 *                         hasPrev:
 *                           type: boolean
 */
router.get(
  "/my-bookings",
  [
    auth,
    query("status").optional().isIn(["pending", "confirmed", "cancelled", "completed"]),
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 50 }),
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

      const { status, page = 1, limit = 10 } = req.query
      const userId = req.user.userId
      const userRole = req.user.role

      // Build query based on user role
      const query = {}
      if (userRole === "tourist") {
        query.tourist = userId
      } else if (userRole === "host") {
        query.host = userId
      }

      if (status) {
        query.status = status
      }

      // Calculate pagination
      const skip = (page - 1) * limit
      const totalBookings = await Booking.countDocuments(query)
      const totalPages = Math.ceil(totalBookings / limit)

      // Fetch bookings
      const bookings = await Booking.find(query)
        .populate("tour", "title location price duration images")
        .populate("tourist", "name email profile.phone profile.avatar")
        .populate("host", "name email profile.phone profile.avatar")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number.parseInt(limit))

      res.json({
        success: true,
        data: {
          bookings,
          pagination: {
            currentPage: Number.parseInt(page),
            totalPages,
            totalBookings,
            hasNext: page < totalPages,
            hasPrev: page > 1,
          },
        },
      })
    } catch (error) {
      console.error("Get bookings error:", error)
      res.status(500).json({
        success: false,
        message: "Server error while fetching bookings",
      })
    }
  },
)

/**
 * @swagger
 * /api/bookings/{id}/respond:
 *   patch:
 *     summary: Respond to a booking request (host only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - action
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [accept, reject]
 *                 example: "accept"
 *               message:
 *                 type: string
 *                 example: "Looking forward to hosting you!"
 *     responses:
 *       200:
 *         description: Booking response recorded successfully
 *       400:
 *         description: Invalid action or booking cannot be modified
 *       403:
 *         description: Not authorized to respond to this booking
 *       404:
 *         description: Booking not found
 */
router.patch(
  "/:id/respond",
  [
    auth,
    authorize("host"),
    body("action").isIn(["accept", "reject"]).withMessage("Action must be either accept or reject"),
    body("message").optional().isLength({ max: 500 }).withMessage("Message must be less than 500 characters"),
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

      const { id } = req.params
      const { action, message } = req.body
      const hostId = req.user.userId

      // Find booking
      const booking = await Booking.findById(id).populate("tour", "title").populate("tourist", "name email")

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Booking not found",
        })
      }

      // Check if user is the host for this booking
      if (booking.host.toString() !== hostId) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to respond to this booking",
        })
      }

      // Check if booking is in pending status
      if (booking.status !== "pending") {
        return res.status(400).json({
          success: false,
          message: "This booking has already been responded to",
        })
      }

      // Update booking status
      booking.status = action === "accept" ? "confirmed" : "cancelled"
      booking.hostResponse = {
        action,
        message,
        respondedAt: new Date(),
      }

      await booking.save()

      res.json({
        success: true,
        message: `Booking ${action}ed successfully`,
        data: booking,
      })
    } catch (error) {
      console.error("Booking response error:", error)
      res.status(500).json({
        success: false,
        message: "Server error while responding to booking",
      })
    }
  },
)

/**
 * @swagger
 * /api/bookings/{id}/cancel:
 *   patch:
 *     summary: Cancel a booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 example: "Change of plans"
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
 *       400:
 *         description: Booking cannot be cancelled
 *       403:
 *         description: Not authorized to cancel this booking
 *       404:
 *         description: Booking not found
 */
router.patch(
  "/:id/cancel",
  [auth, body("reason").optional().isLength({ max: 500 }).withMessage("Reason must be less than 500 characters")],
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

      const { id } = req.params
      const { reason } = req.body
      const userId = req.user.userId
      const userRole = req.user.role

      // Find booking
      const booking = await Booking.findById(id)
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Booking not found",
        })
      }

      // Check authorization
      const isAuthorized =
        (userRole === "tourist" && booking.tourist.toString() === userId) ||
        (userRole === "host" && booking.host.toString() === userId) ||
        userRole === "admin"

      if (!isAuthorized) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to cancel this booking",
        })
      }

      // Check if booking can be cancelled
      if (booking.status === "cancelled") {
        return res.status(400).json({
          success: false,
          message: "Booking is already cancelled",
        })
      }

      if (booking.status === "completed") {
        return res.status(400).json({
          success: false,
          message: "Cannot cancel a completed booking",
        })
      }

      // Update booking
      booking.status = "cancelled"
      booking.cancellation = {
        cancelledBy: userId,
        reason,
        cancelledAt: new Date(),
      }

      await booking.save()

      res.json({
        success: true,
        message: "Booking cancelled successfully",
        data: booking,
      })
    } catch (error) {
      console.error("Booking cancellation error:", error)
      res.status(500).json({
        success: false,
        message: "Server error while cancelling booking",
      })
    }
  },
)

/**
 * @swagger
 * /api/bookings/{id}:
 *   get:
 *     summary: Get booking details
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Booking'
 *       403:
 *         description: Not authorized to view this booking
 *       404:
 *         description: Booking not found
 */
router.get("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.userId
    const userRole = req.user.role

    // Find booking with full details
    const booking = await Booking.findById(id)
      .populate("tour", "title description location price duration images maxGuests")
      .populate("tourist", "name email profile")
      .populate("host", "name email profile")

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      })
    }

    // Check authorization
    const isAuthorized =
      (userRole === "tourist" && booking.tourist._id.toString() === userId) ||
      (userRole === "host" && booking.host._id.toString() === userId) ||
      userRole === "admin"

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this booking",
      })
    }

    res.json({
      success: true,
      data: booking,
    })
  } catch (error) {
    console.error("Get booking error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while fetching booking details",
    })
  }
})

module.exports = router
