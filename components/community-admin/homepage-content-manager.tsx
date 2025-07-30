"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Home, Plus, Edit3, Eye, Trash2, Upload, X, Star, Users, MapPin, Save, Globe, Heart } from "lucide-react"
import { toast } from "sonner"

interface HomepageTour {
  id: string
  title: string
  description: string
  shortDescription: string
  price: number
  duration: string
  maxGuests: number
  category: string
  location: string
  rating: number
  reviews: number
  isActive: boolean
  isFeatured: boolean
  images: string[]
  highlights: string[]
}

const initialTours: HomepageTour[] = [
  {
    id: "1",
    title: "Traditional Coffee Ceremony",
    description: "Experience the birthplace of coffee through authentic ceremonies with local families",
    shortDescription: "Authentic coffee ceremony with local family",
    price: 800,
    duration: "3 hours",
    maxGuests: 8,
    category: "Coffee Culture",
    location: "Lalibela Village",
    rating: 4.9,
    reviews: 127,
    isActive: true,
    isFeatured: true,
    images: [
      "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop",
    ],
    highlights: ["Traditional roasting", "Cultural storytelling", "Local community", "Three rounds ceremony"],
  },
  {
    id: "2",
    title: "Injera Making Workshop",
    description: "Learn to make Ethiopia's staple bread using traditional methods and clay ovens",
    shortDescription: "Learn traditional bread making",
    price: 1200,
    duration: "4 hours",
    maxGuests: 6,
    category: "Culinary Arts",
    location: "Gondar Town",
    rating: 4.8,
    reviews: 89,
    isActive: true,
    isFeatured: false,
    images: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop"],
    highlights: ["Traditional clay oven", "Teff grain preparation", "Family recipes", "Take home skills"],
  },
  {
    id: "3",
    title: "Traditional Dance & Music",
    description: "Join vibrant Ethiopian folk dances and learn traditional music with local communities",
    shortDescription: "Folk dance and music experience",
    price: 600,
    duration: "3 hours",
    maxGuests: 15,
    category: "Cultural Arts",
    location: "Bahir Dar",
    rating: 4.9,
    reviews: 203,
    isActive: false,
    isFeatured: false,
    images: ["https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop"],
    highlights: ["Live performances", "Interactive learning", "Cultural costumes", "Community celebration"],
  },
]

