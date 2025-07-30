import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    // In a real implementation, you would:
    // 1. Authenticate the user
    // 2. Fetch conversations from database
    // 3. Return the conversations

    // Mock data for demonstration
    const conversations = [
      {
        id: "conv_1",
        bookingId: "booking_1",
        participants: [
          {
            id: "user_123",
            name: "Michael Chen",
            role: "tourist",
            isOnline: true,
            lastSeen: new Date(),
          },
          {
            id: "host_1",
            name: "Dawit Tadesse",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
            role: "host",
            isOnline: true,
            lastSeen: new Date(),
          },
        ],
        lastMessage: {
          id: "msg_last_1",
          conversationId: "conv_1",
          senderId: "host_1",
          senderName: "Dawit Tadesse",
          senderRole: "host",
          message: "Looking forward to hosting your coffee ceremony experience!",
          messageType: "text",
          timestamp: new Date(Date.now() - 300000),
          status: "read",
        },
        unreadCount: { user_123: 0 },
        createdAt: new Date(Date.now() - 86400000),
        updatedAt: new Date(Date.now() - 300000),
        isActive: true,
        bookingDetails: {
          experienceTitle: "Traditional Coffee Ceremony",
          bookingDate: new Date("2024-02-15"),
          status: "confirmed",
        },
      },
      {
        id: "conv_2",
        bookingId: "booking_2",
        participants: [
          {
            id: "user_123",
            name: "Michael Chen",
            role: "tourist",
            isOnline: true,
            lastSeen: new Date(),
          },
          {
            id: "host_2",
            name: "Meron Alemu",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
            role: "host",
            isOnline: false,
            lastSeen: new Date(Date.now() - 1800000),
          },
        ],
        lastMessage: {
          id: "msg_last_2",
          conversationId: "conv_2",
          senderId: "user_123",
          senderName: "Michael Chen",
          senderRole: "tourist",
          message: "Thank you for the information about the injera workshop!",
          messageType: "text",
          timestamp: new Date(Date.now() - 1800000),
          status: "delivered",
        },
        unreadCount: { user_123: 2 },
        createdAt: new Date(Date.now() - 172800000),
        updatedAt: new Date(Date.now() - 1800000),
        isActive: true,
        bookingDetails: {
          experienceTitle: "Injera Making Workshop",
          bookingDate: new Date("2024-02-20"),
          status: "pending",
        },
      },
    ]

    return NextResponse.json(conversations)
  } catch (error) {
    console.error("Error fetching conversations:", error)
    return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 })
  }
}
