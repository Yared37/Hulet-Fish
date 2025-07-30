"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Calendar,
  MapPin,
  Users,
  Star,
  Clock,
  DollarSign,
  CheckCircle,
  MessageSquare,
  Camera,
  Award,
} from "lucide-react"
import Image from "next/image"

const activeTours = [
  {
    id: 1,
    title: "Simien Mountains Trek",
    client: "Michael Chen",
    startDate: "Jan 25, 2024",
    endDate: "Feb 1, 2024",
    status: "in-progress",
    day: 3,
    totalDays: 7,
    groupSize: 8,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center",
    clientAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 2,
    title: "Lalibela Churches",
    client: "Sarah Wilson",
    startDate: "Feb 15, 2024",
    endDate: "Feb 19, 2024",
    status: "upcoming",
    day: 0,
    totalDays: 4,
    groupSize: 12,
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop&crop=center",
    clientAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 3,
    title: "Danakil Depression",
    client: "David Rodriguez",
    startDate: "Mar 5, 2024",
    endDate: "Mar 10, 2024",
    status: "upcoming",
    day: 0,
    totalDays: 5,
    groupSize: 6,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center",
    clientAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  },
]

const recentReviews = [
  {
    id: 1,
    client: "Emma Thompson",
    tour: "Omo Valley Cultural",
    rating: 5,
    comment: "Dawit was an exceptional guide! His knowledge of local culture was incredible.",
    date: "2 days ago",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 2,
    client: "James Wilson",
    tour: "Harar Historic Town",
    rating: 5,
    comment: "Amazing experience! The coffee ceremony was unforgettable.",
    date: "1 week ago",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
  },
]

const guideStats = [
  { label: "Total Tours", value: "47", icon: MapPin },
  { label: "Happy Clients", value: "156", icon: Users },
  { label: "Avg. Rating", value: "4.9", icon: Star },
  { label: "This Month Earnings", value: "$3,240", icon: DollarSign },
]

const upcomingSchedule = [
  {
    id: 1,
    time: "09:00 AM",
    title: "Meet Simien Mountains group",
    location: "Hotel pickup",
    type: "pickup",
  },
  {
    id: 2,
    time: "02:00 PM",
    title: "Gelada monkey viewing",
    location: "Simien Mountains",
    type: "activity",
  },
  {
    id: 3,
    time: "06:00 PM",
    title: "Evening briefing",
    location: "Camp site",
    type: "briefing",
  },
]

export default function GuideDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome, Dawit! 🏔️</h1>
            <p className="text-green-100 text-lg">Ready to guide another amazing Ethiopian adventure today?</p>
          </div>
          <div className="hidden md:block">
            <Button className="bg-white text-green-600 hover:bg-green-50">
              <Calendar className="w-4 h-4 mr-2" />
              View Schedule
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Guide Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {guideStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Active Tours */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              My Tours
              <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                {activeTours.length} active
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeTours.map((tour) => (
                <div key={tour.id} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="relative h-48 md:h-32 rounded-lg overflow-hidden">
                      <Image src={tour.image || "/placeholder.svg"} alt={tour.title} fill className="object-cover" />
                      <div className="absolute top-3 right-3">
                        <Badge
                          className={
                            tour.status === "in-progress"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                          }
                        >
                          {tour.status === "in-progress" ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <Clock className="w-3 h-3 mr-1" />
                          )}
                          {tour.status === "in-progress" ? "Day " + tour.day : "Upcoming"}
                        </Badge>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{tour.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {tour.startDate} - {tour.endDate}
                            </div>
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {tour.groupSize} people
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Chat
                          </Button>
                          <Button size="sm" className="bg-gradient-to-r from-green-500 to-blue-600">
                            {tour.status === "in-progress" ? "Update" : "Prepare"}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {tour.status === "in-progress" && (
                          <div>
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-gray-600 dark:text-gray-400">Tour Progress</span>
                              <span className="font-medium">
                                Day {tour.day} of {tour.totalDays}
                              </span>
                            </div>
                            <Progress value={(tour.day / tour.totalDays) * 100} className="h-2" />
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <img
                              src={tour.clientAvatar || "/placeholder.svg"}
                              alt={tour.client}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{tour.client}</p>
                              <p className="text-xs text-gray-500">Lead traveler</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <Camera className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MapPin className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Today's Schedule & Recent Reviews */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Today's Schedule
                <Badge variant="outline">3 activities</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingSchedule.map((item, index) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.time}</p>
                      <div
                        className={`w-2 h-2 rounded-full mt-1 mx-auto ${index === 0 ? "bg-green-500" : "bg-gray-300"}`}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">{item.title}</h4>
                      <p className="text-sm text-gray-500 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {item.location}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {item.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Reviews */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Reviews
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">4.9</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentReviews.map((review) => (
                  <div key={review.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <img
                        src={review.avatar || "/placeholder.svg"}
                        alt={review.client}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">{review.client}</p>
                            <p className="text-xs text-gray-500">{review.tour}</p>
                          </div>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">"{review.comment}"</p>
                        <p className="text-xs text-gray-500">{review.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                <Award className="w-4 h-4 mr-2" />
                View All Reviews
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
