"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  MapPin,
  Clock,
  Users,
  Star,
  Calendar,
  Coffee,
  ChefHat,
  Music,
  Heart,
  Camera,
  Sparkles,
  X,
  SlidersHorizontal,
  ArrowRight,
  TrendingUp,
} from "lucide-react"
import Image from "next/image"
import InteractiveMap from "@/components/interactive-map"

// Mock experience data with comprehensive details
const experienceData = [
  {
    id: 1,
    title: "Traditional Coffee Ceremony",
    description: "Experience the birthplace of coffee through authentic ceremonies with local families",
    image: "/images/coffee-ceremony-woman.jpg",
    category: "Coffee Culture",
    location: "Addis Ababa",
    duration: "3 hours",
    price: 800,
    rating: 4.9,
    reviews: 127,
    difficulty: "Easy",
    groupSize: "2-8 people",
    highlights: ["Traditional roasting", "Cultural storytelling", "Local community", "Three rounds ceremony"],
    tags: ["coffee", "traditional", "cultural", "family", "authentic"],
    availability: "Daily",
    languages: ["English", "Amharic"],
    includes: ["Coffee beans", "Traditional snacks", "Cultural guide"],
    featured: true,
  },
  {
    id: 2,
    title: "Injera Making Workshop",
    description: "Learn to make Ethiopia's staple bread using traditional methods and clay ovens",
    image: "/images/injera-making.webp",
    category: "Culinary Arts",
    location: "Bahir Dar",
    duration: "4 hours",
    price: 1200,
    rating: 4.8,
    reviews: 89,
    difficulty: "Moderate",
    groupSize: "4-12 people",
    highlights: ["Traditional clay oven", "Teff grain preparation", "Family recipes", "Take home skills"],
    tags: ["cooking", "injera", "traditional", "hands-on", "cultural"],
    availability: "Weekends",
    languages: ["English", "Amharic"],
    includes: ["All ingredients", "Recipe book", "Meal"],
    featured: false,
  },
  {
    id: 3,
    title: "Traditional Dance & Music",
    description: "Join vibrant Ethiopian folk dances and learn traditional music with local communities",
    image: "/images/traditional-dance.webp",
    category: "Cultural Arts",
    location: "Gondar",
    duration: "3 hours",
    price: 600,
    rating: 4.9,
    reviews: 203,
    difficulty: "Easy",
    groupSize: "6-20 people",
    highlights: ["Live performances", "Interactive learning", "Cultural costumes", "Community celebration"],
    tags: ["dance", "music", "performance", "cultural", "community"],
    availability: "Evenings",
    languages: ["English", "Amharic", "Tigrinya"],
    includes: ["Traditional costume", "Refreshments", "Certificate"],
    featured: true,
  },
  {
    id: 4,
    title: "Ethiopian Cuisine Experience",
    description: "Discover authentic Ethiopian flavors including traditional meat dishes and spices",
    image: "/images/traditional-meat-dish.jpg",
    category: "Culinary",
    location: "Lalibela",
    duration: "5 hours",
    price: 1500,
    rating: 4.7,
    reviews: 156,
    difficulty: "Moderate",
    groupSize: "4-10 people",
    highlights: ["Traditional preparation", "Local spices", "Cultural dining", "Recipe sharing"],
    tags: ["food", "spices", "traditional", "cooking", "cultural"],
    availability: "Daily",
    languages: ["English", "Amharic"],
    includes: ["All meals", "Spice kit", "Recipe collection"],
    featured: false,
  },
  {
    id: 5,
    title: "Handcraft Workshop",
    description: "Learn traditional Ethiopian crafts including basket weaving and pottery",
    image: "/images/ethiopian-textiles.jpg",
    category: "Arts & Crafts",
    location: "Addis Ababa",
    duration: "6 hours",
    price: 1000,
    rating: 4.6,
    reviews: 78,
    difficulty: "Moderate",
    groupSize: "3-8 people",
    highlights: ["Traditional techniques", "Local artisans", "Take home crafts", "Cultural stories"],
    tags: ["crafts", "handmade", "traditional", "artisan", "cultural"],
    availability: "Weekdays",
    languages: ["English", "Amharic"],
    includes: ["All materials", "Tools", "Finished products"],
    featured: false,
  },
  {
    id: 6,
    title: "Cultural Storytelling Evening",
    description: "Listen to ancient Ethiopian stories and legends around a traditional fire",
    image: "/images/traditional-ceremony.jpg",
    category: "Cultural Heritage",
    location: "Axum",
    duration: "2 hours",
    price: 400,
    rating: 4.8,
    reviews: 92,
    difficulty: "Easy",
    groupSize: "5-15 people",
    highlights: ["Ancient stories", "Traditional setting", "Cultural insights", "Interactive session"],
    tags: ["stories", "legends", "cultural", "traditional", "evening"],
    availability: "Evenings",
    languages: ["English", "Amharic", "Tigrinya"],
    includes: ["Traditional tea", "Snacks", "Cultural booklet"],
    featured: true,
  },
]

