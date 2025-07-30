"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, X, Minimize2, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { chatService, type ChatMessage, type Conversation } from "@/lib/chat-service"
import ChatNotification from "./chat-notification"
import { format } from "date-fns"

interface ChatWidgetProps {
  currentUserId: string
  currentUserRole: "tourist" | "host"
  bookingId?: string
}

export default function ChatWidget({ currentUserId, currentUserRole, bookingId }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState<ChatMessage[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    // Set up chat service event handlers
    chatService.onNewMessage = (message: ChatMessage) => {
      // Update messages if conversation is selected
      if (selectedConversation && message.conversationId === selectedConversation.id) {
        setMessages((prev) => [...prev, message])
        // Mark as read
        chatService.markMessageAsRead(message.id)
      } else {
        // Update unread count
        if (message.senderId !== currentUserId) {
          setUnreadCount((prev) => prev + 1)

          // Show notification if widget is closed or minimized
          if (!isOpen || isMinimized) {
            setNotifications((prev) => [...prev, message])
          }
        }
      }
    }

    return () => {
      chatService.onNewMessage = undefined
    }
  }, [currentUserId, isOpen, isMinimized, selectedConversation])

  useEffect(() => {
    // Load conversations when widget is opened
    if (isOpen && !isMinimized) {
      loadConversations()
    }
  }, [isOpen, isMinimized])

  const loadConversations = async () => {
    try {
      // Mock conversations data
      const mockConversations: Conversation[] = [
        {
          id: "conv_1",
          bookingId: "booking_1",
          participants: [
            {
              id: currentUserId,
              name: currentUserRole === "tourist" ? "Michael Chen" : "Dawit Tadesse",
              role: currentUserRole,
              isOnline: true,
              lastSeen: new Date(),
            },
            {
              id: currentUserRole === "tourist" ? "host_1" : "tourist_1",
              name: currentUserRole === "tourist" ? "Dawit Tadesse" : "Sarah Wilson",
              avatar:
                currentUserRole === "tourist"
                  ? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                  : "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
              role: currentUserRole === "tourist" ? "host" : "tourist",
              isOnline: true,
              lastSeen: new Date(),
            },
          ],
          lastMessage: {
            id: "msg_last_1",
            conversationId: "conv_1",
            senderId: currentUserRole === "tourist" ? "host_1" : "tourist_1",
            senderName: currentUserRole === "tourist" ? "Dawit Tadesse" : "Sarah Wilson",
            senderRole: currentUserRole === "tourist" ? "host" : "tourist",
            message: "Looking forward to hosting your coffee ceremony experience!",
            messageType: "text",
            timestamp: new Date(Date.now() - 300000),
            status: "read",
          },
          unreadCount: { [currentUserId]: 0 },
          createdAt: new Date(Date.now() - 86400000),
          updatedAt: new Date(Date.now() - 300000),
          isActive: true,
          bookingDetails: {
            experienceTitle: "Traditional Coffee Ceremony",
            bookingDate: new Date("2024-02-15"),
            status: "confirmed",
          },
        },
        {
          id: "conv_2",
          bookingId: "booking_2",
          participants: [
            {
              id: currentUserId,
              name: currentUserRole === "tourist" ? "Michael Chen" : "Dawit Tadesse",
              role: currentUserRole,
              isOnline: true,
              lastSeen: new Date(),
            },
            {
              id: currentUserRole === "tourist" ? "host_2" : "tourist_2",
              name: currentUserRole === "tourist" ? "Meron Alemu" : "James Wilson",
              avatar:
                currentUserRole === "tourist"
                  ? "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
                  : "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
              role: currentUserRole === "tourist" ? "host" : "tourist",
              isOnline: false,
              lastSeen: new Date(Date.now() - 1800000),
            },
          ],
          lastMessage: {
            id: "msg_last_2",
            conversationId: "conv_2",
            senderId: currentUserId,
            senderName: currentUserRole === "tourist" ? "Michael Chen" : "Dawit Tadesse",
            senderRole: currentUserRole,
            message: "Thank you for the information about the injera workshop!",
            messageType: "text",
            timestamp: new Date(Date.now() - 1800000),
            status: "delivered",
          },
          unreadCount: { [currentUserId]: 2 },
          createdAt: new Date(Date.now() - 172800000),
          updatedAt: new Date(Date.now() - 1800000),
          isActive: true,
          bookingDetails: {
            experienceTitle: "Injera Making Workshop",
            bookingDate: new Date("2024-02-20"),
            status: "pending",
          },
        },
      ]

      setConversations(mockConversations)
    } catch (error) {
      console.error("Failed to load conversations:", error)
    }
  }

  const loadMessages = async (conversationId: string) => {
    try {
      // Mock messages data
      const mockMessages: ChatMessage[] = [
        {
          id: "msg_1",
          conversationId: conversationId,
          senderId: currentUserRole === "tourist" ? "host_1" : "tourist_1",
          senderName: currentUserRole === "tourist" ? "Dawit Tadesse" : "Sarah Wilson",
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
          conversationId: conversationId,
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
    } catch (error) {
      console.error("Failed to load messages:", error)
    }
  }

  const handleOpenChat = () => {
    setIsOpen(true)
    setIsMinimized(false)
    setUnreadCount(0)
  }

  const handleCloseChat = () => {
    setIsOpen(false)
    setSelectedConversation(null)
    setMessages([])
  }

  const handleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  const handleNotificationClose = (messageId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== messageId))
  }

  const handleNotificationReply = (message: ChatMessage) => {
    // Find and select the conversation
    const conversation = conversations.find((c) => c.id === message.conversationId)
    if (conversation) {
      handleSelectConversation(conversation)
    }
    setNotifications((prev) => prev.filter((n) => n.id !== message.id))
  }

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation)
    loadMessages(conversation.id)
    // Join the conversation
    chatService.joinConversation(conversation.id)
    // Reset unread count for this conversation
    if (conversation.unreadCount[currentUserId] > 0) {
      setUnreadCount((prev) => Math.max(0, prev - conversation.unreadCount[currentUserId]))
    }
  }

  const handleBackToList = () => {
    setSelectedConversation(null)
    setMessages([])
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return

    try {
      setIsSending(true)

      // Create optimistic message
      const optimisticMessage: ChatMessage = {
        id: `temp_${Date.now()}`,
        conversationId: selectedConversation.id,
        senderId: currentUserId,
        senderName: selectedConversation.participants.find((p) => p.id === currentUserId)?.name || "You",
        senderRole: currentUserRole,
        message: newMessage,
        messageType: "text",
        timestamp: new Date(),
        status: "sending",
      }

      setMessages((prev) => [...prev, optimisticMessage])
      setNewMessage("")

      // Send via WebSocket
      chatService.sendMessage(selectedConversation.id, newMessage)
    } catch (error) {
      console.error("Failed to send message:", error)
    } finally {
      setIsSending(false)
    }
  }

  const getOtherParticipant = (conversation: Conversation) => {
    return conversation.participants.find((p) => p.id !== currentUserId)
  }

  return (
    <>
      {/* Chat Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((message) => (
          <ChatNotification
            key={message.id}
            message={message}
            onClose={() => handleNotificationClose(message.id)}
            onReply={() => handleNotificationReply(message)}
          />
        ))}
      </div>

      {/* Chat Widget Button */}
      {!isOpen && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="fixed bottom-4 right-4 z-40"
        >
          <Button
            onClick={handleOpenChat}
            className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg relative"
          >
            <MessageSquare className="h-6 w-6 text-white" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-red-600 text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </Badge>
            )}
          </Button>
        </motion.div>
      )}

      {/* Chat Widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-4 right-4 z-40"
          >
            <div
              className={`bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 ${
                isMinimized ? "w-80 h-16" : "w-96 h-[500px]"
              }`}
            >
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    {selectedConversation ? getOtherParticipant(selectedConversation)?.name : "Messages"}
                  </h3>
                  {unreadCount > 0 && !selectedConversation && (
                    <Badge className="bg-red-600 text-white">{unreadCount}</Badge>
                  )}
                </div>
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleMinimize}>
                    {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleCloseChat}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Chat Content */}
              {!isMinimized && (
                <div className="flex flex-col h-[calc(500px-64px)]">
                  {selectedConversation ? (
                    <>
                      {/* Messages */}
                      <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                          {messages.map((message) => {
                            const isOwnMessage = message.senderId === currentUserId
                            return (
                              <div
                                key={message.id}
                                className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                              >
                                {!isOwnMessage && (
                                  <Avatar className="h-8 w-8 mr-2">
                                    <AvatarImage
                                      src={
                                        getOtherParticipant(selectedConversation)?.avatar ||
                                        "/placeholder.svg" ||
                                        "/placeholder.svg"
                                      }
                                      alt={getOtherParticipant(selectedConversation)?.name}
                                    />
                                    <AvatarFallback>
                                      {getOtherParticipant(selectedConversation)
                                        ?.name.split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                )}
                                <div
                                  className={`max-w-[70%] px-3 py-2 rounded-lg ${
                                    isOwnMessage
                                      ? "bg-blue-600 text-white"
                                      : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                  }`}
                                >
                                  <p className="text-sm">{message.message}</p>
                                  <p className="text-xs mt-1 opacity-70">{format(message.timestamp, "HH:mm")}</p>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </ScrollArea>

                      {/* Message Input */}
                      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex space-x-2">
                          <Input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1"
                            onKeyPress={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault()
                                handleSendMessage()
                              }
                            }}
                          />
                          <Button
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim() || isSending}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Send
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Conversation List */}
                      <ScrollArea className="flex-1">
                        <div className="p-2 space-y-1">
                          {conversations.map((conversation) => {
                            const otherParticipant = getOtherParticipant(conversation)
                            return (
                              <Button
                                key={conversation.id}
                                variant="ghost"
                                className="w-full justify-start p-3 h-auto"
                                onClick={() => handleSelectConversation(conversation)}
                              >
                                <div className="flex items-center space-x-3 w-full">
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage
                                      src={otherParticipant?.avatar || "/placeholder.svg"}
                                      alt={otherParticipant?.name}
                                    />
                                    <AvatarFallback>
                                      {otherParticipant?.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 min-w-0 text-left">
                                    <div className="flex items-center justify-between">
                                      <p className="font-medium text-sm truncate">{otherParticipant?.name}</p>
                                      {conversation.unreadCount[currentUserId] > 0 && (
                                        <Badge className="bg-red-600 text-white ml-2">
                                          {conversation.unreadCount[currentUserId]}
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-xs text-gray-500 truncate">
                                      {conversation.bookingDetails.experienceTitle}
                                    </p>
                                    {conversation.lastMessage && (
                                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                        {conversation.lastMessage.senderId === currentUserId ? "You: " : ""}
                                        {conversation.lastMessage.message}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </Button>
                            )
                          })}

                          {conversations.length === 0 && (
                            <div className="text-center py-8">
                              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                              <p className="text-gray-500">No messages yet</p>
                              <p className="text-sm text-gray-400 mt-1">
                                Your conversations with hosts and tourists will appear here
                              </p>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
