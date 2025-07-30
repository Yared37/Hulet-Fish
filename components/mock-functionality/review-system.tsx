"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { mockDataStore } from "@/lib/mock-data"
import { Star, ThumbsUp, MessageSquare, Send, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function ReviewSystem() {
  const [selectedTour, setSelectedTour] = useState("")
  const [selectedUser, setSelectedUser] = useState("")
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const tours = mockDataStore.getTours()
  const users = mockDataStore.getUsers().filter((u) => u.role === "tourist")
  const reviews = mockDataStore.getReviews()

  const handleStarClick = (starRating: number) => {
    setRating(starRating)
  }

  const handleSubmitReview = async () => {
    if (!selectedTour || !selectedUser || !rating || !comment.trim()) {
      toast.error("Please fill in all fields")
      return
    }

    setIsSubmitting(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const selectedUserData = users.find((u) => u.id === Number.parseInt(selectedUser))
      const selectedTourData = tours.find((t) => t.id === Number.parseInt(selectedTour))

      const newReview = mockDataStore.addReview({
        userId: Number.parseInt(selectedUser),
        tourId: Number.parseInt(selectedTour),
        userName: selectedUserData?.name || "Unknown",
        tourName: selectedTourData?.name || "Unknown Tour",
        rating,
        comment: comment.trim(),
      })

      toast.success("Review submitted successfully!", {
        description: "Thank you for your feedback",
      })

      // Reset form
      setSelectedTour("")
      setSelectedUser("")
      setRating(0)
      setComment("")
    } catch (error) {
      toast.error("Failed to submit review")
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStars = (currentRating: number, interactive = false) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < currentRating ? "text-yellow-400 fill-current" : "text-gray-300"
        } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
        onClick={interactive ? () => handleStarClick(i + 1) : undefined}
      />
    ))
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Submit Review Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            Submit a Review
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Select Tour</label>
              <Select value={selectedTour} onValueChange={setSelectedTour}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a tour" />
                </SelectTrigger>
                <SelectContent>
                  {tours.map((tour) => (
                    <SelectItem key={tour.id} value={tour.id.toString()}>
                      {tour.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Select Customer</label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose customer" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Rating</label>
            <div className="flex space-x-1">{renderStars(rating, true)}</div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Review Comment</label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              rows={4}
            />
          </div>

          <Button
            onClick={handleSubmitReview}
            disabled={isSubmitting || !selectedTour || !selectedUser || !rating || !comment.trim()}
            className="bg-gradient-to-r from-blue-600 to-purple-600"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit Review
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Reviews Display */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {reviews.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No reviews yet. Be the first to submit a review!</div>
            ) : (
              reviews.map((review) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage
                          src={`https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face`}
                        />
                        <AvatarFallback>
                          {review.userName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{review.userName}</h4>
                        <p className="text-sm text-gray-500">{review.tourName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex space-x-1 mb-1">{renderStars(review.rating)}</div>
                      <p className="text-sm text-gray-500">{review.date}</p>
                    </div>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 mb-4">{review.comment}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button variant="ghost" size="sm" className="text-gray-500">
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        Helpful ({review.helpful})
                      </Button>
                      {review.photos && review.photos.length > 0 && (
                        <Badge variant="outline">{review.photos.length} photos</Badge>
                      )}
                    </div>
                    <Button variant="outline" size="sm">
                      Reply
                    </Button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
