"use client"

// Mock data store that simulates backend functionality
export class MockDataStore {
  private static instance: MockDataStore
  private data: {
    users: any[]
    tours: any[]
    bookings: any[]
    reviews: any[]
    messages: any[]
    analytics: any
    revenue: any[]
    notifications: any[]
  }

  private constructor() {
    this.data = this.initializeData()
  }

  static getInstance(): MockDataStore {
    if (!MockDataStore.instance) {
      MockDataStore.instance = new MockDataStore()
    }
    return MockDataStore.instance
  }

  private initializeData() {
    return {
      users: [
        {
          id: 1,
          name: "Dawit Tadesse",
          email: "dawit.tadesse@email.com",
          phone: "+251 911 123456",
          location: "Addis Ababa, Ethiopia",
          joinDate: "2023-08-15",
          status: "active",
          role: "tourist",
          totalBookings: 4,
          totalSpent: 25200, // ETB
          lastActive: "2 hours ago",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
          rating: 4.8,
          preferences: ["Adventure", "Cultural"],
          emergencyContact: "+251 911 987654",
        },
        {
          id: 2,
          name: "Hanan Mohammed",
          email: "hanan.mohammed@email.com",
          phone: "+251 912 234567",
          location: "Bahir Dar, Ethiopia",
          joinDate: "2023-06-22",
          status: "active",
          role: "tourist",
          totalBookings: 7,
          totalSpent: 37800, // ETB
          lastActive: "1 day ago",
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
          rating: 4.9,
          preferences: ["Cultural", "Historical"],
          emergencyContact: "+251 912 876543",
        },
        {
          id: 3,
          name: "Yohannes Bekele",
          email: "yohannes.bekele@email.com",
          phone: "+251 913 345678",
          location: "Gondar, Ethiopia",
          joinDate: "2023-09-10",
          status: "active",
          role: "guide",
          totalBookings: 15,
          totalSpent: 0,
          lastActive: "3 hours ago",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
          rating: 4.9,
          preferences: ["Adventure", "Historical"],
          emergencyContact: "+251 913 765432",
        },
        {
          id: 4,
          name: "Meron Haile",
          email: "meron.haile@email.com",
          phone: "+251 914 456789",
          location: "Lalibela, Ethiopia",
          joinDate: "2023-07-05",
          status: "active",
          role: "guide",
          totalBookings: 22,
          totalSpent: 0,
          lastActive: "5 hours ago",
          avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
          rating: 4.8,
          preferences: ["Cultural", "Religious"],
          emergencyContact: "+251 914 654321",
        },
      ],
      tours: [
        {
          id: 1,
          name: "Simien Mountains Trek",
          description: "7-day trekking adventure through UNESCO World Heritage site with endemic wildlife",
          image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center",
          duration: "7 days",
          price: 72000, // ETB
          maxGroupSize: 12,
          difficulty: "Moderate",
          status: "active",
          category: "Adventure",
          totalBookings: 45,
          rating: 4.9,
          reviews: 38,
          guide: "Yohannes Bekele",
          nextAvailable: "2024-02-15",
          revenue: 3240000, // ETB
          highlights: ["Gelada monkeys", "Ras Dashen peak", "Mountain lodges", "Traditional injera meals"],
          itinerary: [
            { day: 1, title: "Arrival in Gondar", description: "Airport pickup and city tour" },
            { day: 2, title: "Drive to Simien Mountains", description: "Scenic drive and first hike" },
            { day: 3, title: "Sankaber to Geech", description: "Full day trekking with wildlife viewing" },
          ],
        },
        {
          id: 2,
          name: "Lalibela Rock Churches",
          description: "3-day spiritual journey exploring the famous rock-hewn churches",
          image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center",
          duration: "3 days",
          price: 36000, // ETB
          maxGroupSize: 15,
          difficulty: "Easy",
          status: "active",
          category: "Religious",
          totalBookings: 62,
          rating: 4.8,
          reviews: 55,
          guide: "Meron Haile",
          nextAvailable: "2024-02-10",
          revenue: 2232000, // ETB
          highlights: [
            "Church of St. George",
            "Timkat celebration",
            "Local monastery visit",
            "Traditional coffee ceremony",
          ],
        },
      ],
      bookings: [
        {
          id: "BK001",
          userId: 1,
          tourId: 1,
          customerName: "Dawit Tadesse",
          tourName: "Simien Mountains Trek",
          startDate: "2024-02-15",
          endDate: "2024-02-22",
          amount: 72000, // ETB
          status: "confirmed",
          paymentStatus: "paid",
          groupSize: 2,
          specialRequests: "Vegetarian injera meals",
          bookingDate: "2024-01-10",
          progress: 85,
        },
      ],
      reviews: [
        {
          id: 1,
          userId: 1,
          tourId: 1,
          userName: "Dawit Tadesse",
          tourName: "Simien Mountains Trek",
          rating: 5,
          comment:
            "Betam gobez! The landscapes were breathtaking and our guide Yohannes was exceptional. The gelada monkeys were amazing!",
          date: "2023-12-20",
          helpful: 12,
          photos: ["photo1.jpg", "photo2.jpg"],
        },
      ],
      messages: [
        {
          id: 1,
          conversationId: 1,
          senderId: 1,
          senderName: "Dawit Tadesse",
          message: "Selam! I'm interested in booking the Simien Mountains trek for my family.",
          timestamp: new Date().toISOString(),
          read: false,
          type: "customer",
        },
      ],
      analytics: {
        totalRevenue: 25425000, // ETB
        monthlyRevenue: 3735000, // ETB
        totalUsers: 2847,
        activeBookings: 156,
        conversionRate: 6.5,
        avgRating: 4.8,
      },
      revenue: [
        { month: "Jan", revenue: 1350000, profit: 459000, bookings: 120 }, // ETB
        { month: "Feb", revenue: 1560000, profit: 530400, bookings: 135 }, // ETB
        { month: "Dec", revenue: 3735000, profit: 1269900, bookings: 320 }, // ETB
      ],
      notifications: [
        {
          id: 1,
          type: "booking",
          title: "New Booking Received",
          message: "Dawit Tadesse booked Simien Mountains Trek",
          timestamp: new Date().toISOString(),
          read: false,
        },
      ],
    }
  }

