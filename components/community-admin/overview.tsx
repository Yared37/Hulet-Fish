"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Users, DollarSign, Star, MapPin, Clock, Eye, MessageSquare, Plus, Camera } from "lucide-react"

const stats = [
  {
    title: "Active Tours",
    value: "3",
    change: "+1 this month",
    icon: MapPin,
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/20",
  },
  {
    title: "Total Bookings",
    value: "24",
    change: "+5 this week",
    icon: Calendar,
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/20",
  },
  {
    title: "Monthly Earnings",
    value: "ETB 18,500",
    change: "+12% from last month",
    icon: DollarSign,
    color: "text-emerald-600",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/20",
  },
  {
    title: "Average Rating",
    value: "4.9",
    change: "Based on 18 reviews",
    icon: Star,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
  },
]

const recentBookings = [
  {
    id: 1,
    guestName: "Sarah Johnson",
    tourTitle: "Traditional Coffee Ceremony Experience",
    date: "March 15, 2024",
    status: "confirmed",
    amount: "ETB 850",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 2,
    guestName: "Michael Chen",
    tourTitle: "Local Village Walking Tour",
    date: "March 18, 2024",
    status: "pending",
    amount: "ETB 650",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 3,
    guestName: "Emma Wilson",
    tourTitle: "Cooking Class with Local Family",
    date: "March 20, 2024",
    status: "confirmed",
    amount: "ETB 1,200",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  },
]

const myTours = [
  {
    id: 1,
    title: "Traditional Coffee Ceremony Experience",
    bookings: 8,
    rating: 4.9,
    price: "ETB 850",
    image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=300&h=200&fit=crop",
    status: "active",
  },
  {
    id: 2,
    title: "Local Village Walking Tour",
    bookings: 12,
    rating: 4.8,
    price: "ETB 650",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop",
    status: "active",
  },
  {
    id: 3,
    title: "Cooking Class with Local Family",
    bookings: 4,
    rating: 5.0,
    price: "ETB 1,200",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop",
    status: "active",
  },
]

export default function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome back, Almaz! 👋</h1>
            <p className="text-green-100 mb-4 md:mb-0">You have 5 new booking requests waiting for your review</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30">
              <Plus className="w-4 h-4 mr-2" />
              Add New Tour
            </Button>
            <Button variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10">
              <Eye className="w-4 h-4 mr-2" />
              View Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.change}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Bookings</span>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                {recentBookings.length} New
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={booking.avatar || "/placeholder.svg"} alt={booking.guestName} />
                  <AvatarFallback className="bg-green-100 text-green-700">
                    {booking.guestName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{booking.guestName}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{booking.tourTitle}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">{booking.date}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{booking.amount}</p>
                  <Badge
                    variant={booking.status === "confirmed" ? "default" : "secondary"}
                    className={
                      booking.status === "confirmed"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                    }
                  >
                    {booking.status}
                  </Badge>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-4 border-green-200 text-green-700 hover:bg-green-50">
              View All Bookings
            </Button>
          </CardContent>
        </Card>

        {/* My Tours */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">My Tours</span>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-1" />
                Add Tour
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {myTours.map((tour) => (
              <div key={tour.id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <img
                  src={tour.image || "/placeholder.svg"}
                  alt={tour.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{tour.title}</p>
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center">
                      <Users className="w-3 h-3 text-gray-400 mr-1" />
                      <span className="text-xs text-gray-500">{tour.bookings} bookings</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                      <span className="text-xs text-gray-500">{tour.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{tour.price}</p>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 mt-1">
                    {tour.status}
                  </Badge>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-4 border-green-200 text-green-700 hover:bg-green-50">
              Manage All Tours
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-20 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 flex-col">
              <Plus className="w-6 h-6 mb-2" />
              Create New Tour
            </Button>
            <Button variant="outline" className="h-20 border-blue-200 text-blue-700 hover:bg-blue-50 flex-col">
              <Camera className="w-6 h-6 mb-2" />
              Upload Photos
            </Button>
            <Button variant="outline" className="h-20 border-purple-200 text-purple-700 hover:bg-purple-50 flex-col">
              <MessageSquare className="w-6 h-6 mb-2" />
              Message Guests
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
