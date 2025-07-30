export interface ExperienceType {
  id: string
  name: string
  description: string
  image: string
  duration: string
  basePrice: number
  rating: number
  maxGroupSize: number
  category: string
  location: {
    name: string
    address: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  languages: string[]
  availableTimes: string[]
  includes: string[]
  host: {
    name: string
    image: string
    rating: number
    reviewCount: number
    bio: string
  }
  reviews: {
    id: string
    author: string
    rating: number
    comment: string
    date: string
  }[]
}

export const experiences: ExperienceType[] = [
  {
    id: "coffee-ceremony",
    name: "Traditional Coffee Ceremony",
    description:
      "Experience the birthplace of coffee through authentic ceremonies with local families. Learn about the cultural significance of coffee in Ethiopian society while participating in the traditional three-round ceremony.",
    image: "/images/coffee-ceremony-woman.jpg",
    duration: "3 hours",
    basePrice: 800,
    rating: 4.9,
    maxGroupSize: 8,
    category: "Coffee Culture",
    location: {
      name: "Addis Ababa",
      address: "Bole District, Addis Ababa, Ethiopia",
      coordinates: { lat: 9.0192, lng: 38.7525 },
    },
    languages: ["English", "Amharic", "Oromiffa"],
    availableTimes: ["9:00 AM", "2:00 PM", "5:00 PM"],
    includes: [
      "Traditional coffee roasting",
      "Three rounds of coffee",
      "Cultural storytelling",
      "Traditional snacks",
      "Take-home coffee beans",
      "Cultural guide",
    ],
    host: {
      name: "Almaz Tadesse",
      image: "/placeholder.svg?height=100&width=100",
      rating: 4.9,
      reviewCount: 127,
      bio: "Almaz has been sharing Ethiopian coffee culture with visitors for over 15 years. She learned the traditional ceremony from her grandmother and is passionate about preserving this beautiful tradition.",
    },
    reviews: [
      {
        id: "1",
        author: "Sarah Johnson",
        rating: 5,
        comment:
          "An absolutely magical experience! Almaz was so welcoming and taught us so much about Ethiopian culture.",
        date: "2024-01-15",
      },
      {
        id: "2",
        author: "Michael Chen",
        rating: 5,
        comment: "The coffee ceremony was incredible. Such a peaceful and authentic experience.",
        date: "2024-01-10",
      },
    ],
  },
  {
    id: "injera-workshop",
    name: "Injera Making Workshop",
    description:
      "Learn to make Ethiopia's staple bread using traditional methods and clay ovens. Discover the art of teff preparation and master the technique of creating perfect injera.",
    image: "/images/injera-making.webp",
    duration: "4 hours",
    basePrice: 1200,
    rating: 4.8,
    maxGroupSize: 6,
    category: "Culinary Arts",
    location: {
      name: "Traditional Kitchen",
      address: "Merkato Area, Addis Ababa, Ethiopia",
      coordinates: { lat: 9.0084, lng: 38.7575 },
    },
    languages: ["English", "Amharic"],
    availableTimes: ["10:00 AM", "3:00 PM"],
    includes: [
      "Teff grain preparation",
      "Traditional clay oven cooking",
      "Family recipes sharing",
      "Injera tasting",
      "Take-home injera",
      "Recipe booklet",
    ],
    host: {
      name: "Desta Bekele",
      image: "/placeholder.svg?height=100&width=100",
      rating: 4.8,
      reviewCount: 89,
      bio: "Desta comes from a family of traditional bakers and has been making injera for over 20 years. She loves teaching visitors the secrets of perfect injera making.",
    },
    reviews: [
      {
        id: "1",
        author: "Emma Wilson",
        rating: 5,
        comment: "Desta was an amazing teacher! I never thought I could make injera, but now I can do it at home.",
        date: "2024-01-12",
      },
    ],
  },
  {
    id: "traditional-dance",
    name: "Folk Dance & Music Experience",
    description:
      "Join vibrant Ethiopian folk dances and learn traditional music with local communities. Experience the joy and energy of Ethiopian cultural celebrations.",
    image: "/images/traditional-dance.webp",
    duration: "3 hours",
    basePrice: 600,
    rating: 4.9,
    maxGroupSize: 12,
    category: "Cultural Arts",
    location: {
      name: "Cultural Center",
      address: "Piazza Area, Addis Ababa, Ethiopia",
      coordinates: { lat: 9.0348, lng: 38.7596 },
    },
    languages: ["English", "Amharic", "Oromiffa"],
    availableTimes: ["11:00 AM", "4:00 PM", "7:00 PM"],
    includes: [
      "Traditional dance lessons",
      "Live music performance",
      "Cultural costume try-on",
      "Group celebration",
      "Photo session",
      "Cultural explanation",
    ],
    host: {
      name: "Yohannes Mulugeta",
      image: "/placeholder.svg?height=100&width=100",
      rating: 4.9,
      reviewCount: 203,
      bio: "Yohannes is a professional dancer and cultural educator who has performed Ethiopian traditional dances internationally. He loves sharing the joy of Ethiopian music and dance.",
    },
    reviews: [
      {
        id: "1",
        author: "David Martinez",
        rating: 5,
        comment: "So much fun! Yohannes made everyone feel comfortable and the dances were amazing to learn.",
        date: "2024-01-08",
      },
    ],
  },
  {
    id: "cuisine-experience",
    name: "Ethiopian Cuisine Experience",
    description:
      "Discover authentic Ethiopian flavors including traditional meat dishes and spices. Learn about the cultural significance of food in Ethiopian society.",
    image: "/images/traditional-meat-dish.jpg",
    duration: "5 hours",
    basePrice: 1500,
    rating: 4.7,
    maxGroupSize: 8,
    category: "Culinary",
    location: {
      name: "Traditional Restaurant",
      address: "Kazanchis Area, Addis Ababa, Ethiopia",
      coordinates: { lat: 9.0227, lng: 38.7468 },
    },
    languages: ["English", "Amharic"],
    availableTimes: ["12:00 PM", "6:00 PM"],
    includes: [
      "Traditional cooking class",
      "Spice market tour",
      "Multi-course meal",
      "Recipe sharing",
      "Spice take-home kit",
      "Cultural dining experience",
    ],
    host: {
      name: "Meron Haile",
      image: "/placeholder.svg?height=100&width=100",
      rating: 4.7,
      reviewCount: 156,
      bio: "Meron is a chef specializing in traditional Ethiopian cuisine. She has worked in restaurants across Ethiopia and loves teaching visitors about the rich culinary heritage.",
    },
    reviews: [
      {
        id: "1",
        author: "Lisa Thompson",
        rating: 5,
        comment: "The food was incredible and Meron taught us so much about Ethiopian spices and cooking techniques.",
        date: "2024-01-05",
      },
    ],
  },
]

export const addOns = [
  {
    id: "transport",
    name: "Private Transport",
    price: 500,
    description: "Private vehicle with driver for pickup and drop-off",
  },
  {
    id: "guide",
    name: "Cultural Guide",
    price: 300,
    description: "Dedicated cultural interpreter and guide",
  },
  {
    id: "meals",
    name: "Traditional Meals",
    price: 400,
    description: "Authentic Ethiopian dining experiences",
  },
  {
    id: "materials",
    name: "Craft Materials",
    price: 200,
    description: "Take-home craft supplies and materials",
  },
  {
    id: "photos",
    name: "Professional Photos",
    price: 600,
    description: "Professional photography of your experience",
  },
  {
    id: "certificate",
    name: "Participation Certificate",
    price: 100,
    description: "Official certificate of cultural experience completion",
  },
]

export const paymentMethods = [
  {
    id: "telebirr",
    name: "TeleBirr",
    icon: "smartphone",
    description: "Ethiopia's leading mobile payment platform",
    discount: 5,
    surcharge: null,
  },
  {
    id: "cbe-birr",
    name: "CBE Birr",
    icon: "smartphone",
    description: "Commercial Bank of Ethiopia mobile payment",
    discount: null,
    surcharge: null,
  },
  {
    id: "credit-card",
    name: "Credit/Debit Card",
    icon: "credit-card",
    description: "Visa, Mastercard, American Express",
    discount: null,
    surcharge: 3,
  },
  {
    id: "bank-transfer",
    name: "Bank Transfer",
    icon: "landmark",
    description: "Direct bank transfer",
    discount: 2,
    surcharge: null,
  },
  {
    id: "cash",
    name: "Cash Payment",
    icon: "wallet",
    description: "Pay in cash upon arrival",
    discount: null,
    surcharge: null,
  },
]

export const discountCodes = [
  {
    code: "WELCOME10",
    discount: 10,
    type: "percentage",
    description: "10% off for first-time visitors",
  },
  {
    code: "FAMILY20",
    discount: 20,
    type: "percentage",
    description: "20% off for families (4+ people)",
  },
  {
    code: "STUDENT15",
    discount: 15,
    type: "percentage",
    description: "15% off for students with valid ID",
  },
  {
    code: "EARLYBIRD",
    discount: 500,
    type: "fixed",
    description: "500 ETB off for bookings 7+ days in advance",
  },
]

export function getExperienceById(id: string): ExperienceType | null {
  return experiences.find((exp) => exp.id === id) || null
}

export function getAvailableDates(): { date: string; available: boolean }[] {
  const dates = []
  const today = new Date()

  for (let i = 0; i < 30; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)

    // Randomly make some dates unavailable (for demo purposes)
    const available = Math.random() > 0.2

    dates.push({
      date: date.toISOString().split("T")[0],
      available,
    })
  }

  return dates
}