  // User Management
  addUser(user: any) {
    const newUser = {
      ...user,
      id: this.data.users.length + 1,
      joinDate: new Date().toISOString().split("T")[0],
      status: "active",
      totalBookings: 0,
      totalSpent: 0,
      lastActive: "Just now",
    }
    this.data.users.push(newUser)
    this.updateAnalytics()
    return newUser
  }

  updateUser(id: number, updates: any) {
    const userIndex = this.data.users.findIndex((u) => u.id === id)
    if (userIndex !== -1) {
      this.data.users[userIndex] = { ...this.data.users[userIndex], ...updates }
      return this.data.users[userIndex]
    }
    return null
  }

  deleteUser(id: number) {
    this.data.users = this.data.users.filter((u) => u.id !== id)
    this.updateAnalytics()
  }

  getUsers() {
    return this.data.users
  }

  // Tour Management
  addTour(tour: any) {
    const newTour = {
      ...tour,
      id: this.data.tours.length + 1,
      totalBookings: 0,
      rating: 0,
      reviews: 0,
      revenue: 0,
      status: "draft",
    }
    this.data.tours.push(newTour)
    return newTour
  }

  updateTour(id: number, updates: any) {
    const tourIndex = this.data.tours.findIndex((t) => t.id === id)
    if (tourIndex !== -1) {
      this.data.tours[tourIndex] = { ...this.data.tours[tourIndex], ...updates }
      return this.data.tours[tourIndex]
    }
    return null
  }

  deleteTour(id: number) {
    this.data.tours = this.data.tours.filter((t) => t.id !== id)
  }

  getTours() {
    return this.data.tours
  }

