"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, ChefHat, Camera, Music, Star, Clock, Users, ArrowRight } from "lucide-react"
import Image from "next/image"
import EnhancedBookingModal from "@/components/enhanced-booking-modal"

interface BookingSystemProps {
  isOpen: boolean
  onClose: () => void
}

const BookingSystem = ({ isOpen, onClose }: BookingSystemProps) => {
  const [selectedExperienceId, setSelectedExperienceId] = useState<string | null>(null)
  const [showEnhancedBooking, setShowEnhancedBooking] = useState(false)

  const handleBookExperience = (experienceId: string) => {
    setSelectedExperienceId(experienceId)
    setShowEnhancedBooking(true)
    onClose() // Close the main booking dialog
  }

  const handleCloseEnhancedBooking = () => {
    setShowEnhancedBooking(false)
    setSelectedExperienceId(null)
  }

  const destinations = [
    {
      id: "coffee-ceremony",
      name: "Traditional Coffee Ceremony",
      description: "Experience the birthplace of coffee through authentic ceremonies",
      image: "/images/coffee-ceremony-woman.jpg",
      duration: "3 hours",
      basePrice: 800,
      rating: 4.9,
      highlights: ["Traditional roasting", "Cultural storytelling", "Community gathering"],
    },
    {
      id: "injera-workshop",
      name: "Injera Making Workshop",
      description: "Learn to make Ethiopia's staple bread using traditional methods",
      image: "/images/injera-making.webp",
      duration: "4 hours",
      basePrice: 1200,
      rating: 4.8,
      highlights: ["Traditional clay oven", "Teff grain preparation", "Family recipes"],
    },
    {
      id: "traditional-dance",
      name: "Folk Dance & Music Experience",
      description: "Learn traditional Ethiopian dances and music",
      image: "/images/traditional-dance.webp",
      duration: "2 hours",
      basePrice: 600,
      rating: 4.9,
      highlights: ["Live performances", "Interactive learning", "Cultural costumes"],
    },
    {
      id: "cuisine-experience",
      name: "Ethiopian Cuisine Experience",
      description: "Discover authentic Ethiopian flavors and traditional cooking",
      image: "/images/traditional-meat-dish.jpg",
      duration: "5 hours",
      basePrice: 1500,
      rating: 4.7,
      highlights: ["Traditional preparation", "Local spices", "Cultural dining"],
    },
  ]

  const experiences = [
    {
      id: "cultural",
      name: "Cultural Immersion",
      icon: Heart,
      price: 0,
      description: "Live with local communities and experience authentic traditions",
    },
    {
      id: "culinary",
      name: "Culinary Experience",
      icon: ChefHat,
      price: 200,
      description: "Master traditional Ethiopian cooking with local chefs",
    },
    {
      id: "artisan",
      name: "Artisan Workshops",
      icon: Camera,
      price: 300,
      description: "Learn traditional crafts from master artisans",
    },
    {
      id: "performance",
      name: "Music & Dance",
      icon: Music,
      price: 150,
      description: "Experience traditional Ethiopian music and dance",
    },
  ]

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Book Your Ethiopian Experience</DialogTitle>
          </DialogHeader>

          <div className="space-y-8">
            {/* Featured Experiences */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Featured Cultural Experiences</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {destinations.map((destination) => (
                  <Card key={destination.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-48">
                      <Image
                        src={destination.image || "/placeholder.svg"}
                        alt={destination.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-white/90 text-gray-900">{destination.duration}</Badge>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">{destination.name}</h3>
                        <div className="flex items-center text-sm">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                          {destination.rating}
                        </div>
                      </div>

                      <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">{destination.description}</p>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {destination.highlights.slice(0, 2).map((highlight, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {highlight}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-xl font-bold">
                          {destination.basePrice} ETB
                          <span className="text-sm font-normal text-gray-500 ml-1">per person</span>
                        </div>
                        <Button
                          onClick={() => handleBookExperience(destination.id)}
                          className="bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700 text-white"
                        >
                          Book Now
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Experience Categories */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Experience Categories</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {experiences.map((experience) => (
                  <Card key={experience.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <experience.icon className="w-6 h-6 text-red-600" />
                      </div>
                      <h3 className="font-semibold mb-2">{experience.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{experience.description}</p>
                      {experience.price > 0 && (
                        <div className="text-lg font-bold text-red-600">+{experience.price} ETB</div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Quick Info */}
            <div className="bg-gradient-to-r from-red-50 via-yellow-50 to-green-50 dark:from-red-900/20 dark:via-yellow-900/20 dark:to-green-900/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Why Book With Us?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Authentic Experiences</p>
                    <p className="text-sm text-gray-600">With verified local hosts</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Flexible Booking</p>
                    <p className="text-sm text-gray-600">Free cancellation up to 24h</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Star className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Highly Rated</p>
                    <p className="text-sm text-gray-600">4.8+ average rating</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Enhanced Booking Modal */}
      {showEnhancedBooking && selectedExperienceId && (
        <EnhancedBookingModal
          isOpen={showEnhancedBooking}
          onClose={handleCloseEnhancedBooking}
          experienceId={selectedExperienceId}
        />
      )}
    </>
  )
}

export default BookingSystem
