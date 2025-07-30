"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { TrendingUp, TrendingDown, DollarSign, Calendar, Star, Download, Filter, RefreshCw } from "lucide-react"

const revenueData = [
  { month: "Jan", revenue: 45000, bookings: 120, users: 89 },
  { month: "Feb", revenue: 52000, bookings: 135, users: 102 },
  { month: "Mar", revenue: 48000, bookings: 128, users: 95 },
  { month: "Apr", revenue: 61000, bookings: 165, users: 134 },
  { month: "May", revenue: 55000, bookings: 142, users: 118 },
  { month: "Jun", revenue: 67000, bookings: 178, users: 156 },
  { month: "Jul", revenue: 72000, bookings: 195, users: 167 },
  { month: "Aug", revenue: 69000, bookings: 186, users: 145 },
  { month: "Sep", revenue: 78000, bookings: 210, users: 189 },
  { month: "Oct", revenue: 85000, bookings: 225, users: 203 },
  { month: "Nov", revenue: 92000, bookings: 245, users: 234 },
  { month: "Dec", revenue: 124500, bookings: 320, users: 287 },
]

const tourPerformance = [
  { name: "Simien Mountains", bookings: 45, revenue: 108000, satisfaction: 4.9 },
  { name: "Lalibela Churches", bookings: 38, revenue: 45600, satisfaction: 4.8 },
  { name: "Danakil Depression", bookings: 32, revenue: 57600, satisfaction: 4.7 },
  { name: "Omo Valley", bookings: 28, revenue: 78400, satisfaction: 4.9 },
  { name: "Axum Obelisks", bookings: 25, revenue: 30000, satisfaction: 4.6 },
  { name: "Harar Historic", bookings: 22, revenue: 19580, satisfaction: 4.8 },
]

const userDemographics = [
  { name: "USA", value: 35, color: "#3b82f6" },
  { name: "UK", value: 25, color: "#10b981" },
  { name: "Germany", value: 15, color: "#f59e0b" },
  { name: "Canada", value: 12, color: "#ef4444" },
  { name: "Australia", value: 8, color: "#8b5cf6" },
  { name: "Others", value: 5, color: "#6b7280" },
]

const conversionData = [
  { stage: "Website Visits", value: 10000, percentage: 100 },
  { stage: "Tour Views", value: 3500, percentage: 35 },
  { stage: "Booking Started", value: 1200, percentage: 12 },
  { stage: "Payment Page", value: 800, percentage: 8 },
  { stage: "Completed Booking", value: 650, percentage: 6.5 },
]

const keyMetrics = [
  {
    title: "Total Revenue",
    value: "$847,500",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    description: "vs last year",
  },
  {
    title: "Conversion Rate",
    value: "6.5%",
    change: "+0.8%",
    trend: "up",
    icon: TrendingUp,
    description: "website to booking",
  },
  {
    title: "Avg. Booking Value",
    value: "$2,640",
    change: "-2.1%",
    trend: "down",
    icon: Calendar,
    description: "per customer",
  },
  {
    title: "Customer Satisfaction",
    value: "4.8/5",
    change: "+0.2",
    trend: "up",
    icon: Star,
    description: "average rating",
  },
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Comprehensive business insights and performance metrics</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {keyMetrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{metric.title}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{metric.value}</p>
                    <div className="flex items-center mt-2">
                      {metric.trend === "up" ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      )}
                      <span className={`text-sm ml-1 ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                        {metric.change}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">{metric.description}</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <metric.icon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Revenue and Bookings Chart */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Revenue Trends
                <Badge variant="outline">2024</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [`$${value.toLocaleString()}`, "Revenue"]} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    fill="url(#revenueGradient)"
                    strokeWidth={2}
                  />
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tour Performance and Demographics */}
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle>Tour Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={tourPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="bookings" fill="#3b82f6" name="Bookings" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>User Demographics</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={userDemographics}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {userDemographics.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Conversion Funnel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Conversion Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {conversionData.map((stage, index) => (
                <div key={stage.stage} className="flex items-center space-x-4">
                  <div className="w-32 text-sm font-medium text-gray-700 dark:text-gray-300">{stage.stage}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {stage.value.toLocaleString()} ({stage.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${stage.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
