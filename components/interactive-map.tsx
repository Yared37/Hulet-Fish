"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  Star,
  Calendar,
  Coffee,
  ChefHat,
  Music,
  Camera,
  Heart,
  Navigation,
  Maximize2,
  Minimize2,
  X,
} from "lucide-react"
import Image from "next/image"

// Mock map data with Ethiopian locations
const mapLocations = [
  {
    id: 1,
    name: "Addis Ababa",
    coordinates: { lat: 9.032, lng: 38.7469 },
    experiences: [
      {
        id: 1,
        title: "Traditional Coffee Ceremony",
        image: "/images/coffee-ceremony-woman.jpg",
        price: 800,
        rating: 4.9,
        reviews: 127,
        duration: "3 hours",
        category: "Coffee Culture",
        icon: Coffee,
      },
      {
        id: 5,
        title: "Handcraft Workshop",
        image: "/images/ethiopian-textiles.jpg",
        price: 1000,
        rating: 4.6,
        reviews: 78,
        duration: "6 hours",
        category: "Arts & Crafts",
        icon: Camera,
      },
    ],
  },
  {
    id: 2,
    name: "Bahir Dar",
    coordinates: { lat: 11.5942, lng: 37.3914 },
    experiences: [
      {
        id: 2,
        title: "Injera Making Workshop",
        image: "/images/injera-making.webp",
        price: 1200,
        rating: 4.8,
        reviews: 89,
        duration: "4 hours",
        category: "Culinary Arts",
        icon: ChefHat,
      },
    ],
  },
  {
    id: 3,
    name: "Gondar",
    coordinates: { lat: 12.609, lng: 37.4671 },
    experiences: [
      {
        id: 3,
        title: "Traditional Dance & Music",
        image: "/images/traditional-dance.webp",
        price: 600,
        rating: 4.9,
        reviews: 203,
        duration: "3 hours",
        category: "Cultural Arts",
        icon: Music,
      },
    ],
  },
  {
    id: 4,
    name: "Lalibela",
    coordinates: { lat: 12.0316, lng: 39.0473 },
    experiences: [
      {
        id: 4,
        title: "Ethiopian Cuisine Experience",
        image: "/images/traditional-meat-dish.jpg",
        price: 1500,
        rating: 4.7,
        reviews: 156,
        duration: "5 hours",
        category: "Culinary",
        icon: ChefHat,
      },
    ],
  },
  {
    id: 5,
    name: "Axum",
    coordinates: { lat: 14.1209, lng: 38.7267 },
    experiences: [
      {
        id: 6,
        title: "Cultural Storytelling Evening",
        image: "/images/traditional-ceremony.jpg",
        price: 400,
        rating: 4.8,
        reviews: 92,
        duration: "2 hours",
        category: "Cultural Heritage",
        icon: Heart,
      },
    ],
  },
]

interface InteractiveMapProps {
  selectedCategory?: string
  priceRange?: [number, number]
  onExperienceSelect?: (experienceId: number) => void
}

