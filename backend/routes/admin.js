const express = require("express")
const { body, query, validationResult } = require("express-validator")
const User = require("../models/User")
const CulturalOffering = require("../models/CulturalOffering")
const Booking = require("../models/Booking")
const auth = require("../middleware/auth")
const adminAuth = require("../middleware/adminAuth")
const emailService = require("../utils/emailService")

const router = express.Router()

// Apply auth middleware to all admin routes
router.use(auth)
router.use(adminAuth)

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private (Admin only)
router.get("/dashboard", async (req, res) => {
  try {
    // Get user statistics
    const totalUsers = await User.countDocuments()
    const totalTourists = await User.countDocuments({ role: "tourist" })
    const totalHosts = await User.countDocuments({ role: "host" })
    const totalGuides = await User.countDocuments({ role: "guide" })
    const pendingHostApprovals = await User.countDocuments({
      role: "host",
      "hostProfile.isApproved": false,
    })

    // Get cultural offering statistics
    const totalOfferings = await CulturalOffering.countDocuments()
    const activeOfferings = await CulturalOffering.countDocuments({ isActive: true })
    const pendingApprovals = await CulturalOffering.countDocuments({ isApproved: false })
    const approvedOfferings = await CulturalOffering.countDocuments({ isApproved: true })

    // Get booking statistics
    const totalBookings = await Booking.countDocuments()
    const pendingBookings = await Booking.countDocuments({ status: "pending" })
    const confirmedBookings = await Booking.countDocuments({ status: "confirmed" })
    const completedBookings = await Booking.countDocuments({ status: "completed" })

    // Get recent activity
    const recentUsers = await User.find()
      .select("name email role createdAt isVerified")
      .sort({ createdAt: -1 })
      .limit(5)

    const recentOfferings = await CulturalOffering.find()
      .populate("host", "name email")
      .select("title category isApproved createdAt")
      .sort({ createdAt: -1 })
      .limit(5)

    const recentBookings = await Booking.find()
      .populate("tourist", "name email")
      .populate("culturalOffering", "title")
      .select("bookingId status createdAt totalAmount")
      .sort({ createdAt: -1 })
      .limit(5)

    // Calculate revenue (placeholder - would integrate with payment system)
    const totalRevenue = await Booking.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ])

    const dashboardStats = {
      users: {
        total: totalUsers,
        tourists: totalTourists,
        hosts: totalHosts,
        guides: totalGuides,
        pendingHostApprovals,
      },
      offerings: {
        total: totalOfferings,
        active: activeOfferings,
        pending: pendingApprovals,
        approved: approvedOfferings,
      },
      bookings: {
        total: totalBookings,
        pending: pendingBookings,
        confirmed: confirmedBookings,
        completed: completedBookings,
      },
      revenue: {
        total: totalRevenue[0]?.total || 0,
        currency: "ETB",
      },
      recentActivity: {
        users: recentUsers,
        offerings: recentOfferings,
        bookings: recentBookings,
      },
    }

    res.json({
      success: true,
      data: dashboardStats,
    })
  } catch (error) {
    console.error("Admin dashboard error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while fetching dashboard data",
    })
  }
})

// @desc    Get all users with filtering and pagination
// @route   GET /api/admin/users
// @access  Private (Admin only)
router.get(
  "/users",
  [
    query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
    query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),
    query("role").optional().isIn(["tourist", "host", "guide", "admin"]).withMessage("Invalid role"),
    query("isActive").optional().isBoolean().withMessage("isActive must be boolean"),
    query("isVerified").optional().isBoolean().withMessage("isVerified must be boolean"),
    query("search").optional().isString().withMessage("Search must be a string"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Invalid query parameters",
          errors: errors.array(),
        })
      }

      const page = Number.parseInt(req.query.page) || 1
      const limit = Number.parseInt(req.query.limit) || 20
      const skip = (page - 1) * limit

      // Build filter object
      const filter = {}

      if (req.query.role) filter.role = req.query.role
      if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === "true"
      if (req.query.isVerified !== undefined) filter.isVerified = req.query.isVerified === "true"

      if (req.query.search) {
        filter.$or = [
          { name: new RegExp(req.query.search, "i") },
          { email: new RegExp(req.query.search, "i") },
          { phone: new RegExp(req.query.search, "i") },
        ]
      }

      const users = await User.find(filter).select("-password").sort({ createdAt: -1 }).skip(skip).limit(limit)

      const total = await User.countDocuments(filter)

      // Add additional stats for each user
      const enrichedUsers = await Promise.all(
        users.map(async (user) => {
          const userObj = user.toObject()

          if (user.role === "host") {
            const offeringsCount = await CulturalOffering.countDocuments({ host: user._id })
            const bookingsCount = await Booking.countDocuments({
              culturalOffering: { $in: await CulturalOffering.find({ host: user._id }).select("_id") },
            })
            userObj.stats = {
              totalOfferings: offeringsCount,
              totalBookings: bookingsCount,
            }
          } else if (user.role === "tourist") {
            const bookingsCount = await Booking.countDocuments({ tourist: user._id })
            userObj.stats = {
              totalBookings: bookingsCount,
            }
          }

          return userObj
        }),
      )

      res.json({
        success: true,
        data: {
          users: enrichedUsers,
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
      console.error("Get users error:", error)
      res.status(500).json({
        success: false,
        message: "Server error while fetching users",
      })
    }
  },
)

