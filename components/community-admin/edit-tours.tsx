"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit3, Search, Filter, Eye, Trash2, Users, Calendar, DollarSign, Star, MapPin, Plus } from "lucide-react"

const myTours = [
  {
    id: 1,
    title: "Traditional Coffee Ceremony Experience",
    description: "Experience authentic Ethiopian coffee culture with a local family",
    status: "active",
    bookings: 8,
    rating: 4.9,
    reviews: 12,
    price: 850,
    maxGuests: 6,
    nextDate: "March 15, 2024",
    image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=300&h=200&fit=crop",
  },
  {
    id: 2,
    title: "Local Village Walking Tour",
    description: "Discover traditional village life and local customs",
    status: "active",
    bookings: 12,
    rating: 4.8,
    reviews: 18,
    price: 650,
    maxGuests: 10,
    nextDate: "March 18, 2024",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop",
  },
  {
    id: 3,
    title: "Cooking Class with Local Family",
    description: "Learn to prepare traditional Ethiopian dishes",
    status: "draft",
    bookings: 4,
    rating: 5.0,
    reviews: 6,
    price: 1200,
    maxGuests: 4,
    nextDate: "March 20, 2024",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop",
  },
]

export default function EditToursPage() {
  const [tours, setTours] = useState(myTours)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredTours = tours.filter((tour) => {
    const matchesSearch = tour.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || tour.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case "draft":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Edit Existing Tours</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage and update your tour experiences</p>
        </div>
        <Button className="mt-4 md:mt-0 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Create New Tour
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search your tours..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tours</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tours Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTours.map((tour) => (
          <Card key={tour.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              <div className="relative">
                <img
                  src={tour.image || "/placeholder.svg"}
                  alt={tour.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <Badge className={`absolute top-3 left-3 ${getStatusColor(tour.status)}`}>
                  {tour.status.charAt(0).toUpperCase() + tour.status.slice(1)}
                </Badge>
                <div className="absolute top-3 right-3 flex items-center space-x-1 bg-black/50 rounded-full px-2 py-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="text-white text-xs font-medium">{tour.rating}</span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                  {tour.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{tour.description}</p>

                {/* Tour Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Users className="w-4 h-4 mr-1" />
                    {tour.bookings} bookings
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Star className="w-4 h-4 mr-1" />
                    {tour.reviews} reviews
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <DollarSign className="w-4 h-4 mr-1" />
                    ETB {tour.price.toLocaleString()}
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4 mr-1" />
                    {tour.nextDate}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                    <Edit3 className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTours.length === 0 && (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No tours found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "You haven't created any tours yet"}
            </p>
            <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Tour
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
