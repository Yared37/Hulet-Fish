const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
require("dotenv").config()

const User = require("../models/User")
const Tour = require("../models/Tour")

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/huletfish")
    console.log("✅ Connected to MongoDB")
  } catch (error) {
    console.error("❌ MongoDB connection error:", error)
    process.exit(1)
  }
}

const seedUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany({})

    const users = [
      {
        name: "Admin User",
        email: "admin@huletfish.com",
        password: "admin123",
        role: "admin",
        isVerified: true,
        location: {
          city: "Addis Ababa",
          region: "Addis Ababa",
          country: "Ethiopia",
        },
      },
      {
        name: "Almaz Tadesse",
        email: "almaz@example.com",
        password: "host123",
        role: "host",
        phone: "+251911234567",
        isVerified: true,
        location: {
          city: "Lalibela",
          region: "Amhara",
          country: "Ethiopia",
        },
        languages: ["English", "Amharic"],
        bio: "Traditional coffee ceremony expert with 15 years of experience sharing Ethiopian culture with visitors.",
        hostProfile: {
          experience: 15,
          specialties: ["Coffee Culture", "Traditional Ceremonies"],
          rating: 4.8,
          totalReviews: 127,
          isApproved: true,
        },
      },
      {
        name: "Bekele Mekonen",
        email: "bekele@example.com",
        password: "host123",
        role: "host",
        phone: "+251922345678",
        isVerified: true,
        location: {
          city: "Gondar",
          region: "Amhara",
          country: "Ethiopia",
        },
        languages: ["English", "Amharic"],
        bio: "Master chef specializing in traditional Ethiopian cuisine and injera making workshops.",
        hostProfile: {
          experience: 12,
          specialties: ["Culinary Arts", "Traditional Cooking"],
          rating: 4.9,
          totalReviews: 89,
          isApproved: true,
        },
      },
      {
        name: "Sarah Johnson",
        email: "sarah@example.com",
        password: "tourist123",
        role: "tourist",
        phone: "+1234567890",
        isVerified: true,
        location: {
          city: "New York",
          region: "NY",
          country: "USA",
        },
        languages: ["English"],
      },
    ]

    const createdUsers = await User.insertMany(users)
    console.log(`✅ Created ${createdUsers.length} users`)
    return createdUsers
  } catch (error) {
    console.error("❌ Error seeding users:", error)
  }
}

