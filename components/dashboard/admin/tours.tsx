"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  MapPin,
  Search,
  Filter,
  MoreHorizontal,
  Plus,
  Star,
  Users,
  Calendar,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  Copy,
  TrendingUp,
  Clock,
} from "lucide-react"
import Image from "next/image"
import { mockDataStore } from "@/lib/mock-data"
import { toast } from "react-hot-toast"

const tourStats = [
  { label: "Total Tours", value: "24", change: "+2", icon: MapPin, color: "text-blue-600" },
  { label: "Active Tours", value: "18", change: "+1", icon: TrendingUp, color: "text-green-600" },
  { label: "Total Bookings", value: "1,247", change: "+156", icon: Users, color: "text-purple-600" },
  { label: "Avg. Rating", value: "4.8", change: "+0.1", icon: Star, color: "text-amber-600" },
]

const tours = mockDataStore.getTours()

export default function ToursPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  const filteredTours = tours.filter((tour) => {
    const matchesSearch =
      tour.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || tour.category.toLowerCase() === selectedCategory
    const matchesStatus = selectedStatus === "all" || tour.status === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Tour Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage and monitor all tour packages</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Tour
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tourStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
                    <p className="text-sm text-green-600">{stat.change} this month</p>
                  </div>
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>All Tours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search tours by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Category: {selectedCategory === "all" ? "All" : selectedCategory}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSelectedCategory("all")}>All Categories</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedCategory("adventure")}>Adventure</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedCategory("cultural")}>Cultural</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedCategory("historical")}>Historical</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Status: {selectedStatus === "all" ? "All" : selectedStatus}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSelectedStatus("all")}>All Status</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedStatus("active")}>Active</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedStatus("draft")}>Draft</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedStatus("inactive")}>Inactive</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Tours Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tour</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Guide</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTours.map((tour) => (
                  <TableRow key={tour.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="relative w-16 h-12 rounded-lg overflow-hidden">
                          <Image src={tour.image || "/placeholder.svg"} alt={tour.name} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">{tour.name}</p>
                          <p className="text-sm text-gray-500 line-clamp-1">{tour.description}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {tour.category}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {tour.difficulty}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {tour.duration}
                        </p>
                        <p className="text-sm flex items-center">
                          <DollarSign className="w-3 h-3 mr-1" />
                          ETB {tour.price.toLocaleString()}
                        </p>
                        <p className="text-sm flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          Max {tour.maxGroupSize}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm">{tour.totalBookings} bookings</p>
                        <div className="flex items-center">
                          <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                          <span className="text-sm">
                            {tour.rating} ({tour.reviews})
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">ETB {tour.revenue.toLocaleString()} revenue</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">{tour.guide}</p>
                        <p className="text-sm text-gray-500 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          Next: {tour.nextAvailable}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          tour.status === "active" ? "default" : tour.status === "draft" ? "secondary" : "outline"
                        }
                      >
                        {tour.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              const updatedTour = mockDataStore.updateTour(tour.id, {
                                status: tour.status === "active" ? "inactive" : "active",
                              })
                              if (updatedTour) {
                                toast.success(
                                  `Tour ${tour.status === "active" ? "deactivated" : "activated"} successfully`,
                                )
                              }
                            }}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            {tour.status === "active" ? "Deactivate" : "Activate"} Tour
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="w-4 h-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              mockDataStore.deleteTour(tour.id)
                              toast.success("Tour deleted successfully")
                            }}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Tour
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
