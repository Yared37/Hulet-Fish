const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const crypto = require("crypto")

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId // Password required only if not Google OAuth user
      },
      minlength: [6, "Password must be at least 6 characters"],
    },
    phone: {
      type: String,
      trim: true,
      match: [/^\+?[\d\s-()]+$/, "Please enter a valid phone number"],
    },
    role: {
      type: String,
      enum: ["tourist", "host", "guide", "admin"],
      default: "tourist",
    },
    avatar: {
      type: String,
      default: "",
    },
    location: {
      city: String,
      region: String,
      country: {
        type: String,
        default: "Ethiopia",
      },
    },
    languages: [
      {
        type: String,
        enum: ["English", "Amharic", "Oromo", "Tigrinya", "Somali", "Arabic"],
      },
    ],
    bio: {
      type: String,
      maxlength: [500, "Bio cannot exceed 500 characters"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    googleId: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    emailVerificationToken: String,
    emailVerificationExpire: Date,
    // Host-specific fields
    hostProfile: {
      experience: {
        type: Number,
        min: 0,
      },
      specialties: [String],
      rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },
      totalReviews: {
        type: Number,
        default: 0,
      },
      isApproved: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  },
)

// Index for better query performance
userSchema.index({ email: 1 })
userSchema.index({ role: 1 })
userSchema.index({ "location.city": 1 })
userSchema.index({ emailVerificationToken: 1 })

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  try {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false
  return await bcrypt.compare(candidatePassword, this.password)
}

// Generate email verification token
userSchema.methods.generateEmailVerificationToken = function () {
  // Generate token
  const verificationToken = crypto.randomBytes(20).toString("hex")

  // Hash token and set to emailVerificationToken field
  this.emailVerificationToken = crypto.createHash("sha256").update(verificationToken).digest("hex")

  // Set expire time (24 hours)
  this.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000

  return verificationToken
}

// Generate password reset token
userSchema.methods.generatePasswordResetToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString("hex")

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")

  // Set expire time (10 minutes)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000

  return resetToken
}

// Get public profile (exclude sensitive data)
userSchema.methods.getPublicProfile = function () {
  const userObject = this.toObject()
  delete userObject.password
  delete userObject.resetPasswordToken
  delete userObject.resetPasswordExpire
  delete userObject.emailVerificationToken
  delete userObject.emailVerificationExpire
  delete userObject.googleId
  return userObject
}

module.exports = mongoose.model("User", userSchema)