export default function HomepageContentManager() {
  const [tours, setTours] = useState<HomepageTour[]>(initialTours)
  const [editingTour, setEditingTour] = useState<HomepageTour | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [newImages, setNewImages] = useState<string[]>([])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newImageUrls = Array.from(files).map((file) => URL.createObjectURL(file))
      setNewImages([...newImages, ...newImageUrls])
    }
  }

  const handleSaveTour = (tourData: Partial<HomepageTour>) => {
    if (editingTour) {
      // Update existing tour
      setTours(tours.map((tour) => (tour.id === editingTour.id ? { ...tour, ...tourData } : tour)))
      toast.success("Tour updated successfully! 🎉")
    } else {
      // Add new tour
      const newTour: HomepageTour = {
        id: Date.now().toString(),
        title: "",
        description: "",
        shortDescription: "",
        price: 0,
        duration: "",
        maxGuests: 1,
        category: "",
        location: "",
        rating: 0,
        reviews: 0,
        isActive: true,
        isFeatured: false,
        images: newImages,
        highlights: [],
        ...tourData,
      } as HomepageTour
      setTours([...tours, newTour])
      toast.success("New tour added to homepage! 🎉")
    }
    setEditingTour(null)
    setIsAddingNew(false)
    setNewImages([])
  }

  const toggleTourStatus = (tourId: string, field: "isActive" | "isFeatured") => {
    setTours(tours.map((tour) => (tour.id === tourId ? { ...tour, [field]: !tour[field] } : tour)))
    toast.success(`Tour ${field === "isActive" ? "status" : "featured status"} updated!`)
  }

  const deleteTour = (tourId: string) => {
    setTours(tours.filter((tour) => tour.id !== tourId))
    toast.success("Tour removed from homepage")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Homepage Tours Management</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage the tours and experiences displayed on your website homepage
          </p>
        </div>
        <Button
          onClick={() => setIsAddingNew(true)}
          className="mt-4 md:mt-0 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Homepage Tour
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Tours</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{tours.length}</p>
              </div>
              <Home className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Tours</p>
                <p className="text-2xl font-bold text-green-600">{tours.filter((t) => t.isActive).length}</p>
              </div>
              <Globe className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Featured Tours</p>
                <p className="text-2xl font-bold text-purple-600">{tours.filter((t) => t.isFeatured).length}</p>
              </div>
              <Star className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Rating</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {(tours.reduce((acc, tour) => acc + tour.rating, 0) / tours.length).toFixed(1)}
                </p>
              </div>
              <Heart className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tours List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {tours.map((tour) => (
          <Card key={tour.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              <div className="relative">
                <img
                  src={tour.images[0] || "/placeholder.svg"}
                  alt={tour.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge className={tour.isActive ? "bg-green-600 text-white" : "bg-gray-600 text-white"}>
                    {tour.isActive ? "Active" : "Inactive"}
                  </Badge>
                  {tour.isFeatured && (
                    <Badge className="bg-purple-600 text-white">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>
                <div className="absolute top-3 right-3 flex items-center space-x-1 bg-black/50 rounded-full px-2 py-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="text-white text-xs font-medium">{tour.rating}</span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 flex-1">
                    {tour.title}
                  </h3>
                  <div className="text-right ml-4">
                    <p className="text-lg font-bold text-green-600">ETB {tour.price.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{tour.duration}</p>
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{tour.shortDescription}</p>

                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <div className="flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {tour.location}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    Max {tour.maxGuests}
                  </div>
                  <div className="flex items-center">
                    <Star className="w-3 h-3 mr-1" />
                    {tour.reviews} reviews
                  </div>
                </div>

                <Badge variant="outline" className="mb-4">
                  {tour.category}
                </Badge>

                {/* Toggle Controls */}
                <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Switch checked={tour.isActive} onCheckedChange={() => toggleTourStatus(tour.id, "isActive")} />
                      <Label className="text-sm">Active on Homepage</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={tour.isFeatured}
                        onCheckedChange={() => toggleTourStatus(tour.id, "isFeatured")}
                      />
                      <Label className="text-sm">Featured</Label>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => setEditingTour(tour)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Edit3 className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteTour(tour.id)}
                    className="border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Tour Modal */}
      {(isAddingNew || editingTour) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{editingTour ? "Edit Homepage Tour" : "Add New Homepage Tour"}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingTour(null)
                    setIsAddingNew(false)
                    setNewImages([])
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  const tourData = {
                    title: formData.get("title") as string,
                    description: formData.get("description") as string,
                    shortDescription: formData.get("shortDescription") as string,
                    price: Number(formData.get("price")),
                    duration: formData.get("duration") as string,
                    maxGuests: Number(formData.get("maxGuests")),
                    category: formData.get("category") as string,
                    location: formData.get("location") as string,
                    images: editingTour ? editingTour.images : newImages,
                    highlights:
                      formData
                        .get("highlights")
                        ?.toString()
                        .split(",")
                        .map((h) => h.trim()) || [],
                  }
                  handleSaveTour(tourData)
                }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Tour Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      defaultValue={editingTour?.title}
                      placeholder="e.g., Traditional Coffee Ceremony"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select name="category" defaultValue={editingTour?.category}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Coffee Culture">Coffee Culture</SelectItem>
                        <SelectItem value="Culinary Arts">Culinary Arts</SelectItem>
                        <SelectItem value="Cultural Arts">Cultural Arts</SelectItem>
                        <SelectItem value="Traditional Crafts">Traditional Crafts</SelectItem>
                        <SelectItem value="Village Life">Village Life</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shortDescription">Short Description (for homepage cards) *</Label>
                  <Input
                    id="shortDescription"
                    name="shortDescription"
                    defaultValue={editingTour?.shortDescription}
                    placeholder="Brief description for homepage display"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Full Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    defaultValue={editingTour?.description}
                    placeholder="Detailed description of the experience"
                    className="min-h-24"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (ETB) *</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      defaultValue={editingTour?.price}
                      placeholder="800"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration *</Label>
                    <Input
                      id="duration"
                      name="duration"
                      defaultValue={editingTour?.duration}
                      placeholder="3 hours"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxGuests">Max Guests *</Label>
                    <Input
                      id="maxGuests"
                      name="maxGuests"
                      type="number"
                      defaultValue={editingTour?.maxGuests}
                      placeholder="8"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    name="location"
                    defaultValue={editingTour?.location}
                    placeholder="e.g., Lalibela Village"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="highlights">Highlights (comma-separated)</Label>
                  <Input
                    id="highlights"
                    name="highlights"
                    defaultValue={editingTour?.highlights.join(", ")}
                    placeholder="Traditional roasting, Cultural storytelling, Local community"
                  />
                </div>

                {/* Image Upload */}
                <div className="space-y-4">
                  <Label>Tour Images</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="tour-images"
                    />
                    <label htmlFor="tour-images" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Click to upload tour images</p>
                    </label>
                  </div>

                  {/* Image Previews */}
                  {(editingTour?.images || newImages).length > 0 && (
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                      {(editingTour?.images || newImages).map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image || "/placeholder.svg"}
                            alt={`Tour image ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg"
                          />
                          {index === 0 && (
                            <Badge className="absolute bottom-1 left-1 bg-green-600 text-white text-xs">Main</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                    <Save className="w-4 h-4 mr-2" />
                    {editingTour ? "Update Tour" : "Add to Homepage"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingTour(null)
                      setIsAddingNew(false)
                      setNewImages([])
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
