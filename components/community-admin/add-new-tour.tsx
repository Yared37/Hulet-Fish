"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import {
  HelpCircle,
  Upload,
  X,
  CalendarIcon,
  MapPin,
  DollarSign,
  Users,
  Camera,
  Save,
  Eye,
  Bold,
  Italic,
  List,
} from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"

export default function AddNewTourForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tourType: "",
    location: "",
    price: "",
    maxGuests: "",
  })
  const [selectedDates, setSelectedDates] = useState<Date[]>([])
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      // Simulate image upload
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file))
      setUploadedImages([...uploadedImages, ...newImages])
    }
  }

  const removeImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast.success("Tour created successfully! 🎉", {
      description: "Your new tour is now live and ready for bookings.",
    })

    // Reset form
    setFormData({
      title: "",
      description: "",
      tourType: "",
      location: "",
      price: "",
      maxGuests: "",
    })
    setSelectedDates([])
    setUploadedImages([])
    setIsSubmitting(false)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Create New Tour Experience</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Share your local knowledge and create memorable experiences for visitors
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
            <CardTitle className="flex items-center text-lg">
              <MapPin className="w-5 h-5 mr-2 text-green-600" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Tour Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium flex items-center">
                Tour Title *
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="ml-2 p-0 h-auto">
                      <HelpCircle className="w-4 h-4 text-gray-400" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <p className="text-sm">
                      Give your tour a catchy, descriptive title that highlights what makes it special.
                    </p>
                  </PopoverContent>
                </Popover>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Traditional Coffee Ceremony with Local Family"
                className="text-base"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium flex items-center">
                Description *
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="ml-2 p-0 h-auto">
                      <HelpCircle className="w-4 h-4 text-gray-400" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <p className="text-sm">
                      Describe what guests will experience. Include activities, duration, and what makes your tour
                      unique.
                    </p>
                  </PopoverContent>
                </Popover>
              </Label>

              {/* Simple Rich Text Toolbar */}
              <div className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-t-lg border border-b-0">
                <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Bold className="w-4 h-4" />
                </Button>
                <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Italic className="w-4 h-4" />
                </Button>
                <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <List className="w-4 h-4" />
                </Button>
              </div>

              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your tour experience in detail. What will guests do? What will they learn? What makes it special?"
                className="min-h-32 text-base rounded-t-none"
                required
              />
            </div>

            {/* Tour Type and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="tourType" className="text-sm font-medium flex items-center">
                  Tour Type *
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" className="ml-2 p-0 h-auto">
                        <HelpCircle className="w-4 h-4 text-gray-400" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Tour Types:</p>
                        <p className="text-xs">
                          <strong>Family:</strong> Suitable for all ages, kid-friendly
                        </p>
                        <p className="text-xs">
                          <strong>Expert:</strong> In-depth, specialized knowledge required
                        </p>
                        <p className="text-xs">
                          <strong>Solo:</strong> Perfect for individual travelers
                        </p>
                      </div>
                    </PopoverContent>
                  </Popover>
                </Label>
                <Select
                  value={formData.tourType}
                  onValueChange={(value) => setFormData({ ...formData, tourType: value })}
                >
                  <SelectTrigger className="text-base">
                    <SelectValue placeholder="Choose tour type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="family">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2 text-green-600" />
                        Family - All ages welcome
                      </div>
                    </SelectItem>
                    <SelectItem value="expert">
                      <div className="flex items-center">
                        <Badge className="w-4 h-4 mr-2 text-blue-600" />
                        Expert - Specialized experience
                      </div>
                    </SelectItem>
                    <SelectItem value="solo">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2 text-purple-600" />
                        Solo - Individual travelers
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-medium flex items-center">
                  Location *
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" className="ml-2 p-0 h-auto">
                        <HelpCircle className="w-4 h-4 text-gray-400" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <p className="text-sm">Where will the tour take place? Be specific about the meeting point.</p>
                    </PopoverContent>
                  </Popover>
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Lalibela Town Center, near St. George Church"
                  className="text-base"
                  required
                />
              </div>
            </div>

            {/* Price and Max Guests */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm font-medium flex items-center">
                  Price per Person (ETB) *
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" className="ml-2 p-0 h-auto">
                        <HelpCircle className="w-4 h-4 text-gray-400" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <p className="text-sm">
                        Set a fair price that reflects the value of your experience. Consider duration, activities, and
                        any included items.
                      </p>
                    </PopoverContent>
                  </Popover>
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="850"
                    className="pl-10 text-base"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxGuests" className="text-sm font-medium flex items-center">
                  Maximum Guests *
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" className="ml-2 p-0 h-auto">
                        <HelpCircle className="w-4 h-4 text-gray-400" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <p className="text-sm">
                        How many guests can you comfortably accommodate? Consider space, safety, and quality of
                        experience.
                      </p>
                    </PopoverContent>
                  </Popover>
                </Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="maxGuests"
                    type="number"
                    value={formData.maxGuests}
                    onChange={(e) => setFormData({ ...formData, maxGuests: e.target.value })}
                    placeholder="8"
                    className="pl-10 text-base"
                    required
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Available Dates */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20">
            <CardTitle className="flex items-center text-lg">
              <CalendarIcon className="w-5 h-5 mr-2 text-blue-600" />
              Available Dates
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Label className="text-sm font-medium">Select Available Dates *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-0 h-auto">
                      <HelpCircle className="w-4 h-4 text-gray-400" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <p className="text-sm">
                      Choose the dates when you're available to host this tour. You can select multiple dates.
                    </p>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex flex-col lg:flex-row gap-6">
                <Calendar
                  mode="multiple"
                  selected={selectedDates}
                  onSelect={(dates) => setSelectedDates(dates || [])}
                  className="rounded-md border"
                  disabled={(date) => date < new Date()}
                />

                <div className="flex-1">
                  <p className="text-sm font-medium mb-3">Selected Dates ({selectedDates.length})</p>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {selectedDates.length === 0 ? (
                      <p className="text-sm text-gray-500 italic">No dates selected yet</p>
                    ) : (
                      selectedDates.map((date, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                        >
                          <span className="text-sm font-medium">{format(date, "EEEE, MMMM d, yyyy")}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedDates(selectedDates.filter((_, i) => i !== index))}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upload Images */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
            <CardTitle className="flex items-center text-lg">
              <Camera className="w-5 h-5 mr-2 text-purple-600" />
              Tour Images
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Label className="text-sm font-medium">Upload Photos</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-0 h-auto">
                      <HelpCircle className="w-4 h-4 text-gray-400" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <p className="text-sm">
                      Add high-quality photos that showcase your tour experience. The first image will be used as the
                      main photo.
                    </p>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-green-400 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Click to upload images</p>
                  <p className="text-sm text-gray-500">PNG, JPG up to 10MB each. You can upload multiple images.</p>
                </label>
              </div>

              {/* Image Previews */}
              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Tour image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                      {index === 0 && (
                        <Badge className="absolute bottom-2 left-2 bg-green-600 text-white text-xs">Main Photo</Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 text-base font-medium"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Creating Tour...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Create Tour
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 py-3 text-base font-medium"
          >
            <Eye className="w-5 h-5 mr-2" />
            Preview
          </Button>
        </div>
      </form>
    </div>
  )
}
