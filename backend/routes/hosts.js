const express = require("express")
const { body, validationResult } = require("express-validator")
const User = require("../models/User")
const CulturalOffering = require("../models/CulturalOffering")
const auth = require("../middleware/auth")
const authorize = require("../middleware/authorize")

const router = express.Router()

// @desc    Get host profile
// @route   GET /api/hosts/profile
// @access  Private (Host only)
router.get("/profile", auth, authorize("host", "admin"), async (req, res) => {
  try {
    const host = await User.findById(req.user.userId).select("-password")

    if (!host) {
      return res.status(404).json({
        success: false,
        message: "Host not found",
      })
    }

    // Get host's cultural offerings count
    const offeringsCount = await CulturalOffering.countDocuments({
      host: req.user.userId,
      isActive: true,
    })

    // Get host's total bookings and revenue (placeholder for now)
    const hostStats = {
      totalOfferings: offeringsCount,
      totalBookings: host.hostProfile?.totalReviews || 0,
      averageRating: host.hostProfile?.rating || 0,
      totalReviews: host.hostProfile?.totalReviews || 0,
      isApproved: host.hostProfile?.isApproved || false,
    }

    res.status(200).json({
      success: true,
      data: {
        profile: host.getPublicProfile(),
        stats: hostStats,
      },
    })
  } catch (error) {
    console.error("Get host profile error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// @desc    Update host profile
// @route   PUT /api/hosts/profile
// @access  Private (Host only)
router.put(
  "/profile",
  auth,
  authorize("host", "admin"),
  [
    body("name").optional().trim().isLength({ min: 1, max: 50 }).withMessage("Name must be 1-50 characters"),
    body("phone")
      .optional()
      .matches(/^\+?[\d\s-()]+$/)
      .withMessage("Please enter a valid phone number"),
    body("bio").optional().isLength({ max: 500 }).withMessage("Bio cannot exceed 500 characters"),
    body("location.city").optional().trim().notEmpty().withMessage("City is required"),
    body("location.region").optional().trim().notEmpty().withMessage("Region is required"),
    body("languages").optional().isArray().withMessage("Languages must be an array"),
    body("hostProfile.experience").optional().isInt({ min: 0 }).withMessage("Experience must be a positive number"),
    body("hostProfile.specialties").optional().isArray().withMessage("Specialties must be an array"),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        })
      }

      const { name, phone, bio, location, languages, hostProfile, avatar } = req.body

      const host = await User.findById(req.user.userId)

      if (!host) {
        return res.status(404).json({
          success: false,
          message: "Host not found",
        })
      }

      // Update fields if provided
      if (name) host.name = name
      if (phone) host.phone = phone
      if (bio) host.bio = bio
      if (avatar) host.avatar = avatar
      if (location) {
        host.location = { ...host.location, ...location }
      }
      if (languages) host.languages = languages

      // Update host profile fields
      if (hostProfile) {
        if (!host.hostProfile) host.hostProfile = {}
        if (hostProfile.experience !== undefined) host.hostProfile.experience = hostProfile.experience
        if (hostProfile.specialties) host.hostProfile.specialties = hostProfile.specialties
      }

      await host.save()

      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: host.getPublicProfile(),
      })
    } catch (error) {
      console.error("Update host profile error:", error)
      res.status(500).json({
        success: false,
        message: "Server error",
      })
    }
  },
)

