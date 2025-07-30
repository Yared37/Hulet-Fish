"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  Star,
  Users,
  Calendar,
  Camera,
  Globe,
  Heart,
  ChevronRight,
  Play,
  Award,
  Clock,
  Compass,
  MessageSquare,
} from "lucide-react"
import SiteHeader from "@/components/site-header"
import AdvancedLogo from "@/components/advanced-logo"
import AuthenticGallery from "@/components/authentic-gallery"
import EthiopianHeritage3D from "@/components/ethiopian-heritage-3d"
import VRTourModal from "@/components/vr-tour-modal"
import BookingSystem from "@/components/booking-system"
import InteractiveMap from "@/components/interactive-map"
import ExperienceSearch from "@/components/experience-search"
import LoadingSpinner from "@/components/loading-spinner"

const featuredTours = [
  {
    id: 1,
    title: "Simien Mountains Trek",
    description: "Experience breathtaking landscapes and unique wildlife in Ethiopia's highlands",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
    price: 1200,
    duration: "7 days",
    rating: 4.9,
    reviews: 127,
    difficulty: "Moderate",
    groupSize: "8-12 people",
    highlights: ["Gelada monkeys", "Dramatic escarpments", "Local villages"],
  },
  {
    id: 2,
    title: "Danakil Depression Adventure",
    description: "Journey to one of the hottest and lowest places on Earth",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
    price: 1800,
    duration: "5 days",
    rating: 4.8,
    reviews: 89,
    difficulty: "Challenging",
    groupSize: "6-10 people",
    highlights: ["Salt flats", "Active volcanoes", "Colorful mineral deposits"],
  },
  {
    id: 3,
    title: "Lalibela Rock Churches",
    description: "Explore the magnificent rock-hewn churches of this UNESCO World Heritage site",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
    price: 800,
    duration: "3 days",
    rating: 4.9,
    reviews: 203,
    difficulty: "Easy",
    groupSize: "4-15 people",
    highlights: ["Ancient churches", "Religious ceremonies", "Local culture"],
  },
]

const testimonials = [
  {
    name: "Sarah Johnson",
    location: "New York, USA",
    rating: 5,
    comment: "An absolutely incredible experience! The guides were knowledgeable and the landscapes were breathtaking.",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    tour: "Simien Mountains Trek",
  },
  {
    name: "Michael Chen",
    location: "Toronto, Canada",
    rating: 5,
    comment: "The cultural immersion was amazing. I learned so much about Ethiopian history and traditions.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    tour: "Lalibela Rock Churches",
  },
  {
    name: "Emma Wilson",
    location: "London, UK",
    rating: 5,
    comment: "Professional organization and unforgettable memories. Highly recommend Hulet Fish Tourism!",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    tour: "Danakil Depression Adventure",
  },
]

const stats = [
  { label: "Happy Travelers", value: "2,500+", icon: Users },
  { label: "Tours Completed", value: "1,200+", icon: MapPin },
  { label: "Years Experience", value: "15+", icon: Award },
  { label: "Customer Rating", value: "4.9/5", icon: Star },
]

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTour, setSelectedTour] = useState(null)
  const [showVRModal, setShowVRModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-teal-900/90 z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=1080&fit=crop')",
          }}
        />

        <div className="relative z-20 text-center text-white px-4 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <AdvancedLogo size="xl" variant="default" className="justify-center mb-8" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            Discover Ethiopia's
            <span className="block bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
              Hidden Treasures
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl mb-8 text-slate-200 max-w-3xl mx-auto leading-relaxed"
          >
            Experience authentic Ethiopian culture, breathtaking landscapes, and unforgettable adventures with local
            experts
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-8 py-4 text-lg font-semibold shadow-xl"
            >
              <Compass className="w-5 h-5 mr-2" />
              Explore Tours
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-slate-900 px-8 py-4 text-lg font-semibold bg-transparent"
              onClick={() => setShowVRModal(true)}
            >
              <Play className="w-5 h-5 mr-2" />
              Virtual Tour
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-slate-300">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Find Your Perfect Adventure
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Search through our curated collection of authentic Ethiopian experiences
            </p>
          </motion.div>

          <ExperienceSearch />
        </div>
      </section>

      {/* Featured Tours */}
      <section className="py-16 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Featured Experiences
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Handpicked adventures that showcase the best of Ethiopia
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTours.map((tour, index) => (
              <motion.div
                key={tour.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-slate-900">
                  <div className="relative">
                    <img src={tour.image || "/placeholder.svg"} alt={tour.title} className="w-full h-64 object-cover" />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-blue-600 text-white">{tour.difficulty}</Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-xl text-slate-900 dark:text-slate-100">{tour.title}</CardTitle>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{tour.rating}</span>
                      </div>
                    </div>
                    <CardDescription className="text-slate-600 dark:text-slate-400">{tour.description}</CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{tour.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{tour.groupSize}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {tour.highlights.map((highlight, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {highlight}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                        <div>
                          <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">${tour.price}</span>
                          <span className="text-sm text-slate-500 dark:text-slate-400 ml-1">per person</span>
                        </div>
                        <Button
                          className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white"
                          onClick={() => setSelectedTour(tour)}
                        >
                          Book Now
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Map */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">Explore Ethiopia</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Discover destinations and plan your journey across Ethiopia's diverse regions
            </p>
          </motion.div>

          <InteractiveMap />
        </div>
      </section>

      {/* Cultural Heritage */}
      <section className="py-16 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Ethiopian Heritage
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Immerse yourself in the rich cultural traditions of Ethiopia
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <EthiopianHeritage3D />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  Ancient Traditions, Modern Experiences
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Ethiopia is home to one of the world's oldest civilizations, with a rich tapestry of cultures,
                  languages, and traditions that have been preserved for millennia. From the ancient rock-hewn churches
                  of Lalibela to the vibrant coffee ceremonies, every experience tells a story.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center space-x-2 mb-2">
                    <Globe className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-slate-900 dark:text-slate-100">UNESCO Sites</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">9 World Heritage Sites</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="w-5 h-5 text-teal-600" />
                    <span className="font-semibold text-slate-900 dark:text-slate-100">Ethnic Groups</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">80+ distinct cultures</p>
                </div>
              </div>

              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white"
              >
                <Camera className="w-5 h-5 mr-2" />
                Explore Heritage
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Authentic Moments
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Captured memories from our travelers' incredible journeys
            </p>
          </motion.div>

          <AuthenticGallery />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              What Travelers Say
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Real experiences from real adventurers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-white dark:bg-slate-900 border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 mb-6 italic">"{testimonial.comment}"</p>
                    <div className="flex items-center space-x-3">
                      <img
                        src={testimonial.avatar || "/placeholder.svg"}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">{testimonial.name}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{testimonial.location}</p>
                        <p className="text-xs text-blue-600 dark:text-blue-400">{testimonial.tour}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready for Your Ethiopian Adventure?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of travelers who have discovered the magic of Ethiopia with Hulet Fish Tourism
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-100 px-8 py-4 text-lg font-semibold">
                <Calendar className="w-5 h-5 mr-2" />
                Plan Your Trip
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold bg-transparent"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Contact Us
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Modals */}
      <AnimatePresence>
        {showVRModal && <VRTourModal onClose={() => setShowVRModal(false)} />}
        {selectedTour && <BookingSystem tour={selectedTour} onClose={() => setSelectedTour(null)} />}
      </AnimatePresence>
    </div>
  )
}
