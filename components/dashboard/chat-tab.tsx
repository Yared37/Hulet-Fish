"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ConversationList from "@/components/chat/conversation-list"
import ChatInterface from "@/components/chat/chat-interface"
import type { Conversation } from "@/lib/chat-service"

interface ChatTabProps {
  currentUserId: string
  currentUserRole: "tourist" | "host" | "admin"
}

export default function ChatTab({ currentUserId, currentUserRole }: ChatTabProps) {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Messages</h2>
        <p className="text-muted-foreground">
          Communicate with your {currentUserRole === "host" ? "guests" : "hosts"} about your experiences
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Messages</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Experiences</TabsTrigger>
          <TabsTrigger value="past">Past Experiences</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <ConversationList
                currentUserId={currentUserId}
                currentUserRole={currentUserRole === "admin" ? "host" : currentUserRole}
                onSelectConversation={setSelectedConversation}
                selectedConversationId={selectedConversation?.id}
              />
            </div>
            <div className="lg:col-span-2">
              {selectedConversation ? (
                <ChatInterface
                  bookingId={selectedConversation.bookingId}
                  currentUserId={currentUserId}
                  currentUserRole={currentUserRole === "admin" ? "host" : currentUserRole}
                />
              ) : (
                <Card className="h-[600px] flex items-center justify-center">
                  <CardContent className="text-center py-10">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                      Choose a conversation from the list to start chatting with your{" "}
                      {currentUserRole === "host" ? "guests" : "hosts"}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="unread" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Unread Messages</CardTitle>
              <CardDescription>View all your unread messages</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Unread messages will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="upcoming" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Experiences</CardTitle>
              <CardDescription>Messages related to your upcoming experiences</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Messages for upcoming experiences will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="past" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Past Experiences</CardTitle>
              <CardDescription>Messages related to your past experiences</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Messages for past experiences will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
