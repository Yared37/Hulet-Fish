"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  Calendar,
  DollarSign,
  MapPin,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Clock,
  Award,
} from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const statsCards = [
  {
    title: "Total Revenue",
    value: "ETB 3,735,000",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/20",
  },
  {
    title: "Active Bookings",
    value: "156",
    change: "+8.2%",
    trend: "up",
    icon: Calendar,
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/20",
  },
  {
    title: "Total Users",
    value: "2,847",
    change: "+15.3%",
    trend: "up",
    icon: Users,
    color: "text-purple-600",
    bgColor: "bg-purple-100 dark:bg-purple-900/20",
  },
  {
    title: "Avg. Rating",
    value: "4.8",
    change: "+0.2",
    trend: "up",
    icon: Star,
    color: "text-amber-600",
    bgColor: "bg-amber-100 dark:bg-amber-900/20",
  },
]

const revenueData = [
  { month: "Jan", revenue: 1350000, bookings: 120 },
  { month: "Feb", revenue: 1560000, bookings: 135 },
  { month: "Mar", revenue: 1440000, bookings: 128 },
  { month: "Apr", revenue: 1830000, bookings: 165 },
  { month: "May", revenue: 1650000, bookings: 142 },
  { month: "Jun", revenue: 2010000, bookings: 178 },
  { month: "Jul", revenue: 2160000, bookings: 195 },
  { month: "Aug", revenue: 2070000, bookings: 186 },
  { month: "Sep", revenue: 2340000, bookings: 210 },
  { month: "Oct", revenue: 2550000, bookings: 225 },
  { month: "Nov", revenue: 2760000, bookings: 245 },
  { month: "Dec", revenue: 3735000, bookings: 320 },
]

const tourData = [
  { name: "Lalibela Churches", bookings: 45, revenue: 1620000, color: "#f59e0b" },
  { name: "Simien Mountains", bookings: 38, revenue: 2736000, color: "#3b82f6" },
  { name: "Danakil Depression", bookings: 32, revenue: 1728000, color: "#10b981" },
  { name: "Omo Valley", bookings: 28, revenue: 2352000, color: "#8b5cf6" },
  { name: "Axum Obelisks", bookings: 25, revenue: 900000, color: "#ef4444" },
]

const recentBookings = [
  {
    id: "BK001",
    customer: "Dawit Tadesse",
    tour: "Simien Mountains Trek",
    date: "2024-01-15",
    amount: "ETB 72,000",
    status: "confirmed",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: "BK002",
    customer: "Hanan Mohammed",
    tour: "Lalibela Churches",
    date: "2024-01-18",
    amount: "ETB 36,000",
    status: "pending",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: "BK003",
    customer: "Yohannes Bekele",
    tour: "Danakil Depression",
    date: "2024-01-20",
    amount: "ETB 54,000",
    status: "confirmed",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: "BK004",
    customer: "Meron Haile",
    tour: "Omo Valley Cultural",
    date: "2024-01-22",
    amount: "ETB 84,000",
    status: "completed",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  },
]

const quickStats = [
  { label: "Tours Available", value: "24", icon: MapPin },
  { label: "Active Guides", value: "18", icon: Users },
  { label: "Avg. Tour Duration", value: "5.2 days", icon: Clock },
  { label: "Customer Satisfaction", value: "96%", icon: Award },
]

export default function AdminOverview() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      {stat.trend === "up" ? (
                        <ArrowUpRight className="w-4 h-4 text-green-600" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-600" />
                      )}
                      <span className={`text-sm ml-1 ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                        {stat.change}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">vs last month</span>
                    </div>
                  </div>
                  <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Revenue Overview
                <Badge variant="outline">2024</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [
                      name === "revenue" ? `ETB ${value.toLocaleString()}` : value,
                      name === "revenue" ? "Revenue" : "Bookings",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#f59e0b"
                    fill="url(#revenueGradient)"
                    strokeWidth={2}
                  />
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Popular Tours */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Popular Tours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tourData.map((tour, index) => (
                  <div key={tour.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tour.color }} />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{tour.name}</p>
                        <p className="text-sm text-gray-500">{tour.bookings} bookings</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        ETB {tour.revenue.toLocaleString()}
                      </p>
                      <Progress value={(tour.bookings / 50) * 100} className="w-20 h-2 mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Bookings
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={booking.avatar || "/placeholder.svg"}
                        alt={booking.customer}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{booking.customer}</p>
                        <p className="text-sm text-gray-500">{booking.tour}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-gray-100">{booking.amount}</p>
                      <Badge
                        variant={
                          booking.status === "confirmed"
                            ? "default"
                            : booking.status === "pending"
                              ? "secondary"
                              : "outline"
                        }
                        className={
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : booking.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-blue-100 text-blue-700"
                        }
                      >
                        {booking.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {quickStats.map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/20 rounded-lg flex items-center justify-center">
                        <stat.icon className="w-4 h-4 text-amber-600" />
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{stat.value}</span>
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
