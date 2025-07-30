"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  MessageSquare,
  Search,
  Send,
  Paperclip,
  Phone,
  Video,
  MoreHorizontal,
  Star,
  Clock,
  AlertCircle,
} from "lucide-react"

const messageStats = [
  { label: "Total Messages", value: "1,847", change: "+156", icon: MessageSquare, color: "text-blue-600" },
  { label: "Unread", value: "23", change: "+5", icon: AlertCircle, color: "text-red-600" },
  { label: "Response Time", value: "2.4h", change: "-0.3h", icon: Clock, color: "text-green-600" },
  { label: "Satisfaction", value: "4.9", change: "+0.1", icon: Star, color: "text-amber-600" },
]

const conversations = [
  {
    id: 1,
    customer: {
      name: "Michael Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      status: "online",
    },
    lastMessage: "Thank you for the amazing tour! When is the next available date for Lalibela?",
    timestamp: "2 min ago",
    unread: 2,
    priority: "high",
    tour: "Simien Mountains",
  },
  {
    id: 2,
    customer: {
      name: "Sarah Wilson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      status: "offline",
    },
    lastMessage: "I have some dietary restrictions. Can you accommodate vegetarian meals?",
    timestamp: "1 hour ago",
    unread: 1,
    priority: "medium",
    tour: "Omo Valley Cultural",
  },
  {
    id: 3,
    customer: {
      name: "David Rodriguez",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      status: "online",
    },
    lastMessage: "The payment went through successfully. Looking forward to the trip!",
    timestamp: "3 hours ago",
    unread: 0,
    priority: "low",
    tour: "Danakil Depression",
  },
  {
    id: 4,
    customer: {
      name: "Emma Thompson",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      status: "offline",
    },
    lastMessage: "Could you please send me the detailed itinerary for the cultural tour?",
    timestamp: "1 day ago",
    unread: 0,
    priority: "medium",
    tour: "Lalibela Churches",
  },
  {
    id: 5,
    customer: {
      name: "James Wilson",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      status: "offline",
    },
    lastMessage: "Is travel insurance included in the package price?",
    timestamp: "2 days ago",
    unread: 1,
    priority: "low",
    tour: "Harar Historic",
  },
]

const currentMessages = [
  {
    id: 1,
    sender: "customer",
    message:
      "Hi! I'm interested in booking the Simien Mountains trek. Could you tell me more about the difficulty level?",
    timestamp: "10:30 AM",
  },
  {
    id: 2,
    sender: "admin",
    message:
      "Hello Michael! Thank you for your interest. The Simien Mountains trek is rated as moderate difficulty. It involves 6-8 hours of hiking per day at high altitude (3000-4000m). Previous hiking experience is recommended but not required.",
    timestamp: "10:35 AM",
  },
  {
    id: 3,
    sender: "customer",
    message: "That sounds perfect! I have some hiking experience. What's included in the package?",
    timestamp: "10:37 AM",
  },
  {
    id: 4,
    sender: "admin",
    message:
      "Great! The package includes: accommodation in mountain lodges, all meals, professional guide, park fees, transportation, and camping equipment. We also provide a detailed packing list.",
    timestamp: "10:40 AM",
  },
  {
    id: 5,
    sender: "customer",
    message: "Excellent! When is the next available date? I'm flexible with timing.",
    timestamp: "10:42 AM",
  },
  {
    id: 6,
    sender: "customer",
    message: "Also, do you accommodate dietary restrictions? I'm vegetarian.",
    timestamp: "10:43 AM",
  },
]

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.tour.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Add message logic here
      setNewMessage("")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Messages</h1>
          <p className="text-gray-600 dark:text-gray-400">Communicate with customers and manage inquiries</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <MessageSquare className="w-4 h-4 mr-2" />
          New Message
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {messageStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
                    <p
                      className={`text-sm ${stat.change.startsWith("+") && stat.label !== "Unread" ? "text-green-600" : stat.change.startsWith("-") ? "text-green-600" : "text-red-600"}`}
                    >
                      {stat.change} this week
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Messages Interface */}
      <div className="grid lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Conversations</CardTitle>
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
          <CardContent className="p-0">
            <div className="space-y-1 max-h-[450px] overflow-y-auto">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-700 ${
                    selectedConversation.id === conversation.id ? "bg-blue-50 dark:bg-blue-900/20" : ""
                  }`}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage
                          src={conversation.customer.avatar || "/placeholder.svg"}
                          alt={conversation.customer.name}
                        />
                        <AvatarFallback>
                          {conversation.customer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                          conversation.customer.status === "online" ? "bg-green-500" : "bg-gray-400"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                          {conversation.customer.name}
                        </p>
                        <div className="flex items-center space-x-1">
                          {conversation.unread > 0 && (
                            <Badge className="bg-red-600 text-white text-xs">{conversation.unread}</Badge>
                          )}
                          <Badge
                            variant={
                              conversation.priority === "high"
                                ? "destructive"
                                : conversation.priority === "medium"
                                  ? "default"
                                  : "secondary"
                            }
                            className="text-xs"
                          >
                            {conversation.priority}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mb-1">{conversation.tour}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{conversation.lastMessage}</p>
                      <p className="text-xs text-gray-500 mt-1">{conversation.timestamp}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Interface */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage
                    src={selectedConversation.customer.avatar || "/placeholder.svg"}
                    alt={selectedConversation.customer.name}
                  />
                  <AvatarFallback>
                    {selectedConversation.customer.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">{selectedConversation.customer.name}</h3>
                  <p className="text-sm text-gray-500">
                    {selectedConversation.customer.status === "online" ? "Online" : "Offline"} •{" "}
                    {selectedConversation.tour}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Video className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col h-[450px]">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {currentMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "admin" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === "admin"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    }`}
                  >
                    <p className="text-sm">{message.message}</p>
                    <p className={`text-xs mt-1 ${message.sender === "admin" ? "text-blue-100" : "text-gray-500"}`}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <Textarea
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="min-h-[60px] resize-none"
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <Button variant="outline" size="sm">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
