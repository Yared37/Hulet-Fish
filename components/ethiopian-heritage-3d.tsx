"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import VRTourModal from "@/components/vr-tour-modal"
import {
  MapPin,
  Star,
  Play,
  Volume2,
  VolumeX,
  RotateCcw,
  Info,
  Camera,
  Clock,
  Crown,
  Mountain,
  Church,
  Palette,
  ArrowRight,
  Eye,
  Headphones,
} from "lucide-react"
import Image from "next/image"

interface HistoricalSite {
  id: string
  name: string
  period: string
  description: string
  culturalSignificance: string
  images: string[]
  highlights: string[]
  tourismFeatures: string[]
  coordinates: { x: number; y: number }
  category: "ancient" | "religious" | "cultural" | "natural"
  icon: any
  color: string
  audioGuide?: string
  vrTour?: boolean
}

const historicalSites: HistoricalSite[] = [
  {
    id: "lalibela",
    name: "Rock-Hewn Churches of Lalibela",
    period: "12th-13th Century",
    description:
      "Eleven medieval monolithic churches carved directly into volcanic rock, representing a 'New Jerusalem'",
    culturalSignificance:
      "UNESCO World Heritage site and active pilgrimage destination for Ethiopian Orthodox Christians",
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=center",
    ],
    highlights: ["Church of St. George", "Underground tunnels", "Religious ceremonies", "Ancient architecture"],
    tourismFeatures: ["Guided tours", "Photography workshops", "Cultural ceremonies", "Spiritual retreats"],
    coordinates: { x: 30, y: 25 },
    category: "religious",
    icon: Church,
    color: "from-amber-500 to-orange-600",
    vrTour: true,
  },
  {
    id: "axum",
    name: "Ancient Kingdom of Axum",
    period: "1st-8th Century AD",
    description: "Capital of the ancient Axumite Kingdom, featuring towering obelisks and royal tombs",
    culturalSignificance: "Legendary home of the Queen of Sheba and the Ark of the Covenant",
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=center",
    ],
    highlights: ["Giant obelisks", "Royal tombs", "Queen of Sheba's palace", "Ancient inscriptions"],
    tourismFeatures: ["Archaeological tours", "Historical lectures", "Cultural exhibitions", "Photography sessions"],
    coordinates: { x: 70, y: 20 },
    category: "ancient",
    icon: Crown,
    color: "from-purple-500 to-indigo-600",
    vrTour: true,
  },
  {
    id: "gondar",
    name: "Fasil Ghebbi (Royal Enclosure)",
    period: "17th-18th Century",
    description: "Fortress-city with palaces, churches, and castles of Ethiopian emperors",
    culturalSignificance: "Former imperial capital showcasing unique Ethiopian-European architectural fusion",
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=center",
    ],
    highlights: ["Fasilides Castle", "Debre Berhan Selassie Church", "Royal baths", "Imperial architecture"],
    tourismFeatures: ["Palace tours", "Cultural festivals", "Traditional music", "Royal ceremonies"],
    coordinates: { x: 15, y: 40 },
    category: "cultural",
    icon: Crown,
    color: "from-red-500 to-pink-600",
    vrTour: false,
  },
  {
    id: "harar",
    name: "Historic Town of Harar",
    period: "13th Century-Present",
    description: "Ancient walled city known as the fourth holiest city in Islam",
    culturalSignificance: "Cultural crossroads with unique blend of Islamic, Ethiopian, and African traditions",
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=center",
    ],
    highlights: ["Ancient city walls", "Traditional houses", "Hyena feeding", "Coffee culture"],
    tourismFeatures: ["Cultural walks", "Coffee ceremonies", "Traditional crafts", "Night tours"],
    coordinates: { x: 85, y: 60 },
    category: "cultural",
    icon: Palette,
    color: "from-green-500 to-teal-600",
    vrTour: false,
  },
  {
    id: "simien",
    name: "Simien Mountains",
    period: "Geological: 40 million years",
    description: "Dramatic mountain landscape with unique wildlife and stunning escarpments",
    culturalSignificance: "Sacred mountains in Ethiopian culture, home to endemic species",
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=center",
    ],
    highlights: ["Ras Dashen peak", "Gelada monkeys", "Dramatic escarpments", "Endemic wildlife"],
    tourismFeatures: ["Trekking expeditions", "Wildlife photography", "Cultural villages", "Camping experiences"],
    coordinates: { x: 25, y: 15 },
    category: "natural",
    icon: Mountain,
    color: "from-blue-500 to-cyan-600",
    vrTour: false,
  },
]

