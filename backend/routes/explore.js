const express = require("express")
const { query, validationResult } = require("express-validator")
const CulturalOffering = require("../models/CulturalOffering")
const User = require("../models/User")

const router = express.Router()

// @desc    Get all available cultural offerings for tourists
// @route   GET /api/explore
// @access  Public
router.get(
  "/",
  [
    query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
    query("limit").optional().isInt({ min: 1, max: 50 }).withMessage("Limit must be between 1 and 50"),
    query("category").optional().isString(),
    query("city").optional().isString(),
    query("region").optional().isString(),
    query("minPrice").optional().isFloat({ min: 0 }),
    query("maxPrice").optional().isFloat({ min: 0 }),
    query("rating").optional().isFloat({ min: 0, max: 5 }),
    query("maxGuests").optional().isInt({ min: 1 }),
    query("language").optional().isString(),
    query("difficulty").optional().isIn(["Easy", "Moderate", "Challenging"]),
    query("sort").optional().isIn(["price_low", "price_high", "rating", "newest", "popular"]),
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
      const filter = {
        isActive: true,
        isApproved: true,
      }

      if (req.query.category) {
        filter.category = req.query.category
      }

      if (req.query.city) {
        filter["location.city"] = new RegExp(req.query.city, "i")
      }

      if (req.query.region) {
        filter["location.region"] = new RegExp(req.query.region, "i")
      }

      if (req.query.minPrice || req.query.maxPrice) {
        filter["price.amount"] = {}
        if (req.query.minPrice) filter["price.amount"].$gte = Number.parseFloat(req.query.minPrice)
        if (req.query.maxPrice) filter["price.amount"].$lte = Number.parseFloat(req.query.maxPrice)
      }

      if (req.query.rating) {
        filter["rating.average"] = { $gte: Number.parseFloat(req.query.rating) }
      }

      if (req.query.maxGuests) {
        filter.maxGuests = { $gte: Number.parseInt(req.query.maxGuests) }
      }

      if (req.query.language) {
        filter.languages = { $in: [req.query.language] }
      }

      if (req.query.difficulty) {
        filter.difficulty = req.query.difficulty
      }

      if (req.query.search) {
        filter.$or = [
          { title: new RegExp(req.query.search, "i") },
          { description: new RegExp(req.query.search, "i") },
          { "location.city": new RegExp(req.query.search, "i") },
          { "location.region": new RegExp(req.query.search, "i") },
          { tags: { $in: [new RegExp(req.query.search, "i")] } },
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
          sort = { "rating.average": -1, "rating.totalReviews": -1 }
          break
        case "newest":
          sort = { createdAt: -1 }
          break
        case "popular":
          sort = { bookingCount: -1, "rating.average": -1 }
          break
        default:
          sort = { "rating.average": -1, bookingCount: -1 }
      }

      const offerings = await CulturalOffering.find(filter)
        .populate(
          "host",
          "name avatar location.city hostProfile.rating hostProfile.totalReviews hostProfile.experience",
        )
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean()

      const total = await CulturalOffering.countDocuments(filter)

      // Add computed fields
      const enrichedOfferings = offerings.map((offering) => ({
        ...offering,
        mainImage: offering.images.find((img) => img.isMain) || offering.images[0],
        hostRating: offering.host.hostProfile?.rating || 0,
        hostExperience: offering.host.hostProfile?.experience || 0,
      }))

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
          filters: {
            totalResults: total,
            appliedFilters: {
              category: req.query.category,
              city: req.query.city,
              region: req.query.region,
              priceRange:
                req.query.minPrice || req.query.maxPrice
                  ? {
                      min: req.query.minPrice,
                      max: req.query.maxPrice,
                    }
                  : null,
              rating: req.query.rating,
              language: req.query.language,
              difficulty: req.query.difficulty,
            },
          },
        },
      })
    } catch (error) {
      console.error("Get cultural offerings error:", error)
      res.status(500).json({
        success: false,
        message: "Server error while fetching cultural offerings",
      })
    }
  },
)

// @desc    Get featured cultural offerings
// @route   GET /api/explore/featured
// @access  Public
router.get("/featured", async (req, res) => {
  try {
    const offerings = await CulturalOffering.find({
      isActive: true,
      isApproved: true,
      "rating.average": { $gte: 4.0 },
    })
      .populate("host", "name avatar location.city hostProfile.rating")
      .sort({ "rating.average": -1, bookingCount: -1 })
      .limit(8)
      .lean()

    const enrichedOfferings = offerings.map((offering) => ({
      ...offering,
      mainImage: offering.images.find((img) => img.isMain) || offering.images[0],
      hostRating: offering.host.hostProfile?.rating || 0,
    }))

    res.json({
      success: true,
      data: enrichedOfferings,
    })
  } catch (error) {
    console.error("Get featured offerings error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while fetching featured offerings",
    })
  }
})

// @desc    Get single cultural offering details
// @route   GET /api/explore/:id
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const offering = await CulturalOffering.findOne({
      _id: req.params.id,
      isActive: true,
      isApproved: true,
    })
      .populate("host", "name avatar bio location languages hostProfile")
      .lean()

    if (!offering) {
      return res.status(404).json({
        success: false,
        message: "Cultural offering not found or not available",
      })
    }

    // Add computed fields
    const enrichedOffering = {
      ...offering,
      mainImage: offering.images.find((img) => img.isMain) || offering.images[0],
      hostRating: offering.host.hostProfile?.rating || 0,
      hostTotalReviews: offering.host.hostProfile?.totalReviews || 0,
      hostExperience: offering.host.hostProfile?.experience || 0,
    }

    res.json({
      success: true,
      data: enrichedOffering,
    })
  } catch (error) {
    console.error("Get cultural offering error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while fetching cultural offering",
    })
  }
})

// @desc    Get available categories
// @route   GET /api/explore/categories
// @access  Public
router.get("/categories", async (req, res) => {
  try {
    const categories = await CulturalOffering.aggregate([
      { $match: { isActive: true, isApproved: true } },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          avgPrice: { $avg: "$price.amount" },
          avgRating: { $avg: "$rating.average" },
        },
      },
      { $sort: { count: -1 } },
    ])

    res.json({
      success: true,
      data: categories.map((cat) => ({
        name: cat._id,
        count: cat.count,
        averagePrice: Math.round(cat.avgPrice || 0),
        averageRating: Math.round((cat.avgRating || 0) * 10) / 10,
      })),
    })
  } catch (error) {
    console.error("Get categories error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while fetching categories",
    })
  }
})

// @desc    Get available locations
// @route   GET /api/explore/locations
// @access  Public
router.get("/locations", async (req, res) => {
  try {
    const locations = await CulturalOffering.aggregate([
      { $match: { isActive: true, isApproved: true } },
      {
        $group: {
          _id: {
            city: "$location.city",
            region: "$location.region",
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 20 },
    ])

    res.json({
      success: true,
      data: locations.map((loc) => ({
        city: loc._id.city,
        region: loc._id.region,
        count: loc.count,
      })),
    })
  } catch (error) {
    console.error("Get locations error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while fetching locations",
    })
  }
})

module.exports = router
