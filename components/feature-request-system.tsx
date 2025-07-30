"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Plus,
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Users,
  Zap,
  Star,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { FeatureRequest } from "@/types/feature-requests"

// Mock data for demonstration
const mockFeatureRequests: FeatureRequest[] = [
  {
    id: "1",
    title: "Real-time Chat with Hosts",
    description: "Enable instant messaging between tourists and hosts for better communication and coordination.",
    category: "communication",
    priority: "high",
    status: "in-development",
    requestedBy: {
      userId: "user1",
      userType: "tourist",
      name: "Sarah Johnson",
      email: "sarah@example.com",
    },
    votes: 45,
    estimatedEffort: "medium",
    businessValue: "high",
    technicalComplexity: "moderate",
    dependencies: ["user-authentication", "push-notifications"],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
    targetRelease: "v2.1",
    assignedTo: "dev-team-1",
    comments: [],
  },
  {
    id: "2",
    title: "AI-Powered Experience Recommendations",
    description:
      "Use machine learning to suggest personalized cultural experiences based on user preferences and behavior.",
    category: "ai-ml",
    priority: "medium",
    status: "approved",
    requestedBy: {
      userId: "user2",
      userType: "host",
      name: "Almaz Tadesse",
      email: "almaz@example.com",
    },
    votes: 32,
    estimatedEffort: "large",
    businessValue: "high",
    technicalComplexity: "complex",
    dependencies: ["user-data-collection", "ml-infrastructure"],
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-18"),
    targetRelease: "v2.2",
    comments: [],
  },
  {
    id: "3",
    title: "Mobile App with Offline Maps",
    description: "Native mobile application with offline capabilities for GPS navigation to experience locations.",
    category: "mobile",
    priority: "high",
    status: "under-review",
    requestedBy: {
      userId: "user3",
      userType: "tourist",
      name: "Michael Chen",
      email: "michael@example.com",
    },
    votes: 67,
    estimatedEffort: "extra-large",
    businessValue: "critical",
    technicalComplexity: "complex",
    dependencies: ["mobile-framework", "map-integration"],
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-22"),
    comments: [],
  },
]

const categoryColors = {
  "user-experience": "bg-blue-100 text-blue-800",
  "payment-system": "bg-green-100 text-green-800",
  communication: "bg-purple-100 text-purple-800",
  analytics: "bg-orange-100 text-orange-800",
  mobile: "bg-pink-100 text-pink-800",
  "ai-ml": "bg-indigo-100 text-indigo-800",
  security: "bg-red-100 text-red-800",
  integration: "bg-yellow-100 text-yellow-800",
  performance: "bg-gray-100 text-gray-800",
  accessibility: "bg-teal-100 text-teal-800",
}

const priorityColors = {
  critical: "bg-red-500 text-white",
  high: "bg-orange-500 text-white",
  medium: "bg-yellow-500 text-white",
  low: "bg-gray-500 text-white",
}

const statusColors = {
  requested: "bg-gray-100 text-gray-800",
  "under-review": "bg-blue-100 text-blue-800",
  approved: "bg-green-100 text-green-800",
  "in-development": "bg-purple-100 text-purple-800",
  testing: "bg-orange-100 text-orange-800",
  deployed: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
}

