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
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  DollarSign,
  TrendingUp,
  Calendar,
  CreditCard,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

const revenueStats = [
  {
    title: "Total Revenue",
    value: "ETB 25,425,000",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    description: "vs last year",
  },
  {
    title: "Monthly Revenue",
    value: "ETB 3,735,000",
    change: "+8.2%",
    trend: "up",
    icon: Calendar,
    description: "this month",
  },
  {
    title: "Average Order",
    value: "ETB 79,200",
    change: "-2.1%",
    trend: "down",
    icon: CreditCard,
    description: "per booking",
  },
  {
    title: "Profit Margin",
    value: "34.2%",
    change: "+1.8%",
    trend: "up",
    icon: TrendingUp,
    description: "gross margin",
  },
]

const monthlyRevenue = [
  { month: "Jan", revenue: 1350000, profit: 459000, bookings: 120 },
  { month: "Feb", revenue: 1560000, profit: 530400, bookings: 135 },
  { month: "Mar", revenue: 1440000, profit: 489600, bookings: 128 },
  { month: "Apr", revenue: 1830000, profit: 622200, bookings: 165 },
  { month: "May", revenue: 1650000, profit: 561000, bookings: 142 },
  { month: "Jun", revenue: 2010000, profit: 682400, bookings: 178 },
  { month: "Jul", revenue: 2160000, profit: 734400, bookings: 195 },
  { month: "Aug", revenue: 2070000, profit: 703800, bookings: 186 },
  { month: "Sep", revenue: 2340000, profit: 795600, bookings: 210 },
  { month: "Oct", revenue: 2550000, profit: 867000, bookings: 225 },
  { month: "Nov", revenue: 2760000, profit: 938400, bookings: 245 },
  { month: "Dec", revenue: 3735000, profit: 1269900, bookings: 320 },
]

const revenueByTour = [
  { name: "Simien Mountains", revenue: 3240000, percentage: 25.4, color: "#3b82f6" },
  { name: "Omo Valley", revenue: 2352000, percentage: 18.5, color: "#10b981" },
  { name: "Danakil Depression", revenue: 1728000, percentage: 13.6, color: "#f59e0b" },
  { name: "Lalibela Churches", revenue: 1368000, percentage: 10.7, color: "#ef4444" },
  { name: "Axum Obelisks", revenue: 900000, percentage: 7.1, color: "#8b5cf6" },
  { name: "Others", revenue: 3147000, percentage: 24.7, color: "#6b7280" },
]

const paymentMethods = [
  { name: "TeleBirr", value: 45, amount: 16541250, color: "#3b82f6" },
  { name: "CBE Birr", value: 30, amount: 11356250, color: "#10b981" },
  { name: "Bank Transfer", value: 15, amount: 5677500, color: "#f59e0b" },
  { name: "Cash", value: 10, amount: 3785000, color: "#ef4444" },
]

const topCustomers = [
  { name: "Dawit Tadesse", bookings: 4, revenue: 252000, lastBooking: "2024-01-15" },
  { name: "Hanan Mohammed", bookings: 7, revenue: 378000, lastBooking: "2024-01-18" },
  { name: "Yohannes Bekele", bookings: 3, revenue: 204000, lastBooking: "2024-01-20" },
  { name: "Meron Haile", bookings: 2, revenue: 96000, lastBooking: "2024-01-22" },
  { name: "Alemayehu Worku", bookings: 5, revenue: 285000, lastBooking: "2024-01-25" },
]

export default function RevenuePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Revenue Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">Track financial performance and revenue trends</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-gradient-to-r from-green-600 to-blue-600">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {revenueStats.map((stat, index) => (
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
                      <span className="text-sm text-gray-500 ml-1">{stat.description}</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Revenue and Profit Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Revenue & Profit Trends
              <Badge variant="outline">2024</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    `ETB ${value.toLocaleString()}`,
                    name === "revenue" ? "Revenue" : "Profit",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stackId="1"
                  stroke="#3b82f6"
                  fill="url(#revenueGradient)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stackId="2"
                  stroke="#10b981"
                  fill="url(#profitGradient)"
                  strokeWidth={2}
                />
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Revenue Breakdown and Payment Methods */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Tour</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {revenueByTour.map((tour) => (
                  <div key={tour.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tour.color }} />
                      <span className="font-medium text-gray-900 dark:text-gray-100">{tour.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        ETB {tour.revenue.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">{tour.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={paymentMethods}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {paymentMethods.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Top Customers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Top Revenue Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCustomers.map((customer, index) => (
                <div
                  key={customer.name}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{customer.name}</p>
                      <p className="text-sm text-gray-500">{customer.bookings} bookings</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      ETB {customer.revenue.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">Last: {customer.lastBooking}</p>
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
