export interface ChatMessage {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  senderAvatar?: string
  senderRole: "tourist" | "host" | "admin"
  message: string
  messageType: "text" | "image" | "file" | "location" | "booking_update" | "system"
  attachments?: {
    url: string
    type: "image" | "file"
    name: string
    size: number
  }[]
  timestamp: Date
  status: "sending" | "sent" | "delivered" | "read"
  translatedMessage?: {
    [language: string]: string
  }
  isEdited?: boolean
  editedAt?: Date
  replyTo?: string
}

export interface Conversation {
  id: string
  bookingId: string
  participants: {
    id: string
    name: string
    avatar?: string
    role: "tourist" | "host"
    isOnline: boolean
    lastSeen: Date
  }[]
  lastMessage?: ChatMessage
  unreadCount: {
    [userId: string]: number
  }
  createdAt: Date
  updatedAt: Date
  isActive: boolean
  bookingDetails: {
    experienceTitle: string
    bookingDate: Date
    status: string
  }
}

export interface TypingIndicator {
  conversationId: string
  userId: string
  userName: string
  isTyping: boolean
}

class ChatService {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000

  constructor() {
    this.connect()
  }

  private connect() {
    try {
      const token = localStorage.getItem("authToken")
      const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080"}/chat?token=${token}`

      this.ws = new WebSocket(wsUrl)

      this.ws.onopen = () => {
        console.log("Chat WebSocket connected")
        this.reconnectAttempts = 0
      }

      this.ws.onclose = () => {
        console.log("Chat WebSocket disconnected")
        this.handleReconnect()
      }

      this.ws.onerror = (error) => {
        console.error("Chat WebSocket error:", error)
      }

      this.ws.onmessage = (event) => {
        this.handleMessage(JSON.parse(event.data))
      }
    } catch (error) {
      console.error("Failed to connect to chat service:", error)
      this.handleReconnect()
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      setTimeout(() => {
        console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
        this.connect()
      }, this.reconnectDelay * this.reconnectAttempts)
    }
  }

  private handleMessage(data: any) {
    switch (data.type) {
      case "new_message":
        this.onNewMessage?.(data.message)
        break
      case "message_status_update":
        this.onMessageStatusUpdate?.(data.messageId, data.status)
        break
      case "typing_indicator":
        this.onTypingIndicator?.(data.typing)
        break
      case "user_online_status":
        this.onUserOnlineStatus?.(data.userId, data.isOnline)
        break
    }
  }

  // Event handlers
  onNewMessage?: (message: ChatMessage) => void
  onMessageStatusUpdate?: (messageId: string, status: string) => void
  onTypingIndicator?: (typing: TypingIndicator) => void
  onUserOnlineStatus?: (userId: string, isOnline: boolean) => void

  sendMessage(conversationId: string, message: string, attachments?: File[]) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error("Chat service not connected")
    }

    const messageData = {
      type: "send_message",
      conversationId,
      message,
      attachments: attachments?.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type.startsWith("image/") ? "image" : "file",
      })),
    }

    this.ws.send(JSON.stringify(messageData))
  }

  sendTypingIndicator(conversationId: string, isTyping: boolean) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return

    this.ws.send(
      JSON.stringify({
        type: "typing_indicator",
        conversationId,
        isTyping,
      }),
    )
  }

  markMessageAsRead(messageId: string) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return

    this.ws.send(
      JSON.stringify({
        type: "mark_as_read",
        messageId,
      }),
    )
  }

  joinConversation(conversationId: string) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return

    this.ws.send(
      JSON.stringify({
        type: "join_conversation",
        conversationId,
      }),
    )
  }

  leaveConversation(conversationId: string) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return

    this.ws.send(
      JSON.stringify({
        type: "leave_conversation",
        conversationId,
      }),
    )
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }
}

export const chatService = new ChatService()

// API functions for REST endpoints
export async function getConversations(): Promise<Conversation[]> {
  const response = await fetch("/api/chat/conversations", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch conversations")
  }

  return response.json()
}

export async function getMessages(
  conversationId: string,
  page = 1,
  limit = 50,
): Promise<{
  messages: ChatMessage[]
  hasMore: boolean
  total: number
}> {
  const response = await fetch(`/api/chat/conversations/${conversationId}/messages?page=${page}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch messages")
  }

  return response.json()
}

export async function translateMessage(messageId: string, targetLanguage: string): Promise<string> {
  const response = await fetch(`/api/chat/messages/${messageId}/translate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
    body: JSON.stringify({ targetLanguage }),
  })

  if (!response.ok) {
    throw new Error("Failed to translate message")
  }

  const data = await response.json()
  return data.translatedText
}

export async function uploadChatAttachment(file: File): Promise<{
  url: string
  type: string
  name: string
  size: number
}> {
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch("/api/chat/upload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
    body: formData,
  })

  if (!response.ok) {
    throw new Error("Failed to upload attachment")
  }

  return response.json()
}