// @desc    Get single user details
// @route   GET /api/admin/users/:id
// @access  Private (Admin only)
router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password")

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Get user's cultural offerings if host
    let offerings = []
    if (user.role === "host") {
      offerings = await CulturalOffering.find({ host: user._id }).select(
        "title category isActive isApproved createdAt rating",
      )
    }

    // Get user's bookings
    let bookings = []
    if (user.role === "tourist") {
      bookings = await Booking.find({ tourist: user._id })
        .populate("culturalOffering", "title category")
        .select("bookingId status bookingDate totalAmount createdAt")
        .sort({ createdAt: -1 })
        .limit(10)
    } else if (user.role === "host") {
      const hostOfferings = await CulturalOffering.find({ host: user._id }).select("_id")
      bookings = await Booking.find({ culturalOffering: { $in: hostOfferings.map((o) => o._id) } })
        .populate("tourist", "name email")
        .populate("culturalOffering", "title")
        .select("bookingId status bookingDate totalAmount createdAt")
        .sort({ createdAt: -1 })
        .limit(10)
    }

    res.json({
      success: true,
      data: {
        user: user.toObject(),
        offerings,
        bookings,
      },
    })
  } catch (error) {
    console.error("Get user details error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while fetching user details",
    })
  }
})

// @desc    Update user status (activate/deactivate)
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin only)
router.put(
  "/users/:id/status",
  [body("isActive").isBoolean().withMessage("isActive must be boolean")],
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

      const { isActive } = req.body

      const user = await User.findById(req.params.id)
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        })
      }

      // Prevent admin from deactivating themselves
      if (req.params.id === req.user.userId && !isActive) {
        return res.status(400).json({
          success: false,
          message: "Cannot deactivate your own account",
        })
      }

      user.isActive = isActive
      await user.save()

      res.json({
        success: true,
        message: `User ${isActive ? "activated" : "deactivated"} successfully`,
        data: {
          userId: user._id,
          isActive: user.isActive,
        },
      })
    } catch (error) {
      console.error("Update user status error:", error)
      res.status(500).json({
        success: false,
        message: "Server error while updating user status",
      })
    }
  },
)

// @desc    Approve or reject host application
// @route   PUT /api/admin/users/:id/approve-host
// @access  Private (Admin only)
router.put(
  "/users/:id/approve-host",
  [
    body("isApproved").isBoolean().withMessage("isApproved must be boolean"),
    body("adminNotes").optional().isString().withMessage("Admin notes must be a string"),
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

      const { isApproved, adminNotes } = req.body

      const user = await User.findById(req.params.id)
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        })
      }

      if (user.role !== "host") {
        return res.status(400).json({
          success: false,
          message: "User is not a host",
        })
      }

      if (!user.hostProfile) {
        user.hostProfile = {}
      }

      user.hostProfile.isApproved = isApproved
      if (adminNotes) {
        user.hostProfile.adminNotes = adminNotes
      }

      await user.save()

      res.json({
        success: true,
        message: `Host application ${isApproved ? "approved" : "rejected"} successfully`,
        data: {
          userId: user._id,
          isApproved: user.hostProfile.isApproved,
          adminNotes: user.hostProfile.adminNotes,
        },
      })
    } catch (error) {
      console.error("Approve host error:", error)
      res.status(500).json({
        success: false,
        message: "Server error while processing host approval",
      })
    }
  },
)