const categories = [
  { id: "all", name: "All Experiences", icon: Sparkles },
  { id: "coffee-culture", name: "Coffee Culture", icon: Coffee },
  { id: "culinary-arts", name: "Culinary Arts", icon: ChefHat },
  { id: "cultural-arts", name: "Cultural Arts", icon: Music },
  { id: "arts-crafts", name: "Arts & Crafts", icon: Camera },
  { id: "cultural-heritage", name: "Cultural Heritage", icon: Heart },
]

const locations = ["All Locations", "Addis Ababa", "Bahir Dar", "Gondar", "Lalibela", "Axum"]
const durations = ["Any Duration", "1-2 hours", "3-4 hours", "5-6 hours", "Full Day"]
const difficulties = ["All Levels", "Easy", "Moderate", "Challenging"]

export default function ExperienceSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("All Locations")
  const [selectedDuration, setSelectedDuration] = useState("Any Duration")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All Levels")
  const [priceRange, setPriceRange] = useState([0, 2000])
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid")

  // Popular searches
  const popularSearches = [
    "Coffee ceremony",
    "Cooking class",
    "Traditional dance",
    "Cultural tour",
    "Handcrafts",
    "Storytelling",
  ]

  // Filter and search logic
  const filteredExperiences = useMemo(() => {
    const filtered = experienceData.filter((experience) => {
      // Text search
      const matchesSearch =
        searchQuery === "" ||
        experience.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        experience.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        experience.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      // Category filter
      const matchesCategory =
        selectedCategory === "all" || experience.category.toLowerCase().replace(/\s+/g, "-") === selectedCategory

      // Location filter
      const matchesLocation = selectedLocation === "All Locations" || experience.location === selectedLocation

      // Duration filter
      const matchesDuration =
        selectedDuration === "Any Duration" ||
        (selectedDuration === "1-2 hours" && Number.parseInt(experience.duration) <= 2) ||
        (selectedDuration === "3-4 hours" &&
          Number.parseInt(experience.duration) >= 3 &&
          Number.parseInt(experience.duration) <= 4) ||
        (selectedDuration === "5-6 hours" &&
          Number.parseInt(experience.duration) >= 5 &&
          Number.parseInt(experience.duration) <= 6) ||
        (selectedDuration === "Full Day" && Number.parseInt(experience.duration) > 6)

      // Difficulty filter
      const matchesDifficulty = selectedDifficulty === "All Levels" || experience.difficulty === selectedDifficulty

      // Price filter
      const matchesPrice = experience.price >= priceRange[0] && experience.price <= priceRange[1]

      return matchesSearch && matchesCategory && matchesLocation && matchesDuration && matchesDifficulty && matchesPrice
    })

    // Sort results
    switch (sortBy) {
      case "featured":
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
        break
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "reviews":
        filtered.sort((a, b) => b.reviews - a.reviews)
        break
      default:
        break
    }

    return filtered
  }, [searchQuery, selectedCategory, selectedLocation, selectedDuration, selectedDifficulty, priceRange, sortBy])

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setSelectedLocation("All Locations")
    setSelectedDuration("Any Duration")
    setSelectedDifficulty("All Levels")
    setPriceRange([0, 2000])
  }

  const activeFiltersCount = [
    selectedCategory !== "all",
    selectedLocation !== "All Locations",
    selectedDuration !== "Any Duration",
    selectedDifficulty !== "All Levels",
    priceRange[0] !== 0 || priceRange[1] !== 2000,
  ].filter(Boolean).length

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700 mb-4">
              <Search className="w-4 h-4 mr-2" />
              Discover Experiences
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Find Your Perfect
              <span className="ethiopian-text-gradient block">Cultural Experience</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Search through our curated collection of authentic Ethiopian cultural experiences
            </p>
          </motion.div>
        </div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="relative max-w-4xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for coffee ceremonies, cooking classes, traditional dances..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-16 py-6 text-lg border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:border-red-500 dark:focus:border-red-400 shadow-lg"
              />
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 border-gray-300 dark:border-gray-600"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge className="ml-2 bg-red-500 text-white text-xs px-2 py-1">{activeFiltersCount}</Badge>
                )}
              </Button>
            </div>

            {/* Popular Searches */}
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Popular:</span>
              {popularSearches.map((search) => (
                <button
                  key={search}
                  onClick={() => setSearchQuery(search)}
                  className="text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full transition-colors"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg scale-105"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-600 hover:shadow-md"
                }`}
              >
                <category.icon className="w-5 h-5 mr-2" />
                {category.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <Card className="border-2 border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Advanced Filters</h3>
                    <div className="flex gap-2">
                      <Button
                        onClick={clearFilters}
                        variant="outline"
                        size="sm"
                        className="text-gray-600 dark:text-gray-400"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Clear All
                      </Button>
                      <Button onClick={() => setShowFilters(false)} variant="outline" size="sm">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Location Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        Location
                      </label>
                      <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map((location) => (
                            <SelectItem key={location} value={location}>
                              {location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Duration Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Clock className="w-4 h-4 inline mr-1" />
                        Duration
                      </label>
                      <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {durations.map((duration) => (
                            <SelectItem key={duration} value={duration}>
                              {duration}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Difficulty Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <TrendingUp className="w-4 h-4 inline mr-1" />
                        Difficulty
                      </label>
                      <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {difficulties.map((difficulty) => (
                            <SelectItem key={difficulty} value={difficulty}>
                              {difficulty}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Sort By */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sort By</label>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="featured">Featured</SelectItem>
                          <SelectItem value="price-low">Price: Low to High</SelectItem>
                          <SelectItem value="price-high">Price: High to Low</SelectItem>
                          <SelectItem value="rating">Highest Rated</SelectItem>
                          <SelectItem value="reviews">Most Reviewed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                      Price Range: {priceRange[0]} - {priceRange[1]} ETB
                    </label>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={2000}
                      min={0}
                      step={50}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {filteredExperiences.length} Experience{filteredExperiences.length !== 1 ? "s" : ""} Found
            </h3>
            {searchQuery && <p className="text-gray-600 dark:text-gray-400 mt-1">Results for "{searchQuery}"</p>}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setViewMode("grid")}
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              className={viewMode === "grid" ? "ethiopian-gradient text-white" : ""}
            >
              <div className="grid grid-cols-2 gap-0.5 w-4 h-4 mr-2">
                <div className="bg-current w-1.5 h-1.5 rounded-sm"></div>
                <div className="bg-current w-1.5 h-1.5 rounded-sm"></div>
                <div className="bg-current w-1.5 h-1.5 rounded-sm"></div>
                <div className="bg-current w-1.5 h-1.5 rounded-sm"></div>
              </div>
              Grid
            </Button>
            <Button
              onClick={() => setViewMode("map")}
              variant={viewMode === "map" ? "default" : "outline"}
              size="sm"
              className={viewMode === "map" ? "ethiopian-gradient text-white" : ""}
            >
              <MapPin className="w-4 h-4 mr-2" />
              Map
            </Button>
          </div>
        </div>

        {/* Results Content */}
        {viewMode === "grid" ? (
          /* Results Grid */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredExperiences.map((experience, index) => (
              <motion.div
                key={experience.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white dark:bg-gray-800">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={experience.image || "/placeholder.svg"}
                      alt={experience.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Featured Badge */}
                    {experience.featured && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-yellow-500 text-white border-0">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      </div>
                    )}

                    {/* Category Badge */}
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 border-0">
                        {experience.category}
                      </Badge>
                    </div>

                    {/* Quick Book Button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button className="bg-white text-red-600 hover:bg-gray-100 font-semibold shadow-lg">
                        <Calendar className="w-4 h-4 mr-2" />
                        Book Now
                      </Button>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 line-clamp-2">
                        {experience.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 ml-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                        {experience.rating}
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm line-clamp-2">
                      {experience.description}
                    </p>

                    {/* Experience Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="w-4 h-4 mr-2" />
                        {experience.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4 mr-2" />
                        {experience.duration}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Users className="w-4 h-4 mr-2" />
                        {experience.groupSize}
                      </div>
                    </div>

                    {/* Highlights */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {experience.highlights.slice(0, 2).map((highlight, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="text-xs border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400"
                        >
                          {highlight}
                        </Badge>
                      ))}
                    </div>

                    {/* Price and Book Button */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {experience.price} ETB
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{experience.reviews} reviews</div>
                      </div>
                      <Button className="ethiopian-gradient text-white hover:opacity-90 transition-all duration-300">
                        Book
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Map View */
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <InteractiveMap
              selectedCategory={selectedCategory}
              priceRange={priceRange}
              onExperienceSelect={(experienceId) => {
                console.log(`Selected experience: ${experienceId}`)
                // Handle experience selection - could open booking modal
              }}
            />
          </motion.div>
        )}

        {/* No Results */}
        {filteredExperiences.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">No experiences found</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
              Try adjusting your search criteria or browse our popular experiences below.
            </p>
            <Button onClick={clearFilters} className="ethiopian-gradient text-white">
              Clear All Filters
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  )
}
