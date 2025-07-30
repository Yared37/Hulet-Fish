const mongoose = require("mongoose")

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      unique: true,
      required: true,
    },
    tourist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Tourist is required"],
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Host is required"],
    },
    culturalOffering: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CulturalOffering",
      required: [true, "Cultural offering is required"],
    },
    bookingDate: {
      type: Date,
      required: [true, "Booking date is required"],
      validate: {
        validator: (date) => date > new Date(),
        message: "Booking date must be in the future",
      },
    },
    timeSlot: {
      startTime: {
        type: String,
        required: [true, "Start time is required"],
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Please enter valid time format (HH:MM)"],
      },
      endTime: {
        type: String,
        required: [true, "End time is required"],
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Please enter valid time format (HH:MM)"],
      },
    },
    numberOfGuests: {
      type: Number,
      required: [true, "Number of guests is required"],
      min: [1, "At least 1 guest is required"],
    },
    guestDetails: [
      {
        name: {
          type: String,
          required: [true, "Guest name is required"],
          trim: true,
        },
        age: {
          type: Number,
          min: [0, "Age cannot be negative"],
          max: [120, "Age cannot exceed 120"],
        },
        specialRequests: String,
      },
    ],
    contactInfo: {
      phone: {
        type: String,
        required: [true, "Phone number is required"],
        match: [/^\+?[\d\s-()]+$/, "Please enter a valid phone number"],
      },
      email: {
        type: String,
        required: [true, "Email is required"],
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
      },
      emergencyContact: {
        name: String,
        phone: String,
        relationship: String,
      },
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "rejected", "cancelled", "completed"],
      default: "pending",
    },
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Total amount cannot be negative"],
    },
    currency: {
      type: String,
      default: "ETB",
      enum: ["ETB", "USD", "EUR"],
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded", "failed"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "bank_transfer", "mobile_money", "card"],
    },
    paymentReference: String,
    touristMessage: {
      type: String,
      maxlength: [500, "Tourist message cannot exceed 500 characters"],
    },
    hostResponse: {
      type: String,
      maxlength: [500, "Host response cannot exceed 500 characters"],
    },
    hostNotes: {
      type: String,
      maxlength: [500, "Host notes cannot exceed 500 characters"],
    },
    cancellationReason: String,
    cancellationFee: {
      type: Number,
      default: 0,
      min: [0, "Cancellation fee cannot be negative"],
    },
    timestamps: {
      requestedAt: {
        type: Date,
        default: Date.now,
      },
      respondedAt: Date,
      confirmedAt: Date,
      cancelledAt: Date,
      completedAt: Date,
    },
    adminNotes: {
      type: String,
      maxlength: [1000, "Admin notes cannot exceed 1000 characters"],
    },
    flaggedForReview: {
      type: Boolean,
      default: false,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviewedAt: Date,
  },
  {
    timestamps: true,
  },
)

// Indexes for better query performance
bookingSchema.index({ bookingId: 1 })
bookingSchema.index({ tourist: 1 })
bookingSchema.index({ host: 1 })
bookingSchema.index({ culturalOffering: 1 })
bookingSchema.index({ status: 1 })
bookingSchema.index({ bookingDate: 1 })
bookingSchema.index({ createdAt: -1 })

// Generate unique booking ID before saving
bookingSchema.pre("save", async function (next) {
  if (!this.bookingId) {
    const date = new Date()
    const year = date.getFullYear().toString().slice(-2)
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const day = date.getDate().toString().padStart(2, "0")

    // Find the last booking of the day
    const lastBooking = await this.constructor
      .findOne({
        bookingId: new RegExp(`^HF${year}${month}${day}`),
      })
      .sort({ bookingId: -1 })

    let sequence = 1
    if (lastBooking) {
      const lastSequence = Number.parseInt(lastBooking.bookingId.slice(-3))
      sequence = lastSequence + 1
    }

    this.bookingId = `HF${year}${month}${day}${sequence.toString().padStart(3, "0")}`
  }
  next()
})

// Virtual for checking if booking can be cancelled
bookingSchema.virtual("canCancel").get(function () {
  if (this.status !== "confirmed" && this.status !== "pending") return false

  const now = new Date()
  const bookingDateTime = new Date(this.bookingDate)
  const timeDiff = bookingDateTime.getTime() - now.getTime()
  const hoursDiff = timeDiff / (1000 * 3600)

  return hoursDiff > 24 // Can cancel if more than 24 hours before booking
})

// Virtual for checking if review can be left
bookingSchema.virtual("canReview").get(function () {
  return this.status === "completed"
})

// Virtual for checking if booking is upcoming
bookingSchema.virtual("isUpcoming").get(function () {
  const now = new Date()
  const bookingDate = new Date(this.bookingDate)
  return bookingDate > now && (this.status === "confirmed" || this.status === "pending")
})

module.exports = mongoose.model("Booking", bookingSchema)