export default function FeatureRequestSystem() {
  const [features, setFeatures] = useState<FeatureRequest[]>(mockFeatureRequests)
  const [filteredFeatures, setFilteredFeatures] = useState<FeatureRequest[]>(mockFeatureRequests)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedPriority, setSelectedPriority] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("votes")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  // Filter and sort features
  useEffect(() => {
    const filtered = features.filter((feature) => {
      const matchesSearch =
        feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feature.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "all" || feature.category === selectedCategory
      const matchesPriority = selectedPriority === "all" || feature.priority === selectedPriority
      const matchesStatus = selectedStatus === "all" || feature.status === selectedStatus

      return matchesSearch && matchesCategory && matchesPriority && matchesStatus
    })

    // Sort features
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "votes":
          return b.votes - a.votes
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "priority":
          const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        default:
          return 0
      }
    })

    setFilteredFeatures(filtered)
  }, [features, searchQuery, selectedCategory, selectedPriority, selectedStatus, sortBy])

  const handleVote = (featureId: string, voteType: "up" | "down") => {
    setFeatures((prev) =>
      prev.map((feature) =>
        feature.id === featureId ? { ...feature, votes: feature.votes + (voteType === "up" ? 1 : -1) } : feature,
      ),
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "deployed":
        return <CheckCircle className="w-4 h-4" />
      case "in-development":
        return <Zap className="w-4 h-4" />
      case "testing":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getProgressPercentage = (status: string) => {
    switch (status) {
      case "requested":
        return 10
      case "under-review":
        return 25
      case "approved":
        return 40
      case "in-development":
        return 70
      case "testing":
        return 90
      case "deployed":
        return 100
      case "rejected":
        return 0
      default:
        return 0
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Feature Request System</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Help shape the future of Hulet Fish Tourism by suggesting and voting on new features
        </p>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
              <Plus className="w-5 h-5 mr-2" />
              Suggest New Feature
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Suggest a New Feature</DialogTitle>
            </DialogHeader>
            <CreateFeatureForm onClose={() => setIsCreateDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Lightbulb className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{features.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Requests</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Zap className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {features.filter((f) => f.status === "in-development").length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">In Development</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {features.filter((f) => f.status === "deployed").length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {features.reduce((sum, f) => sum + f.votes, 0)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Votes</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="user-experience">User Experience</SelectItem>
                <SelectItem value="payment-system">Payment System</SelectItem>
                <SelectItem value="communication">Communication</SelectItem>
                <SelectItem value="analytics">Analytics</SelectItem>
                <SelectItem value="mobile">Mobile</SelectItem>
                <SelectItem value="ai-ml">AI/ML</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="integration">Integration</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
                <SelectItem value="accessibility">Accessibility</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedPriority} onValueChange={setSelectedPriority}>
              <SelectTrigger className="w-full lg:w-32">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full lg:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="requested">Requested</SelectItem>
                <SelectItem value="under-review">Under Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="in-development">In Development</SelectItem>
                <SelectItem value="testing">Testing</SelectItem>
                <SelectItem value="deployed">Deployed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-32">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="votes">Most Voted</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Feature List */}
      <div className="space-y-6">
        <AnimatePresence>
          {filteredFeatures.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Voting Section */}
                    <div className="flex lg:flex-col items-center lg:items-start gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVote(feature.id, "up")}
                        className="hover:bg-green-50 hover:border-green-300"
                      >
                        <ThumbsUp className="w-4 h-4" />
                      </Button>
                      <div className="text-lg font-bold text-center min-w-[3rem]">{feature.votes}</div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVote(feature.id, "down")}
                        className="hover:bg-red-50 hover:border-red-300"
                      >
                        <ThumbsDown className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Feature Content */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{feature.title}</h3>
                          <p className="text-gray-600 dark:text-gray-300 mb-4">{feature.description}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge className={categoryColors[feature.category]}>
                            {feature.category.replace("-", " ")}
                          </Badge>
                          <Badge className={priorityColors[feature.priority]}>{feature.priority}</Badge>
                          <Badge className={statusColors[feature.status]}>
                            {getStatusIcon(feature.status)}
                            <span className="ml-1">{feature.status.replace("-", " ")}</span>
                          </Badge>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                          <span>Progress</span>
                          <span>{getProgressPercentage(feature.status)}%</span>
                        </div>
                        <Progress value={getProgressPercentage(feature.status)} className="h-2" />
                      </div>

                      {/* Feature Details */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Effort:</span>
                          <div className="font-medium">{feature.estimatedEffort}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Value:</span>
                          <div className="font-medium">{feature.businessValue}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Complexity:</span>
                          <div className="font-medium">{feature.technicalComplexity}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Requested by:</span>
                          <div className="font-medium">{feature.requestedBy.name}</div>
                        </div>
                      </div>

                      {/* Target Release */}
                      {feature.targetRelease && (
                        <div className="mt-4">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            <Star className="w-3 h-3 mr-1" />
                            Target: {feature.targetRelease}
                          </Badge>
                        </div>
                      )}

                      {/* Dependencies */}
                      {feature.dependencies.length > 0 && (
                        <div className="mt-4">
                          <span className="text-sm text-gray-500">Dependencies:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {feature.dependencies.map((dep) => (
                              <Badge key={dep} variant="outline" className="text-xs">
                                {dep}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Comment ({feature.comments.length})
                        </Button>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredFeatures.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No features found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search criteria or suggest a new feature.</p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Suggest New Feature
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function CreateFeatureForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "",
    businessJustification: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Feature request submitted:", formData)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Feature Title</label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Brief, descriptive title for your feature"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Detailed description of the feature and how it would work"
          rows={4}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user-experience">User Experience</SelectItem>
              <SelectItem value="payment-system">Payment System</SelectItem>
              <SelectItem value="communication">Communication</SelectItem>
              <SelectItem value="analytics">Analytics</SelectItem>
              <SelectItem value="mobile">Mobile</SelectItem>
              <SelectItem value="ai-ml">AI/ML</SelectItem>
              <SelectItem value="security">Security</SelectItem>
              <SelectItem value="integration">Integration</SelectItem>
              <SelectItem value="performance">Performance</SelectItem>
              <SelectItem value="accessibility">Accessibility</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Priority</label>
          <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Business Justification</label>
        <Textarea
          value={formData.businessJustification}
          onChange={(e) => setFormData({ ...formData, businessJustification: e.target.value })}
          placeholder="Why is this feature important? How will it benefit users and the business?"
          rows={3}
        />
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="submit" className="flex-1">
          Submit Feature Request
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
