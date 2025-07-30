const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema(
  {
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tour",
      required: [true, "Tour is required"],
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: [true, "Booking is required"],
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Reviewer is required"],
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Host is required"],
    },
    rating: {
      overall: {
        type: Number,
        required: [true, "Overall rating is required"],
        min: [1, "Rating must be at least 1"],
        max: [5, "Rating cannot exceed 5"],
      },
      experience: {
        type: Number,
        min: 1,
        max: 5,
      },
      value: {
        type: Number,
        min: 1,
        max: 5,
      },
      hospitality: {
        type: Number,
        min: 1,
        max: 5,
      },
      authenticity: {
        type: Number,
        min: 1,
        max: 5,
      },
    },
    title: {
      type: String,
      maxlength: [100, "Review title cannot exceed 100 characters"],
    },
    comment: {
      type: String,
      required: [true, "Review comment is required"],
      maxlength: [1000, "Review comment cannot exceed 1000 characters"],
    },
    photos: [
      {
        url: String,
        publicId: String,
        caption: String,
      },
    ],
    isVerified: {
      type: Boolean,
      default: true, // Since reviews are from actual bookings
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    helpfulVotes: {
      type: Number,
      default: 0,
    },
    reportCount: {
      type: Number,
      default: 0,
    },
    hostResponse: {
      message: String,
      respondedAt: Date,
    },
    visitDate: {
      type: Date,
      required: [true, "Visit date is required"],
    },
  },
  {
    timestamps: true,
  },
)

// Indexes
reviewSchema.index({ tour: 1 })
reviewSchema.index({ reviewer: 1 })
reviewSchema.index({ host: 1 })
reviewSchema.index({ "rating.overall": -1 })
reviewSchema.index({ createdAt: -1 })
reviewSchema.index({ isVisible: 1 })

// Ensure one review per booking
reviewSchema.index({ booking: 1 }, { unique: true })

module.exports = mongoose.model("Review", reviewSchema)
