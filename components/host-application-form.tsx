"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  UserPlus,
  Upload,
  Camera,
  Video,
  Coffee,
  ChefHat,
  Music,
  Brush,
  Home,
  Check,
  X,
  ArrowRight,
  DollarSign,
  MapPin,
  Phone,
  ImageIcon,
  AlertCircle,
} from "lucide-react"
import Image from "next/image"

interface FilePreview {
  id: string
  file: File
  preview: string
  type: "image" | "video"
}

export default function HostApplicationForm() {
  const [step, setStep] = useState(1)
  const [progress, setProgress] = useState(20)
  const [files, setFiles] = useState<FilePreview[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    address: "",
    experienceType: "",
    experienceTitle: "",
    experienceDescription: "",
    languages: [] as string[],
    groupSize: "",
    duration: "",
    price: "",
    availability: [] as string[],
    facilities: [] as string[],
    hostingSince: "",
    hostBio: "",
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (!selectedFiles) return

    const newFiles: FilePreview[] = []

    Array.from(selectedFiles).forEach((file) => {
      const id = Math.random().toString(36).substring(2, 9)
      const isImage = file.type.startsWith("image/")
      const isVideo = file.type.startsWith("video/")

      if (isImage || isVideo) {
        const preview = URL.createObjectURL(file)
        newFiles.push({
          id,
          file,
          preview,
          type: isImage ? "image" : "video",
        })
      }
    })

    setFiles((prev) => [...prev, ...newFiles])
  }

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const updatedFiles = prev.filter((file) => file.id !== id)
      return updatedFiles
    })
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const nextStep = () => {
    if (step < 4) {
      setStep(step + 1)
      setProgress((step + 1) * 25)
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
      setProgress((step - 1) * 25)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would submit the form data and files to the server
    console.log("Form submitted:", formData)
    console.log("Files:", files)
    alert("Thank you for your application! We'll review your information and contact you soon.")

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      location: "",
      address: "",
      experienceType: "",
      experienceTitle: "",
      experienceDescription: "",
      languages: [],
      groupSize: "",
      duration: "",
      price: "",
      availability: [],
      facilities: [],
      hostingSince: "",
      hostBio: "",
    })
    setFiles([])
    setStep(1)
    setProgress(20)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string, value: string, checked: boolean) => {
    setFormData((prev) => {
      const currentValues = prev[name as keyof typeof prev] as string[]
      if (checked) {
        return { ...prev, [name]: [...currentValues, value] }
      } else {
        return { ...prev, [name]: currentValues.filter((v) => v !== value) }
      }
    })
  }

  const experienceTypes = [
    { icon: Coffee, label: "Coffee Ceremony", value: "coffee" },
    { icon: ChefHat, label: "Cooking Class", value: "cooking" },
    { icon: Music, label: "Traditional Music & Dance", value: "music" },
    { icon: Brush, label: "Craft Workshop", value: "craft" },
    { icon: Home, label: "Home Stay", value: "homestay" },
  ]

  return (
    <Card className="shadow-2xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm overflow-hidden">
      <CardContent className="p-0">
        {/* Form Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 bg-[url('/images/pattern-light.svg')] opacity-10"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="bg-white/20 p-3 rounded-xl mr-4">
                  <UserPlus className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Become a Cultural Host</h2>
                  <p className="text-white/80">Share your Ethiopian heritage with travelers worldwide</p>
                </div>
              </div>
              <Badge className="bg-white/20 border-0 text-white px-3 py-1.5">Step {step} of 4</Badge>
            </div>

            <Progress value={progress} className="h-2 bg-white/20" />

            <div className="flex justify-between mt-6">
              <div className={`flex items-center ${step >= 1 ? "text-white" : "text-white/50"}`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                    step >= 1 ? "bg-white/30" : "bg-white/10"
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                </div>
                <span className="text-sm">Personal Info</span>
              </div>

              <div className={`flex items-center ${step >= 2 ? "text-white" : "text-white/50"}`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                    step >= 2 ? "bg-white/30" : "bg-white/10"
                  }`}
                >
                  <Coffee className="w-4 h-4" />
                </div>
                <span className="text-sm">Experience Details</span>
              </div>

              <div className={`flex items-center ${step >= 3 ? "text-white" : "text-white/50"}`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                    step >= 3 ? "bg-white/30" : "bg-white/10"
                  }`}
                >
                  <Upload className="w-4 h-4" />
                </div>
                <span className="text-sm">Media Upload</span>
              </div>

              <div className={`flex items-center ${step >= 4 ? "text-white" : "text-white/50"}`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                    step >= 4 ? "bg-white/30" : "bg-white/10"
                  }`}
                >
                  <Check className="w-4 h-4" />
                </div>
                <span className="text-sm">Review & Submit</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-8">
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
                  <UserPlus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Personal Information</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Your full name"
                    className="mt-1 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="your.email@example.com"
                    className="mt-1 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative mt-1">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="+251 xxx xxx xxx"
                      className="pl-10 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location" className="text-gray-700 dark:text-gray-300">
                    City/Region <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative mt-1">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      placeholder="Addis Ababa, Ethiopia"
                      className="pl-10 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="address" className="text-gray-700 dark:text-gray-300">
                  Full Address
                </Label>
                <Textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Your full address where the experience will take place"
                  className="mt-1 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="languages" className="text-gray-700 dark:text-gray-300 mb-2 block">
                  Languages Spoken <span className="text-red-500">*</span>
                </Label>
                <div className="flex flex-wrap gap-2">
                  {["Amharic", "English", "Oromiffa", "Tigrinya", "French", "Arabic"].map((lang) => (
                    <div key={lang} className="flex items-center">
                      <Checkbox
                        id={`lang-${lang}`}
                        checked={formData.languages.includes(lang)}
                        onCheckedChange={(checked) => handleCheckboxChange("languages", lang, checked as boolean)}
                        className="mr-2"
                      />
                      <Label htmlFor={`lang-${lang}`} className="text-sm text-gray-700 dark:text-gray-300">
                        {lang}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="hostBio" className="text-gray-700 dark:text-gray-300">
                  About You <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="hostBio"
                  name="hostBio"
                  value={formData.hostBio}
                  onChange={handleInputChange}
                  required
                  placeholder="Tell us about yourself, your background, and why you want to become a host..."
                  className="mt-1 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                />
              </div>
            </motion.div>
          )}

          {/* Step 2: Experience Details */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
                  <Coffee className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Experience Details</h3>
              </div>

              <div>
                <Label className="text-gray-700 dark:text-gray-300 mb-3 block">
                  Experience Type <span className="text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {experienceTypes.map((type) => (
                    <div
                      key={type.value}
                      onClick={() => handleSelectChange("experienceType", type.value)}
                      className={`flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer transition-all ${
                        formData.experienceType === type.value
                          ? "bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500 dark:border-blue-400"
                          : "bg-gray-50 dark:bg-gray-800 border-2 border-transparent hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <div
                        className={`p-3 rounded-full mb-2 ${
                          formData.experienceType === type.value
                            ? "bg-blue-200 dark:bg-blue-800 text-blue-600 dark:text-blue-300"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        <type.icon className="w-6 h-6" />
                      </div>
                      <span className="text-sm text-center text-gray-700 dark:text-gray-300">{type.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="experienceTitle" className="text-gray-700 dark:text-gray-300">
                  Experience Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="experienceTitle"
                  name="experienceTitle"
                  value={formData.experienceTitle}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Traditional Ethiopian Coffee Ceremony"
                  className="mt-1 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <Label htmlFor="experienceDescription" className="text-gray-700 dark:text-gray-300">
                  Experience Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="experienceDescription"
                  name="experienceDescription"
                  value={formData.experienceDescription}
                  onChange={handleInputChange}
                  required
                  placeholder="Describe your cultural experience in detail. What will guests do? What will they learn? What makes your experience special?"
                  className="mt-1 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  rows={5}
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="groupSize" className="text-gray-700 dark:text-gray-300">
                    Max Group Size <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.groupSize} onValueChange={(value) => handleSelectChange("groupSize", value)}>
                    <SelectTrigger className="mt-1 border-gray-300 dark:border-gray-600">
                      <SelectValue placeholder="Select group size" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 8, 10, 15, 20].map((size) => (
                        <SelectItem key={size} value={size.toString()}>
                          {size} {size === 1 ? "person" : "people"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="duration" className="text-gray-700 dark:text-gray-300">
                    Duration <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.duration} onValueChange={(value) => handleSelectChange("duration", value)}>
                    <SelectTrigger className="mt-1 border-gray-300 dark:border-gray-600">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {["1 hour", "2 hours", "3 hours", "4 hours", "Half day", "Full day"].map((duration) => (
                        <SelectItem key={duration} value={duration}>
                          {duration}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="price" className="text-gray-700 dark:text-gray-300">
                    Price per Person (ETB) <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative mt-1">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., 800"
                      className="pl-10 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-gray-700 dark:text-gray-300 mb-2 block">
                  Availability <span className="text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                    <div key={day} className="flex items-center">
                      <Checkbox
                        id={`day-${day}`}
                        checked={formData.availability.includes(day)}
                        onCheckedChange={(checked) => handleCheckboxChange("availability", day, checked as boolean)}
                        className="mr-2"
                      />
                      <Label htmlFor={`day-${day}`} className="text-sm text-gray-700 dark:text-gray-300">
                        {day.substring(0, 3)}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-gray-700 dark:text-gray-300 mb-2 block">Facilities Available</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {["Wi-Fi", "Restroom", "Parking", "Wheelchair Access", "Air Conditioning", "Food Included"].map(
                    (facility) => (
                      <div key={facility} className="flex items-center">
                        <Checkbox
                          id={`facility-${facility}`}
                          checked={formData.facilities.includes(facility)}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange("facilities", facility, checked as boolean)
                          }
                          className="mr-2"
                        />
                        <Label htmlFor={`facility-${facility}`} className="text-sm text-gray-700 dark:text-gray-300">
                          {facility}
                        </Label>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Media Upload */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
                  <Upload className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Upload Media</h3>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-6 border border-blue-100 dark:border-blue-900/20">
                <div className="flex items-start mb-4">
                  <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Upload photos or videos that showcase your cultural experience. High-quality media helps travelers
                    understand what to expect and increases bookings.
                  </p>
                </div>

                <div
                  className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  onClick={triggerFileInput}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*,video/*"
                    multiple
                    className="hidden"
                  />

                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mb-4">
                    <Camera className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>

                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Drag & drop or click to upload
                  </h4>

                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Upload photos or short videos (max 100MB)
                  </p>

                  <Button type="button" variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50">
                    <Upload className="w-4 h-4 mr-2" />
                    Select Files
                  </Button>
                </div>
              </div>

              {files.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">Uploaded Media ({files.length})</h4>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {files.map((file) => (
                      <div key={file.id} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                          {file.type === "image" ? (
                            <Image
                              src={file.preview || "/placeholder.svg"}
                              alt="Preview"
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <video src={file.preview} className="w-full h-full object-cover" controls />
                          )}

                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="bg-red-600 hover:bg-red-700"
                              onClick={(e) => {
                                e.stopPropagation()
                                removeFile(file.id)
                              }}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                            {file.type === "image" ? (
                              <div className="flex items-center">
                                <ImageIcon className="w-3 h-3 mr-1" />
                                <span>Image</span>
                              </div>
                            ) : (
                              <div className="flex items-center">
                                <Video className="w-3 h-3 mr-1" />
                                <span>Video</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 truncate">{file.file.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-yellow-50 dark:bg-yellow-900/10 rounded-lg p-4 border border-yellow-100 dark:border-yellow-900/20">
                <p className="text-sm text-yellow-700 dark:text-yellow-300 flex items-start">
                  <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                  <span>
                    Please ensure you have permission to use all photos and videos. Media should accurately represent
                    your experience and follow our community guidelines.
                  </span>
                </p>
              </div>
            </motion.div>
          )}

          {/* Step 4: Review & Submit */}
          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
                  <Check className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Review & Submit</h3>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                  <UserPlus className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                  Personal Information
                </h4>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{formData.name || "Not provided"}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email Address</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{formData.email || "Not provided"}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Phone Number</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{formData.phone || "Not provided"}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {formData.location || "Not provided"}
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Languages</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {formData.languages.length > 0 ? (
                        formData.languages.map((lang) => (
                          <Badge
                            key={lang}
                            variant="outline"
                            className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                          >
                            {lang}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">None selected</span>
                      )}
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                  <Coffee className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                  Experience Details
                </h4>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Experience Type</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {experienceTypes.find((t) => t.value === formData.experienceType)?.label || "Not selected"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Experience Title</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {formData.experienceTitle || "Not provided"}
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Experience Description</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100 whitespace-pre-line">
                      {formData.experienceDescription || "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Group Size</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {formData.groupSize ? `${formData.groupSize} people` : "Not selected"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {formData.duration || "Not selected"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Price per Person</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {formData.price ? `${formData.price} ETB` : "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Availability</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {formData.availability.length > 0 ? (
                        formData.availability.map((day) => (
                          <Badge
                            key={day}
                            variant="outline"
                            className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
                          >
                            {day.substring(0, 3)}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">None selected</span>
                      )}
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                  <Upload className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                  Media Files
                </h4>

                {files.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                    {files.map((file) => (
                      <div key={file.id} className="relative">
                        <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                          {file.type === "image" ? (
                            <Image
                              src={file.preview || "/placeholder.svg"}
                              alt="Preview"
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-800">
                              <Video className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No media files uploaded</p>
                )}
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-6 border border-blue-100 dark:border-blue-900/20">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Terms & Conditions</h4>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Checkbox id="terms-1" className="mt-1 mr-2" required />
                    <Label htmlFor="terms-1" className="text-sm text-gray-700 dark:text-gray-300">
                      I confirm that all information provided is accurate and complete.
                    </Label>
                  </div>

                  <div className="flex items-start">
                    <Checkbox id="terms-2" className="mt-1 mr-2" required />
                    <Label htmlFor="terms-2" className="text-sm text-gray-700 dark:text-gray-300">
                      I agree to Hulet Fish's Host Terms of Service and Community Guidelines.
                    </Label>
                  </div>

                  <div className="flex items-start">
                    <Checkbox id="terms-3" className="mt-1 mr-2" required />
                    <Label htmlFor="terms-3" className="text-sm text-gray-700 dark:text-gray-300">
                      I understand that my application will be reviewed and I may be contacted for additional
                      information or verification.
                    </Label>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                className="border-gray-300 dark:border-gray-600"
              >
                Back
              </Button>
            ) : (
              <div></div>
            )}

            {step < 4 ? (
              <Button
                type="button"
                onClick={nextStep}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                Submit Application
                <Check className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
