const mongoose = require("mongoose")

const MessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    messageType: {
      type: String,
      enum: ["text", "image", "file", "location", "booking_update", "system"],
      default: "text",
    },
    attachments: [
      {
        url: String,
        type: {
          type: String,
          enum: ["image", "file"],
        },
        name: String,
        size: Number,
      },
    ],
    status: {
      type: String,
      enum: ["sending", "sent", "delivered", "read"],
      default: "sent",
    },
    translatedMessage: {
      type: Map,
      of: String,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: Date,
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  {
    timestamps: true,
  },
)

// Add indexes for faster queries
MessageSchema.index({ conversationId: 1, createdAt: -1 })
MessageSchema.index({ senderId: 1 })

module.exports = mongoose.model("Message", MessageSchema)
