const mongoose = require("mongoose")

const tourSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Tour title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Tour description is required"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    shortDescription: {
      type: String,
      maxlength: [200, "Short description cannot exceed 200 characters"],
    },
    category: {
      type: String,
      required: [true, "Tour category is required"],
      enum: [
        "Coffee Culture",
        "Culinary Arts",
        "Cultural Arts",
        "Traditional Crafts",
        "Religious Sites",
        "Nature & Wildlife",
        "Adventure",
        "Family Experience",
      ],
    },
    type: {
      type: String,
      enum: ["Family", "Expert", "Solo", "Group"],
      default: "Family",
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Tour host is required"],
    },
    location: {
      city: {
        type: String,
        required: [true, "City is required"],
      },
      region: {
        type: String,
        required: [true, "Region is required"],
      },
      address: String,
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },
    price: {
      amount: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price cannot be negative"],
      },
      currency: {
        type: String,
        default: "ETB",
      },
      priceType: {
        type: String,
        enum: ["per_person", "per_group", "per_family"],
        default: "per_person",
      },
    },
    duration: {
      hours: {
        type: Number,
        required: [true, "Duration in hours is required"],
        min: [0.5, "Minimum duration is 30 minutes"],
      },
      days: {
        type: Number,
        default: 0,
      },
    },
    maxGuests: {
      type: Number,
      required: [true, "Maximum guests is required"],
      min: [1, "At least 1 guest must be allowed"],
      max: [50, "Maximum 50 guests allowed"],
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: String,
        caption: String,
        isMain: {
          type: Boolean,
          default: false,
        },
      },
    ],
    amenities: [
      {
        type: String,
        enum: [
          "Food Included",
          "Transportation",
          "Guide Included",
          "Equipment Provided",
          "Pickup Service",
          "Cultural Dress",
          "Certificate",
          "Photos Included",
        ],
      },
    ],
    languages: [
      {
        type: String,
        enum: ["English", "Amharic", "Oromo", "Tigrinya", "Somali", "Arabic"],
      },
    ],
    difficulty: {
      type: String,
      enum: ["Easy", "Moderate", "Challenging"],
      default: "Easy",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    availableDates: [
      {
        date: {
          type: Date,
          required: true,
        },
        availableSlots: {
          type: Number,
          required: true,
          min: 0,
        },
        isBlocked: {
          type: Boolean,
          default: false,
        },
      },
    ],
    rating: {
      average: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },
      totalReviews: {
        type: Number,
        default: 0,
      },
    },
    bookingCount: {
      type: Number,
      default: 0,
    },
    tags: [String],
    cancellationPolicy: {
      type: String,
      enum: ["Flexible", "Moderate", "Strict"],
      default: "Moderate",
    },
    requirements: [String],
    whatToExpect: [String],
    whatToWear: [String],
    meetingPoint: String,
  },
  {
    timestamps: true,
  },
)

// Indexes for better query performance
tourSchema.index({ category: 1 })
tourSchema.index({ "location.city": 1 })
tourSchema.index({ "location.region": 1 })
tourSchema.index({ host: 1 })
tourSchema.index({ isActive: 1 })
tourSchema.index({ isFeatured: 1 })
tourSchema.index({ "rating.average": -1 })
tourSchema.index({ createdAt: -1 })

// Virtual for main image
tourSchema.virtual("mainImage").get(function () {
  const mainImg = this.images.find((img) => img.isMain)
  return mainImg || this.images[0]
})

// Ensure only one main image
tourSchema.pre("save", function (next) {
  if (this.images && this.images.length > 0) {
    const mainImages = this.images.filter((img) => img.isMain)
    if (mainImages.length > 1) {
      // Keep only the first main image
      this.images.forEach((img, index) => {
        if (index > 0) img.isMain = false
      })
    } else if (mainImages.length === 0) {
      // Set first image as main if no main image exists
      this.images[0].isMain = true
    }
  }
  next()
})

module.exports = mongoose.model("Tour", tourSchema)
