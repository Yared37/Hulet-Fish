const mongoose = require("mongoose")
const Booking = require("../models/Booking")
const CulturalOffering = require("../models/CulturalOffering")
const User = require("../models/User")
require("dotenv").config()

const seedBookings = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/huletfish")
    console.log("Connected to MongoDB")

    // Clear existing bookings
    await Booking.deleteMany({})
    console.log("Cleared existing bookings")

    // Get sample users and offerings
    const tourists = await User.find({ role: "tourist" }).limit(3)
    const hosts = await User.find({ role: "host" }).limit(2)
    const offerings = await CulturalOffering.find({ isActive: true }).limit(3)

    if (tourists.length === 0 || hosts.length === 0 || offerings.length === 0) {
      console.log("Please seed users and cultural offerings first")
      return
    }

    const sampleBookings = [
      {
        culturalOffering: offerings[0]._id,
        tourist: tourists[0]._id,
        host: hosts[0]._id,
        bookingDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        timeSlot: {
          startTime: "09:00",
          endTime: "11:00",
        },
        numberOfGuests: 2,
        guestDetails: [
          {
            name: "John Doe",
            age: 30,
            specialRequests: "Vegetarian dietary requirements",
          },
          {
            name: "Jane Doe",
            age: 28,
          },
        ],
        contactInfo: {
          phone: "+251911234567",
          email: "john.doe@example.com",
          emergencyContact: {
            name: "Emergency Contact",
            phone: "+251911234568",
            relationship: "Spouse",
          },
        },
        totalAmount: offerings[0].price.amount * 2,
        currency: offerings[0].price.currency,
        status: "pending",
        specialRequests: "First time visiting Ethiopia, would appreciate cultural context",
        touristMessage: "Very excited to experience authentic Ethiopian coffee culture!",
      },
      {
        culturalOffering: offerings[1]._id,
        tourist: tourists[1]._id,
        host: hosts[1]._id,
        bookingDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        timeSlot: {
          startTime: "14:00",
          endTime: "17:00",
        },
        numberOfGuests: 4,
        guestDetails: [
          { name: "Alice Smith", age: 35 },
          { name: "Bob Smith", age: 37 },
          { name: "Charlie Smith", age: 12 },
          { name: "Diana Smith", age: 10 },
        ],
        contactInfo: {
          phone: "+251922345678",
          email: "alice.smith@example.com",
        },
        totalAmount: offerings[1].price.amount * 4,
        currency: offerings[1].price.currency,
        status: "confirmed",
        hostResponse: "Looking forward to hosting your family! I'll prepare special activities for the children.",
        hostNotes: "Family with young children - prepare kid-friendly activities",
      },
      {
        culturalOffering: offerings[2]._id,
        tourist: tourists[2]._id,
        host: hosts[0]._id,
        bookingDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        timeSlot: {
          startTime: "10:00",
          endTime: "13:00",
        },
        numberOfGuests: 1,
        guestDetails: [
          {
            name: "Sarah Johnson",
            age: 25,
            specialRequests: "Photography enthusiast - would love to take photos",
          },
        ],
        contactInfo: {
          phone: "+251933456789",
          email: "sarah.johnson@example.com",
        },
        totalAmount: offerings[2].price.amount,
        currency: offerings[2].price.currency,
        status: "completed",
        hostResponse: "Welcome! I'll make sure you get great photo opportunities.",
        actualGuests: 1,
        checkInTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000),
        checkOutTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 13 * 60 * 60 * 1000),
      },
      {
        culturalOffering: offerings[0]._id,
        tourist: tourists[1]._id,
        host: hosts[0]._id,
        bookingDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        timeSlot: {
          startTime: "15:00",
          endTime: "17:00",
        },
        numberOfGuests: 3,
        guestDetails: [
          { name: "Mike Wilson", age: 45 },
          { name: "Lisa Wilson", age: 42 },
          { name: "Tom Wilson", age: 16 },
        ],
        contactInfo: {
          phone: "+251944567890",
          email: "mike.wilson@example.com",
        },
        totalAmount: offerings[0].price.amount * 3,
        currency: offerings[0].price.currency,
        status: "rejected",
        rejectionReason: "Unfortunately, I'm not available on that date due to a family commitment",
        hostResponse: "I apologize for the inconvenience. Please consider booking for the following week.",
      },
    ]

    // Create bookings
    const createdBookings = await Booking.insertMany(sampleBookings)
    console.log(`✅ Created ${createdBookings.length} sample bookings`)

    // Update booking counts for cultural offerings
    for (const booking of createdBookings) {
      if (booking.status === "completed") {
        await CulturalOffering.findByIdAndUpdate(booking.culturalOffering, {
          $inc: { bookingCount: 1 },
        })
      }
    }

    console.log("✅ Updated booking counts for cultural offerings")
    console.log("🎉 Booking seeding completed successfully!")
  } catch (error) {
    console.error("❌ Error seeding bookings:", error)
  } finally {
    await mongoose.connection.close()
  }
}

// Run the seeding function
seedBookings()