const seedTours = async (users) => {
  try {
    // Clear existing tours
    await Tour.deleteMany({})

    const hosts = users.filter((user) => user.role === "host")

    const tours = [
      {
        title: "Authentic Ethiopian Coffee Ceremony Experience",
        description:
          "Join Almaz for an authentic Ethiopian coffee ceremony in her traditional home. Learn about the cultural significance of coffee in Ethiopian society, participate in the roasting and brewing process, and enjoy freshly prepared coffee with traditional snacks. This intimate experience includes storytelling about Ethiopian traditions and the opportunity to dress in traditional Ethiopian clothing.",
        shortDescription: "Traditional coffee ceremony with cultural storytelling and authentic Ethiopian hospitality.",
        category: "Coffee Culture",
        type: "Family",
        host: hosts[0]._id,
        location: {
          city: "Lalibela",
          region: "Amhara",
          address: "Traditional Quarter, Near Rock Churches",
          coordinates: {
            latitude: 12.0317,
            longitude: 39.0473,
          },
        },
        price: {
          amount: 850,
          currency: "ETB",
          priceType: "per_person",
        },
        duration: {
          hours: 2.5,
          days: 0,
        },
        maxGuests: 8,
        images: [
          {
            url: "/images/coffee-ceremony-woman.jpg",
            caption: "Traditional coffee ceremony preparation",
            isMain: true,
          },
          {
            url: "/images/coffee-ceremony-steam.webp",
            caption: "Aromatic coffee brewing process",
          },
        ],
        amenities: ["Food Included", "Cultural Dress", "Guide Included", "Photos Included"],
        languages: ["English", "Amharic"],
        difficulty: "Easy",
        isActive: true,
        isFeatured: true,
        availableDates: [
          {
            date: new Date("2024-07-15"),
            availableSlots: 6,
          },
          {
            date: new Date("2024-07-16"),
            availableSlots: 8,
          },
          {
            date: new Date("2024-07-17"),
            availableSlots: 4,
          },
        ],
        rating: {
          average: 4.8,
          totalReviews: 127,
        },
        bookingCount: 89,
        tags: ["coffee", "culture", "traditional", "authentic", "family-friendly"],
        cancellationPolicy: "Flexible",
        requirements: ["Comfortable seating on floor cushions", "Respect for cultural traditions"],
        whatToExpect: [
          "Welcome with traditional Ethiopian greeting",
          "Learn about coffee's origin in Ethiopia",
          "Participate in green coffee roasting",
          "Experience the three rounds of coffee service",
          "Enjoy traditional snacks (popcorn, roasted barley)",
          "Storytelling about Ethiopian culture and history",
        ],
        whatToWear: ["Comfortable clothing", "Modest dress recommended", "Traditional dress provided if desired"],
        meetingPoint: "Almaz's Traditional Home - detailed directions provided after booking",
      },
      {
        title: "Traditional Ethiopian Cooking & Injera Making Workshop",
        description:
          "Learn the art of Ethiopian cooking with master chef Bekele in his family kitchen. This hands-on experience covers the preparation of injera (Ethiopian flatbread), various traditional stews (wot), and the blend of authentic spices. You'll prepare a complete Ethiopian meal and enjoy it together with the family, learning about the cultural significance of communal dining in Ethiopian society.",
        shortDescription: "Hands-on cooking class featuring injera making and traditional Ethiopian dishes.",
        category: "Culinary Arts",
        type: "Expert",
        host: hosts[1]._id,
        location: {
          city: "Gondar",
          region: "Amhara",
          address: "Historic Gondar, Traditional Cooking School",
          coordinates: {
            latitude: 12.6089,
            longitude: 37.4671,
          },
        },
        price: {
          amount: 1200,
          currency: "ETB",
          priceType: "per_person",
        },
        duration: {
          hours: 4,
          days: 0,
        },
        maxGuests: 6,
        images: [
          {
            url: "/images/injera-making.webp",
            caption: "Learning traditional injera preparation",
            isMain: true,
          },
          {
            url: "/images/traditional-food-prep.jpg",
            caption: "Preparing authentic Ethiopian spices",
          },
          {
            url: "/images/traditional-meat-dish.jpg",
            caption: "Traditional Ethiopian feast",
          },
        ],
        amenities: ["Food Included", "Equipment Provided", "Guide Included", "Certificate"],
        languages: ["English", "Amharic"],
        difficulty: "Moderate",
        isActive: true,
        isFeatured: true,
        availableDates: [
          {
            date: new Date("2024-07-18"),
            availableSlots: 4,
          },
          {
            date: new Date("2024-07-19"),
            availableSlots: 6,
          },
          {
            date: new Date("2024-07-20"),
            availableSlots: 2,
          },
        ],
        rating: {
          average: 4.9,
          totalReviews: 89,
        },
        bookingCount: 67,
        tags: ["cooking", "injera", "traditional", "hands-on", "cultural"],
        cancellationPolicy: "Moderate",
        requirements: ["Basic cooking interest", "Comfortable standing for extended periods"],
        whatToExpect: [
          "Introduction to Ethiopian spices and ingredients",
          "Learn traditional injera fermentation process",
          "Prepare various types of wot (stews)",
          "Master the art of berbere spice blend",
          "Cook and share a complete Ethiopian meal",
          "Receive traditional recipes to take home",
        ],
        whatToWear: ["Comfortable clothes that can get messy", "Closed-toe shoes", "Apron provided"],
        meetingPoint: "Bekele's Traditional Cooking School - GPS coordinates provided",
      },
    ]

    const createdTours = await Tour.insertMany(tours)
    console.log(`✅ Created ${createdTours.length} tours`)
  } catch (error) {
    console.error("❌ Error seeding tours:", error)
  }
}

const seedDatabase = async () => {
  try {
    await connectDB()

    console.log("🌱 Starting database seeding...")

    const users = await seedUsers()
    await seedTours(users)

    console.log("✅ Database seeding completed successfully!")
    process.exit(0)
  } catch (error) {
    console.error("❌ Database seeding failed:", error)
    process.exit(1)
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
}

module.exports = { seedDatabase }