const culturalPatterns = [
  "M12 2L2 7V17L12 22L22 17V7L12 2Z", // Ethiopian cross pattern
  "M3 3H21V21H3V3ZM7 7V17H17V7H7Z", // Traditional weaving pattern
  "M12 2L22 8.5V15.5L12 22L2 15.5V8.5L12 2Z", // Star of David (Ethiopian Jewish heritage)
]

const vrTourData = {
  lalibela: {
    id: "lalibela",
    name: "Rock-Hewn Churches of Lalibela",
    description: "Experience the spiritual wonder of these 12th-century churches carved from solid rock",
    duration: "45 minutes",
    difficulty: "Easy",
    highlights: ["Church of St. George", "Underground passages", "Religious ceremonies", "Ancient carvings"],
    vrScenes: [
      {
        id: "church-exterior",
        name: "Church of St. George - Exterior",
        description: "Marvel at the perfectly carved cross-shaped church from above",
        image: "/placeholder.svg?height=600&width=800&text=Lalibela+Church+Exterior+360",
        hotspots: [
          {
            id: "cross-shape",
            x: 50,
            y: 30,
            title: "Perfect Cross Design",
            description: "The church is carved in a perfect Greek cross shape, representing the crucifixion",
            type: "info",
            icon: Info,
          },
          {
            id: "entrance",
            x: 70,
            y: 60,
            title: "Sacred Entrance",
            description: "Enter the church through this ancient doorway",
            type: "navigation",
            icon: MapPin,
          },
          {
            id: "carvings",
            x: 30,
            y: 45,
            title: "Ancient Carvings",
            description: "Intricate religious symbols carved 800 years ago",
            type: "artifact",
            icon: Camera,
          },
        ],
      },
      {
        id: "church-interior",
        name: "Church Interior",
        description: "Step inside this sacred space where pilgrims have prayed for centuries",
        image: "/placeholder.svg?height=600&width=800&text=Lalibela+Church+Interior+360",
        hotspots: [
          {
            id: "altar",
            x: 50,
            y: 40,
            title: "Sacred Altar",
            description: "The holy altar where religious ceremonies take place",
            type: "info",
            icon: Info,
          },
          {
            id: "pillars",
            x: 25,
            y: 50,
            title: "Supporting Pillars",
            description: "Massive pillars carved from the living rock",
            type: "artifact",
            icon: Camera,
          },
          {
            id: "audio-guide",
            x: 75,
            y: 35,
            title: "Audio Guide",
            description: "Listen to the history and significance of this sacred space",
            type: "audio",
            icon: Headphones,
          },
        ],
      },
    ],
  },
  axum: {
    id: "axum",
    name: "Ancient Kingdom of Axum",
    description: "Walk among the towering obelisks of this ancient civilization",
    duration: "35 minutes",
    difficulty: "Moderate",
    highlights: ["Giant Obelisks", "Royal Tombs", "Queen of Sheba's Palace", "Ancient Inscriptions"],
    vrScenes: [
      {
        id: "obelisk-field",
        name: "Obelisk Field",
        description: "Stand among the magnificent granite obelisks reaching toward the sky",
        image: "/placeholder.svg?height=600&width=800&text=Axum+Obelisks+360",
        hotspots: [
          {
            id: "great-obelisk",
            x: 60,
            y: 20,
            title: "The Great Obelisk",
            description: "The tallest standing obelisk, 24 meters high",
            type: "info",
            icon: Info,
          },
          {
            id: "inscriptions",
            x: 40,
            y: 70,
            title: "Ancient Inscriptions",
            description: "Ge'ez script telling stories of ancient kings",
            type: "artifact",
            icon: Camera,
          },
        ],
      },
    ],
  },
}

