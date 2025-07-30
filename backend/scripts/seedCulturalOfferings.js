const mongoose = require("mongoose")
const User = require("../models/User")
const CulturalOffering = require("../models/CulturalOffering")
require("dotenv").config()

const sampleOfferings = [
  {
    title: "Traditional Ethiopian Coffee Ceremony",
    description:
      "Experience the authentic Ethiopian coffee ceremony in a traditional setting. Learn about the cultural significance of coffee in Ethiopian society, participate in the roasting and brewing process, and enjoy freshly prepared coffee with traditional snacks. This intimate experience includes storytelling about coffee's origins and its role in Ethiopian daily life.",
    shortDescription: "Authentic coffee ceremony with cultural storytelling and traditional snacks",
    category: "Coffee Culture",
    images: [
      {
        url: "/images/coffee-ceremony-woman.jpg",
        caption: "Traditional coffee ceremony preparation",
        isMain: true,
      },
      {
        url: "/images/coffee-ceremony-steam.webp",
        caption: "Aromatic coffee brewing process",
        isMain: false,
      },
    ],
    price: {
      amount: 500,
      currency: "ETB",
      priceType: "per_person",
    },
    location: {
      address: "Merkato Cultural Center",
      city: "Addis Ababa",
      region: "Addis Ababa",
      country: "Ethiopia",
      coordinates: {
        latitude: 9.0192,
        longitude: 38.7525,
      },
    },
    duration: {
      hours: 2,
      days: 0,
    },
    maxGuests: 8,
    minGuests: 2,
    amenities: ["Food Included", "Cultural Dress", "Photos Included", "Traditional Music"],
    languages: ["English", "Amharic"],
    difficulty: "Easy",
    availability: {
      schedule: [
        {
          dayOfWeek: "Monday",
          isAvailable: true,
          timeSlots: [
            {
              startTime: "09:00",
              endTime: "11:00",
              maxBookings: 2,
            },
            {
              startTime: "14:00",
              endTime: "16:00",
              maxBookings: 2,
            },
          ],
        },
        {
          dayOfWeek: "Tuesday",
          isAvailable: true,
          timeSlots: [
            {
              startTime: "09:00",
              endTime: "11:00",
              maxBookings: 2,
            },
          ],
        },
        {
          dayOfWeek: "Wednesday",
          isAvailable: true,
          timeSlots: [
            {
              startTime: "14:00",
              endTime: "16:00",
              maxBookings: 2,
            },
          ],
        },
        {
          dayOfWeek: "Thursday",
          isAvailable: true,
          timeSlots: [
            {
              startTime: "09:00",
              endTime: "11:00",
              maxBookings: 2,
            },
          ],
        },
        {
          dayOfWeek: "Friday",
          isAvailable: true,
          timeSlots: [
            {
              startTime: "14:00",
              endTime: "16:00",
              maxBookings: 2,
            },
          ],
        },
        {
          dayOfWeek: "Saturday",
          isAvailable: true,
          timeSlots: [
            {
              startTime: "10:00",
              endTime: "12:00",
              maxBookings: 3,
            },
            {
              startTime: "15:00",
              endTime: "17:00",
              maxBookings: 3,
            },
          ],
        },
        {
          dayOfWeek: "Sunday",
          isAvailable: false,
          timeSlots: [],
        },
      ],
    },
    requirements: ["Comfortable seating on floor", "Respect for cultural traditions"],
    whatToExpect: [
      "Traditional coffee roasting demonstration",
      "Cultural storytelling about coffee history",
      "Participation in brewing process",
      "Traditional snacks and refreshments",
      "Photo opportunities in traditional dress",
    ],
    whatToBring: ["Comfortable clothing", "Camera (optional)", "Open mind and curiosity"],
    tags: ["coffee", "tradition", "culture", "authentic", "storytelling"],
    seasonalInfo: {
      bestMonths: ["October", "November", "December", "January", "February", "March"],
      weatherConsiderations: "Indoor activity, suitable year-round",
    },
  },
  {
    title: "Injera Making Workshop",
    description:
      "Learn the art of making injera, Ethiopia's staple bread, from scratch. This hands-on workshop covers the entire process from preparing the teff batter to cooking on a traditional mitad. Participants will learn about the nutritional benefits of teff, the fermentation process, and the cultural significance of injera in Ethiopian cuisine.",
    shortDescription: "Hands-on workshop to learn traditional injera bread making",
    category: "Culinary Arts",
    images: [
      {
        url: "/images/injera-making.webp",
        caption: "Traditional injera preparation",
        isMain: true,
      },
      {
        url: "/images/injera-bread.webp",
        caption: "Fresh injera bread",
        isMain: false,
      },
    ],
    price: {
      amount: 750,
      currency: "ETB",
      priceType: "per_person",
    },
    location: {
      address: "Traditional Kitchen, Bole District",
      city: "Addis Ababa",
      region: "Addis Ababa",
      country: "Ethiopia",
      coordinates: {
        latitude: 8.9806,
        longitude: 38.7578,
      },
    },
    duration: {
      hours: 3,
      days: 0,
    },
    maxGuests: 6,
    minGuests: 2,
    amenities: ["Food Included", "Equipment Provided", "Recipe Card", "Photos Included"],
    languages: ["English", "Amharic"],
    difficulty: "Moderate",
    availability: {
      schedule: [
        {
          dayOfWeek: "Tuesday",
          isAvailable: true,
          timeSlots: [
            {
              startTime: "10:00",
              endTime: "13:00",
              maxBookings: 1,
            },
          ],
        },
        {
          dayOfWeek: "Thursday",
          isAvailable: true,
          timeSlots: [
            {
              startTime: "10:00",
              endTime: "13:00",
              maxBookings: 1,
            },
          ],
        },
        {
          dayOfWeek: "Saturday",
          isAvailable: true,
          timeSlots: [
            {
              startTime: "09:00",
              endTime: "12:00",
              maxBookings: 1,
            },
            {
              startTime: "14:00",
              endTime: "17:00",
              maxBookings: 1,
            },
          ],
        },
      ],
    },
    requirements: ["Willingness to get hands dirty", "Basic cooking interest"],
    whatToExpected: [
      "Teff grain introduction and preparation",
      "Fermentation process explanation",
      "Hands-on injera cooking experience",
      "Traditional Ethiopian meal with your injera",
      "Recipe and tips to take home",
    ],
    whatToBring: ["Apron (provided if needed)", "Hair tie for long hair", "Appetite for learning"],
    tags: ["cooking", "injera", "teff", "traditional", "hands-on"],
    seasonalInfo: {
      bestMonths: ["All year"],
      weatherConsiderations: "Indoor cooking activity",
    },
  },
  {
    title: "Traditional Ethiopian Dance & Music Experience",
    description:
      "Immerse yourself in the vibrant world of Ethiopian traditional dance and music. Learn basic steps from various regional dances including Eskista (shoulder dance), participate in traditional music sessions, and understand the cultural context behind different performances. This interactive experience includes live music, dance instruction, and cultural storytelling.",
    shortDescription: "Interactive traditional dance and music learning experience",
    category: "Music & Dance",
    images: [
      {
        url: "/images/traditional-dance.webp",
        caption: "Traditional Ethiopian dance performance",
        isMain: true,
      },
    ],
    price: {
      amount: 600,
      currency: "ETB",
      priceType: "per_person",
    },
    location: {
      address: "Cultural Arts Center, Piazza",
      city: "Addis Ababa",
      region: "Addis Ababa",
      country: "Ethiopia",
      coordinates: {
        latitude: 9.0348,
        longitude: 38.7596,
      },
    },
    duration: {
      hours: 2.5,
      days: 0,
    },
    maxGuests: 12,
    minGuests: 3,
    amenities: ["Traditional Music", "Cultural Dress", "Photos Included", "Refreshments"],
    languages: ["English", "Amharic"],
    difficulty: "Easy",
    availability: {
      schedule: [
        {
          dayOfWeek: "Wednesday",
          isAvailable: true,
          timeSlots: [
            {
              startTime: "16:00",
              endTime: "18:30",
              maxBookings: 1,
            },
          ],
        },
        {
          dayOfWeek: "Friday",
          isAvailable: true,
          timeSlots: [
            {
              startTime: "16:00",
              endTime: "18:30",
              maxBookings: 1,
            },
          ],
        },
        {
          dayOfWeek: "Saturday",
          isAvailable: true,
          timeSlots: [
            {
              startTime: "14:00",
              endTime: "16:30",
              maxBookings: 1,
            },
          ],
        },
        {
          dayOfWeek: "Sunday",
          isAvailable: true,
          timeSlots: [
            {
              startTime: "15:00",
              endTime: "17:30",
              maxBookings: 1,
            },
          ],
        },
      ],
    },
    requirements: ["Comfortable clothing for movement", "Willingness to participate"],
    whatToExpect: [
      "Introduction to Ethiopian music instruments",
      "Basic dance step instruction",
      "Cultural context and history",
      "Group participation and fun",
      "Traditional costume photo session",
    ],
    whatToBring: ["Comfortable shoes", "Water bottle", "Enthusiasm for learning"],
    tags: ["dance", "music", "culture", "interactive", "traditional"],
    seasonalInfo: {
      bestMonths: ["All year"],
      weatherConsiderations: "Indoor activity with good ventilation",
    },
  },
]

