const mongoose = require("mongoose")

const ConversationSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    participants: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        role: {
          type: String,
          enum: ["tourist", "host", "admin"],
          required: true,
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
        lastSeen: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    unreadCount: {
      type: Map,
      of: Number,
      default: {},
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
)

// Add indexes for faster queries
ConversationSchema.index({ bookingId: 1 })
ConversationSchema.index({ "participants.userId": 1 })
ConversationSchema.index({ updatedAt: -1 })

module.exports = mongoose.model("Conversation", ConversationSchema)