  // Booking Management
  addBooking(booking: any) {
    const newBooking = {
      ...booking,
      id: `BK${String(this.data.bookings.length + 1).padStart(3, "0")}`,
      bookingDate: new Date().toISOString().split("T")[0],
      status: "pending",
      paymentStatus: "pending",
      progress: 0,
    }
    this.data.bookings.push(newBooking)

    // Update user stats
    const user = this.data.users.find((u) => u.id === booking.userId)
    if (user) {
      user.totalBookings += 1
      user.totalSpent += booking.amount
    }

    // Update tour stats
    const tour = this.data.tours.find((t) => t.id === booking.tourId)
    if (tour) {
      tour.totalBookings += 1
      tour.revenue += booking.amount
    }

    this.updateAnalytics()
    this.addNotification({
      type: "booking",
      title: "New Booking Received",
      message: `${booking.customerName} booked ${booking.tourName}`,
    })

    return newBooking
  }

  updateBooking(id: string, updates: any) {
    const bookingIndex = this.data.bookings.findIndex((b) => b.id === id)
    if (bookingIndex !== -1) {
      this.data.bookings[bookingIndex] = { ...this.data.bookings[bookingIndex], ...updates }
      return this.data.bookings[bookingIndex]
    }
    return null
  }

  getBookings() {
    return this.data.bookings
  }

  // Review Management
  addReview(review: any) {
    const newReview = {
      ...review,
      id: this.data.reviews.length + 1,
      date: new Date().toISOString().split("T")[0],
      helpful: 0,
    }
    this.data.reviews.push(newReview)

    // Update tour rating
    const tour = this.data.tours.find((t) => t.id === review.tourId)
    if (tour) {
      const tourReviews = this.data.reviews.filter((r) => r.tourId === review.tourId)
      const avgRating = tourReviews.reduce((sum, r) => sum + r.rating, 0) / tourReviews.length
      tour.rating = Math.round(avgRating * 10) / 10
      tour.reviews = tourReviews.length
    }

    return newReview
  }

  getReviews() {
    return this.data.reviews
  }

  // Message Management
  addMessage(message: any) {
    const newMessage = {
      ...message,
      id: this.data.messages.length + 1,
      timestamp: new Date().toISOString(),
      read: false,
    }
    this.data.messages.push(newMessage)
    return newMessage
  }

  markMessageAsRead(id: number) {
    const message = this.data.messages.find((m) => m.id === id)
    if (message) {
      message.read = true
    }
  }

  getMessages() {
    return this.data.messages
  }

  // Analytics
  updateAnalytics() {
    this.data.analytics = {
      totalRevenue: this.data.bookings.reduce((sum, b) => sum + b.amount, 0),
      monthlyRevenue: this.data.bookings
        .filter((b) => new Date(b.bookingDate).getMonth() === new Date().getMonth())
        .reduce((sum, b) => sum + b.amount, 0),
      totalUsers: this.data.users.length,
      activeBookings: this.data.bookings.filter((b) => b.status === "confirmed").length,
      conversionRate: 6.5,
      avgRating:
        this.data.reviews.length > 0
          ? this.data.reviews.reduce((sum, r) => sum + r.rating, 0) / this.data.reviews.length
          : 0,
    }
  }

  getAnalytics() {
    return this.data.analytics
  }

  // Notifications
  addNotification(notification: any) {
    const newNotification = {
      ...notification,
      id: this.data.notifications.length + 1,
      timestamp: new Date().toISOString(),
      read: false,
    }
    this.data.notifications.unshift(newNotification)
    return newNotification
  }

  getNotifications() {
    return this.data.notifications
  }

  markNotificationAsRead(id: number) {
    const notification = this.data.notifications.find((n) => n.id === id)
    if (notification) {
      notification.read = true
    }
  }

  // Search functionality
  searchUsers(query: string) {
    return this.data.users.filter(
      (user) =>
        user.name.toLowerCase().includes(query.toLowerCase()) || user.email.toLowerCase().includes(query.toLowerCase()),
    )
  }

  searchTours(query: string) {
    return this.data.tours.filter(
      (tour) =>
        tour.name.toLowerCase().includes(query.toLowerCase()) ||
        tour.description.toLowerCase().includes(query.toLowerCase()),
    )
  }

  // Simulate API delays
  async simulateApiCall<T>(data: T, delay = 500): Promise<T> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(data), delay)
    })
  }
}

export const mockDataStore = MockDataStore.getInstance()