// @desc    Get all cultural offerings for admin review
// @route   GET /api/admin/offerings
// @access  Private (Admin only)
router.get(
  "/offerings",
  [
    query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
    query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),
    query("status").optional().isIn(["pending", "approved", "rejected", "all"]).withMessage("Invalid status"),
    query("category").optional().isString().withMessage("Category must be a string"),
    query("search").optional().isString().withMessage("Search must be a string"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Invalid query parameters",
          errors: errors.array(),
        })
      }

      const page = Number.parseInt(req.query.page) || 1
      const limit = Number.parseInt(req.query.limit) || 20
      const skip = (page - 1) * limit

      // Build filter object
      const filter = {}

      if (req.query.status && req.query.status !== "all") {
        switch (req.query.status) {
          case "pending":
            filter.isApproved = false
            filter.adminRejected = { $ne: true }
            break
          case "approved":
            filter.isApproved = true
            break
          case "rejected":
            filter.adminRejected = true
            break
        }
      }

      if (req.query.category) filter.category = req.query.category

      if (req.query.search) {
        filter.$or = [
          { title: new RegExp(req.query.search, "i") },
          { description: new RegExp(req.query.search, "i") },
          { "location.city": new RegExp(req.query.search, "i") },
        ]
      }

      const offerings = await CulturalOffering.find(filter)
        .populate("host", "name email avatar location")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)

      const total = await CulturalOffering.countDocuments(filter)

      // Add booking statistics for each offering
      const enrichedOfferings = await Promise.all(
        offerings.map(async (offering) => {
          const bookingCount = await Booking.countDocuments({ culturalOffering: offering._id })
          const completedBookings = await Booking.countDocuments({
            culturalOffering: offering._id,
            status: "completed",
          })

          return {
            ...offering.toObject(),
            stats: {
              totalBookings: bookingCount,
              completedBookings,
            },
          }
        }),
      )

      res.json({
        success: true,
        data: {
          offerings: enrichedOfferings,
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
      console.error("Get offerings error:", error)
      res.status(500).json({
        success: false,
        message: "Server error while fetching cultural offerings",
      })
    }
  },
)

// @desc    Approve or reject cultural offering
// @route   PUT /api/admin/offerings/:id/approve
// @access  Private (Admin only)
router.put(
  "/offerings/:id/approve",
  [
    body("isApproved").isBoolean().withMessage("isApproved must be boolean"),
    body("adminNotes").optional().isString().withMessage("Admin notes must be a string"),
    body("adminFeedback").optional().isString().withMessage("Admin feedback must be a string"),
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

      const { isApproved, adminNotes, adminFeedback } = req.body

      const offering = await CulturalOffering.findById(req.params.id).populate("host", "name email")

      if (!offering) {
        return res.status(404).json({
          success: false,
          message: "Cultural offering not found",
        })
      }

      offering.isApproved = isApproved
      offering.adminRejected = !isApproved

      if (adminNotes) offering.adminNotes = adminNotes
      if (adminFeedback) offering.adminFeedback = adminFeedback

      offering.reviewedAt = new Date()
      offering.reviewedBy = req.user.userId

      await offering.save()

      // Send email notification to host
      try {
        if (isApproved) {
          await emailService.sendOfferingApproval(offering)
        } else {
          await emailService.sendOfferingRejection(offering)
        }
        console.log(`Offering ${isApproved ? "approval" : "rejection"} email sent successfully`)
      } catch (emailError) {
        console.error("Error sending offering notification email:", emailError)
      }

      res.json({
        success: true,
        message: `Cultural offering ${isApproved ? "approved" : "rejected"} successfully`,
        data: {
          offeringId: offering._id,
          title: offering.title,
          isApproved: offering.isApproved,
          adminNotes: offering.adminNotes,
          adminFeedback: offering.adminFeedback,
          host: offering.host,
        },
      })
    } catch (error) {
      console.error("Approve offering error:", error)
      res.status(500).json({
        success: false,
        message: "Server error while processing offering approval",
      })
    }
  },
)

// @desc    Get single cultural offering for admin review
// @route   GET /api/admin/offerings/:id
// @access  Private (Admin only)
router.get("/offerings/:id", async (req, res) => {
  try {
    const offering = await CulturalOffering.findById(req.params.id).populate("host", "name email avatar location")

    if (!offering) {
      return res.status(404).json({
        success: false,
        message: "Cultural offering not found",
      })
    }

    // Get booking statistics
    const totalBookings = await Booking.countDocuments({ culturalOffering: offering._id })
    const completedBookings = await Booking.countDocuments({
      culturalOffering: offering._id,
      status: "completed",
    })
    const pendingBookings = await Booking.countDocuments({
      culturalOffering: offering._id,
      status: "pending",
    })

    // Get recent bookings
    const recentBookings = await Booking.find({ culturalOffering: offering._id })
      .populate("tourist", "name email")
      .select("bookingId status bookingDate totalAmount createdAt")
      .sort({ createdAt: -1 })
      .limit(5)

    res.json({
      success: true,
      data: {
        offering: offering.toObject(),
        stats: {
          totalBookings,
          completedBookings,
          pendingBookings,
        },
        recentBookings,
      },
    })
  } catch (error) {
    console.error("Get offering details error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while fetching offering details",
    })
  }
})