// @desc    Get all cultural offerings for a host
// @route   GET /api/hosts/destinations
// @access  Private (Host only)
router.get("/destinations", auth, authorize("host", "admin"), async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const { status, category, search } = req.query

    // Build query
    const query = { host: req.user.userId }

    if (status === "active") query.isActive = true
    if (status === "inactive") query.isActive = false
    if (status === "pending") query.isApproved = false
    if (status === "approved") query.isApproved = true

    if (category) query.category = category

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { "location.city": { $regex: search, $options: "i" } },
      ]
    }

    const offerings = await CulturalOffering.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("host", "name avatar location")

    const total = await CulturalOffering.countDocuments(query)

    res.status(200).json({
      success: true,
      data: {
        offerings,
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
    console.error("Get host destinations error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// @desc    Create new cultural offering
// @route   POST /api/hosts/destinations
// @access  Private (Host only)
router.post(
  "/destinations",
  auth,
  authorize("host", "admin"),
  [
    body("title").trim().isLength({ min: 1, max: 100 }).withMessage("Title must be 1-100 characters"),
    body("description").isLength({ min: 10, max: 2000 }).withMessage("Description must be 10-2000 characters"),
    body("category")
      .isIn([
        "Coffee Culture",
        "Culinary Arts",
        "Cultural Arts",
        "Traditional Crafts",
        "Religious Sites",
        "Nature & Wildlife",
        "Adventure",
        "Family Experience",
        "Music & Dance",
        "Storytelling",
        "Traditional Games",
        "Farming Experience",
      ])
      .withMessage("Invalid category"),
    body("price.amount").isFloat({ min: 0 }).withMessage("Price must be a positive number"),
    body("location.address").trim().notEmpty().withMessage("Address is required"),
    body("location.city").trim().notEmpty().withMessage("City is required"),
    body("location.region").trim().notEmpty().withMessage("Region is required"),
    body("duration.hours").isFloat({ min: 0.5, max: 24 }).withMessage("Duration must be between 0.5 and 24 hours"),
    body("maxGuests").isInt({ min: 1, max: 50 }).withMessage("Max guests must be between 1 and 50"),
    body("languages").isArray({ min: 1 }).withMessage("At least one language is required"),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        })
      }

      // Verify host exists and is approved
      const host = await User.findById(req.user.userId)
      if (!host || host.role !== "host") {
        return res.status(403).json({
          success: false,
          message: "Only approved hosts can create cultural offerings",
        })
      }

      const offeringData = {
        ...req.body,
        host: req.user.userId,
      }

      const offering = new CulturalOffering(offeringData)
      await offering.save()

      // Populate host information
      await offering.populate("host", "name avatar location")

      res.status(201).json({
        success: true,
        message: "Cultural offering created successfully",
        data: offering,
      })
    } catch (error) {
      console.error("Create cultural offering error:", error)
      res.status(500).json({
        success: false,
        message: "Server error",
      })
    }
  },
)

// @desc    Get single cultural offering
// @route   GET /api/hosts/destinations/:id
// @access  Private (Host only)
router.get("/destinations/:id", auth, authorize("host", "admin"), async (req, res) => {
  try {
    const offering = await CulturalOffering.findOne({
      _id: req.params.id,
      host: req.user.userId,
    }).populate("host", "name avatar location")

    if (!offering) {
      return res.status(404).json({
        success: false,
        message: "Cultural offering not found",
      })
    }

    res.status(200).json({
      success: true,
      data: offering,
    })
  } catch (error) {
    console.error("Get cultural offering error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// @desc    Update cultural offering
// @route   PUT /api/hosts/destinations/:id
// @access  Private (Host only)
router.put(
  "/destinations/:id",
  auth,
  authorize("host", "admin"),
  [
    body("title").optional().trim().isLength({ min: 1, max: 100 }).withMessage("Title must be 1-100 characters"),
    body("description")
      .optional()
      .isLength({ min: 10, max: 2000 })
      .withMessage("Description must be 10-2000 characters"),
    body("category")
      .optional()
      .isIn([
        "Coffee Culture",
        "Culinary Arts",
        "Cultural Arts",
        "Traditional Crafts",
        "Religious Sites",
        "Nature & Wildlife",
        "Adventure",
        "Family Experience",
        "Music & Dance",
        "Storytelling",
        "Traditional Games",
        "Farming Experience",
      ])
      .withMessage("Invalid category"),
    body("price.amount").optional().isFloat({ min: 0 }).withMessage("Price must be a positive number"),
    body("location.address").optional().trim().notEmpty().withMessage("Address is required"),
    body("location.city").optional().trim().notEmpty().withMessage("City is required"),
    body("location.region").optional().trim().notEmpty().withMessage("Region is required"),
    body("duration.hours")
      .optional()
      .isFloat({ min: 0.5, max: 24 })
      .withMessage("Duration must be between 0.5 and 24 hours"),
    body("maxGuests").optional().isInt({ min: 1, max: 50 }).withMessage("Max guests must be between 1 and 50"),
    body("languages").optional().isArray({ min: 1 }).withMessage("At least one language is required"),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        })
      }

      const offering = await CulturalOffering.findOne({
        _id: req.params.id,
        host: req.user.userId,
      })

      if (!offering) {
        return res.status(404).json({
          success: false,
          message: "Cultural offering not found",
        })
      }

      // Update fields
      Object.keys(req.body).forEach((key) => {
        if (req.body[key] !== undefined) {
          if (key === "location" || key === "price" || key === "duration" || key === "availability") {
            offering[key] = { ...offering[key], ...req.body[key] }
          } else {
            offering[key] = req.body[key]
          }
        }
      })

      // If updating, set approval status to pending for admin review
      if (req.user.role === "host") {
        offering.isApproved = false
      }

      await offering.save()
      await offering.populate("host", "name avatar location")

      res.status(200).json({
        success: true,
        message: "Cultural offering updated successfully",
        data: offering,
      })
    } catch (error) {
      console.error("Update cultural offering error:", error)
      res.status(500).json({
        success: false,
        message: "Server error",
      })
    }
  },
)

