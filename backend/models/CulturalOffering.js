const mongoose = require("mongoose")

const culturalOfferingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    shortDescription: {
      type: String,
      maxlength: [200, "Short description cannot exceed 200 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
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
      ],
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Host is required"],
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
    price: {
      amount: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price cannot be negative"],
      },
      currency: {
        type: String,
        default: "ETB",
        enum: ["ETB", "USD", "EUR"],
      },
      priceType: {
        type: String,
        enum: ["per_person", "per_group", "per_family"],
        default: "per_person",
      },
    },
    location: {
      address: {
        type: String,
        required: [true, "Address is required"],
      },
      city: {
        type: String,
        required: [true, "City is required"],
      },
      region: {
        type: String,
        required: [true, "Region is required"],
      },
      country: {
        type: String,
        default: "Ethiopia",
      },
      coordinates: {
        latitude: {
          type: Number,
          min: [-90, "Latitude must be between -90 and 90"],
          max: [90, "Latitude must be between -90 and 90"],
        },
        longitude: {
          type: Number,
          min: [-180, "Longitude must be between -180 and 180"],
          max: [180, "Longitude must be between -180 and 180"],
        },
      },
    },
    duration: {
      hours: {
        type: Number,
        required: [true, "Duration in hours is required"],
        min: [0.5, "Minimum duration is 30 minutes"],
        max: [24, "Maximum duration is 24 hours"],
      },
      days: {
        type: Number,
        default: 0,
        min: [0, "Days cannot be negative"],
      },
    },
    maxGuests: {
      type: Number,
      required: [true, "Maximum guests is required"],
      min: [1, "At least 1 guest must be allowed"],
      max: [50, "Maximum 50 guests allowed"],
    },
    minGuests: {
      type: Number,
      default: 1,
      min: [1, "Minimum guests must be at least 1"],
    },
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
          "Refreshments",
          "Materials Provided",
          "Traditional Music",
          "Storytelling",
        ],
      },
    ],
    languages: [
      {
        type: String,
        enum: ["English", "Amharic", "Oromo", "Tigrinya", "Somali", "Arabic"],
        required: true,
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
    isApproved: {
      type: Boolean,
      default: false,
    },
    adminRejected: {
      type: Boolean,
      default: false,
    },
    adminNotes: {
      type: String,
      maxlength: [1000, "Admin notes cannot exceed 1000 characters"],
    },
    adminFeedback: {
      type: String,
      maxlength: [1000, "Admin feedback cannot exceed 1000 characters"],
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviewedAt: Date,
    availability: {
      schedule: [
        {
          dayOfWeek: {
            type: String,
            enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            required: true,
          },
          isAvailable: {
            type: Boolean,
            default: true,
          },
          timeSlots: [
            {
              startTime: {
                type: String,
                required: true,
                match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Please enter valid time format (HH:MM)"],
              },
              endTime: {
                type: String,
                required: true,
                match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Please enter valid time format (HH:MM)"],
              },
              maxBookings: {
                type: Number,
                default: 1,
                min: [1, "At least 1 booking must be allowed"],
              },
            },
          ],
        },
      ],
      specialDates: [
        {
          date: {
            type: Date,
            required: true,
          },
          isAvailable: {
            type: Boolean,
            default: true,
          },
          specialPrice: {
            type: Number,
            min: [0, "Special price cannot be negative"],
          },
          note: String,
        },
      ],
      blackoutDates: [
        {
          startDate: {
            type: Date,
            required: true,
          },
          endDate: {
            type: Date,
            required: true,
          },
          reason: String,
        },
      ],
    },
    requirements: [String],
    whatToExpect: [String],
    whatToBring: [String],
    cancellationPolicy: {
      type: String,
      enum: ["Flexible", "Moderate", "Strict"],
      default: "Moderate",
    },
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
    seasonalInfo: {
      bestMonths: [
        {
          type: String,
          enum: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ],
        },
      ],
      weatherConsiderations: String,
    },
  },
  {
    timestamps: true,
  },
)

// Indexes for better query performance
culturalOfferingSchema.index({ host: 1 })
culturalOfferingSchema.index({ category: 1 })
culturalOfferingSchema.index({ "location.city": 1 })
culturalOfferingSchema.index({ "location.region": 1 })
culturalOfferingSchema.index({ isActive: 1 })
culturalOfferingSchema.index({ isApproved: 1 })
culturalOfferingSchema.index({ "rating.average": -1 })
culturalOfferingSchema.index({ createdAt: -1 })
culturalOfferingSchema.index({ adminRejected: 1 })

// Virtual for main image
culturalOfferingSchema.virtual("mainImage").get(function () {
  const mainImg = this.images.find((img) => img.isMain)
  return mainImg || this.images[0]
})

// Ensure only one main image
culturalOfferingSchema.pre("save", function (next) {
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

// Validate that endTime is after startTime for time slots
culturalOfferingSchema.pre("save", function (next) {
  if (this.availability && this.availability.schedule) {
    for (const day of this.availability.schedule) {
      for (const slot of day.timeSlots) {
        const startTime = new Date(`2000-01-01T${slot.startTime}:00`)
        const endTime = new Date(`2000-01-01T${slot.endTime}:00`)
        if (endTime <= startTime) {
          return next(new Error("End time must be after start time"))
        }
      }
    }
  }
  next()
})

module.exports = mongoose.model("CulturalOffering", culturalOfferingSchema)
