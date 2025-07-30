"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UserRegistration from "@/components/mock-functionality/user-registration"
import TourCreator from "@/components/mock-functionality/tour-creator"
import BookingSimulator from "@/components/mock-functionality/booking-simulator"
import ReviewSystem from "@/components/mock-functionality/review-system"
import { mockDataStore } from "@/lib/mock-data"
import {
  Users,
  MapPin,
  Calendar,
  Star,
  BarChart3,
  MessageSquare,
  Database,
  Zap,
  CheckCircle,
  TrendingUp,
} from "lucide-react"

export default function DemoPage() {
  const [activeDemo, setActiveDemo] = useState("overview")

  const stats = mockDataStore.getAnalytics()
  const users = mockDataStore.getUsers()
  const tours = mockDataStore.getTours()
  const bookings = mockDataStore.getBookings()
  const reviews = mockDataStore.getReviews()

  const demoFeatures = [
    {
      id: "users",
      title: "User Registration",
      description: "Create new users with full profile management",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      id: "tours",
      title: "Tour Creation",
      description: "Build comprehensive tour packages with itineraries",
      icon: MapPin,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      id: "bookings",
      title: "Booking System",
      description: "Complete booking flow with payment simulation",
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
    {
      id: "reviews",
      title: "Review System",
      description: "Customer feedback and rating management",
      icon: Star,
      color: "text-amber-600",
      bgColor: "bg-amber-100 dark:bg-amber-900/20",
    },
  ]

  const mockCapabilities = [
    {
      title: "Real-time Data Updates",
      description: "All changes are immediately reflected across the platform",
      icon: Zap,
    },
    {
      title: "Persistent Session Storage",
      description: "Data persists throughout your session for realistic testing",
      icon: Database,
    },
    {
      title: "Complete CRUD Operations",
      description: "Create, read, update, and delete functionality for all entities",
      icon: CheckCircle,
    },
    {
      title: "Analytics Integration",
      description: "Automatic calculation of metrics and performance indicators",
      icon: TrendingUp,
    },
    {
      title: "Notification System",
      description: "Toast notifications for all user actions and system events",
      icon: MessageSquare,
    },
    {
      title: "Search & Filtering",
      description: "Dynamic search and filter capabilities across all data",
      icon: BarChart3,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-amber-600 bg-clip-text text-transparent mb-4">
            Hulet Fish Demo
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Experience the complete Ethiopian tourism platform with full mock functionality. Every feature simulates
            real backend operations without requiring a server.
          </p>
          <div className="flex items-center justify-center space-x-2 mt-4">
            <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
              <CheckCircle className="w-3 h-3 mr-1" />
              Fully Functional
            </Badge>
            <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
              <Database className="w-3 h-3 mr-1" />
              Mock Backend
            </Badge>
            <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
              <Zap className="w-3 h-3 mr-1" />
              Real-time Updates
            </Badge>
          </div>
        </motion.div>

        {/* Current Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          <Card className="text-center">
            <CardContent className="p-4">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">{users.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Users</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <MapPin className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">{tours.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tours</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">{bookings.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Bookings</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <Star className="w-8 h-8 text-amber-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">{reviews.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Reviews</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Demo Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-center mb-8">Interactive Demo Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {demoFeatures.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.05 }}
                className="cursor-pointer"
                onClick={() => setActiveDemo(feature.id)}
              >
                <Card
                  className={`h-full transition-all duration-300 ${
                    activeDemo === feature.id ? "ring-2 ring-blue-500 shadow-lg" : "hover:shadow-md"
                  }`}
                >
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-16 h-16 ${feature.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}
                    >
                      <feature.icon className={`w-8 h-8 ${feature.color}`} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Mock Capabilities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-12"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Mock Backend Capabilities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockCapabilities.map((capability, index) => (
                  <motion.div
                    key={capability.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-start space-x-3"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <capability.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">{capability.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{capability.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Interactive Demo */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
          <Card>
            <CardHeader>
              <CardTitle>Try It Yourself</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeDemo} onValueChange={setActiveDemo}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="users">Users</TabsTrigger>
                  <TabsTrigger value="tours">Tours</TabsTrigger>
                  <TabsTrigger value="bookings">Bookings</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>

                <TabsContent value="users" className="mt-6">
                  <UserRegistration />
                </TabsContent>

                <TabsContent value="tours" className="mt-6">
                  <TourCreator />
                </TabsContent>

                <TabsContent value="bookings" className="mt-6">
                  <BookingSimulator />
                </TabsContent>

                <TabsContent value="reviews" className="mt-6">
                  <ReviewSystem />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="text-center mt-12"
        >
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Ready to Explore Ethiopia?</h3>
              <p className="text-lg mb-6 opacity-90">
                Experience the complete tourism platform with authentic Ethiopian adventures
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                  onClick={() => (window.location.href = "/dashboard")}
                >
                  <Users className="w-5 h-5 mr-2" />
                  Access Dashboard
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600"
                  onClick={() => (window.location.href = "/")}
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  Explore Tours
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
