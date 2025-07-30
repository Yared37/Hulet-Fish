"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Calendar,
  MapPin,
  Clock,
  Star,
  Camera,
  Heart,
  Plane,
  Users,
  Globe,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  PlayCircle,
} from "lucide-react"
import Image from "next/image"

const upcomingTrips = [
  {
    id: 1,
    destination: "Simien Mountains",
    date: "Jan 25, 2024",
    duration: "7 days",
    status: "confirmed",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center",
    guide: "Dawit Tadesse",
    groupSize: 8,
    progress: 85,
  },
  {
    id: 2,
    destination: "Lalibela Churches",
    date: "Feb 15, 2024",
    duration: "4 days",
    status: "pending",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop&crop=center",
    guide: "Meron Alemu",
    groupSize: 12,
    progress: 60,
  },
]

const recentTrips = [
  {
    id: 1,
    destination: "Danakil Depression",
    date: "Dec 10, 2023",
    rating: 5,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center",
    photos: 47,
    status: "completed",
  },
  {
    id: 2,
    destination: "Omo Valley",
    date: "Nov 5, 2023",
    rating: 5,
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop&crop=center",
    photos: 62,
    status: "completed",
  },
]

const recommendations = [
  {
    id: 1,
    title: "Harar Historic Town",
    description: "Explore the ancient walled city and coffee culture",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center",
    duration: "3 days",
    price: "$890",
    rating: 4.8,
    difficulty: "Easy",
    highlights: ["Coffee ceremony", "Ancient walls", "Hyena feeding"],
  },
  {
    id: 2,
    title: "Bale Mountains",
    description: "Wildlife watching and mountain trekking",
    image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&h=300&fit=crop&crop=center",
    duration: "6 days",
    price: "$1,650",
    rating: 4.9,
    difficulty: "Moderate",
    highlights: ["Ethiopian wolves", "Alpine scenery", "Bird watching"],
  },
]

const travelStats = [
  { label: "Countries Visited", value: "1", icon: Globe },
  { label: "Total Trips", value: "4", icon: Plane },
  { label: "Photos Taken", value: "247", icon: Camera },
  { label: "Favorite Spots", value: "12", icon: Heart },
]

export default function TouristDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, Michael! 🌍</h1>
            <p className="text-amber-100 text-lg">Your next Ethiopian adventure awaits. Ready to explore?</p>
          </div>
          <div className="hidden md:block">
            <Button className="bg-white text-amber-600 hover:bg-amber-50">
              <Globe className="w-4 h-4 mr-2" />
              Explore Tours
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Travel Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {travelStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-6 h-6 text-amber-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Upcoming Trips */}
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
            <div className="grid gap-6">
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
                        <Badge
                          className={
                            trip.status === "confirmed"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }
                        >
                          {trip.status === "confirmed" ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <AlertCircle className="w-3 h-3 mr-1" />
                          )}
                          {trip.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                            {trip.destination}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {trip.date}
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
                        <Button variant="outline" size="sm">
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
                          <Button size="sm" className="bg-gradient-to-r from-amber-500 to-orange-600">
                            <MapPin className="w-4 h-4 mr-2" />
                            View Itinerary
                          </Button>
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

      {/* Recent Trips & Recommendations */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Trips */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Adventures
                <Button variant="ghost" size="sm">
                  <Camera className="w-4 h-4 mr-2" />
                  View Gallery
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTrips.map((trip) => (
                  <div key={trip.id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                      <Image
                        src={trip.image || "/placeholder.svg"}
                        alt={trip.destination}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">{trip.destination}</h4>
                      <p className="text-sm text-gray-500">{trip.date}</p>
                      <div className="flex items-center mt-1">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < trip.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 ml-2">{trip.photos} photos</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <PlayCircle className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recommended for You
                <Badge variant="outline">Personalized</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                        <Image src={rec.image || "/placeholder.svg"} alt={rec.title} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">{rec.title}</h4>
                          <div className="text-right">
                            <p className="font-bold text-amber-600">{rec.price}</p>
                            <p className="text-xs text-gray-500">{rec.duration}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{rec.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <span className="text-xs text-gray-500 ml-1">{rec.rating}</span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {rec.difficulty}
                            </Badge>
                          </div>
                          <Button size="sm" variant="outline">
                            <ArrowRight className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
