"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { mockDataStore } from "@/lib/mock-data"
import { MapPin, Plus, Trash2, CheckCircle, Loader2, Upload } from "lucide-react"
import { toast } from "sonner"

export default function TourCreator() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: "",
    price: "",
    maxGroupSize: "",
    difficulty: "",
    category: "",
    guide: "",
    highlights: [] as string[],
    itinerary: [] as { day: number; title: string; description: string }[],
    image: "",
  })

  const [newHighlight, setNewHighlight] = useState("")
  const [newItineraryDay, setNewItineraryDay] = useState({ title: "", description: "" })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const tourData = {
        ...formData,
        price: Number.parseInt(formData.price),
        maxGroupSize: Number.parseInt(formData.maxGroupSize),
        image:
          formData.image ||
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center",
      }

      const newTour = mockDataStore.addTour(tourData)

      toast.success("Tour created successfully!", {
        description: `${newTour.name} has been added to the catalog`,
        action: {
          label: "View Tour",
          onClick: () => console.log("View tour clicked"),
        },
      })

      // Reset form
      setFormData({
        name: "",
        description: "",
        duration: "",
        price: "",
        maxGroupSize: "",
        difficulty: "",
        category: "",
        guide: "",
        highlights: [],
        itinerary: [],
        image: "",
      })
    } catch (error) {
      toast.error("Failed to create tour", {
        description: "Please try again later",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addHighlight = () => {
    if (newHighlight.trim()) {
      setFormData((prev) => ({
        ...prev,
        highlights: [...prev.highlights, newHighlight.trim()],
      }))
      setNewHighlight("")
    }
  }

  const removeHighlight = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index),
    }))
  }

  const addItineraryDay = () => {
    if (newItineraryDay.title.trim() && newItineraryDay.description.trim()) {
      setFormData((prev) => ({
        ...prev,
        itinerary: [
          ...prev.itinerary,
          {
            day: prev.itinerary.length + 1,
            title: newItineraryDay.title.trim(),
            description: newItineraryDay.description.trim(),
          },
        ],
      }))
      setNewItineraryDay({ title: "", description: "" })
    }
  }

  const removeItineraryDay = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary
        .filter((_, i) => i !== index)
        .map((item, i) => ({
          ...item,
          day: i + 1,
        })),
    }))
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="w-5 h-5 mr-2" />
          Create New Tour
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>

            <div>
              <Label htmlFor="name">Tour Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                required
                placeholder="e.g., Simien Mountains Trek"
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                required
                placeholder="Describe the tour experience..."
                rows={3}
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="duration">Duration *</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData((prev) => ({ ...prev, duration: e.target.value }))}
                  required
                  placeholder="e.g., 7 days"
                />
              </div>
              <div>
                <Label htmlFor="price">Price (USD) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                  required
                  placeholder="2400"
                />
              </div>
              <div>
                <Label htmlFor="maxGroupSize">Max Group Size *</Label>
                <Input
                  id="maxGroupSize"
                  type="number"
                  value={formData.maxGroupSize}
                  onChange={(e) => setFormData((prev) => ({ ...prev, maxGroupSize: e.target.value }))}
                  required
                  placeholder="12"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="difficulty">Difficulty Level *</Label>
                <Select
                  value={formData.difficulty}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, difficulty: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                    <SelectItem value="Extreme">Extreme</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Adventure">Adventure</SelectItem>
                    <SelectItem value="Cultural">Cultural</SelectItem>
                    <SelectItem value="Historical">Historical</SelectItem>
                    <SelectItem value="Wildlife">Wildlife</SelectItem>
                    <SelectItem value="Photography">Photography</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="guide">Tour Guide</Label>
                <Input
                  id="guide"
                  value={formData.guide}
                  onChange={(e) => setFormData((prev) => ({ ...prev, guide: e.target.value }))}
                  placeholder="Guide name"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="image">Tour Image URL</Label>
              <div className="flex space-x-2">
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                />
                <Button type="button" variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </div>
            </div>
          </div>

          {/* Highlights */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Tour Highlights</h3>

            <div className="flex space-x-2">
              <Input
                value={newHighlight}
                onChange={(e) => setNewHighlight(e.target.value)}
                placeholder="Add a highlight..."
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addHighlight())}
              />
              <Button type="button" onClick={addHighlight}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.highlights.map((highlight, index) => (
                <Badge key={index} variant="default" className="flex items-center space-x-1">
                  <span>{highlight}</span>
                  <button type="button" onClick={() => removeHighlight(index)} className="ml-1 hover:text-red-300">
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Itinerary */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Daily Itinerary</h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Day Title</Label>
                <Input
                  value={newItineraryDay.title}
                  onChange={(e) => setNewItineraryDay((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Arrival in Gondar"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Input
                  value={newItineraryDay.description}
                  onChange={(e) => setNewItineraryDay((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the day"
                />
              </div>
            </div>

            <Button type="button" onClick={addItineraryDay} variant="outline" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Day to Itinerary
            </Button>

            <div className="space-y-3">
              {formData.itinerary.map((day, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {day.day}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{day.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{day.description}</p>
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeItineraryDay(index)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
            disabled={isLoading || !formData.name || !formData.description || !formData.duration || !formData.price}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating Tour...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Create Tour
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
