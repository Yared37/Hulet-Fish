"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { X, ChevronLeft, ChevronRight, Download, Share2, Heart } from "lucide-react"
import Image from "next/image"

interface ImageGalleryProps {
  images: string[]
  isOpen: boolean
  onClose: () => void
  initialIndex?: number
}

export default function ImageGallery({ images, isOpen, onClose, initialIndex = 0 }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [isLiked, setIsLiked] = useState(false)

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full h-full flex items-center justify-center p-4"
      >
        {/* Header */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <div className="text-white">
            <span className="text-sm opacity-75">
              {currentIndex + 1} of {images.length}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className={`w-5 h-5 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <Share2 className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <Download className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Main Image */}
        <div className="relative w-full h-full max-w-6xl max-h-[80vh]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-full"
            >
              <Image
                src={images[currentIndex] || "/placeholder.svg"}
                alt={`Gallery image ${currentIndex + 1}`}
                fill
                className="object-contain"
                priority
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="lg"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 w-12 h-12 rounded-full"
              onClick={prevImage}
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 w-12 h-12 rounded-full"
              onClick={nextImage}
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </>
        )}

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 max-w-full overflow-x-auto px-4">
            {images.map((image, index) => (
              <button
                key={index}
                className={`relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 ${
                  index === currentIndex ? "ring-2 ring-white" : "opacity-60 hover:opacity-100"
                }`}
                onClick={() => setCurrentIndex(index)}
              >
                <Image src={image || "/placeholder.svg"} alt={`Thumbnail ${index + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
