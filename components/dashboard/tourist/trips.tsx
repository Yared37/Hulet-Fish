"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Star,
  Download,
  MessageSquare,
  Camera,
  CheckCircle,
  AlertCircle,
  Plane,
} from "lucide-react"
import Image from "next/image"

const tripStats = [
  { label: "Total Trips", value: "4", icon: Plane, color: "text-blue-600" },
  { label: "Countries Visited", value: "1", icon: MapPin, color: "text-green-600" },
  { label: "Photos Taken", value: "247", icon: Camera, color: "text-purple-600" },
  { label: "Avg. Rating Given", value: "4.8", icon: Star, color: "text-amber-600" },
]

const trips = [
  {
    id: 1,
    destination: "Simien Mountains Trek",
    status: "upcoming",
    startDate: "2024-02-15",
    endDate: "2024-02-22",
    duration: "7 days",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center",
    guide: "Dawit Tadesse",
    groupSize: 8,
    price: 2400,
    progress: 85,
    description:
      "Epic trekking adventure through UNESCO World Heritage site with dramatic landscapes and endemic wildlife",
    highlights: ["Gelada monkeys", "Ras Dashen peak", "Mountain lodges", "Local cuisine"],
    itinerary: [
      { day: 1, title: "Arrival in Gondar", description: "Airport pickup and city tour" },
      { day: 2, title: "Drive to Simien Mountains", description: "Scenic drive and first hike" },
      { day: 3, title: "Sankaber to Geech", description: "Full day trekking with wildlife viewing" },
    ],
  },
  {
    id: 2,
    destination: "Lalibela Churches",
    status: "upcoming",
    startDate: "2024-03-10",
    endDate: "2024-03-14",
    duration: "4 days",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop&crop=center",
    guide: "Meron Alemu",
    groupSize: 12,
    price: 1200,
    progress: 60,
    description: "Spiritual journey through ancient rock-hewn churches and religious ceremonies",
    highlights: ["Rock churches", "Religious ceremonies", "Local culture", "Traditional food"],
    itinerary: [
      { day: 1, title: "Arrival in Lalibela", description: "Hotel check-in and orientation" },
      { day: 2, title: "Northern Churches", description: "Visit to the northern cluster of churches" },
      { day: 3, title: "Southern Churches", description: "Explore the southern churches and St. George" },
    ],
  },
  {
    id: 3,
    destination: "Danakil Depression",
    status: "completed",
    startDate: "2023-12-10",
    endDate: "2023-12-15",
    duration: "5 days",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center",
    guide: "Tekle Haile",
    groupSize: 6,
    price: 1800,
    progress: 100,
    rating: 5,
    review:
      "Absolutely incredible experience! The salt formations and volcanic activity were unlike anything I've ever seen.",
    description: "Extreme adventure to one of Earth's hottest and most unique landscapes",
    highlights: ["Salt formations", "Active volcanoes", "Mineral deposits", "Afar culture"],
    photos: 47,
  },
  {
    id: 4,
    destination: "Omo Valley Cultural",
    status: "completed",
    startDate: "2023-11-05",
    endDate: "2023-11-13",
    duration: "8 days",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop&crop=center",
    guide: "Alemayehu Bekele",
    groupSize: 10,
    price: 2800,
    progress: 100,
    rating: 5,
    review: "Life-changing cultural immersion with incredible people and traditions.",
    description: "Immersive cultural experience with indigenous tribes and traditional ceremonies",
    highlights: ["Tribal cultures", "Traditional ceremonies", "Local markets", "Authentic experiences"],
    photos: 62,
  },
]

