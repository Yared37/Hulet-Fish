const express = require("express")
const { body, validationResult } = require("express-validator")
const User = require("../models/User")
const auth = require("../middleware/auth")
const authorize = require("../middleware/authorize")

const router = express.Router()

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.json({
      success: true,
      user: user.getPublicProfile(),
    })
  } catch (error) {
    console.error("Get profile error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put(
  "/profile",
  auth,
  [
    body("name")
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("Name must be between 2 and 50 characters"),
    body("phone")
      .optional()
      .matches(/^\+?[\d\s-()]+$/)
      .withMessage("Please enter a valid phone number"),
    body("bio").optional().isLength({ max: 500 }).withMessage("Bio cannot exceed 500 characters"),
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

      const { name, phone, bio, location, languages } = req.body

      const user = await User.findById(req.user.userId)
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        })
      }

      // Update fields if provided
      if (name) user.name = name
      if (phone) user.phone = phone
      if (bio) user.bio = bio
      if (location) user.location = { ...user.location, ...location }
      if (languages) user.languages = languages

      await user.save()

      res.json({
        success: true,
        message: "Profile updated successfully",
        user: user.getPublicProfile(),
      })
    } catch (error) {
      console.error("Update profile error:", error)
      res.status(500).json({
        success: false,
        message: "Server error during profile update",
      })
    }
  },
)

// @route   GET /api/users/hosts
// @desc    Get all approved hosts
// @access  Public
router.get("/hosts", async (req, res) => {
  try {
    const { page = 1, limit = 10, city, region } = req.query

    // Build filter
    const filter = {
      role: "host",
      "hostProfile.isApproved": true,
      isActive: true,
    }

    if (city) filter["location.city"] = new RegExp(city, "i")
    if (region) filter["location.region"] = new RegExp(region, "i")

    const hosts = await User.find(filter)
      .select("name email avatar location languages bio hostProfile createdAt")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ "hostProfile.rating": -1, createdAt: -1 })

    const total = await User.countDocuments(filter)

    res.json({
      success: true,
      hosts,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    })
  } catch (error) {
    console.error("Get hosts error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// @route   GET /api/users/hosts/:id
// @desc    Get host profile by ID
// @access  Public
router.get("/hosts/:id", async (req, res) => {
  try {
    const host = await User.findOne({
      _id: req.params.id,
      role: "host",
      "hostProfile.isApproved": true,
      isActive: true,
    }).select("name email avatar location languages bio hostProfile createdAt")

    if (!host) {
      return res.status(404).json({
        success: false,
        message: "Host not found",
      })
    }

    res.json({
      success: true,
      host,
    })
  } catch (error) {
    console.error("Get host error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// @route   PUT /api/users/host-profile
// @desc    Update host profile (host only)
// @access  Private (Host)
router.put(
  "/host-profile",
  auth,
  authorize("host"),
  [
    body("experience").optional().isInt({ min: 0 }).withMessage("Experience must be a positive number"),
    body("specialties").optional().isArray().withMessage("Specialties must be an array"),
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

      const { experience, specialties } = req.body

      const user = await User.findById(req.user.userId)
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        })
      }

      // Update host profile
      if (experience !== undefined) user.hostProfile.experience = experience
      if (specialties) user.hostProfile.specialties = specialties

      await user.save()

      res.json({
        success: true,
        message: "Host profile updated successfully",
        user: user.getPublicProfile(),
      })
    } catch (error) {
      console.error("Update host profile error:", error)
      res.status(500).json({
        success: false,
        message: "Server error during host profile update",
      })
    }
  },
)

// @route   GET /api/users/admin/all
// @desc    Get all users (admin only)
// @access  Private (Admin)
router.get("/admin/all", auth, authorize("admin"), async (req, res) => {
  try {
    const { page = 1, limit = 20, role, isActive } = req.query

    // Build filter
    const filter = {}
    if (role) filter.role = role
    if (isActive !== undefined) filter.isActive = isActive === "true"

    const users = await User.find(filter)
      .select("-password")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })

    const total = await User.countDocuments(filter)

    res.json({
      success: true,
      users,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    })
  } catch (error) {
    console.error("Get all users error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// @route   PUT /api/users/admin/:id/approve-host
// @desc    Approve host application (admin only)
// @access  Private (Admin)
router.put("/admin/:id/approve-host", auth, authorize("admin"), async (req, res) => {
  try {
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

    user.hostProfile.isApproved = true
    await user.save()

    res.json({
      success: true,
      message: "Host approved successfully",
      user: user.getPublicProfile(),
    })
  } catch (error) {
    console.error("Approve host error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

module.exports = router
