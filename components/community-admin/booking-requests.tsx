"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Users, Search, Filter, Check, X, MessageSquare, Phone, Mail, Clock, DollarSign } from "lucide-react"
import { toast } from "sonner"

const bookingRequests = [
  {
    id: 1,
    guestName: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 555-0123",
    tourTitle: "Traditional Coffee Ceremony Experience",
    tourDate: "March 15, 2024",
    requestDate: "March 1, 2024",
    guests: 2,
    totalAmount: "ETB 1,700",
    status: "pending",
    message:
      "Hi! I'm very excited about experiencing the traditional coffee ceremony. Could you please let me know what we should bring?",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    specialRequests: "Vegetarian dietary requirements",
  },
  {
    id: 2,
    guestName: "Michael Chen",
    email: "michael.chen@email.com",
    phone: "+1 555-0456",
    tourTitle: "Local Village Walking Tour",
    tourDate: "March 18, 2024",
    requestDate: "March 2, 2024",
    guests: 4,
    totalAmount: "ETB 2,600",
    status: "pending",
    message: "Looking forward to learning about local culture and traditions. We're a family with two teenagers.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    specialRequests: "Family with teenagers (ages 14, 16)",
  },
  {
    id: 3,
    guestName: "Emma Wilson",
    email: "emma.wilson@email.com",
    phone: "+44 20 7946 0958",
    tourTitle: "Cooking Class with Local Family",
    tourDate: "March 20, 2024",
    requestDate: "February 28, 2024",
    guests: 1,
    totalAmount: "ETB 1,200",
    status: "confirmed",
    message:
      "I'm a food blogger and would love to document this experience. Is photography allowed during the cooking class?",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    specialRequests: "Food blogger - photography needed",
  },
  {
    id: 4,
    guestName: "David Rodriguez",
    email: "david.rodriguez@email.com",
    phone: "+34 91 123 4567",
    tourTitle: "Traditional Coffee Ceremony Experience",
    tourDate: "March 22, 2024",
    requestDate: "March 3, 2024",
    guests: 3,
    totalAmount: "ETB 2,550",
    status: "pending",
    message: "We're celebrating our anniversary and would love to experience authentic Ethiopian culture together.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    specialRequests: "Anniversary celebration",
  },
  {
    id: 5,
    guestName: "Lisa Thompson",
    email: "lisa.thompson@email.com",
    phone: "+61 2 9876 5432",
    tourTitle: "Local Village Walking Tour",
    tourDate: "March 25, 2024",
    requestDate: "March 4, 2024",
    guests: 2,
    totalAmount: "ETB 1,300",
    status: "rejected",
    message:
      "We're interested in the walking tour but need to know about accessibility for someone with mobility issues.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    specialRequests: "Mobility accessibility needed",
  },
]

export default function BookingRequestsPage() {
  const [requests, setRequests] = useState(bookingRequests)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedRequest, setSelectedRequest] = useState<(typeof bookingRequests)[0] | null>(null)

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.tourTitle.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || request.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleApprove = (id: number) => {
    setRequests(requests.map((req) => (req.id === id ? { ...req, status: "confirmed" } : req)))
    toast.success("Booking approved! 🎉", {
      description: "The guest has been notified and will receive booking confirmation.",
    })
  }

  const handleReject = (id: number) => {
    setRequests(requests.map((req) => (req.id === id ? { ...req, status: "rejected" } : req)))
    toast.success("Booking declined", {
      description: "The guest has been notified with a polite message.",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
    }
  }

  const pendingCount = requests.filter((req) => req.status === "pending").length
  const confirmedCount = requests.filter((req) => req.status === "confirmed").length
  const totalRevenue = requests
    .filter((req) => req.status === "confirmed")
    .reduce((sum, req) => sum + Number.parseInt(req.totalAmount.replace(/[^\d]/g, "")), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Booking Requests</h1>
        <p className="text-gray-600 dark:text-gray-400">Review and manage guest booking requests for your tours</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Requests</p>
                <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
                <p className="text-sm text-gray-500">Need your attention</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Confirmed Bookings</p>
                <p className="text-3xl font-bold text-green-600">{confirmedCount}</p>
                <p className="text-sm text-gray-500">Ready to go</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                <Check className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p className="text-3xl font-bold text-blue-600">ETB {totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-gray-500">From confirmed bookings</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by guest name or tour title..."
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
                <SelectItem value="all">All Requests</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Booking Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No booking requests found</h3>
              <p className="text-gray-500">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "New booking requests will appear here when guests book your tours"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredRequests.map((request) => (
            <Card key={request.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  {/* Guest Info */}
                  <div className="flex items-center space-x-4 flex-1">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={request.avatar || "/placeholder.svg"} alt={request.guestName} />
                      <AvatarFallback className="bg-green-100 text-green-700 text-lg">
                        {request.guestName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{request.guestName}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{request.tourTitle}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {request.tourDate}
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {request.guests} guest{request.guests > 1 ? "s" : ""}
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />
                          {request.totalAmount}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status and Actions */}
                  <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                    <Badge className={getStatusColor(request.status)}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </Badge>

                    {request.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(request.id)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(request.id)}
                          className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Decline
                        </Button>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Message
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedRequest(request)}
                        className="border-gray-200 text-gray-600 hover:bg-gray-50"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Guest Message */}
                {request.message && (
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Guest Message:</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic">"{request.message}"</p>
                  </div>
                )}

                {/* Special Requests */}
                {request.specialRequests && (
                  <div className="mt-3">
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                      Special Request: {request.specialRequests}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Request Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Booking Request Details</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedRequest(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Guest Information */}
              <div className="flex items-center space-x-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={selectedRequest.avatar || "/placeholder.svg"} alt={selectedRequest.guestName} />
                  <AvatarFallback className="bg-green-100 text-green-700 text-xl">
                    {selectedRequest.guestName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {selectedRequest.guestName}
                  </h3>
                  <div className="space-y-1 mt-2">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Mail className="w-4 h-4 mr-2" />
                      {selectedRequest.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Phone className="w-4 h-4 mr-2" />
                      {selectedRequest.phone}
                    </div>
                  </div>
                </div>
                <Badge className={getStatusColor(selectedRequest.status)}>
                  {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                </Badge>
              </div>

              {/* Booking Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tour</p>
                    <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                      {selectedRequest.tourTitle}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tour Date</p>
                    <p className="text-base text-gray-900 dark:text-gray-100">{selectedRequest.tourDate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Number of Guests</p>
                    <p className="text-base text-gray-900 dark:text-gray-100">
                      {selectedRequest.guests} guest{selectedRequest.guests > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Amount</p>
                    <p className="text-xl font-bold text-green-600">{selectedRequest.totalAmount}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Request Date</p>
                    <p className="text-base text-gray-900 dark:text-gray-100">{selectedRequest.requestDate}</p>
                  </div>
                </div>
              </div>

              {/* Guest Message */}
              {selectedRequest.message && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Guest Message:</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 italic">"{selectedRequest.message}"</p>
                </div>
              )}

              {/* Special Requests */}
              {selectedRequest.specialRequests && (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Special Requests:</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{selectedRequest.specialRequests}</p>
                </div>
              )}

              {/* Actions */}
              {selectedRequest.status === "pending" && (
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                  <Button
                    onClick={() => {
                      handleApprove(selectedRequest.id)
                      setSelectedRequest(null)
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Approve Booking
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleReject(selectedRequest.id)
                      setSelectedRequest(null)
                    }}
                    className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Decline Booking
                  </Button>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline" className="flex-1 border-green-200 text-green-600 hover:bg-green-50">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Guest
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
