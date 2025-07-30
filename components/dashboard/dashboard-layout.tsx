"use client"

import type React from "react"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import DashboardSidebar from "@/components/dashboard/sidebar"
import DashboardHeader from "@/components/dashboard/header"
import ChatWidget from "@/components/chat/chat-widget"

interface DashboardLayoutProps {
  children: React.ReactNode
  userRole: "tourist" | "host" | "admin"
  userId: string
}

export default function DashboardLayout({ children, userRole, userId }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Don't show chat widget on messages page to avoid duplication
  const showChatWidget = !pathname?.includes("/dashboard/messages")

  return (
    <SidebarProvider defaultOpen={sidebarOpen} open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <div className="flex min-h-screen">
        <DashboardSidebar userRole={userRole} />
        <div className="flex flex-col flex-1">
          <DashboardHeader userRole={userRole} />
          <main className="flex-1 p-4 md:p-6 bg-gray-50 dark:bg-gray-900">{children}</main>
        </div>

        {/* Chat Widget */}
        {showChatWidget && <ChatWidget currentUserId={userId} currentUserRole={userRole} />}
      </div>
    </SidebarProvider>
  )
}
