"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  X,
  Play,
  Pause,
  Maximize,
  Volume2,
  VolumeX,
  Move3D,
  Eye,
  Navigation,
  Info,
  Camera,
  Clock,
  Users,
  Star,
  Headphones,
  Smartphone,
  Monitor,
} from "lucide-react"

interface VRTourProps {
  isOpen: boolean
  onClose: () => void
  site: {
    id: string
    name: string
    description: string
    vrScenes: VRScene[]
    duration: string
    difficulty: string
    highlights: string[]
  } | null
}

interface VRScene {
  id: string
  name: string
  description: string
  image: string
  hotspots: Hotspot[]
  audioGuide?: string
  panorama360?: string
}

interface Hotspot {
  id: string
  x: number
  y: number
  title: string
  description: string
  type: "info" | "navigation" | "artifact" | "audio"
  icon: any
}

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
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center",
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
            icon: Navigation,
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
        image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop&crop=center",
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
      {
        id: "underground-tunnel",
        name: "Underground Passages",
        description: "Explore the mysterious tunnels connecting the churches",
        image: "/placeholder.svg?height=600&width=800&text=Lalibela+Tunnels+360",
        hotspots: [
          {
            id: "tunnel-system",
            x: 40,
            y: 50,
            title: "Tunnel Network",
            description: "Complex system of tunnels and chambers",
            type: "info",
            icon: Info,
          },
          {
            id: "next-church",
            x: 80,
            y: 45,
            title: "To Next Church",
            description: "Follow the tunnel to another church",
            type: "navigation",
            icon: Navigation,
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
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=center",
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

export default function VRTourModal({ isOpen, onClose, site }: VRTourProps) {
  const [currentScene, setCurrentScene] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null)
  const [viewMode, setViewMode] = useState<"vr" | "360" | "standard">("standard")
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const vrContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && site) {
      setCurrentScene(0)
      setSelectedHotspot(null)
    }
  }, [isOpen, site])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (vrContainerRef.current) {
      const rect = vrContainerRef.current.getBoundingClientRect()
      setMousePosition({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      })
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      vrContainerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  if (!isOpen || !site) return null

  const currentSceneData = site.vrScenes[currentScene]

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden m-4"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{site.name}</h2>
              <p className="text-blue-100">{site.description}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-white/20 text-white border-white/30">
                <Clock className="w-4 h-4 mr-1" />
                {site.duration}
              </Badge>
              <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* VR Controls */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                className={`border-white/30 text-white hover:bg-white/20 ${
                  viewMode === "standard" ? "bg-white/20" : ""
                }`}
                onClick={() => setViewMode("standard")}
              >
                <Monitor className="w-4 h-4 mr-1" />
                Standard
              </Button>
              <Button
                size="sm"
                variant="outline"
                className={`border-white/30 text-white hover:bg-white/20 ${viewMode === "360" ? "bg-white/20" : ""}`}
                onClick={() => setViewMode("360")}
              >
                <Move3D className="w-4 h-4 mr-1" />
                360°
              </Button>
              <Button
                size="sm"
                variant="outline"
                className={`border-white/30 text-white hover:bg-white/20 ${viewMode === "vr" ? "bg-white/20" : ""}`}
                onClick={() => setViewMode("vr")}
              >
                <Eye className="w-4 h-4 mr-1" />
                VR Mode
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/20"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/20"
                onClick={() => setAudioEnabled(!audioEnabled)}
              >
                {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/20"
                onClick={toggleFullscreen}
              >
                <Maximize className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex h-[calc(95vh-200px)]">
          {/* VR Viewer */}
          <div className="flex-1 relative">
            <div
              ref={vrContainerRef}
              className={`relative h-full bg-black overflow-hidden ${
                viewMode === "vr" ? "grid grid-cols-2 gap-1" : ""
              }`}
              onMouseMove={handleMouseMove}
            >
              {/* VR Scene */}
              {viewMode === "vr" ? (
                // VR Split View
                <>
                  <div className="relative h-full">
                    <img
                      src={currentSceneData.image || "/placeholder.svg"}
                      alt={currentSceneData.name}
                      className="w-full h-full object-cover"
                      style={{
                        transform: `perspective(1000px) rotateY(${(mousePosition.x - 50) * 0.1}deg) rotateX(${
                          (mousePosition.y - 50) * 0.1
                        }deg)`,
                      }}
                    />
                    {/* VR Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent" />
                  </div>
                  <div className="relative h-full">
                    <img
                      src={currentSceneData.image || "/placeholder.svg"}
                      alt={currentSceneData.name}
                      className="w-full h-full object-cover"
                      style={{
                        transform: `perspective(1000px) rotateY(${(mousePosition.x - 50) * 0.1 + 5}deg) rotateX(${
                          (mousePosition.y - 50) * 0.1
                        }deg)`,
                      }}
                    />
                    {/* VR Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-l from-red-500/10 to-transparent" />
                  </div>
                </>
              ) : (
                // Standard/360 View
                <div className="relative h-full">
                  <img
                    src={currentSceneData.image || "/placeholder.svg"}
                    alt={currentSceneData.name}
                    className="w-full h-full object-cover transition-transform duration-300"
                    style={{
                      transform:
                        viewMode === "360"
                          ? `perspective(1000px) rotateY(${(mousePosition.x - 50) * 0.2}deg) rotateX(${
                              (mousePosition.y - 50) * 0.1
                            }deg) scale(1.1)`
                          : "none",
                    }}
                  />

                  {/* Hotspots */}
                  {currentSceneData.hotspots.map((hotspot) => (
                    <motion.div
                      key={hotspot.id}
                      className="absolute cursor-pointer group"
                      style={{
                        left: `${hotspot.x}%`,
                        top: `${hotspot.y}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                      whileHover={{ scale: 1.2 }}
                      onClick={() => setSelectedHotspot(hotspot)}
                    >
                      {/* Pulsing Ring */}
                      <motion.div
                        className="absolute inset-0 rounded-full bg-white/30 border-2 border-white"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      />

                      {/* Hotspot Icon */}
                      <div className="relative w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <hotspot.icon className="w-4 h-4 text-blue-600" />
                      </div>

                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-black/80 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap">
                          {hotspot.title}
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* 360° Indicator */}
                  {viewMode === "360" && (
                    <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      <Move3D className="w-4 h-4 inline mr-1" />
                      360° View - Move mouse to explore
                    </div>
                  )}

                  {/* VR Mode Indicator */}
                  {viewMode === "vr" && (
                    <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      <Eye className="w-4 h-4 inline mr-1" />
                      VR Mode - Use VR headset for immersive experience
                    </div>
                  )}
                </div>
              )}

              {/* Scene Navigation */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {site.vrScenes.map((scene, index) => (
                  <button
                    key={scene.id}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentScene ? "bg-white scale-125" : "bg-white/50"
                    }`}
                    onClick={() => setCurrentScene(index)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="w-80 bg-gray-50 dark:bg-gray-800 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Current Scene Info */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{currentSceneData.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{currentSceneData.description}</p>
              </div>

              {/* Scene Navigation */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Scenes</h4>
                <div className="space-y-2">
                  {site.vrScenes.map((scene, index) => (
                    <button
                      key={scene.id}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        index === currentScene
                          ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100"
                          : "bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                      }`}
                      onClick={() => setCurrentScene(index)}
                    >
                      <div className="font-medium text-sm">{scene.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{scene.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Hotspots */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Points of Interest</h4>
                <div className="space-y-2">
                  {currentSceneData.hotspots.map((hotspot) => (
                    <button
                      key={hotspot.id}
                      className="w-full text-left p-3 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      onClick={() => setSelectedHotspot(hotspot)}
                    >
                      <div className="flex items-center space-x-2">
                        <hotspot.icon className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-sm">{hotspot.title}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tour Info */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Tour Information</h4>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Clock className="w-4 h-4 mr-2" />
                    Duration: {site.duration}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Users className="w-4 h-4 mr-2" />
                    Difficulty: {site.difficulty}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Star className="w-4 h-4 mr-2" />
                    Interactive Experience
                  </div>
                </div>
              </div>

              {/* Highlights */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Highlights</h4>
                <ul className="space-y-2">
                  {site.highlights.map((highlight, index) => (
                    <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Device Compatibility */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Compatible Devices</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-2 bg-white dark:bg-gray-700 rounded-lg">
                    <Smartphone className="w-6 h-6 mx-auto mb-1 text-blue-600" />
                    <div className="text-xs">Mobile</div>
                  </div>
                  <div className="text-center p-2 bg-white dark:bg-gray-700 rounded-lg">
                    <Monitor className="w-6 h-6 mx-auto mb-1 text-blue-600" />
                    <div className="text-xs">Desktop</div>
                  </div>
                  <div className="text-center p-2 bg-white dark:bg-gray-700 rounded-lg">
                    <Eye className="w-6 h-6 mx-auto mb-1 text-blue-600" />
                    <div className="text-xs">VR Headset</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hotspot Detail Modal */}
        <AnimatePresence>
          {selectedHotspot && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 flex items-center justify-center p-4"
              onClick={() => setSelectedHotspot(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <selectedHotspot.icon className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{selectedHotspot.title}</h3>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedHotspot(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{selectedHotspot.description}</p>
                {selectedHotspot.type === "audio" && (
                  <Button className="w-full">
                    <Headphones className="w-4 h-4 mr-2" />
                    Play Audio Guide
                  </Button>
                )}
                {selectedHotspot.type === "navigation" && (
                  <Button className="w-full">
                    <Navigation className="w-4 h-4 mr-2" />
                    Go to Location
                  </Button>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
