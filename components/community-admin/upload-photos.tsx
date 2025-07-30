"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Camera, Upload, X, ImageIcon, Trash2, Eye, Star, HelpCircle } from "lucide-react"
import { toast } from "sonner"

const existingPhotos = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=300&fit=crop",
    tourTitle: "Traditional Coffee Ceremony Experience",
    caption: "Roasting fresh coffee beans over traditional fire",
    isMain: true,
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    tourTitle: "Local Village Walking Tour",
    caption: "Beautiful village landscape with traditional houses",
    isMain: false,
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
    tourTitle: "Cooking Class with Local Family",
    caption: "Preparing traditional injera bread",
    isMain: true,
  },
]

const tours = [
  "Traditional Coffee Ceremony Experience",
  "Local Village Walking Tour",
  "Cooking Class with Local Family",
]

export default function UploadPhotosPage() {
  const [photos, setPhotos] = useState(existingPhotos)
  const [newPhotos, setNewPhotos] = useState<File[]>([])
  const [selectedTour, setSelectedTour] = useState("")
  const [photoCaption, setPhotoCaption] = useState("")
  const [isUploading, setIsUploading] = useState(false)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const fileArray = Array.from(files)
      setNewPhotos([...newPhotos, ...fileArray])
    }
  }

  const removeNewPhoto = (index: number) => {
    setNewPhotos(newPhotos.filter((_, i) => i !== index))
  }

  const deleteExistingPhoto = (id: number) => {
    setPhotos(photos.filter((photo) => photo.id !== id))
    toast.success("Photo deleted successfully")
  }

  const handleUpload = async () => {
    if (newPhotos.length === 0) {
      toast.error("Please select photos to upload")
      return
    }
    if (!selectedTour) {
      toast.error("Please select a tour for these photos")
      return
    }

    setIsUploading(true)

    // Simulate upload process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Add new photos to existing photos
    const uploadedPhotos = newPhotos.map((file, index) => ({
      id: photos.length + index + 1,
      url: URL.createObjectURL(file),
      tourTitle: selectedTour,
      caption: photoCaption || `Photo from ${selectedTour}`,
      isMain: false,
    }))

    setPhotos([...photos, ...uploadedPhotos])
    setNewPhotos([])
    setSelectedTour("")
    setPhotoCaption("")
    setIsUploading(false)

    toast.success(`${uploadedPhotos.length} photo(s) uploaded successfully! 📸`)
  }

  const setAsMainPhoto = (id: number) => {
    const photo = photos.find((p) => p.id === id)
    if (photo) {
      setPhotos(
        photos.map((p) => ({
          ...p,
          isMain: p.tourTitle === photo.tourTitle ? p.id === id : p.isMain,
        })),
      )
      toast.success("Main photo updated")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Upload Photos</h1>
        <p className="text-gray-600 dark:text-gray-400">Add beautiful photos to showcase your tour experiences</p>
      </div>

      {/* Upload New Photos */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <CardTitle className="flex items-center text-lg">
            <Camera className="w-5 h-5 mr-2 text-purple-600" />
            Upload New Photos
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Tour Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center">
              Select Tour *
              <Button variant="ghost" size="sm" className="ml-2 p-0 h-auto">
                <HelpCircle className="w-4 h-4 text-gray-400" />
              </Button>
            </Label>
            <Select value={selectedTour} onValueChange={setSelectedTour}>
              <SelectTrigger>
                <SelectValue placeholder="Choose which tour these photos are for" />
              </SelectTrigger>
              <SelectContent>
                {tours.map((tour) => (
                  <SelectItem key={tour} value={tour}>
                    {tour}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Photo Caption */}
          <div className="space-y-2">
            <Label htmlFor="caption" className="text-sm font-medium">
              Photo Caption (Optional)
            </Label>
            <Input
              id="caption"
              value={photoCaption}
              onChange={(e) => setPhotoCaption(e.target.value)}
              placeholder="Describe what's happening in the photos..."
            />
          </div>

          {/* File Upload Area */}
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="photo-upload"
            />
            <label htmlFor="photo-upload" className="cursor-pointer">
              <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">Click to upload photos</p>
              <p className="text-sm text-gray-500">PNG, JPG up to 10MB each. You can select multiple photos at once.</p>
            </label>
          </div>

          {/* New Photos Preview */}
          {newPhotos.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Photos to Upload ({newPhotos.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {newPhotos.map((file, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(file) || "/placeholder.svg"}
                      alt={`Upload preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeNewPhoto(index)}
                      className="absolute top-2 right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-xs text-white bg-black/50 rounded px-2 py-1 truncate">{file.name}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                onClick={handleUpload}
                disabled={isUploading || !selectedTour}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3"
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Uploading Photos...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5 mr-2" />
                    Upload {newPhotos.length} Photo{newPhotos.length > 1 ? "s" : ""}
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Existing Photos */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-lg">
            <div className="flex items-center">
              <ImageIcon className="w-5 h-5 mr-2 text-blue-600" />
              Your Photos ({photos.length})
            </div>
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
              {photos.filter((p) => p.isMain).length} Main Photos
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {photos.length === 0 ? (
            <div className="text-center py-12">
              <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No photos yet</h3>
              <p className="text-gray-500">Upload your first photos to get started</p>
            </div>
          ) : (
            <div className="space-y-8">
              {tours.map((tour) => {
                const tourPhotos = photos.filter((photo) => photo.tourTitle === tour)
                if (tourPhotos.length === 0) return null

                return (
                  <div key={tour} className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
                      {tour} ({tourPhotos.length} photo{tourPhotos.length > 1 ? "s" : ""})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {tourPhotos.map((photo) => (
                        <div key={photo.id} className="relative group">
                          <div className="relative overflow-hidden rounded-lg">
                            <img
                              src={photo.url || "/placeholder.svg"}
                              alt={photo.caption}
                              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {photo.isMain && (
                              <Badge className="absolute top-2 left-2 bg-yellow-500 text-white">
                                <Star className="w-3 h-3 mr-1" />
                                Main Photo
                              </Badge>
                            )}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => setAsMainPhoto(photo.id)}
                                  className="bg-white/90 text-gray-900 hover:bg-white"
                                >
                                  <Star className="w-4 h-4 mr-1" />
                                  {photo.isMain ? "Main" : "Set Main"}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  className="bg-white/90 text-gray-900 hover:bg-white"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => deleteExistingPhoto(photo.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          <div className="mt-2">
                            <p className="text-sm text-gray-600 dark:text-gray-400">{photo.caption}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <Camera className="w-5 h-5 mr-2 text-green-600" />
            Photo Tips for Better Bookings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="space-y-2">
              <p>• Use natural lighting when possible</p>
              <p>• Show people enjoying the experience</p>
              <p>• Include close-up shots of activities</p>
            </div>
            <div className="space-y-2">
              <p>• Capture the local environment and culture</p>
              <p>• Take photos from different angles</p>
              <p>• Make sure photos are clear and high quality</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
