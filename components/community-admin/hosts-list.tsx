"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Users, Search, MapPin, Star, MessageSquare, Phone, Calendar } from "lucide-react"
import { useState } from "react"

const communityHosts = [
  {
    id: 1,
    name: "Dawit Mengistu",
    location: "Lalibela, Ethiopia",
    specialties: ["Historical Tours", "Religious Sites"],
    rating: 4.9,
    reviews: 24,
    tours: 5,
    joinDate: "January 2023",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    status: "active",
    languages: ["Amharic", "English"],
  },
  {
    id: 2,
    name: "Hanan Ahmed",
    location: "Harar, Ethiopia",
    specialties: ["Cultural Tours", "Food Experiences"],
    rating: 4.8,
    reviews: 18,
    tours: 3,
    joinDate: "March 2023",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    status: "active",
    languages: ["Amharic", "English", "Arabic"],
  },
  {
    id: 3,
    name: "Yohannes Bekele",
    location: "Axum, Ethiopia",
    specialties: ["Archaeological Sites", "History"],
    rating: 5.0,
    reviews: 12,
    tours: 2,
    joinDate: "February 2023",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    status: "active",
    languages: ["Amharic", "English", "Tigrinya"],
  },
]

export default function CommunityHostsList() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredHosts = communityHosts.filter(
    (host) =>
      host.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      host.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      host.specialties.some((specialty) => specialty.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Community Hosts</h1>
        <p className="text-gray-600 dark:text-gray-400">Connect with other local hosts in your community</p>
      </div>

      {/* Search */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search hosts by name, location, or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Hosts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHosts.map((host) => (
          <Card key={host.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={host.avatar || "/placeholder.svg"} alt={host.name} />
                  <AvatarFallback className="bg-green-100 text-green-700 text-lg">
                    {host.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{host.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {host.location}
                  </p>
                  <div className="flex items-center mt-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {host.rating} ({host.reviews} reviews)
                    </span>
                  </div>
                </div>
              </div>

              {/* Specialties */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Specialties:</p>
                <div className="flex flex-wrap gap-1">
                  {host.specialties.map((specialty, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Languages:</p>
                <div className="flex flex-wrap gap-1">
                  {host.languages.map((language, index) => (
                    <Badge
                      key={index}
                      className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-xs"
                    >
                      {language}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {host.tours} tours
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  Since {host.joinDate}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Message
                </Button>
                <Button size="sm" variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                  <Phone className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredHosts.length === 0 && (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No hosts found</h3>
            <p className="text-gray-500">
              {searchQuery ? "Try adjusting your search criteria" : "No other hosts in your community yet"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