export default function InteractiveMap({
  selectedCategory = "all",
  priceRange = [0, 2000],
  onExperienceSelect,
}: InteractiveMapProps) {
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null)
  const [hoveredLocation, setHoveredLocation] = useState<number | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [mapCenter, setMapCenter] = useState({ lat: 11.0, lng: 38.5 })
  const [mapZoom, setMapZoom] = useState(6)
  const mapRef = useRef<HTMLDivElement>(null)

  // Filter locations based on criteria
  const filteredLocations = mapLocations
    .map((location) => ({
      ...location,
      experiences: location.experiences.filter((experience) => {
        const matchesCategory =
          selectedCategory === "all" || experience.category.toLowerCase().replace(/\s+/g, "-") === selectedCategory
        const matchesPrice = experience.price >= priceRange[0] && experience.price <= priceRange[1]
        return matchesCategory && matchesPrice
      }),
    }))
    .filter((location) => location.experiences.length > 0)

  const handleLocationClick = (locationId: number) => {
    const location = filteredLocations.find((loc) => loc.id === locationId)
    if (location) {
      setSelectedLocation(locationId)
      setMapCenter(location.coordinates)
      setMapZoom(10)
    }
  }

  const handleExperienceClick = (experienceId: number) => {
    onExperienceSelect?.(experienceId)
  }

  const resetMapView = () => {
    setMapCenter({ lat: 11.0, lng: 38.5 })
    setMapZoom(6)
    setSelectedLocation(null)
  }

  return (
    <div
      className={`relative ${isFullscreen ? "fixed inset-0 z-50 bg-white dark:bg-gray-900" : "h-96 md:h-[500px]"} rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700`}
    >
      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button
          onClick={resetMapView}
          size="sm"
          variant="outline"
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm"
        >
          <Navigation className="w-4 h-4 mr-1" />
          Reset View
        </Button>
        <Button
          onClick={() => setIsFullscreen(!isFullscreen)}
          size="sm"
          variant="outline"
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </Button>
      </div>

      {/* Map Legend */}
      <div className="absolute top-4 left-4 z-10">
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-3">
            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Experience Locations</div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span className="text-gray-600 dark:text-gray-300">Available Experiences</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <span className="text-gray-600 dark:text-gray-300">Selected Location</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Simplified Map Background */}
      <div
        ref={mapRef}
        className="w-full h-full bg-gradient-to-br from-green-100 via-yellow-50 to-red-50 dark:from-green-900/20 dark:via-yellow-900/20 dark:to-red-900/20 relative overflow-hidden"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(239, 68, 68, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(251, 191, 36, 0.1) 0%, transparent 50%)
          `,
        }}
      >
        {/* Ethiopia Outline (Simplified) */}
        <svg
          className="absolute inset-0 w-full h-full opacity-20"
          viewBox="0 0 400 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M50 150 Q100 100 150 120 Q200 110 250 130 Q300 140 350 160 Q340 200 300 220 Q250 240 200 230 Q150 220 100 200 Q60 180 50 150Z"
            stroke="currentColor"
            strokeWidth="2"
            fill="rgba(34, 197, 94, 0.1)"
            className="text-green-600 dark:text-green-400"
          />
        </svg>

        {/* Location Markers */}
        {filteredLocations.map((location, index) => {
          const isSelected = selectedLocation === location.id
          const isHovered = hoveredLocation === location.id

          // Convert coordinates to screen position (simplified)
          const x = ((location.coordinates.lng - 33) / (48 - 33)) * 100
          const y = ((18 - location.coordinates.lat) / (18 - 3)) * 100

          return (
            <motion.div
              key={location.id}
              className="absolute cursor-pointer"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%, -50%)",
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              whileHover={{ scale: 1.2 }}
              onClick={() => handleLocationClick(location.id)}
              onMouseEnter={() => setHoveredLocation(location.id)}
              onMouseLeave={() => setHoveredLocation(null)}
            >
              {/* Marker */}
              <div className={`relative ${isSelected ? "z-20" : "z-10"}`}>
                <div
                  className={`w-6 h-6 rounded-full border-2 border-white shadow-lg transition-all duration-300 ${
                    isSelected ? "bg-yellow-500 scale-125" : isHovered ? "bg-red-400 scale-110" : "bg-red-500"
                  }`}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <MapPin className="w-3 h-3 text-white" />
                  </div>
                </div>

                {/* Pulse Animation */}
                {(isSelected || isHovered) && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-red-400"
                    initial={{ scale: 1, opacity: 0.7 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                  />
                )}

                {/* Location Label */}
                <div
                  className={`absolute top-8 left-1/2 transform -translate-x-1/2 transition-all duration-300 ${
                    isHovered || isSelected ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                  }`}
                >
                  <div className="bg-white dark:bg-gray-800 px-2 py-1 rounded-md shadow-lg border border-gray-200 dark:border-gray-600 whitespace-nowrap">
                    <div className="text-xs font-semibold text-gray-900 dark:text-gray-100">{location.name}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {location.experiences.length} experience{location.experiences.length !== 1 ? "s" : ""}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Location Details Panel */}
      <AnimatePresence>
        {selectedLocation && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="absolute right-0 top-0 h-full w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 shadow-xl overflow-y-auto"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {filteredLocations.find((loc) => loc.id === selectedLocation)?.name}
                </h3>
                <Button onClick={() => setSelectedLocation(null)} size="sm" variant="ghost">
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                {filteredLocations
                  .find((loc) => loc.id === selectedLocation)
                  ?.experiences.map((experience, index) => (
                    <motion.div
                      key={experience.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group cursor-pointer"
                      onClick={() => handleExperienceClick(experience.id)}
                    >
                      <Card className="overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 group-hover:border-red-300 dark:group-hover:border-red-600">
                        <div className="relative h-32">
                          <Image
                            src={experience.image || "/placeholder.svg"}
                            alt={experience.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-white/90 text-gray-900 text-xs">{experience.duration}</Badge>
                          </div>
                          <div className="absolute top-2 left-2">
                            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                              <experience.icon className="w-3 h-3 text-white" />
                            </div>
                          </div>
                        </div>

                        <CardContent className="p-3">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 flex-1">
                              {experience.title}
                            </h4>
                            <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 ml-2">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                              {experience.rating}
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
                              {experience.price} ETB
                            </div>
                            <Button
                              size="sm"
                              className="ethiopian-gradient text-white hover:opacity-90 text-xs px-3 py-1"
                            >
                              <Calendar className="w-3 h-3 mr-1" />
                              Book
                            </Button>
                          </div>

                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {experience.reviews} reviews
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map Statistics */}
      <div className="absolute bottom-4 left-4 z-10">
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-3">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 text-red-500 mr-1" />
                <span className="font-semibold text-gray-900 dark:text-gray-100">{filteredLocations.length}</span>
                <span className="text-gray-600 dark:text-gray-300 ml-1">locations</span>
              </div>
              <div className="flex items-center">
                <Heart className="w-4 h-4 text-red-500 mr-1" />
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {filteredLocations.reduce((total, loc) => total + loc.experiences.length, 0)}
                </span>
                <span className="text-gray-600 dark:text-gray-300 ml-1">experiences</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