// @desc    Delete cultural offering (admin only)
// @route   DELETE /api/admin/offerings/:id
// @access  Private (Admin only)
router.delete("/offerings/:id", async (req, res) => {
  try {
    const offering = await CulturalOffering.findById(req.params.id)

    if (!offering) {
      return res.status(404).json({
        success: false,
        message: "Cultural offering not found",
      })
    }

    // Check for active bookings
    const activeBookings = await Booking.countDocuments({
      culturalOffering: req.params.id,
      status: { $in: ["pending", "confirmed"] },
    })

    if (activeBookings > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete offering with active bookings",
        activeBookings,
      })
    }

    await CulturalOffering.findByIdAndDelete(req.params.id)

    res.json({
      success: true,
      message: "Cultural offering deleted successfully",
    })
  } catch (error) {
    console.error("Delete offering error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while deleting offering",
    })
  }
})

// @desc    Get all bookings for admin review
// @route   GET /api/admin/bookings
// @access  Private (Admin only)
router.get(
  "/bookings",
  [
    query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
    query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),
    query("status")
      .optional()
      .isIn(["pending", "confirmed", "rejected", "cancelled", "completed", "all"])
      .withMessage("Invalid status"),
    query("search").optional().isString().withMessage("Search must be a string"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Invalid query parameters",
          errors: errors.array(),
        })
      }

      const page = Number.parseInt(req.query.page) || 1
      const limit = Number.parseInt(req.query.limit) || 20
      const skip = (page - 1) * limit

      // Build filter object
      const filter = {}

      if (req.query.status && req.query.status !== "all") {
        filter.status = req.query.status
      }

      if (req.query.search) {
        // Search in booking ID, tourist name, or offering title
        const searchRegex = new RegExp(req.query.search, "i")
        filter.$or = [{ bookingId: searchRegex }]
      }

      const bookings = await Booking.find(filter)
        .populate("tourist", "name email phone")
        .populate("culturalOffering", "title category location")
        .populate("host", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)

      const total = await Booking.countDocuments(filter)

      res.json({
        success: true,
        data: {
          bookings,
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
      console.error("Get bookings error:", error)
      res.status(500).json({
        success: false,
        message: "Server error while fetching bookings",
      })
    }
  },
)

// @desc    Get platform analytics
// @route   GET /api/admin/analytics
// @access  Private (Admin only)
router.get("/analytics", async (req, res) => {
  try {
    const { period = "30" } = req.query
    const days = Number.parseInt(period)
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // User growth analytics
    const userGrowth = await User.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            role: "$role",
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.date": 1 } },
    ])

    // Booking analytics
    const bookingAnalytics = await Booking.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            status: "$status",
          },
          count: { $sum: 1 },
          revenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { "_id.date": 1 } },
    ])

    // Popular categories
    const popularCategories = await CulturalOffering.aggregate([
      { $match: { isActive: true, isApproved: true } },
      {
        $lookup: {
          from: "bookings",
          localField: "_id",
          foreignField: "culturalOffering",
          as: "bookings",
        },
      },
      {
        $group: {
          _id: "$category",
          offeringsCount: { $sum: 1 },
          bookingsCount: { $sum: { $size: "$bookings" } },
          avgRating: { $avg: "$rating.average" },
        },
      },
      { $sort: { bookingsCount: -1 } },
    ])

    // Top performing hosts
    const topHosts = await User.aggregate([
      { $match: { role: "host", "hostProfile.isApproved": true } },
      {
        $lookup: {
          from: "culturalofferings",
          localField: "_id",
          foreignField: "host",
          as: "offerings",
        },
      },
      {
        $lookup: {
          from: "bookings",
          localField: "offerings._id",
          foreignField: "culturalOffering",
          as: "bookings",
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          "hostProfile.rating": 1,
          offeringsCount: { $size: "$offerings" },
          bookingsCount: { $size: "$bookings" },
          totalRevenue: {
            $sum: {
              $map: {
                input: { $filter: { input: "$bookings", cond: { $eq: ["$$this.status", "completed"] } } },
                as: "booking",
                in: "$$booking.totalAmount",
              },
            },
          },
        },
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 10 },
    ])

    res.json({
      success: true,
      data: {
        period: `${days} days`,
        userGrowth,
        bookingAnalytics,
        popularCategories,
        topHosts,
      },
    })
  } catch (error) {
    console.error("Get analytics error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while fetching analytics",
    })
  }
})

module.exports = router
