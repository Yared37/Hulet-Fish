"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, MessageSquare, Calendar } from "lucide-react"
import { format, formatDistanceToNow } from "date-fns"
import { motion } from "framer-motion"
import type { Conversation } from "@/lib/chat-service"

interface ConversationListProps {
  currentUserId: string
  currentUserRole: "tourist" | "host"
  onSelectConversation: (conversation: Conversation) => void
  selectedConversationId?: string
}

export default function ConversationList({
  currentUserId,
  currentUserRole,
  onSelectConversation,
  selectedConversationId,
}: ConversationListProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadConversations()
  }, [])

  const loadConversations = async () => {
    try {
      setIsLoading(true)

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
          unreadCount: { [currentUserId]: 0 },
          createdAt: new Date(Date.now() - 172800000),
          updatedAt: new Date(Date.now() - 1800000),
          isActive: true,
          bookingDetails: {
            experienceTitle: "Injera Making Workshop",
            bookingDate: new Date("2024-02-20"),
            status: "pending",
          },
        },
        {
          id: "conv_3",
          bookingId: "booking_3",
          participants: [
            {
              id: currentUserId,
              name: currentUserRole === "tourist" ? "Michael Chen" : "Dawit Tadesse",
              role: currentUserRole,
              isOnline: true,
              lastSeen: new Date(),
            },
            {
              id: currentUserRole === "tourist" ? "host_3" : "tourist_3",
              name: currentUserRole === "tourist" ? "Alemayehu Bekele" : "Emma Thompson",
              avatar:
                currentUserRole === "tourist"
                  ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
                  : "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
              role: currentUserRole === "tourist" ? "host" : "tourist",
              isOnline: false,
              lastSeen: new Date(Date.now() - 3600000),
            },
          ],
          lastMessage: {
            id: "msg_last_3",
            conversationId: "conv_3",
            senderId: currentUserRole === "tourist" ? "host_3" : "tourist_3",
            senderName: currentUserRole === "tourist" ? "Alemayehu Bekele" : "Emma Thompson",
            senderRole: currentUserRole === "tourist" ? "host" : "tourist",
            message: "The traditional dance workshop will be amazing! See you soon.",
            messageType: "text",
            timestamp: new Date(Date.now() - 3600000),
            status: "read",
          },
          unreadCount: { [currentUserId]: 2 },
          createdAt: new Date(Date.now() - 259200000),
          updatedAt: new Date(Date.now() - 3600000),
          isActive: true,
          bookingDetails: {
            experienceTitle: "Folk Dance & Music Experience",
            bookingDate: new Date("2024-02-25"),
            status: "confirmed",
          },
        },
      ]

      setConversations(mockConversations)
    } catch (error) {
      console.error("Failed to load conversations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredConversations = conversations.filter((conv) => {
    const otherParticipant = conv.participants.find((p) => p.id !== currentUserId)
    return (
      otherParticipant?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.bookingDetails.experienceTitle.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const getOtherParticipant = (conversation: Conversation) => {
    return conversation.participants.find((p) => p.id !== currentUserId)
  }

  const getUnreadCount = (conversation: Conversation) => {
    return conversation.unreadCount[currentUserId] || 0
  }

  if (isLoading) {
    return (
      <Card className="h-[600px]">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <span>Messages</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-3 p-3 animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <span>Messages</span>
          </div>
          <Badge variant="secondary">{conversations.length}</Badge>
        </CardTitle>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full">
          <div className="space-y-1 p-2">
            {filteredConversations.map((conversation) => {
              const otherParticipant = getOtherParticipant(conversation)
              const unreadCount = getUnreadCount(conversation)
              const isSelected = selectedConversationId === conversation.id

              return (
                <motion.div key={conversation.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant={isSelected ? "secondary" : "ghost"}
                    className={`w-full p-4 h-auto justify-start ${
                      isSelected ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200" : ""
                    }`}
                    onClick={() => onSelectConversation(conversation)}
                  >
                    <div className="flex items-start space-x-3 w-full">
                      <div className="relative">
                        <Avatar className="w-12 h-12">
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
                        {otherParticipant?.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-sm truncate">{otherParticipant?.name}</h4>
                          <div className="flex items-center space-x-2">
                            {unreadCount > 0 && (
                              <Badge className="bg-red-600 text-white text-xs px-2 py-0.5">{unreadCount}</Badge>
                            )}
                            <span className="text-xs text-gray-500">
                              {conversation.lastMessage &&
                                formatDistanceToNow(conversation.lastMessage.timestamp, { addSuffix: true })}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {otherParticipant?.role === "host" ? "Host Family" : "Tourist"}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              conversation.bookingDetails.status === "confirmed"
                                ? "text-green-600 border-green-200"
                                : "text-yellow-600 border-yellow-200"
                            }`}
                          >
                            {conversation.bookingDetails.status}
                          </Badge>
                        </div>

                        <div className="space-y-1">
                          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                            {conversation.bookingDetails.experienceTitle}
                          </p>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            <span>{format(conversation.bookingDetails.bookingDate, "MMM d, yyyy")}</span>
                          </div>
                          {conversation.lastMessage && (
                            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                              {conversation.lastMessage.senderId === currentUserId ? "You: " : ""}
                              {conversation.lastMessage.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Button>
                </motion.div>
              )
            })}

            {filteredConversations.length === 0 && (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">{searchQuery ? "No conversations found" : "No messages yet"}</p>
                <p className="text-sm text-gray-400 mt-1">
                  {searchQuery ? "Try a different search term" : "Start a conversation with your host or tourist"}
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
