"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Star, Search, Filter, MoreHorizontal, ThumbsUp, MessageSquare, Flag, Eye, Reply, Award } from "lucide-react"

const reviewStats = [
  { label: "Total Reviews", value: "1,247", change: "+156", icon: MessageSquare, color: "text-blue-600" },
  { label: "Average Rating", value: "4.8", change: "+0.1", icon: Star, color: "text-amber-600" },
  { label: "Response Rate", value: "94%", change: "+2%", icon: Reply, color: "text-green-600" },
  { label: "Satisfaction", value: "96%", change: "+1%", icon: Award, color: "text-purple-600" },
]

const reviews = [
  {
    id: 1,
    customer: {
      name: "Michael Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      email: "michael.chen@email.com",
    },
    tour: "Simien Mountains Trek",
    rating: 5,
    title: "Absolutely incredible experience!",
    comment:
      "Dawit was an exceptional guide with incredible knowledge of the local wildlife and culture. The trek was challenging but rewarding, and the views were breathtaking. The accommodation was comfortable and the food was delicious. I would definitely recommend this tour to anyone looking for an authentic Ethiopian adventure.",
    date: "2024-01-15",
    helpful: 12,
    status: "published",
    response: {
      author: "Hulet Fish Team",
      message:
        "Thank you so much for your wonderful review, Michael! We're thrilled that you had such an amazing experience with Dawit. Your feedback means the world to us!",
      date: "2024-01-16",
    },
  },
  {
    id: 2,
    customer: {
      name: "Sarah Wilson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      email: "sarah.wilson@email.com",
    },
    tour: "Lalibela Churches",
    rating: 5,
    title: "Spiritual and enlightening journey",
    comment:
      "The rock-hewn churches of Lalibela are truly a wonder of the world. Our guide Meron was incredibly knowledgeable about the history and religious significance of each church. The early morning ceremonies were particularly moving. This tour exceeded all my expectations.",
    date: "2024-01-18",
    helpful: 8,
    status: "published",
    response: {
      author: "Meron Alemu",
      message:
        "Dear Sarah, thank you for your kind words! It was my pleasure to share the spiritual beauty of Lalibela with you. I'm so glad you found the experience meaningful.",
      date: "2024-01-19",
    },
  },
  {
    id: 3,
    customer: {
      name: "David Rodriguez",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      email: "david.rodriguez@email.com",
    },
    tour: "Danakil Depression",
    rating: 4,
    title: "Extreme but unforgettable",
    comment:
      "The Danakil Depression is not for the faint of heart - it's extremely hot and challenging. However, the salt formations and volcanic activity are unlike anything I've ever seen. The logistics were well-organized and our guide kept us safe throughout. Just be prepared for the heat!",
    date: "2024-01-20",
    helpful: 15,
    status: "published",
    response: null,
  },
  {
    id: 4,
    customer: {
      name: "Emma Thompson",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      email: "emma.thompson@email.com",
    },
    tour: "Omo Valley Cultural",
    rating: 5,
    title: "Life-changing cultural immersion",
    comment:
      "This was hands down the most authentic cultural experience I've ever had. Living with the local tribes and participating in their daily activities was incredibly humbling and educational. Alemayehu was an amazing guide who facilitated meaningful connections with the community.",
    date: "2024-01-22",
    helpful: 20,
    status: "published",
    response: {
      author: "Alemayehu Bekele",
      message:
        "Emma, your respect and appreciation for our local communities was wonderful to witness. Thank you for being such a thoughtful traveler!",
      date: "2024-01-23",
    },
  },
  {
    id: 5,
    customer: {
      name: "James Wilson",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      email: "james.wilson@email.com",
    },
    tour: "Harar Historic Town",
    rating: 3,
    title: "Good but could be better",
    comment:
      "The historic town of Harar is fascinating and the coffee ceremony was a highlight. However, I felt the tour was a bit rushed and we didn't have enough time to really explore. The guide was knowledgeable but seemed to be in a hurry. Overall decent but room for improvement.",
    date: "2024-01-25",
    helpful: 5,
    status: "pending",
    response: null,
  },
]

export default function ReviewsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRating, setSelectedRating] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.tour.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRating = selectedRating === "all" || review.rating.toString() === selectedRating
    const matchesStatus = selectedStatus === "all" || review.status === selectedStatus
    return matchesSearch && matchesRating && matchesStatus
  })

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Reviews & Feedback</h1>
          <p className="text-gray-600 dark:text-gray-400">Monitor and respond to customer reviews</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <MessageSquare className="w-4 h-4 mr-2" />
          Bulk Response
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reviewStats.map((stat, index) => (
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
                    <p className="text-sm text-green-600">{stat.change} this month</p>
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

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>All Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search reviews by customer, tour, or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Rating: {selectedRating === "all" ? "All" : `${selectedRating} stars`}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSelectedRating("all")}>All Ratings</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedRating("5")}>5 Stars</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedRating("4")}>4 Stars</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedRating("3")}>3 Stars</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedRating("2")}>2 Stars</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedRating("1")}>1 Star</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Status: {selectedStatus === "all" ? "All" : selectedStatus}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSelectedStatus("all")}>All Status</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedStatus("published")}>Published</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedStatus("pending")}>Pending</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedStatus("flagged")}>Flagged</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            {filteredReviews.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <Avatar>
                      <AvatarImage src={review.customer.avatar || "/placeholder.svg"} alt={review.customer.name} />
                      <AvatarFallback>
                        {review.customer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">{review.customer.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {review.tour}
                        </Badge>
                        <Badge
                          variant={
                            review.status === "published"
                              ? "default"
                              : review.status === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {review.status}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex">{renderStars(review.rating)}</div>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                      <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">{review.title}</h5>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{review.comment}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Reply className="w-4 h-4 mr-2" />
                        Reply
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Flag className="w-4 h-4 mr-2" />
                        Flag Review
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Review Response */}
                {review.response && (
                  <div className="mt-4 ml-12 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-600">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-blue-900 dark:text-blue-100">{review.response.author}</span>
                      <span className="text-sm text-blue-600 dark:text-blue-400">{review.response.date}</span>
                    </div>
                    <p className="text-blue-800 dark:text-blue-200">{review.response.message}</p>
                  </div>
                )}

                {/* Review Actions */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{review.helpful}</span>
                    </button>
                    <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                      <MessageSquare className="w-4 h-4" />
                      <span>Reply</span>
                    </button>
                  </div>
                  {!review.response && (
                    <Button size="sm" variant="outline">
                      <Reply className="w-4 h-4 mr-2" />
                      Respond
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
