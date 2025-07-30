"use client"

import ChatTab from "@/components/dashboard/chat-tab"

export default function MessagesPage() {
  // In a real app, get this from auth context
  const currentUserId = "user_123"
  const currentUserRole = "tourist" as const

  return (
    <div className="container mx-auto py-6">
      <ChatTab currentUserId={currentUserId} currentUserRole={currentUserRole} />
    </div>
  )
}
