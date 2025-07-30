const express = require("express")
const router = express.Router()
const auth = require("../middleware/auth")
const Conversation = require("../models/Conversation")
const Message = require("../models/Message")
const User = require("../models/User")
const Booking = require("../models/Booking")
const multer = require("multer")
const { v4: uuidv4 } = require("uuid")
const path = require("path")
const fs = require("fs")

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads")
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname)
    cb(null, `${uuidv4()}${fileExt}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)

    if (extname && mimetype) {
      return cb(null, true)
    } else {
      cb(new Error("Invalid file type. Only images, PDFs, and documents are allowed."))
    }
  },
})

// Get all conversations for the current user
router.get("/conversations", auth, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      "participants.userId": req.user.id,
    })
      .populate("bookingId", "experienceTitle bookingDate status")
      .populate("lastMessage")
      .populate({
        path: "participants.userId",
        select: "name avatar role",
      })
      .sort({ updatedAt: -1 })

    // Format the conversations for the client
    const formattedConversations = conversations.map((conv) => {
      const booking = conv.bookingId
      const participants = conv.participants.map((p) => ({
        id: p.userId._id,
        name: p.userId.name,
        avatar: p.userId.avatar,
        role: p.role,
        isOnline: false, // This would come from a real-time service
        lastSeen: p.lastSeen,
      }))

      return {
        id: conv._id,
        bookingId: booking._id,
        participants,
        lastMessage: conv.lastMessage
          ? {
              id: conv.lastMessage._id,
              conversationId: conv._id,
              senderId: conv.lastMessage.senderId,
              senderName:
                participants.find((p) => p.id.toString() === conv.lastMessage.senderId.toString())?.name || "Unknown",
              senderRole:
                participants.find((p) => p.id.toString() === conv.lastMessage.senderId.toString())?.role || "unknown",
              message: conv.lastMessage.message,
              messageType: conv.lastMessage.messageType,
              timestamp: conv.lastMessage.createdAt,
              status: conv.lastMessage.status,
            }
          : null,
        unreadCount: conv.unreadCount || {},
        createdAt: conv.createdAt,
        updatedAt: conv.updatedAt,
        isActive: conv.isActive,
        bookingDetails: {
          experienceTitle: booking.experienceTitle,
          bookingDate: booking.bookingDate,
          status: booking.status,
        },
      }
    })

    res.json(formattedConversations)
  } catch (err) {
    console.error("Error fetching conversations:", err)
    res.status(500).json({ error: "Server error" })
  }
})

// Get messages for a specific conversation
router.get("/conversations/:id/messages", auth, async (req, res) => {
  try {
    const { id } = req.params
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 50
    const skip = (page - 1) * limit

    // Check if user is part of the conversation
    const conversation = await Conversation.findOne({
      _id: id,
      "participants.userId": req.user.id,
    })

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" })
    }

    // Get messages
    const messages = await Message.find({ conversationId: id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("senderId", "name avatar role")

    // Get total count for pagination
    const total = await Message.countDocuments({ conversationId: id })

    // Format messages for client
    const formattedMessages = messages.map((msg) => ({
      id: msg._id,
      conversationId: msg.conversationId,
      senderId: msg.senderId._id,
      senderName: msg.senderId.name,
      senderAvatar: msg.senderId.avatar,
      senderRole: msg.senderId.role,
      message: msg.message,
      messageType: msg.messageType,
      attachments: msg.attachments,
      timestamp: msg.createdAt,
      status: msg.status,
      translatedMessage: msg.translatedMessage,
      isEdited: msg.isEdited,
      editedAt: msg.editedAt,
      replyTo: msg.replyTo,
    }))

    // Mark messages as read
    await Message.updateMany(
      {
        conversationId: id,
        senderId: { $ne: req.user.id },
        status: { $ne: "read" },
      },
      { status: "read" },
    )

    // Reset unread count for this user
    const unreadCount = { ...conversation.unreadCount }
    unreadCount[req.user.id] = 0
    await Conversation.updateOne({ _id: id }, { $set: { unreadCount } })

    res.json({
      messages: formattedMessages.reverse(), // Reverse to get chronological order
      hasMore: skip + messages.length < total,
      total,
    })
  } catch (err) {
    console.error("Error fetching messages:", err)
    res.status(500).json({ error: "Server error" })
  }
})

// Upload file attachment
router.post("/upload", auth, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" })
    }

    const baseUrl = process.env.BASE_URL || "http://localhost:5000"
    const fileUrl = `${baseUrl}/uploads/${req.file.filename}`

    res.json({
      url: fileUrl,
      type: req.file.mimetype.startsWith("image/") ? "image" : "file",
      name: req.file.originalname,
      size: req.file.size,
    })
  } catch (err) {
    console.error("Error uploading file:", err)
    res.status(500).json({ error: "Server error" })
  }
})

// Translate message
router.post("/messages/:id/translate", auth, async (req, res) => {
  try {
    const { id } = req.params
    const { targetLanguage } = req.body

    if (!targetLanguage) {
      return res.status(400).json({ error: "Target language is required" })
    }

    const message = await Message.findById(id)
    if (!message) {
      return res.status(404).json({ error: "Message not found" })
    }

    // Check if translation already exists
    if (message.translatedMessage && message.translatedMessage.get(targetLanguage)) {
      return res.json({ translatedText: message.translatedMessage.get(targetLanguage) })
    }

    // In a real implementation, you would call a translation API here
    // For now, we'll simulate a translation
    const translatedText = `[Translated to ${targetLanguage}] ${message.message}`

    // Save the translation
    if (!message.translatedMessage) {
      message.translatedMessage = new Map()
    }
    message.translatedMessage.set(targetLanguage, translatedText)
    await message.save()

    res.json({ translatedText })
  } catch (err) {
    console.error("Error translating message:", err)
    res.status(500).json({ error: "Server error" })
  }
})

// Create a new conversation
router.post("/conversations", auth, async (req, res) => {
  try {
    const { bookingId, participantIds } = req.body

    if (!bookingId || !participantIds || !Array.isArray(participantIds)) {
      return res.status(400).json({ error: "Booking ID and participant IDs are required" })
    }

    // Check if booking exists
    const booking = await Booking.findById(bookingId)
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" })
    }

    // Check if conversation already exists for this booking
    const existingConversation = await Conversation.findOne({ bookingId })
    if (existingConversation) {
      return res.status(400).json({ error: "Conversation already exists for this booking" })
    }

    // Get participant roles
    const participants = []
    for (const userId of participantIds) {
      const user = await User.findById(userId)
      if (!user) {
        return res.status(404).json({ error: `User ${userId} not found` })
      }
      participants.push({
        userId,
        role: user.role,
        joinedAt: new Date(),
        lastSeen: new Date(),
      })
    }

    // Add current user if not already included
    if (!participants.some((p) => p.userId.toString() === req.user.id)) {
      const currentUser = await User.findById(req.user.id)
      participants.push({
        userId: req.user.id,
        role: currentUser.role,
        joinedAt: new Date(),
        lastSeen: new Date(),
      })
    }

    // Create conversation
    const conversation = new Conversation({
      bookingId,
      participants,
      isActive: true,
    })

    await conversation.save()

    res.status(201).json({ id: conversation._id })
  } catch (err) {
    console.error("Error creating conversation:", err)
    res.status(500).json({ error: "Server error" })
  }
})

// Send a message
router.post("/conversations/:id/messages", auth, async (req, res) => {
  try {
    const { id } = req.params
    const { message, messageType, attachments, replyTo } = req.body

    if (!message && (!attachments || attachments.length === 0)) {
      return res.status(400).json({ error: "Message or attachments are required" })
    }

    // Check if conversation exists and user is part of it
    const conversation = await Conversation.findOne({
      _id: id,
      "participants.userId": req.user.id,
    })

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" })
    }

    // Create message
    const newMessage = new Message({
      conversationId: id,
      senderId: req.user.id,
      message: message || "",
      messageType: messageType || "text",
      attachments,
      status: "sent",
      replyTo,
    })

    await newMessage.save()

    // Update conversation with last message and increment unread counts
    const unreadCount = { ...conversation.unreadCount }
    conversation.participants.forEach((p) => {
      if (p.userId.toString() !== req.user.id) {
        unreadCount[p.userId] = (unreadCount[p.userId] || 0) + 1
      }
    })

    await Conversation.updateOne(
      { _id: id },
      {
        $set: {
          lastMessage: newMessage._id,
          unreadCount,
          updatedAt: new Date(),
        },
      },
    )

    // Get sender info for response
    const sender = await User.findById(req.user.id, "name avatar role")

    res.status(201).json({
      id: newMessage._id,
      conversationId: id,
      senderId: req.user.id,
      senderName: sender.name,
      senderAvatar: sender.avatar,
      senderRole: sender.role,
      message: newMessage.message,
      messageType: newMessage.messageType,
      attachments: newMessage.attachments,
      timestamp: newMessage.createdAt,
      status: newMessage.status,
      replyTo: newMessage.replyTo,
    })
  } catch (err) {
    console.error("Error sending message:", err)
    res.status(500).json({ error: "Server error" })
  }
})

module.exports = router
