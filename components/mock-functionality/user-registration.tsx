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
import { UserPlus, CheckCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function UserRegistration() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    role: "",
    preferences: [] as string[],
    emergencyContact: "",
    bio: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const newUser = mockDataStore.addUser(formData)

      toast.success("User registered successfully!", {
        description: `Welcome ${newUser.name}! Account created with ID: ${newUser.id}`,
        action: {
          label: "View Profile",
          onClick: () => console.log("View profile clicked"),
        },
      })

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        location: "",
        role: "",
        preferences: [],
        emergencyContact: "",
        bio: "",
      })
    } catch (error) {
      toast.error("Registration failed", {
        description: "Please try again later",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addPreference = (preference: string) => {
    if (!formData.preferences.includes(preference)) {
      setFormData((prev) => ({
        ...prev,
        preferences: [...prev.preferences, preference],
      }))
    }
  }

  const removePreference = (preference: string) => {
    setFormData((prev) => ({
      ...prev,
      preferences: prev.preferences.filter((p) => p !== preference),
    }))
  }

  const availablePreferences = ["Adventure", "Cultural", "Historical", "Wildlife", "Photography", "Spiritual"]

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <UserPlus className="w-5 h-5 mr-2" />
          Register New User
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                required
                placeholder="Enter full name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                required
                placeholder="Enter email address"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                placeholder="City, Country"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="role">User Role *</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tourist">Tourist</SelectItem>
                  <SelectItem value="guide">Tour Guide</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="emergency">Emergency Contact</Label>
              <Input
                id="emergency"
                value={formData.emergencyContact}
                onChange={(e) => setFormData((prev) => ({ ...prev, emergencyContact: e.target.value }))}
                placeholder="Emergency contact number"
              />
            </div>
          </div>

          <div>
            <Label>Travel Preferences</Label>
            <div className="flex flex-wrap gap-2 mt-2 mb-3">
              {formData.preferences.map((pref) => (
                <Badge key={pref} variant="default" className="cursor-pointer" onClick={() => removePreference(pref)}>
                  {pref} ×
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {availablePreferences
                .filter((pref) => !formData.preferences.includes(pref))
                .map((pref) => (
                  <Badge
                    key={pref}
                    variant="outline"
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => addPreference(pref)}
                  >
                    + {pref}
                  </Badge>
                ))}
            </div>
          </div>

          <div>
            <Label htmlFor="bio">Bio / Additional Information</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
              placeholder="Tell us about yourself..."
              rows={3}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            disabled={isLoading || !formData.name || !formData.email || !formData.role}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Register User
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
