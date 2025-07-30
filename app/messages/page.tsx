"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import ConversationList from "@/components/chat/conversation-list"
import ChatInterface from "@/components/chat/chat-interface"
import type { Conversation } from "@/lib/chat-service"

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)

  // Mock current user data - in real app, get from auth context
  const currentUserId = "user_123"
  const currentUserRole = "tourist" as const

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Messages</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Chat with your {currentUserRole === "tourist" ? "host families" : "tourists"} about your cultural
            experiences
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Conversation List */}
          <div className="lg:col-span-1">
            <ConversationList
              currentUserId={currentUserId}
              currentUserRole={currentUserRole}
              onSelectConversation={setSelectedConversation}
              selectedConversationId={selectedConversation?.id}
            />
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-2">
            {selectedConversation ? (
              <ChatInterface
                bookingId={selectedConversation.bookingId}
                currentUserId={currentUserId}
                currentUserRole={currentUserRole}
              />
            ) : (
              <div className="h-[600px] flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Select a conversation</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Choose a conversation from the list to start chatting
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
