"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import ImageGallery from "@/components/image-gallery"
import { Camera, Eye, MapPin, Coffee, ChefHat, Music } from "lucide-react"
import Image from "next/image"

const authenticEthiopianImages = [
  {
    id: 1,
    src: "/images/coffee-ceremony-steam.webp",
    title: "Traditional Coffee Ceremony with Steam",
    description:
      "Authentic Ethiopian coffee ceremony showing the traditional jebena with aromatic steam rising, surrounded by small cups in the traditional three-round ceremony setup.",
    location: "Local Family Home, Ethiopia",
    category: "Coffee Culture",
    experience: "Coffee Ceremony Experience",
    price: 800,
    duration: "3 hours",
    highlights: ["Traditional roasting", "Cultural storytelling", "Three rounds ceremony"],
  },
  {
    id: 2,
    src: "/images/coffee-ceremony-woman.jpg",
    title: "Ethiopian Woman Performing Coffee Ceremony",
    description:
      "Young Ethiopian woman in traditional white dress gracefully performing the sacred coffee ceremony, demonstrating the cultural significance and artistry of this ancient tradition.",
    location: "Traditional Setting, Ethiopia",
    category: "Coffee Culture",
    experience: "Coffee Ceremony Experience",
    price: 800,
    duration: "3 hours",
    highlights: ["Traditional dress", "Sacred ceremony", "Cultural education"],
  },
  {
    id: 3,
    src: "/images/injera-making.webp",
    title: "Traditional Injera Making Process",
    description:
      "Ethiopian woman skillfully making injera on a traditional clay oven (mitad), showcasing the ancient technique of preparing Ethiopia's staple bread from teff grain.",
    location: "Family Kitchen, Ethiopia",
    category: "Local Cuisine",
    experience: "Injera Making Workshop",
    price: 1200,
    duration: "4 hours",
    highlights: ["Traditional clay oven", "Teff grain", "Ancient techniques"],
  },
  {
    id: 4,
    src: "/images/injera-bread.webp",
    title: "Authentic Ethiopian Injera Bread",
    description:
      "Perfectly prepared injera bread showing the characteristic spongy texture and rolled presentation, demonstrating the skill required to create this traditional Ethiopian staple.",
    location: "Traditional Kitchen, Ethiopia",
    category: "Local Cuisine",
    experience: "Injera Making Workshop",
    price: 1200,
    duration: "4 hours",
    highlights: ["Spongy texture", "Traditional preparation", "Staple food"],
  },
  {
    id: 5,
    src: "/images/traditional-dance.webp",
    title: "Ethiopian Traditional Folk Dance",
    description:
      "Vibrant Ethiopian cultural dance performance featuring traditional white clothing and colorful decorations, showcasing the joy and community spirit of Ethiopian celebrations.",
    location: "Cultural Festival, Ethiopia",
    category: "Cultural Arts",
    experience: "Traditional Dance & Music",
    price: 600,
    duration: "3 hours",
    highlights: ["Folk dances", "Traditional costumes", "Community celebration"],
  },
  {
    id: 6,
    src: "/images/traditional-meat-dish.jpg",
    title: "Traditional Ethiopian Cuisine Platter",
    description:
      "Authentic Ethiopian meat dishes beautifully arranged on banana leaves with traditional sauces and injera, representing the rich culinary heritage and communal dining culture.",
    location: "Local Restaurant, Ethiopia",
    category: "Local Cuisine",
    experience: "Ethiopian Cuisine Experience",
    price: 1500,
    duration: "5 hours",
    highlights: ["Traditional preparation", "Local spices", "Cultural dining"],
  },
]

export default function AuthenticGallery() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const categories = ["All", "Coffee Culture", "Local Cuisine", "Cultural Arts"]

  const filteredImages =
    selectedCategory === "All"
      ? authenticEthiopianImages
      : authenticEthiopianImages.filter((image) => image.category === selectedCategory)

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index)
    setGalleryOpen(true)
  }

  const handleBookExperience = (experience: string) => {
    console.log(`Booking experience: ${experience}`)
    // In a real app, this would open the booking system
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Coffee Culture":
        return <Coffee className="w-4 h-4" />
      case "Local Cuisine":
        return <ChefHat className="w-4 h-4" />
      case "Cultural Arts":
        return <Music className="w-4 h-4" />
      default:
        return <Camera className="w-4 h-4" />
    }
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
            Authentic Ethiopian Experiences
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="ethiopian-text-gradient">Real Cultural</span>
            <br />
            <span className="text-gray-700 dark:text-gray-300">Experiences Gallery</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Explore authentic Ethiopian cultural experiences through real photographs showcasing traditional coffee
            ceremonies, injera making, folk dances, and authentic cuisine prepared by local families.
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
              {getCategoryIcon(category)}
              <span className="ml-2">{category}</span>
            </Button>
          ))}
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer bg-white dark:bg-gray-800"
            >
              <div className="relative h-80 overflow-hidden">
                <Image
                  src={image.src || "/placeholder.svg"}
                  alt={image.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <Badge className="ethiopian-gradient text-white border-0 text-xs">
                    {getCategoryIcon(image.category)}
                    <span className="ml-1">{image.category}</span>
                  </Badge>
                </div>

                {/* Price Badge */}
                <div className="absolute top-4 right-4">
                  <Badge className="bg-white/90 text-gray-900 border-0 font-bold">{image.price} ETB</Badge>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-xl font-bold mb-2 line-clamp-2">{image.title}</h3>
                  <p className="text-white/90 text-sm mb-3 line-clamp-3">{image.description}</p>

                  <div className="flex items-center text-sm opacity-90 mb-3">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span className="line-clamp-1">{image.location}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {image.highlights.slice(0, 2).map((highlight, i) => (
                      <Badge key={i} variant="outline" className="text-xs border-white/30 text-white/80">
                        {highlight}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleBookExperience(image.experience)
                      }}
                      className="bg-white text-red-600 hover:bg-gray-100 font-semibold flex-1"
                    >
                      Book Experience
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleImageClick(index)
                      }}
                      className="border-white/30 text-white hover:bg-white/20"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* View Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Experience Summary */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Experience Authentic Ethiopian Culture
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-3xl mx-auto">
              These authentic images showcase real Ethiopian cultural experiences you can book and participate in. Each
              experience is hosted by local families and cultural experts who are passionate about sharing their
              heritage.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-12 h-12 ethiopian-gradient rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Coffee className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Coffee Culture</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Experience the birthplace of coffee through traditional ceremonies
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 ethiopian-gradient rounded-lg flex items-center justify-center mx-auto mb-3">
                  <ChefHat className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Culinary Arts</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Learn traditional cooking and bread-making techniques
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 ethiopian-gradient rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Music className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Cultural Arts</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Participate in traditional dances and cultural celebrations
                </p>
              </div>
            </div>
            <Button
              size="lg"
              className="ethiopian-gradient text-white hover:opacity-90 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Camera className="w-5 h-5 mr-2" />
              Book Your Cultural Experience
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Image Gallery Modal */}
      <ImageGallery
        images={filteredImages.map((image) => image.src)}
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        initialIndex={selectedImageIndex}
      />
    </section>
  )
}
