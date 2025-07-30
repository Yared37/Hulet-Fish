const express = require("express")
const { body, validationResult, query } = require("express-validator")
const Tour = require("../models/Tour")
const User = require("../models/User")
const auth = require("../middleware/auth")
const authorize = require("../middleware/authorize")

const router = express.Router()

// @route   GET /api/tours
// @desc    Get all tours with filtering and pagination
// @access  Public
router.get(
  "/",
  [
    query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
    query("limit").optional().isInt({ min: 1, max: 50 }).withMessage("Limit must be between 1 and 50"),
    query("category").optional().isString(),
    query("city").optional().isString(),
    query("minPrice").optional().isFloat({ min: 0 }),
    query("maxPrice").optional().isFloat({ min: 0 }),
    query("rating").optional().isFloat({ min: 0, max: 5 }),
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
      const limit = Number.parseInt(req.query.limit) || 12
      const skip = (page - 1) * limit

      // Build filter object
      const filter = { isActive: true }

      if (req.query.category) {
        filter.category = req.query.category
      }

      if (req.query.city) {
        filter["location.city"] = new RegExp(req.query.city, "i")
      }

      if (req.query.minPrice || req.query.maxPrice) {
        filter["price.amount"] = {}
        if (req.query.minPrice) filter["price.amount"].$gte = Number.parseFloat(req.query.minPrice)
        if (req.query.maxPrice) filter["price.amount"].$lte = Number.parseFloat(req.query.maxPrice)
      }

      if (req.query.rating) {
        filter["rating.average"] = { $gte: Number.parseFloat(req.query.rating) }
      }

      if (req.query.search) {
        filter.$or = [
          { title: new RegExp(req.query.search, "i") },
          { description: new RegExp(req.query.search, "i") },
          { "location.city": new RegExp(req.query.search, "i") },
        ]
      }

      // Build sort object
      let sort = {}
      switch (req.query.sort) {
        case "price_low":
          sort = { "price.amount": 1 }
          break
        case "price_high":
          sort = { "price.amount": -1 }
          break
        case "rating":
          sort = { "rating.average": -1 }
          break
        case "newest":
          sort = { createdAt: -1 }
          break
        default:
          sort = { isFeatured: -1, "rating.average": -1 }
      }

      const tours = await Tour.find(filter)
        .populate("host", "name avatar location.city rating")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean()

      const total = await Tour.countDocuments(filter)

      res.json({
        success: true,
        data: {
          tours,
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
      console.error("Get tours error:", error)
      res.status(500).json({
        success: false,
        message: "Server error while fetching tours",
      })
    }
  },
)

// @route   GET /api/tours/featured
// @desc    Get featured tours
// @access  Public
router.get("/featured", async (req, res) => {
  try {
    const tours = await Tour.find({ isActive: true, isFeatured: true })
      .populate("host", "name avatar location.city")
      .sort({ "rating.average": -1 })
      .limit(6)
      .lean()

    res.json({
      success: true,
      data: tours,
    })
  } catch (error) {
    console.error("Get featured tours error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while fetching featured tours",
    })
  }
})

// @route   GET /api/tours/:id
// @desc    Get single tour by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id)
      .populate("host", "name avatar bio location languages hostProfile")
      .lean()

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Tour not found",
      })
    }

    if (!tour.isActive) {
      return res.status(404).json({
        success: false,
        message: "Tour is not available",
      })
    }

    res.json({
      success: true,
      data: tour,
    })
  } catch (error) {
    console.error("Get tour error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while fetching tour",
    })
  }
})

// @route   POST /api/tours
// @desc    Create a new tour
// @access  Private (Host/Admin)
router.post(
  "/",
  [
    auth,
    authorize("host", "admin"),
    body("title").trim().isLength({ min: 5, max: 100 }).withMessage("Title must be between 5 and 100 characters"),
    body("description")
      .trim()
      .isLength({ min: 50, max: 2000 })
      .withMessage("Description must be between 50 and 2000 characters"),
    body("category").isIn([
      "Coffee Culture",
      "Culinary Arts",
      "Cultural Arts",
      "Traditional Crafts",
      "Religious Sites",
      "Nature & Wildlife",
      "Adventure",
      "Family Experience",
    ]),
    body("location.city").trim().notEmpty().withMessage("City is required"),
    body("location.region").trim().notEmpty().withMessage("Region is required"),
    body("price.amount").isFloat({ min: 0 }).withMessage("Price must be a positive number"),
    body("duration.hours").isFloat({ min: 0.5 }).withMessage("Duration must be at least 30 minutes"),
    body("maxGuests").isInt({ min: 1, max: 50 }).withMessage("Max guests must be between 1 and 50"),
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

      // Check if user is approved host
      const user = await User.findById(req.user.userId)
      if (user.role === "host" && !user.hostProfile.isApproved) {
        return res.status(403).json({
          success: false,
          message: "Host account must be approved before creating tours",
        })
      }

      const tourData = {
        ...req.body,
        host: req.user.userId,
      }

      const tour = new Tour(tourData)
      await tour.save()

      await tour.populate("host", "name avatar location.city")

      res.status(201).json({
        success: true,
        message: "Tour created successfully",
        data: tour,
      })
    } catch (error) {
      console.error("Create tour error:", error)
      res.status(500).json({
        success: false,
        message: "Server error while creating tour",
      })
    }
  },
)

// @route   PUT /api/tours/:id
// @desc    Update tour
// @access  Private (Host/Admin)
router.put("/:id", [auth, authorize("host", "admin")], async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id)

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Tour not found",
      })
    }

    // Check if user owns the tour or is admin
    if (tour.host.toString() !== req.user.userId && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this tour",
      })
    }

    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("host", "name avatar location.city")

    res.json({
      success: true,
      message: "Tour updated successfully",
      data: updatedTour,
    })
  } catch (error) {
    console.error("Update tour error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while updating tour",
    })
  }
})

// @route   DELETE /api/tours/:id
// @desc    Delete tour
// @access  Private (Host/Admin)
router.delete("/:id", [auth, authorize("host", "admin")], async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id)

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Tour not found",
      })
    }

    // Check if user owns the tour or is admin
    if (tour.host.toString() !== req.user.userId && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this tour",
      })
    }

    // Soft delete by setting isActive to false
    tour.isActive = false
    await tour.save()

    res.json({
      success: true,
      message: "Tour deleted successfully",
    })
  } catch (error) {
    console.error("Delete tour error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while deleting tour",
    })
  }
})

module.exports = router
