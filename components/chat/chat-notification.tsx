"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { X, MessageSquare } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import type { ChatMessage } from "@/lib/chat-service"

interface ChatNotificationProps {
  message: ChatMessage
  onClose: () => void
  onReply: () => void
}

export default function ChatNotification({ message, onClose, onReply }: ChatNotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Wait for animation to complete
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 300, scale: 0.8 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 300, scale: 0.8 }}
        className="fixed top-4 right-4 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 max-w-sm"
      >
        <div className="flex items-start space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={message.senderAvatar || "/placeholder.svg"} alt={message.senderName} />
            <AvatarFallback>
              {message.senderName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{message.senderName}</p>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setIsVisible(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">{message.message}</p>

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(message.timestamp, { addSuffix: true })}
              </span>

              <Button size="sm" className="h-7 px-3 text-xs" onClick={onReply}>
                <MessageSquare className="w-3 h-3 mr-1" />
                Reply
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