export default function EthiopianHeritage3D() {
  const [selectedSite, setSelectedSite] = useState<HistoricalSite | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isRotating, setIsRotating] = useState(true)
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [hoveredSite, setHoveredSite] = useState<string | null>(null)
  const [vrTourOpen, setVrTourOpen] = useState(false)
  const [selectedVrSite, setSelectedVrSite] = useState<any>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 360])

  useEffect(() => {
    if (selectedSite && isRotating) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % selectedSite.images.length)
      }, 4000)
      return () => clearInterval(interval)
    }
  }, [selectedSite, isRotating])

  const handleSiteSelect = (site: HistoricalSite) => {
    setSelectedSite(site)
    setCurrentImageIndex(0)
    setIsRotating(true)
  }

  const handleVrTour = (site: HistoricalSite) => {
    if (site.vrTour && vrTourData[site.id as keyof typeof vrTourData]) {
      setSelectedVrSite(vrTourData[site.id as keyof typeof vrTourData])
      setVrTourOpen(true)
    }
  }

  return (
    <section
      ref={containerRef}
      id="heritage"
      className="py-24 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden"
    >
      {/* Ethiopian Cultural Background Patterns */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        {culturalPatterns.map((pattern, index) => (
          <motion.svg
            key={index}
            className="absolute w-32 h-32 text-amber-800 dark:text-amber-400"
            style={{
              left: `${20 + index * 30}%`,
              top: `${10 + index * 20}%`,
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20 + index * 5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d={pattern} />
          </motion.svg>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900 dark:to-orange-900 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-700 mb-4 px-6 py-2">
            <Crown className="w-4 h-4 mr-2" />
            Ethiopian Heritage & Culture
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-800 via-orange-700 to-red-700 dark:from-amber-400 dark:via-orange-300 dark:to-red-400 bg-clip-text text-transparent">
            Journey Through Time
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Explore Ethiopia's magnificent historical sites in immersive 3D. From ancient kingdoms to sacred churches,
            discover the rich tapestry of Ethiopian civilization that spans over 3,000 years.
          </p>
        </motion.div>

        {/* Interactive 3D Map */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* 3D Interactive Map */}
          <div className="lg:col-span-2">
            <motion.div
              style={{ y }}
              className="relative h-[600px] bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-900 dark:to-orange-800 rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-200 dark:border-amber-700"
            >
              {/* Ethiopia Map Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-200 via-yellow-200 to-red-200 dark:from-green-800 dark:via-yellow-800 dark:to-red-800 opacity-30" />

              {/* Animated Cultural Elements */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full opacity-20"
              />

              {/* Historical Sites Markers */}
              {historicalSites.map((site, index) => (
                <motion.div
                  key={site.id}
                  className="absolute cursor-pointer group"
                  style={{
                    left: `${site.coordinates.x}%`,
                    top: `${site.coordinates.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  whileHover={{ scale: 1.2 }}
                  onClick={() => handleSiteSelect(site)}
                  onHoverStart={() => setHoveredSite(site.id)}
                  onHoverEnd={() => setHoveredSite(null)}
                >
                  {/* Pulsing Ring */}
                  <motion.div
                    className={`absolute inset-0 rounded-full bg-gradient-to-r ${site.color} opacity-30`}
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  />

                  {/* Site Marker */}
                  <div
                    className={`relative w-12 h-12 bg-gradient-to-r ${site.color} rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-gray-800`}
                  >
                    <site.icon className="w-6 h-6 text-white" />
                  </div>

                  {/* VR Badge */}
                  {site.vrTour && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <Eye className="w-3 h-3 text-white" />
                    </div>
                  )}

                  {/* Hover Tooltip */}
                  <AnimatePresence>
                    {hoveredSite === site.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                        animate={{ opacity: 1, y: -60, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.8 }}
                        className="absolute left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-3 min-w-48 border border-gray-200 dark:border-gray-700"
                      >
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm">{site.name}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{site.period}</p>
                        <div className="flex items-center mt-2 text-xs text-amber-600 dark:text-amber-400">
                          <MapPin className="w-3 h-3 mr-1" />
                          Click to explore
                          {site.vrTour && (
                            <>
                              <Eye className="w-3 h-3 ml-2 mr-1" />
                              VR Available
                            </>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}

              {/* Floating Cultural Elements */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-4 h-4 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full opacity-20"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [-20, 20, -20],
                    x: [-10, 10, -10],
                  }}
                  transition={{
                    duration: 4 + i,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </motion.div>
          </div>

          {/* Site Categories */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Explore by Category</h3>
            {[
              { category: "ancient", label: "Ancient Kingdoms", icon: Crown, count: 2 },
              { category: "religious", label: "Sacred Sites", icon: Church, count: 1 },
              { category: "cultural", label: "Cultural Heritage", icon: Palette, count: 2 },
              { category: "natural", label: "Natural Wonders", icon: Mountain, count: 1 },
            ].map((cat) => (
              <motion.div
                key={cat.category}
                whileHover={{ x: 5 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-gray-700 cursor-pointer group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900 dark:to-orange-900 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <cat.icon className="w-5 h-5 text-amber-700 dark:text-amber-300" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{cat.label}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{cat.count} sites</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Selected Site 3D Showcase */}
        <AnimatePresence>
          {selectedSite && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              <div className="grid lg:grid-cols-2 gap-0">
                {/* 3D Image Display */}
                <div className="relative h-96 lg:h-[500px] overflow-hidden">
                  <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative h-full"
                  >
                    <Image
                      src={selectedSite.images[currentImageIndex] || "/placeholder.svg"}
                      alt={`${selectedSite.name} - View ${currentImageIndex + 1}`}
                      fill
                      className="object-cover"
                    />

                    {/* 3D Overlay Effects */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                    {/* Floating Info Hotspots */}
                    {selectedSite.highlights.slice(0, 3).map((highlight, index) => (
                      <motion.div
                        key={highlight}
                        className="absolute bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full p-2 shadow-lg cursor-pointer group"
                        style={{
                          left: `${20 + index * 25}%`,
                          top: `${30 + index * 15}%`,
                        }}
                        animate={{
                          y: [-5, 5, -5],
                        }}
                        transition={{
                          duration: 2 + index * 0.5,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                        whileHover={{ scale: 1.1 }}
                      >
                        <Info className="w-4 h-4 text-amber-600" />
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileHover={{ opacity: 1, scale: 1 }}
                          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg px-2 py-1 whitespace-nowrap"
                        >
                          {highlight}
                        </motion.div>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Image Controls */}
                  <div className="absolute bottom-4 left-4 flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-white/50 dark:border-gray-700/50"
                      onClick={() => setIsRotating(!isRotating)}
                    >
                      {isRotating ? <RotateCcw className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-white/50 dark:border-gray-700/50"
                      onClick={() => setAudioEnabled(!audioEnabled)}
                    >
                      {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    </Button>
                    {selectedSite.vrTour && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-blue-600/90 text-white backdrop-blur-sm border-blue-500/50"
                        onClick={() => handleVrTour(selectedSite)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  {/* Image Navigation Dots */}
                  <div className="absolute bottom-4 right-4 flex space-x-2">
                    {selectedSite.images.map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentImageIndex ? "bg-white scale-125" : "bg-white/50"
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                </div>

                {/* Site Information */}
                <div className="p-8 lg:p-12">
                  <div className="flex items-center space-x-3 mb-4">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${selectedSite.color} rounded-xl flex items-center justify-center`}
                    >
                      <selectedSite.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedSite.name}</h3>
                      <div className="flex items-center text-amber-600 dark:text-amber-400 text-sm">
                        <Clock className="w-4 h-4 mr-1" />
                        {selectedSite.period}
                        {selectedSite.vrTour && (
                          <>
                            <Eye className="w-4 h-4 ml-3 mr-1" />
                            VR Tour Available
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">{selectedSite.description}</p>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Cultural Significance</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      {selectedSite.culturalSignificance}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                        <Star className="w-4 h-4 mr-2 text-amber-500" />
                        Highlights
                      </h4>
                      <ul className="space-y-2">
                        {selectedSite.highlights.map((highlight, index) => (
                          <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2" />
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                        <Camera className="w-4 h-4 mr-2 text-amber-500" />
                        Tourism Features
                      </h4>
                      <ul className="space-y-2">
                        {selectedSite.tourismFeatures.map((feature, index) => (
                          <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white flex-1">
                      <MapPin className="w-4 h-4 mr-2" />
                      Plan Visit
                    </Button>
                    {selectedSite.vrTour ? (
                      <Button
                        variant="outline"
                        className="border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900 flex-1"
                        onClick={() => handleVrTour(selectedSite)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        VR Tour
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        className="border-amber-200 dark:border-amber-700 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900 flex-1"
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Virtual Tour
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cultural Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <h3 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Ethiopian Cultural Timeline
          </h3>
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-amber-400 to-orange-600 rounded-full" />

            {/* Timeline Events */}
            <div className="space-y-12">
              {[
                {
                  period: "3000 BCE",
                  event: "Early Ethiopian Civilizations",
                  description: "First settlements and agricultural development",
                },
                {
                  period: "1000 BCE",
                  event: "Kingdom of D'mt",
                  description: "First organized kingdom in northern Ethiopia",
                },
                {
                  period: "100 CE",
                  event: "Axumite Empire",
                  description: "Major trading empire and early Christianity",
                },
                {
                  period: "1270 CE",
                  event: "Solomonic Dynasty",
                  description: "Medieval Ethiopian empire and church construction",
                },
                {
                  period: "1636 CE",
                  event: "Gondar Period",
                  description: "Imperial capital and architectural renaissance",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`flex items-center ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
                >
                  <div className={`w-5/12 ${index % 2 === 0 ? "text-right pr-8" : "text-left pl-8"}`}>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-amber-100 dark:border-amber-800">
                      <div className="text-amber-600 dark:text-amber-400 font-bold text-lg mb-2">{item.period}</div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{item.event}</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{item.description}</p>
                    </div>
                  </div>

                  {/* Timeline Node */}
                  <div className="w-2/12 flex justify-center">
                    <div className="w-4 h-4 bg-gradient-to-r from-amber-400 to-orange-600 rounded-full border-4 border-white dark:border-gray-800 shadow-lg" />
                  </div>

                  <div className="w-5/12" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* VR Tour Modal */}
      <VRTourModal isOpen={vrTourOpen} onClose={() => setVrTourOpen(false)} site={selectedVrSite} />
    </section>
  )
}
