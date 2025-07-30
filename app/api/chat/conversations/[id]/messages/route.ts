import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const url = new URL(request.url)
    const page = Number.parseInt(url.searchParams.get("page") || "1")
    const limit = Number.parseInt(url.searchParams.get("limit") || "50")

    // In a real implementation, you would:
    // 1. Authenticate the user
    // 2. Fetch messages for the conversation from database
    // 3. Return the messages with pagination

    // Mock data for demonstration
    const messages = [
      {
        id: "msg_1",
        conversationId: id,
        senderId: "host_1",
        senderName: "Dawit Tadesse",
        senderRole: "host",
        message:
          "Welcome! I'm excited to host your coffee ceremony experience. Do you have any dietary restrictions I should know about?",
        messageType: "text",
        timestamp: new Date(Date.now() - 3600000),
        status: "read",
      },
      {
        id: "msg_2",
        conversationId: id,
        senderId: "user_123",
        senderName: "Michael Chen",
        senderRole: "tourist",
        message:
          "Thank you for the warm welcome! I don't have any dietary restrictions. I'm really excited to learn about Ethiopian coffee culture!",
        messageType: "text",
        timestamp: new Date(Date.now() - 3000000),
        status: "read",
      },
    ]

    return NextResponse.json({
      messages,
      hasMore: false,
      total: messages.length,
    })
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}
