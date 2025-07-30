"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import { Users, Shield, MapPin } from "lucide-react"

const userRoles = [
  {
    id: "admin" as const,
    title: "Administrator",
    description: "Manage bookings, users, and business analytics",
    icon: Shield,
    color: "from-red-500 to-pink-600",
    features: ["User Management", "Revenue Analytics", "Tour Management", "System Settings"],
  },
  {
    id: "tourist" as const,
    title: "Tourist",
    description: "Plan trips, view bookings, and explore destinations",
    icon: Users,
    color: "from-blue-500 to-purple-600",
    features: ["Trip Planning", "Booking History", "Recommendations", "Photo Gallery"],
  },
  {
    id: "guide" as const,
    title: "Local Guide",
    description: "Manage tours, interact with clients, and track earnings",
    icon: MapPin,
    color: "from-green-500 to-teal-600",
    features: ["Tour Management", "Client Communication", "Schedule Planning", "Earnings Tracking"],
  },
]

export default function DashboardPage() {
  const [selectedRole, setSelectedRole] = useState<"admin" | "tourist" | "guide" | null>(null)

  if (selectedRole) {
    return <DashboardLayout userRole={selectedRole} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-6">
      <div className="max-w-6xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge className="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900 dark:to-orange-900 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-700 mb-4 px-6 py-2">
            Dashboard Demo
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-800 via-orange-700 to-red-700 dark:from-amber-400 dark:via-orange-300 dark:to-red-400 bg-clip-text text-transparent">
            Hulet Fish Dashboard
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Experience our premium dashboard interface designed for different user roles. Choose a role below to explore
            the tailored experience.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {userRoles.map((role, index) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -5 }}
              className="group cursor-pointer"
              onClick={() => setSelectedRole(role.id)}
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white dark:bg-gray-800 overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${role.color}`} />
                <CardHeader className="text-center pb-4">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${role.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <role.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {role.title}
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-400">{role.description}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3 mb-6">
                    {role.features.map((feature, i) => (
                      <div key={i} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-3" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  <Button
                    className={`w-full bg-gradient-to-r ${role.color} hover:opacity-90 text-white shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105`}
                  >
                    Enter {role.title} Dashboard
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 dark:text-gray-400">
            This is a frontend prototype showcasing the dashboard UI design. All data shown is sample data for
            demonstration purposes.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
