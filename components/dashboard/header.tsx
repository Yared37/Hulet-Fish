"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import { Search, Bell, Menu, MessageSquare, Settings, User, LogOut, Globe, Calendar, MapPin } from "lucide-react"
import LanguageSelector from "@/components/language-selector"
import CurrencySelector from "@/components/currency-selector"
import { useI18n } from "@/lib/i18n/i18n-context"

interface HeaderProps {
  userRole: "admin" | "tourist" | "guide"
  onToggleSidebar: () => void
}

const notifications = [
  {
    id: 1,
    title: "New booking received",
    message: "Michael Chen booked Simien Mountains trek",
    time: "2 min ago",
    type: "booking",
    unread: true,
  },
  {
    id: 2,
    title: "Payment confirmed",
    message: "Payment of $2,400 received for Lalibela tour",
    time: "1 hour ago",
    type: "payment",
    unread: true,
  },
  {
    id: 3,
    title: "Tour completed",
    message: "Danakil Depression expedition completed successfully",
    time: "3 hours ago",
    type: "tour",
    unread: false,
  },
  {
    id: 4,
    title: "New review",
    message: "5-star review received from Sarah Wilson",
    time: "1 day ago",
    type: "review",
    unread: false,
  },
]

const messages = [
  {
    id: 1,
    sender: "Michael Chen",
    message: "When should I arrive at the meeting point?",
    time: "5 min ago",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    unread: true,
  },
  {
    id: 2,
    sender: "Sarah Wilson",
    message: "Thank you for the amazing tour!",
    time: "2 hours ago",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    unread: true,
  },
  {
    id: 3,
    sender: "Tour Support",
    message: "Your itinerary has been updated",
    time: "1 day ago",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    unread: false,
  },
]

export default function Header({ userRole, onToggleSidebar }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const unreadNotifications = notifications.filter((n) => n.unread).length
  const unreadMessages = messages.filter((m) => m.unread).length
  const { t } = useI18n()

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return t("greeting.morning")
    if (hour < 18) return t("greeting.afternoon")
    return t("greeting.evening")
  }

  const getUserName = () => {
    const names = {
      admin: "Sarah",
      tourist: "Michael",
      guide: "Dawit",
    }
    return names[userRole]
  }

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-6 py-4 shadow-sm z-40 relative">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onToggleSidebar} className="lg:hidden">
            <Menu className="w-5 h-5" />
          </Button>

          <div className="hidden lg:block">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {getGreeting()}, {getUserName()}! 👋
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {userRole === "admin" && t("dashboard.admin.subtitle")}
              {userRole === "tourist" && t("dashboard.tourist.subtitle")}
              {userRole === "guide" && t("dashboard.guide.subtitle")}
            </p>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder={
                userRole === "admin"
                  ? t("search.admin")
                  : userRole === "tourist"
                    ? t("search.tourist")
                    : t("search.guide")
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* Quick Actions */}
          <div className="hidden md:flex items-center space-x-2">
            {userRole === "admin" && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400 bg-transparent"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  {t("actions.schedule")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400 bg-transparent"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  {t("actions.tours")}
                </Button>
              </>
            )}
            {userRole === "tourist" && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400 bg-transparent"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  {t("actions.explore")}
                </Button>
                <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white">
                  {t("actions.bookTour")}
                </Button>
              </>
            )}
            {userRole === "guide" && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400 bg-transparent"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  {t("actions.schedule")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400 bg-transparent"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  {t("actions.chat")}
                </Button>
              </>
            )}
          </div>

          {/* Language and Currency Selectors */}
          <div className="hidden md:flex items-center space-x-1">
            <LanguageSelector />
            <CurrencySelector />
          </div>

          {/* Messages */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative hover:bg-slate-100 dark:hover:bg-slate-800">
                <MessageSquare className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                {unreadMessages > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 bg-blue-600 text-white text-xs border-2 border-white dark:border-slate-900">
                    {unreadMessages}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-80 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl"
            >
              <DropdownMenuLabel>{t("messages.title")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-64 overflow-y-auto">
                {messages.map((message) => (
                  <DropdownMenuItem key={message.id} className="p-3">
                    <div className="flex items-start space-x-3 w-full">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={message.avatar || "/placeholder.svg"} alt={message.sender} />
                        <AvatarFallback>{message.sender[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                            {message.sender}
                          </p>
                          <span className="text-xs text-slate-500">{message.time}</span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 truncate">{message.message}</p>
                        {message.unread && <div className="w-2 h-2 bg-blue-600 rounded-full mt-1" />}
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center text-blue-600 hover:text-blue-700">
                {t("messages.viewAll")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative hover:bg-slate-100 dark:hover:bg-slate-800">
                <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                {unreadNotifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 bg-teal-600 text-white text-xs border-2 border-white dark:border-slate-900">
                    {unreadNotifications}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-80 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl"
            >
              <DropdownMenuLabel>{t("notifications.title")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((notification) => (
                  <DropdownMenuItem key={notification.id} className="p-3">
                    <div className="w-full">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{notification.title}</p>
                        <span className="text-xs text-slate-500">{notification.time}</span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{notification.message}</p>
                      {notification.unread && <div className="w-2 h-2 bg-teal-600 rounded-full mt-2" />}
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center text-blue-600 hover:text-blue-700">
                {t("notifications.viewAll")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={
                      userRole === "admin"
                        ? "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
                        : userRole === "tourist"
                          ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
                          : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                    }
                    alt="User"
                  />
                  <AvatarFallback>{getUserName()[0]}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {userRole === "admin" ? "Sarah Johnson" : userRole === "tourist" ? "Michael Chen" : "Dawit Tadesse"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {userRole === "admin"
                      ? "sarah@huletfish.com"
                      : userRole === "tourist"
                        ? "michael@email.com"
                        : "dawit@huletfish.com"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>{t("user.profile")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>{t("user.settings")}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t("user.logout")}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
