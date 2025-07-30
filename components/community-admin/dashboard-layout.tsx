"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Menu, Bell } from "lucide-react"
import CommunityNavigation from "./navigation"
import AddNewTourForm from "./add-new-tour"
import EditToursPage from "./edit-tours"
import BookingRequestsPage from "./booking-requests"
import UploadPhotosPage from "./upload-photos"
import CommunityHostsList from "./hosts-list"
import DashboardOverview from "./overview"
import HomepageContentManager from "./homepage-content-manager"
import PricingManager from "./pricing-manager"

interface CommunityDashboardProps {
  hostName?: string
  hostAvatar?: string
  hostLocation?: string
}

export default function CommunityDashboardLayout({
  hostName = "Almaz Tadesse",
  hostAvatar = "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  hostLocation = "Lalibela, Ethiopia",
}: CommunityDashboardProps) {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardOverview />
      case "add-tour":
        return <AddNewTourForm />
      case "edit-tours":
        return <EditToursPage />
      case "bookings":
        return <BookingRequestsPage />
      case "photos":
        return <UploadPhotosPage />
      case "hosts":
        return <CommunityHostsList />
      case "homepage-content":
        return <HomepageContentManager />
      case "pricing":
        return <PricingManager />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white dark:bg-gray-800 shadow-sm border-b border-green-100 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold text-green-800 dark:text-green-400">Hulet Fish</h1>
              <p className="text-xs text-green-600 dark:text-green-500">Community Dashboard</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50">
              <Bell className="w-5 h-5" />
            </Button>
            <Avatar className="w-8 h-8">
              <AvatarImage src={hostAvatar || "/placeholder.svg"} alt={hostName} />
              <AvatarFallback className="bg-green-100 text-green-700">
                {hostName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <CommunityNavigation
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          sidebarOpen={sidebarOpen}
          onCloseSidebar={() => setSidebarOpen(false)}
          hostName={hostName}
          hostAvatar={hostAvatar}
          hostLocation={hostLocation}
        />

        {/* Main Content */}
        <div className="flex-1 lg:ml-80">
          <main className="p-4 lg:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  )
}