const seedCulturalOfferings = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/huletfish")
    console.log("✅ Connected to MongoDB")

    // Find a host user to assign offerings to
    const host = await User.findOne({ role: "host" })
    if (!host) {
      console.log("❌ No host user found. Please create a host user first.")
      process.exit(1)
    }

    console.log(`📝 Found host: ${host.name} (${host.email})`)

    // Clear existing cultural offerings
    await CulturalOffering.deleteMany({})
    console.log("🗑️ Cleared existing cultural offerings")

    // Add host ID to each offering
    const offeringsWithHost = sampleOfferings.map((offering) => ({
      ...offering,
      host: host._id,
      isActive: true,
      isApproved: true, // Pre-approve for demo purposes
    }))

    // Insert sample offerings
    const createdOfferings = await CulturalOffering.insertMany(offeringsWithHost)
    console.log(`✅ Created ${createdOfferings.length} cultural offerings`)

    // Update host profile with some stats
    host.hostProfile = {
      ...host.hostProfile,
      experience: 5,
      specialties: ["Coffee Culture", "Culinary Arts", "Music & Dance"],
      rating: 4.8,
      totalReviews: 24,
      isApproved: true,
    }
    await host.save()
    console.log("✅ Updated host profile")

    console.log("\n🎉 Cultural offerings seeded successfully!")
    console.log("\nCreated offerings:")
    createdOfferings.forEach((offering, index) => {
      console.log(`${index + 1}. ${offering.title} - ${offering.category}`)
    })

    process.exit(0)
  } catch (error) {
    console.error("❌ Error seeding cultural offerings:", error)
    process.exit(1)
  }
}

// Run the seeding function
seedCulturalOfferings()