export default function TripsPage() {
  const [selectedTrip, setSelectedTrip] = useState<(typeof trips)[0] | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  const upcomingTrips = trips.filter((trip) => trip.status === "upcoming")
  const completedTrips = trips.filter((trip) => trip.status === "completed")

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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">My Trips</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your Ethiopian adventures</p>
        </div>
        <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700">
          <Plane className="w-4 h-4 mr-2" />
          Book New Trip
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {tripStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Upcoming Trips */}
      {upcomingTrips.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Upcoming Adventures
                <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                  {upcomingTrips.length} trips
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {upcomingTrips.map((trip) => (
                  <div key={trip.id} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="relative h-48 md:h-32 rounded-lg overflow-hidden">
                        <Image
                          src={trip.image || "/placeholder.svg"}
                          alt={trip.destination}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-green-100 text-green-700">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Confirmed
                          </Badge>
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                              {trip.destination}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-3">{trip.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {trip.startDate} - {trip.endDate}
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {trip.duration}
                              </div>
                              <div className="flex items-center">
                                <Users className="w-4 h-4 mr-1" />
                                {trip.groupSize} people
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => setSelectedTrip(trip)}>
                            View Details
                          </Button>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-gray-600 dark:text-gray-400">Trip Preparation</span>
                              <span className="font-medium">{trip.progress}%</span>
                            </div>
                            <Progress value={trip.progress} className="h-2" />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center">
                                <Users className="w-3 h-3 text-amber-600" />
                              </div>
                              <span className="text-sm text-gray-600 dark:text-gray-400">Guide: {trip.guide}</span>
                            </div>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Chat
                              </Button>
                              <Button size="sm" className="bg-gradient-to-r from-amber-500 to-orange-600">
                                <Download className="w-4 h-4 mr-2" />
                                Itinerary
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
      )}

      {/* Completed Trips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Past Adventures
              <Badge variant="outline">{completedTrips.length} completed</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {completedTrips.map((trip) => (
                <div key={trip.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                    <Image
                      src={trip.image || "/placeholder.svg"}
                      alt={trip.destination}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-blue-100 text-blue-700">
                        <Camera className="w-3 h-3 mr-1" />
                        {trip.photos} photos
                      </Badge>
                    </div>
                  </div>

                  <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">{trip.destination}</h4>

                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {trip.startDate}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {trip.duration}
                    </div>
                  </div>

                  {trip.rating && (
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="flex">{renderStars(trip.rating)}</div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Your rating</span>
                    </div>
                  )}

                  {trip.review && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 italic">"{trip.review}"</p>
                  )}

                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Camera className="w-4 h-4 mr-2" />
                      View Photos
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Certificate
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Trip Detail Modal */}
      {selectedTrip && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            <div className="relative h-64">
              <Image
                src={selectedTrip.image || "/placeholder.svg"}
                alt={selectedTrip.destination}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <h2 className="text-3xl font-bold mb-2">{selectedTrip.destination}</h2>
                <p className="text-lg">{selectedTrip.description}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedTrip(null)}
                className="absolute top-4 right-4 text-white hover:bg-white/20"
              >
                ✕
              </Button>
            </div>

            <div className="p-6">
              <div className="flex space-x-4 mb-6">
                {["overview", "itinerary", "preparation"].map((tab) => (
                  <Button
                    key={tab}
                    variant={activeTab === tab ? "default" : "outline"}
                    onClick={() => setActiveTab(tab)}
                    className="capitalize"
                  >
                    {tab}
                  </Button>
                ))}
              </div>

              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Trip Details</h3>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                          <span>
                            {selectedTrip.startDate} - {selectedTrip.endDate}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-gray-500" />
                          <span>{selectedTrip.duration}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2 text-gray-500" />
                          <span>{selectedTrip.groupSize} people in group</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                          <span>Guide: {selectedTrip.guide}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Highlights</h3>
                      <div className="space-y-2">
                        {selectedTrip.highlights.map((highlight, index) => (
                          <div key={index} className="flex items-center">
                            <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                            <span>{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "itinerary" && selectedTrip.itinerary && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Daily Itinerary</h3>
                  {selectedTrip.itinerary.map((day) => (
                    <div key={day.day} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold">
                          {day.day}
                        </div>
                        <h4 className="font-semibold">{day.title}</h4>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 ml-11">{day.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "preparation" && (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold">Preparation Progress</h3>
                      <span className="text-sm font-medium">{selectedTrip.progress}% Complete</span>
                    </div>
                    <Progress value={selectedTrip.progress} className="h-3" />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <h4 className="font-medium">Documents</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Passport & Visa</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <h4 className="font-medium">Health</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Vaccinations</p>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <AlertCircle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                      <h4 className="font-medium">Packing</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">In Progress</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
