"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import ImageGallery from "@/components/image-gallery"
import { Camera, Eye, Heart, Share2, MapPin } from "lucide-react"
import Image from "next/image"
import { useI18n } from "@/lib/i18n/i18n-context"
import { GalleryCard, AnimatedButton } from "@/components/interactive-elements"

const ethiopianPhotos = [
  {
    id: 1,
    src: "/images/coffee-ceremony-steam.webp",
    title: "Traditional Ethiopian Coffee Ceremony",
    location: "Local Family Home, Ethiopia",
    photographer: "Authentic Cultural Experience",
    category: "Coffee Culture",
    likes: 3247,
  },
  {
    id: 2,
    src: "/images/coffee-ceremony-woman.jpg",
    title: "Ethiopian Woman Performing Coffee Ceremony",
    location: "Traditional Setting, Ethiopia",
    photographer: "Cultural Heritage Documentation",
    category: "Coffee Culture",
    likes: 2891,
  },
  {
    id: 3,
    src: "/images/injera-making.webp",
    title: "Traditional Injera Making Process",
    location: "Family Kitchen, Ethiopia",
    photographer: "Traditional Bread Making",
    category: "Local Cuisine",
    likes: 2634,
  },
  {
    id: 4,
    src: "/images/injera-bread.webp",
    title: "Authentic Ethiopian Injera Bread",
    location: "Traditional Kitchen, Ethiopia",
    photographer: "Local Food Traditions",
    category: "Local Cuisine",
    likes: 2156,
  },
  {
    id: 5,
    src: "/images/traditional-dance.webp",
    title: "Ethiopian Traditional Folk Dance",
    location: "Cultural Festival, Ethiopia",
    photographer: "Community Celebration",
    category: "Cultural Arts",
    likes: 2847,
  },
  {
    id: 6,
    src: "/images/traditional-meat-dish.jpg",
    title: "Traditional Ethiopian Cuisine Platter",
    location: "Local Restaurant, Ethiopia",
    photographer: "Authentic Food Culture",
    category: "Local Cuisine",
    likes: 1943,
  },
  {
    id: 7,
    src: "/images/traditional-ceremony.jpg",
    title: "Traditional Ethiopian Cultural Ceremony",
    location: "Addis Ababa, Ethiopia",
    photographer: "Cultural Heritage Documentation",
    category: "Cultural Arts",
    likes: 2847,
  },
  {
    id: 8,
    src: "/images/ethiopian-textiles.jpg",
    title: "Handwoven Ethiopian Textiles Market",
    location: "Local Artisan Village, Ethiopia",
    photographer: "Traditional Weaving Community",
    category: "Traditional Clothing",
    likes: 1943,
  },
  {
    id: 9,
    src: "/images/traditional-food-prep.jpg",
    title: "Traditional Ethiopian Food Preparation",
    location: "Family Kitchen, Ethiopia",
    photographer: "Local Cooking Traditions",
    category: "Local Cuisine",
    likes: 1623,
  },
  {
    id: 10,
    src: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=600&fit=crop&crop=center",
    title: "Traditional Coffee Ceremony",
    location: "Addis Ababa, Ethiopia",
    photographer: "Local Coffee Master",
    category: "Coffee Culture",
    likes: 1247,
  },
  {
    id: 11,
    src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center",
    title: "Ethiopian Coffee Roasting",
    location: "Sidama Region, Ethiopia",
    photographer: "Coffee Ceremony",
    category: "Coffee Culture",
    likes: 892,
  },
  {
    id: 12,
    src: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop&crop=center",
    title: "Traditional Habesha Dress",
    location: "Gondar, Ethiopia",
    photographer: "Cultural Heritage",
    category: "Traditional Clothing",
    likes: 1456,
  },
  {
    id: 13,
    src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&crop=center",
    title: "Handwoven Ethiopian Textiles",
    location: "Dorze Village, Ethiopia",
    photographer: "Traditional Weaving",
    category: "Traditional Clothing",
    likes: 743,
  },
  {
    id: 14,
    src: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop&crop=center",
    title: "Doro Wot Preparation",
    location: "Local Ethiopian Kitchen",
    photographer: "Traditional Cooking",
    category: "Local Cuisine",
    likes: 1123,
  },
  {
    id: 15,
    src: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&h=600&fit=crop&crop=center",
    title: "Traditional Ethiopian Home",
    location: "Rural Ethiopia",
    photographer: "Local Architecture",
    category: "Local Homes",
    likes: 987,
  },
  {
    id: 16,
    src: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&crop=center",
    title: "Ethiopian Folk Dance",
    location: "Cultural Center, Addis Ababa",
    photographer: "Traditional Performance",
    category: "Cultural Arts",
    likes: 1567,
  },
  {
    id: 17,
    src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&crop=center",
    title: "Injera Making Process",
    location: "Family Kitchen, Ethiopia",
    photographer: "Traditional Bread Making",
    category: "Local Cuisine",
    likes: 834,
  },
  {
    id: 18,
    src: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop&crop=center",
    title: "Ethiopian Spice Market",
    location: "Merkato, Addis Ababa",
    photographer: "Local Market Life",
    category: "Local Culture",
    likes: 1298,
  },
  {
    id: 19,
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=center",
    title: "Traditional Tukul House",
    location: "Omo Valley, Ethiopia",
    photographer: "Indigenous Architecture",
    category: "Local Homes",
    likes: 756,
  },
  {
    id: 20,
    src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center",
    title: "Ethiopian Orthodox Ceremony",
    location: "Lalibela, Ethiopia",
    photographer: "Religious Heritage",
    category: "Cultural Arts",
    likes: 1890,
  },
  {
    id: 21,
    src: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=600&fit=crop&crop=center",
    title: "Coffee Bean Harvesting",
    location: "Yirgacheffe, Ethiopia",
    photographer: "Coffee Farm Life",
    category: "Coffee Culture",
    likes: 1045,
  },
  {
    id: 22,
    src: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop&crop=center",
    title: "Traditional Ethiopian Wedding",
    location: "Amhara Region, Ethiopia",
    photographer: "Cultural Celebration",
    category: "Traditional Clothing",
    likes: 2134,
  },
  {
    id: 23,
    src: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop&crop=center",
    title: "Berbere Spice Preparation",
    location: "Local Spice House, Ethiopia",
    photographer: "Traditional Spices",
    category: "Local Cuisine",
    likes: 678,
  },
  {
    id: 24,
    src: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop&crop=center",
    title: "Ethiopian Honey Wine (Tej)",
    location: "Traditional Tej House, Ethiopia",
    photographer: "Local Beverages",
    category: "Local Cuisine",
    likes: 567,
  },
]