// @desc    Delete cultural offering
// @route   DELETE /api/hosts/destinations/:id
// @access  Private (Host only)
router.delete("/destinations/:id", auth, authorize("host", "admin"), async (req, res) => {
  try {
    const offering = await CulturalOffering.findOne({
      _id: req.params.id,
      host: req.user.userId,
    })

    if (!offering) {
      return res.status(404).json({
        success: false,
        message: "Cultural offering not found",
      })
    }

    // Check if there are active bookings (placeholder for future booking system)
    // const activeBookings = await Booking.countDocuments({
    //   culturalOffering: req.params.id,
    //   status: 'confirmed',
    //   date: { $gte: new Date() }
    // });

    // if (activeBookings > 0) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Cannot delete offering with active bookings'
    //   });
    // }

    await CulturalOffering.findByIdAndDelete(req.params.id)

    res.status(200).json({
      success: true,
      message: "Cultural offering deleted successfully",
    })
  } catch (error) {
    console.error("Delete cultural offering error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// @desc    Toggle cultural offering status (active/inactive)
// @route   PATCH /api/hosts/destinations/:id/toggle-status
// @access  Private (Host only)
router.patch("/destinations/:id/toggle-status", auth, authorize("host", "admin"), async (req, res) => {
  try {
    const offering = await CulturalOffering.findOne({
      _id: req.params.id,
      host: req.user.userId,
    })

    if (!offering) {
      return res.status(404).json({
        success: false,
        message: "Cultural offering not found",
      })
    }

    offering.isActive = !offering.isActive
    await offering.save()

    res.status(200).json({
      success: true,
      message: `Cultural offering ${offering.isActive ? "activated" : "deactivated"} successfully`,
      data: {
        id: offering._id,
        isActive: offering.isActive,
      },
    })
  } catch (error) {
    console.error("Toggle offering status error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// @desc    Update cultural offering availability
// @route   PUT /api/hosts/destinations/:id/availability
// @access  Private (Host only)
router.put(
  "/destinations/:id/availability",
  auth,
  authorize("host", "admin"),
  [
    body("schedule").optional().isArray().withMessage("Schedule must be an array"),
    body("specialDates").optional().isArray().withMessage("Special dates must be an array"),
    body("blackoutDates").optional().isArray().withMessage("Blackout dates must be an array"),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        })
      }

      const offering = await CulturalOffering.findOne({
        _id: req.params.id,
        host: req.user.userId,
      })

      if (!offering) {
        return res.status(404).json({
          success: false,
          message: "Cultural offering not found",
        })
      }

      // Update availability
      if (req.body.schedule) offering.availability.schedule = req.body.schedule
      if (req.body.specialDates) offering.availability.specialDates = req.body.specialDates
      if (req.body.blackoutDates) offering.availability.blackoutDates = req.body.blackoutDates

      await offering.save()

      res.status(200).json({
        success: true,
        message: "Availability updated successfully",
        data: offering.availability,
      })
    } catch (error) {
      console.error("Update availability error:", error)
      res.status(500).json({
        success: false,
        message: "Server error",
      })
    }
  },
)

// @desc    Get host dashboard statistics
// @route   GET /api/hosts/dashboard-stats
// @access  Private (Host only)
router.get("/dashboard-stats", auth, authorize("host", "admin"), async (req, res) => {
  try {
    const hostId = req.user.userId

    // Get offerings statistics
    const totalOfferings = await CulturalOffering.countDocuments({ host: hostId })
    const activeOfferings = await CulturalOffering.countDocuments({ host: hostId, isActive: true })
    const pendingApproval = await CulturalOffering.countDocuments({ host: hostId, isApproved: false })

    // Get recent offerings
    const recentOfferings = await CulturalOffering.find({ host: hostId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title category isActive isApproved createdAt")

    // Get host profile
    const host = await User.findById(hostId).select("hostProfile")

    const stats = {
      totalOfferings,
      activeOfferings,
      pendingApproval,
      averageRating: host.hostProfile?.rating || 0,
      totalReviews: host.hostProfile?.totalReviews || 0,
      isApproved: host.hostProfile?.isApproved || false,
      recentOfferings,
    }

    res.status(200).json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error("Get dashboard stats error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

module.exports = router
