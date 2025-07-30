"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  Users,
  Search,
  Filter,
  MoreHorizontal,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  Ban,
  Edit,
  Trash2,
  Eye,
} from "lucide-react"
import { mockDataStore } from "@/lib/mock-data"
import { toast } from "react-hot-toast"

const userStats = [
  { label: "Total Users", value: "2,847", change: "+12.5%", icon: Users, color: "text-blue-600" },
  { label: "Active Users", value: "2,156", change: "+8.2%", icon: Users, color: "text-green-600" },
  { label: "New This Month", value: "234", change: "+15.3%", icon: UserPlus, color: "text-purple-600" },
  { label: "Avg. Rating Given", value: "4.6", change: "+0.2", icon: Star, color: "text-amber-600" },
]

const users = mockDataStore.getUsers()

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = selectedRole === "all" || user.role === selectedRole
    const matchesStatus = selectedStatus === "all" || user.status === selectedStatus
    return matchesSearch && matchesRole && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">User Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage and monitor all platform users</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <UserPlus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {userStats.map((stat, index) => (
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
                    <p className={`text-sm ${stat.change.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
                      {stat.change} vs last month
                    </p>
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
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search users by name or email..."
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
                    Role: {selectedRole === "all" ? "All" : selectedRole}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSelectedRole("all")}>All Roles</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedRole("tourist")}>Tourist</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedRole("guide")}>Guide</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedRole("admin")}>Admin</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Status: {selectedStatus === "all" ? "All" : selectedStatus}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSelectedStatus("all")}>All Status</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedStatus("active")}>Active</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedStatus("inactive")}>Inactive</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Users Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead>Stats</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                          <AvatarFallback>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">{user.name}</p>
                          <p className="text-sm text-gray-500 flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {user.location}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {user.email}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {user.phone}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.role === "guide" ? "default" : "secondary"}>{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === "active" ? "default" : "secondary"}>{user.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm">Last active: {user.lastActive}</p>
                        <p className="text-sm text-gray-500 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          Joined {user.joinDate}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm">
                          {user.role === "guide" ? `${user.totalBookings} tours` : `${user.totalBookings} bookings`}
                        </p>
                        <div className="flex items-center">
                          <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                          <span className="text-sm">{user.rating}</span>
                        </div>
                        {user.role === "tourist" && (
                          <p className="text-sm text-gray-500">ETB {user.totalSpent.toLocaleString()} spent</p>
                        )}
                      </div>
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
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="w-4 h-4 mr-2" />
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              const updatedUser = mockDataStore.updateUser(user.id, {
                                status: user.status === "active" ? "inactive" : "active",
                              })
                              if (updatedUser) {
                                toast.success(
                                  `User ${user.status === "active" ? "suspended" : "activated"} successfully`,
                                )
                              }
                            }}
                          >
                            <Ban className="w-4 h-4 mr-2" />
                            {user.status === "active" ? "Suspend" : "Activate"} User
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              mockDataStore.deleteUser(user.id)
                              toast.success("User deleted successfully")
                            }}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete User
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
