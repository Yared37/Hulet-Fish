const WebSocket = require("ws")
const jwt = require("jsonwebtoken")
const Message = require("../models/Message")
const Conversation = require("../models/Conversation")
const User = require("../models/User")

// Store active connections
const clients = new Map()
const conversationSubscriptions = new Map()

function setupWebSocketServer(server) {
  const wss = new WebSocket.Server({
    server,
    path: "/chat",
  })

  wss.on("connection", async (ws, req) => {
    try {
      // Extract token from URL
      const url = new URL(req.url, "http://localhost")
      const token = url.searchParams.get("token")

      if (!token) {
        ws.close(4001, "Authentication required")
        return
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const userId = decoded.user.id

      // Get user
      const user = await User.findById(userId)
      if (!user) {
        ws.close(4004, "User not found")
        return
      }

      // Store connection
      clients.set(userId, ws)

      console.log(`User ${userId} connected`)

      // Update user's online status
      await User.findByIdAndUpdate(userId, { isOnline: true, lastSeen: new Date() })

      // Handle messages
      ws.on("message", async (data) => {
        try {
          const message = JSON.parse(data)

          switch (message.type) {
            case "join_conversation":
              handleJoinConversation(userId, message.conversationId)
              break

            case "leave_conversation":
              handleLeaveConversation(userId, message.conversationId)
              break

            case "send_message":
              await handleSendMessage(userId, message)
              break

            case "typing_indicator":
              handleTypingIndicator(userId, message)
              break

            case "mark_as_read":
              await handleMarkAsRead(userId, message.messageId)
              break

            default:
              console.warn(`Unknown message type: ${message.type}`)
          }
        } catch (err) {
          console.error("Error handling WebSocket message:", err)
        }
      })

      // Handle disconnection
      ws.on("close", async () => {
        clients.delete(userId)

        // Remove user from all conversation subscriptions
        for (const [conversationId, subscribers] of conversationSubscriptions.entries()) {
          if (subscribers.has(userId)) {
            subscribers.delete(userId)
            if (subscribers.size === 0) {
              conversationSubscriptions.delete(conversationId)
            }
          }
        }

        // Update user's online status
        await User.findByIdAndUpdate(userId, { isOnline: false, lastSeen: new Date() })

        console.log(`User ${userId} disconnected`)
      })
    } catch (err) {
      console.error("WebSocket connection error:", err)
      ws.close(4000, "Connection error")
    }
  })

  return wss
}

// Handle joining a conversation
function handleJoinConversation(userId, conversationId) {
  if (!conversationSubscriptions.has(conversationId)) {
    conversationSubscriptions.set(conversationId, new Set())
  }
  conversationSubscriptions.get(conversationId).add(userId)

  console.log(`User ${userId} joined conversation ${conversationId}`)
}

// Handle leaving a conversation
function handleLeaveConversation(userId, conversationId) {
  if (conversationSubscriptions.has(conversationId)) {
    conversationSubscriptions.get(conversationId).delete(userId)
    if (conversationSubscriptions.get(conversationId).size === 0) {
      conversationSubscriptions.delete(conversationId)
    }
  }

  console.log(`User ${userId} left conversation ${conversationId}`)
}

// Handle sending a message
async function handleSendMessage(userId, messageData) {
  try {
    const { conversationId, message, attachments } = messageData

    // Check if conversation exists and user is part of it
    const conversation = await Conversation.findOne({
      _id: conversationId,
      "participants.userId": userId,
    })

    if (!conversation) {
      console.error(`Conversation ${conversationId} not found or user ${userId} not part of it`)
      return
    }

    // Create message
    const newMessage = new Message({
      conversationId,
      senderId: userId,
      message: message || "",
      messageType: attachments && attachments.length > 0 ? "image" : "text",
      attachments,
      status: "sent",
    })

    await newMessage.save()

    // Update conversation with last message and increment unread counts
    const unreadCount = { ...conversation.unreadCount }
    conversation.participants.forEach((p) => {
      if (p.userId.toString() !== userId) {
        unreadCount[p.userId] = (unreadCount[p.userId] || 0) + 1
      }
    })

    await Conversation.updateOne(
      { _id: conversationId },
      {
        $set: {
          lastMessage: newMessage._id,
          unreadCount,
          updatedAt: new Date(),
        },
      },
    )

    // Get sender info
    const sender = await User.findById(userId, "name avatar role")

    // Prepare message for broadcast
    const messageToSend = {
      type: "new_message",
      message: {
        id: newMessage._id,
        conversationId,
        senderId: userId,
        senderName: sender.name,
        senderAvatar: sender.avatar,
        senderRole: sender.role,
        message: newMessage.message,
        messageType: newMessage.messageType,
        attachments: newMessage.attachments,
        timestamp: newMessage.createdAt,
        status: newMessage.status,
      },
    }

    // Broadcast to all users in the conversation
    broadcastToConversation(conversationId, messageToSend)

    // Update message status to delivered for all online users
    setTimeout(() => updateMessageStatus(newMessage._id, "delivered"), 1000)
  } catch (err) {
    console.error("Error sending message:", err)
  }
}

// Handle typing indicator
function handleTypingIndicator(userId, messageData) {
  const { conversationId, isTyping } = messageData

  // Get user info
  User.findById(userId, "name")
    .then((user) => {
      if (!user) return

      // Broadcast typing indicator
      const typingMessage = {
        type: "typing_indicator",
        typing: {
          conversationId,
          userId,
          userName: user.name,
          isTyping,
        },
      }

      broadcastToConversation(conversationId, typingMessage, [userId])
    })
    .catch((err) => console.error("Error getting user for typing indicator:", err))
}

// Handle marking a message as read
async function handleMarkAsRead(userId, messageId) {
  try {
    const message = await Message.findById(messageId)
    if (!message) return

    // Update message status
    await Message.updateOne({ _id: messageId }, { status: "read" })

    // Notify sender
    const statusUpdate = {
      type: "message_status_update",
      messageId,
      status: "read",
    }

    sendToUser(message.senderId.toString(), statusUpdate)
  } catch (err) {
    console.error("Error marking message as read:", err)
  }
}

// Update message status
async function updateMessageStatus(messageId, status) {
  try {
    const message = await Message.findById(messageId)
    if (!message) return

    // Update status
    await Message.updateOne({ _id: messageId }, { status })

    // Notify sender
    const statusUpdate = {
      type: "message_status_update",
      messageId,
      status,
    }

    sendToUser(message.senderId.toString(), statusUpdate)
  } catch (err) {
    console.error("Error updating message status:", err)
  }
}

// Broadcast message to all users in a conversation
function broadcastToConversation(conversationId, message, excludeUserIds = []) {
  if (!conversationSubscriptions.has(conversationId)) return

  const subscribers = conversationSubscriptions.get(conversationId)
  for (const userId of subscribers) {
    if (!excludeUserIds.includes(userId)) {
      sendToUser(userId, message)
    }
  }
}

// Send message to specific user
function sendToUser(userId, message) {
  const ws = clients.get(userId)
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message))
  }
}

module.exports = { setupWebSocketServer }
