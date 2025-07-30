"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Send,
  Paperclip,
  ImageIcon,
  MapPin,
  Phone,
  Video,
  MoreVertical,
  ImportIcon as Translate,
  Download,
  Calendar,
  CheckCircle2,
  Check,
  Loader2,
} from "lucide-react"
import { format, formatDistanceToNow } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"
import { chatService, type ChatMessage, type Conversation, type TypingIndicator } from "@/lib/chat-service"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface ChatInterfaceProps {
  bookingId: string
  currentUserId: string
  currentUserRole: "tourist" | "host"
}

export default function ChatInterface({ bookingId, currentUserId, currentUserRole }: ChatInterfaceProps) {
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [typingUsers, setTypingUsers] = useState<TypingIndicator[]>([])
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [showTranslation, setShowTranslation] = useState<{ [messageId: string]: boolean }>({})
  const [translatedMessages, setTranslatedMessages] = useState<{ [messageId: string]: string }>({})
  const [isTranslating, setIsTranslating] = useState<{ [messageId: string]: boolean }>({})

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()
  const { toast } = useToast()

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  // Load conversation and messages
  useEffect(() => {
    loadConversation()
  }, [bookingId])

  // Set up chat service event handlers
  useEffect(() => {
    chatService.onNewMessage = (message: ChatMessage) => {
      setMessages((prev) => [...prev, message])
      scrollToBottom()

      // Mark as read if not from current user
      if (message.senderId !== currentUserId) {
        chatService.markMessageAsRead(message.id)
      }
    }

    chatService.onMessageStatusUpdate = (messageId: string, status: string) => {
      setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, status: status as any } : msg)))
    }

    chatService.onTypingIndicator = (typing: TypingIndicator) => {
      if (typing.userId !== currentUserId) {
        setTypingUsers((prev) => {
          const filtered = prev.filter((t) => t.userId !== typing.userId)
          return typing.isTyping ? [...filtered, typing] : filtered
        })
      }
    }

    return () => {
      chatService.onNewMessage = undefined
      chatService.onMessageStatusUpdate = undefined
      chatService.onTypingIndicator = undefined
    }
  }, [currentUserId, scrollToBottom])

  const loadConversation = async () => {
    try {
      setIsLoading(true)

      // In a real implementation, you'd fetch the conversation by bookingId
      // For now, we'll simulate the data
      const mockConversation: Conversation = {
        id: `conv_${bookingId}`,
        bookingId,
        participants: [
          {
            id: currentUserRole === "tourist" ? currentUserId : "host_123",
            name: currentUserRole === "tourist" ? "Michael Chen" : "Dawit Tadesse",
            avatar:
              currentUserRole === "tourist"
                ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
                : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
            role: currentUserRole,
            isOnline: true,
            lastSeen: new Date(),
          },
          {
            id: currentUserRole === "host" ? currentUserId : "tourist_456",
            name: currentUserRole === "host" ? "Dawit Tadesse" : "Michael Chen",
            avatar:
              currentUserRole === "host"
                ? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
            role: currentUserRole === "host" ? "tourist" : "host",
            isOnline: false,
            lastSeen: new Date(Date.now() - 300000), // 5 minutes ago
          },
        ],
        unreadCount: {},
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        bookingDetails: {
          experienceTitle: "Traditional Coffee Ceremony",
          bookingDate: new Date("2024-02-15"),
          status: "confirmed",
        },
      }

      setConversation(mockConversation)

      // Load initial messages
      const mockMessages: ChatMessage[] = [
        {
          id: "msg_1",
          conversationId: mockConversation.id,
          senderId: currentUserRole === "tourist" ? "host_123" : "tourist_456",
          senderName: currentUserRole === "tourist" ? "Dawit Tadesse" : "Michael Chen",
          senderRole: currentUserRole === "tourist" ? "host" : "tourist",
          message:
            currentUserRole === "tourist"
              ? "Welcome! I'm excited to host your coffee ceremony experience. Do you have any dietary restrictions I should know about?"
              : "Hi! I'm looking forward to the coffee ceremony. What time should I arrive?",
          messageType: "text",
          timestamp: new Date(Date.now() - 3600000),
          status: "read",
        },
        {
          id: "msg_2",
          conversationId: mockConversation.id,
          senderId: currentUserId,
          senderName: currentUserRole === "tourist" ? "Michael Chen" : "Dawit Tadesse",
          senderRole: currentUserRole,
          message:
            currentUserRole === "tourist"
              ? "Thank you for the warm welcome! I don't have any dietary restrictions. I'm really excited to learn about Ethiopian coffee culture!"
              : "Please arrive at 2:00 PM. I'll have everything prepared for an authentic experience. Looking forward to meeting you!",
          messageType: "text",
          timestamp: new Date(Date.now() - 3000000),
          status: "read",
        },
      ]

      setMessages(mockMessages)

      // Join the conversation
      chatService.joinConversation(mockConversation.id)
    } catch (error) {
      console.error("Failed to load conversation:", error)
      toast({
        title: "Error",
        description: "Failed to load conversation. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() && selectedFiles.length === 0) return
    if (!conversation) return

    try {
      setIsSending(true)

      // Create optimistic message
      const optimisticMessage: ChatMessage = {
        id: `temp_${Date.now()}`,
        conversationId: conversation.id,
        senderId: currentUserId,
        senderName: conversation.participants.find((p) => p.id === currentUserId)?.name || "You",
        senderRole: currentUserRole,
        message: newMessage,
        messageType: selectedFiles.length > 0 ? "image" : "text",
        timestamp: new Date(),
        status: "sending",
        attachments: selectedFiles.map((file) => ({
          url: URL.createObjectURL(file),
          type: file.type.startsWith("image/") ? "image" : "file",
          name: file.name,
          size: file.size,
        })),
      }

      setMessages((prev) => [...prev, optimisticMessage])
      setNewMessage("")
      setSelectedFiles([])
      scrollToBottom()

      // Send via WebSocket
      chatService.sendMessage(conversation.id, newMessage, selectedFiles)
    } catch (error) {
      console.error("Failed to send message:", error)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  const handleTyping = () => {
    if (!conversation) return

    chatService.sendTypingIndicator(conversation.id, true)

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      chatService.sendTypingIndicator(conversation.id, false)
    }, 1000)
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const validFiles = files.filter((file) => {
      const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB
      const isValidType = file.type.startsWith("image/") || file.type.startsWith("application/")

      if (!isValidSize) {
        toast({
          title: "File too large",
          description: `${file.name} is larger than 10MB`,
          variant: "destructive",
        })
      }

      return isValidSize && isValidType
    })

    setSelectedFiles((prev) => [...prev, ...validFiles])
  }

  const handleTranslate = async (messageId: string, targetLanguage = "en") => {
    try {
      setIsTranslating((prev) => ({ ...prev, [messageId]: true }))

      // Simulate translation API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const message = messages.find((m) => m.id === messageId)
      if (message) {
        // Mock translation
        const translations: { [key: string]: string } = {
          Hello: "ሰላም (Selam)",
          "Thank you": "አመሰግናለሁ (Ameseginalew)",
          Welcome: "እንኳን ደህና መጣህ (Enkuan dehna metah)",
        }

        const translated = translations[message.message] || `[Translated] ${message.message}`
        setTranslatedMessages((prev) => ({ ...prev, [messageId]: translated }))
        setShowTranslation((prev) => ({ ...prev, [messageId]: true }))
      }
    } catch (error) {
      console.error("Translation failed:", error)
      toast({
        title: "Translation failed",
        description: "Could not translate message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsTranslating((prev) => ({ ...prev, [messageId]: false }))
    }
  }

  const getMessageStatusIcon = (status: string) => {
    switch (status) {
      case "sending":
        return <Loader2 className="w-3 h-3 animate-spin text-gray-400" />
      case "sent":
        return <Check className="w-3 h-3 text-gray-400" />
      case "delivered":
        return <CheckCircle2 className="w-3 h-3 text-gray-400" />
      case "read":
        return <CheckCircle2 className="w-3 h-3 text-blue-500" />
      default:
        return null
    }
  }

  const otherParticipant = conversation?.participants.find((p) => p.id !== currentUserId)

  if (isLoading) {
    return (
      <Card className="h-[600px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </Card>
    )
  }

  if (!conversation) {
    return (
      <Card className="h-[600px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">No conversation found</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="h-[600px] flex flex-col">
      {/* Chat Header */}
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar>
                <AvatarImage src={otherParticipant?.avatar || "/placeholder.svg"} alt={otherParticipant?.name} />
                <AvatarFallback>
                  {otherParticipant?.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              {otherParticipant?.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
              )}
            </div>
            <div>
              <CardTitle className="text-lg">{otherParticipant?.name}</CardTitle>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Badge variant="outline" className="text-xs">
                  {otherParticipant?.role === "host" ? "Host Family" : "Tourist"}
                </Badge>
                <span>•</span>
                <span>
                  {otherParticipant?.isOnline
                    ? "Online"
                    : `Last seen ${formatDistanceToNow(otherParticipant?.lastSeen || new Date())} ago`}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Video className="w-4 h-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Calendar className="w-4 h-4 mr-2" />
                  View Booking Details
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <MapPin className="w-4 h-4 mr-2" />
                  Share Location
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="w-4 h-4 mr-2" />
                  Export Chat
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Booking Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mt-3">
          <div className="flex items-center justify-between text-sm">
            <div>
              <p className="font-medium text-blue-900 dark:text-blue-100">
                {conversation.bookingDetails.experienceTitle}
              </p>
              <p className="text-blue-700 dark:text-blue-300">
                {format(conversation.bookingDetails.bookingDate, "EEEE, MMMM d, yyyy")}
              </p>
            </div>
            <Badge
              className={
                conversation.bookingDetails.status === "confirmed"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
              }
            >
              {conversation.bookingDetails.status}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <Separator />

      {/* Messages Area */}
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full p-4">
          <div className="space-y-4">
            {messages.map((message) => {
              const isOwnMessage = message.senderId === currentUserId

              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[70%] ${isOwnMessage ? "order-2" : "order-1"}`}>
                    <div
                      className={`rounded-lg px-4 py-2 ${
                        isOwnMessage
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      }`}
                    >
                      {/* Message Content */}
                      <div className="space-y-2">
                        {message.message && (
                          <p className="text-sm leading-relaxed">
                            {showTranslation[message.id] && translatedMessages[message.id]
                              ? translatedMessages[message.id]
                              : message.message}
                          </p>
                        )}

                        {/* Attachments */}
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="space-y-2">
                            {message.attachments.map((attachment, index) => (
                              <div key={index}>
                                {attachment.type === "image" ? (
                                  <div className="relative rounded-lg overflow-hidden">
                                    <Image
                                      src={attachment.url || "/placeholder.svg"}
                                      alt={attachment.name}
                                      width={200}
                                      height={150}
                                      className="object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="flex items-center space-x-2 p-2 bg-white/10 rounded">
                                    <Paperclip className="w-4 h-4" />
                                    <span className="text-xs">{attachment.name}</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Message Actions */}
                      {!isOwnMessage && (
                        <div className="flex items-center justify-end mt-2 space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs opacity-70 hover:opacity-100"
                            onClick={() => handleTranslate(message.id)}
                            disabled={isTranslating[message.id]}
                          >
                            {isTranslating[message.id] ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Translate className="w-3 h-3" />
                            )}
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Message Info */}
                    <div
                      className={`flex items-center mt-1 space-x-2 text-xs text-gray-500 ${
                        isOwnMessage ? "justify-end" : "justify-start"
                      }`}
                    >
                      <span>{format(message.timestamp, "HH:mm")}</span>
                      {isOwnMessage && getMessageStatusIcon(message.status)}
                    </div>
                  </div>
                </motion.div>
              )
            })}

            {/* Typing Indicators */}
            <AnimatePresence>
              {typingUsers.map((typing) => (
                <motion.div
                  key={typing.userId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        />
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{typing.userName} is typing...</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>
      </CardContent>

      <Separator />

      {/* Message Input */}
      <div className="p-4">
        {/* Selected Files Preview */}
        {selectedFiles.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2"
              >
                <ImageIcon className="w-4 h-4" />
                <span className="text-sm truncate max-w-[100px]">{file.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0"
                  onClick={() => setSelectedFiles((prev) => prev.filter((_, i) => i !== index))}
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value)
                  handleTyping()
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                placeholder="Type your message..."
                className="flex-1"
                disabled={isSending}
              />

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx"
                onChange={handleFileSelect}
                className="hidden"
              />

              <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isSending}>
                <Paperclip className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Button
            onClick={handleSendMessage}
            disabled={(!newMessage.trim() && selectedFiles.length === 0) || isSending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </Card>
  )
}