export default function PhotoShowcase() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [likedPhotos, setLikedPhotos] = useState<number[]>([])
  const { t } = useI18n()

  const categories = [
    "All",
    "Coffee Culture",
    "Traditional Clothing",
    "Local Cuisine",
    "Local Homes",
    "Cultural Arts",
    "Local Culture",
  ]

  const filteredPhotos =
    selectedCategory === "All"
      ? ethiopianPhotos
      : ethiopianPhotos.filter((photo) => photo.category === selectedCategory)

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index)
    setGalleryOpen(true)
  }

  const toggleLike = (photoId: number) => {
    setLikedPhotos((prev) => (prev.includes(photoId) ? prev.filter((id) => id !== photoId) : [...prev, photoId]))
  }

  return (
    <section className="py-24 bg-gradient-to-br from-yellow-50 via-green-50 to-red-50 dark:from-gray-900 dark:via-green-900/10 dark:to-red-900/10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="ethiopian-gradient text-white border-0 mb-4 px-6 py-2">
            <Camera className="w-4 h-4 mr-2" />
            {t("gallery.badge") || "Cultural Photo Gallery"}
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="ethiopian-text-gradient">{t("gallery.title") || "Authentic Ethiopian"}</span>
            <br />
            <span className="text-gray-700 dark:text-gray-300">{t("gallery.subtitle") || "Cultural Experiences"}</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            {t("gallery.description") ||
              "Discover the rich tapestry of Ethiopian culture through authentic photographs showcasing traditional coffee ceremonies, handwoven textiles, local cuisine, traditional homes, and vibrant cultural celebrations."}
          </p>
        </motion.div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={`${
                selectedCategory === category
                  ? "ethiopian-gradient text-white border-0"
                  : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20"
              } transition-all duration-300`}
            >
              {t(`gallery.categories.${category.toLowerCase().replace(" ", "_")}`) || category}
            </Button>
          ))}
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPhotos.map((photo, index) => (
            <GalleryCard key={photo.id} className="cursor-pointer" onClick={() => handleImageClick(index)}>
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={photo.src || "/placeholder.svg"}
                  alt={photo.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <Badge className="ethiopian-gradient text-white border-0 text-xs">{photo.category}</Badge>
                </div>

                {/* Actions */}
                <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm w-8 h-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleLike(photo.id)
                    }}
                  >
                    <Heart className={`w-4 h-4 ${likedPhotos.includes(photo.id) ? "fill-red-500 text-red-500" : ""}`} />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm w-8 h-8 p-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-lg font-bold mb-1 line-clamp-1">{photo.title}</h3>
                  <div className="flex items-center text-sm opacity-90 mb-2">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span className="line-clamp-1">{photo.location}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="opacity-75 line-clamp-1">{photo.photographer}</span>
                    <div className="flex items-center">
                      <Heart className="w-3 h-3 mr-1" />
                      {photo.likes}
                    </div>
                  </div>
                </div>

                {/* View Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
            </GalleryCard>
          ))}
        </div>

        {/* Cultural Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-6">
              <div className="w-12 h-12 ethiopian-gradient rounded-lg flex items-center justify-center mx-auto mb-4">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                {t("gallery.highlights.authentic.title") || "Authentic Moments"}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {t("gallery.highlights.authentic.description") ||
                  "Every photo captures genuine Ethiopian cultural moments, from intimate family gatherings to vibrant community celebrations."}
              </p>
            </div>
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-6">
              <div className="w-12 h-12 ethiopian-gradient rounded-lg flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                {t("gallery.highlights.stories.title") || "Local Stories"}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {t("gallery.highlights.stories.description") ||
                  "Each image tells a story of Ethiopian heritage, showcasing the daily life and traditions of local communities."}
              </p>
            </div>
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-6">
              <div className="w-12 h-12 ethiopian-gradient rounded-lg flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                {t("gallery.highlights.diversity.title") || "Cultural Diversity"}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {t("gallery.highlights.diversity.description") ||
                  "Explore the incredible diversity of Ethiopian culture across different regions, tribes, and traditions."}
              </p>
            </div>
          </div>

          <AnimatedButton
            size="lg"
            className="ethiopian-gradient text-white px-8 py-4 hover:opacity-90 transition-all duration-300"
            icon={Camera}
          >
            {t("gallery.cta") || "Experience These Moments Yourself"}
          </AnimatedButton>
        </motion.div>
      </div>

      {/* Image Gallery Modal */}
      <ImageGallery
        images={filteredPhotos.map((photo) => photo.src)}
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        initialIndex={selectedImageIndex}
      />
    </section>
  )
}
