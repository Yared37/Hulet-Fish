"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { mockDataStore } from "@/lib/mock-data"
import { Calendar, Users, CreditCard, CheckCircle, Loader2, MapPin, Clock, DollarSign } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

export default function BookingSimulator() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [bookingData, setBookingData] = useState({
    tourId: "",
    userId: "",
    startDate: "",
    endDate: "",
    groupSize: 1,
    specialRequests: "",
    paymentMethod: "",
    emergencyContact: "",
  })

  const tours = mockDataStore.getTours()
  const users = mockDataStore.getUsers().filter((u) => u.role === "tourist")
  const selectedTour = tours.find((t) => t.id === Number.parseInt(bookingData.tourId))

  const steps = [
    { id: 1, title: "Select Tour", icon: MapPin },
    { id: 2, title: "Choose Dates", icon: Calendar },
    { id: 3, title: "Group Details", icon: Users },
    { id: 4, title: "Payment", icon: CreditCard },
    { id: 5, title: "Confirmation", icon: CheckCircle },
  ]

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleBookingSubmit = async () => {
    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const selectedUser = users.find((u) => u.id === Number.parseInt(bookingData.userId))
      const booking = {
        ...bookingData,
        tourId: Number.parseInt(bookingData.tourId),
        userId: Number.parseInt(bookingData.userId),
        customerName: selectedUser?.name || "Unknown",
        tourName: selectedTour?.name || "Unknown Tour",
        amount: selectedTour ? selectedTour.price * bookingData.groupSize : 0,
      }

      const newBooking = mockDataStore.addBooking(booking)

      toast.success("Booking confirmed!", {
        description: `Booking ${newBooking.id} has been created successfully`,
        action: {
          label: "View Booking",
          onClick: () => console.log("View booking clicked"),
        },
      })

      setCurrentStep(5)
    } catch (error) {
      toast.error("Booking failed", {
        description: "Please try again later",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetBooking = () => {
    setCurrentStep(1)
    setBookingData({
      tourId: "",
      userId: "",
      startDate: "",
      endDate: "",
      groupSize: 1,
      specialRequests: "",
      paymentMethod: "",
      emergencyContact: "",
    })
  }

  const totalAmount = selectedTour ? selectedTour.price * bookingData.groupSize : 0

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Book a Tour</CardTitle>
        <div className="flex items-center justify-between mt-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep >= step.id ? "bg-amber-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                <step.icon className="w-5 h-5" />
              </div>
              <div className="ml-2 hidden md:block">
                <p className={`text-sm font-medium ${currentStep >= step.id ? "text-amber-600" : "text-gray-500"}`}>
                  {step.title}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-4 ${currentStep > step.id ? "bg-amber-600" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>
        <Progress value={(currentStep / 5) * 100} className="mt-4" />
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Step 1: Select Tour */}
        {currentStep === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <h3 className="text-lg font-semibold">Select a Tour</h3>
            <div className="grid gap-4">
              {tours.map((tour) => (
                <div
                  key={tour.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    bookingData.tourId === tour.id.toString()
                      ? "border-amber-600 bg-amber-50 dark:bg-amber-900/20"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setBookingData((prev) => ({ ...prev, tourId: tour.id.toString() }))}
                >
                  <div className="flex items-start space-x-4">
                    <div className="relative w-24 h-16 rounded-lg overflow-hidden">
                      <Image src={tour.image || "/placeholder.svg"} alt={tour.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{tour.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{tour.description}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {tour.duration}
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />${tour.price.toLocaleString()}
                        </div>
                        <Badge variant="outline">{tour.difficulty}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2: Choose Dates */}
        {currentStep === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <h3 className="text-lg font-semibold">Choose Your Dates</h3>
            {selectedTour && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
                <h4 className="font-medium">{selectedTour.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedTour.duration} • ${selectedTour.price.toLocaleString()} per person
                </p>
              </div>
            )}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={bookingData.startDate}
                  onChange={(e) => setBookingData((prev) => ({ ...prev, startDate: e.target.value }))}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={bookingData.endDate}
                  onChange={(e) => setBookingData((prev) => ({ ...prev, endDate: e.target.value }))}
                  min={bookingData.startDate}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Group Details */}
        {currentStep === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <h3 className="text-lg font-semibold">Group Details</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="userId">Select Customer</Label>
                <Select
                  value={bookingData.userId}
                  onValueChange={(value) => setBookingData((prev) => ({ ...prev, userId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.name} - {user.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="groupSize">Group Size</Label>
                <Select
                  value={bookingData.groupSize.toString()}
                  onValueChange={(value) => setBookingData((prev) => ({ ...prev, groupSize: Number.parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(selectedTour?.maxGroupSize || 10)].map((_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        {i + 1} {i === 0 ? "person" : "people"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="specialRequests">Special Requests</Label>
              <Input
                id="specialRequests"
                value={bookingData.specialRequests}
                onChange={(e) => setBookingData((prev) => ({ ...prev, specialRequests: e.target.value }))}
                placeholder="Dietary restrictions, accessibility needs, etc."
              />
            </div>
            <div>
              <Label htmlFor="emergencyContact">Emergency Contact</Label>
              <Input
                id="emergencyContact"
                value={bookingData.emergencyContact}
                onChange={(e) => setBookingData((prev) => ({ ...prev, emergencyContact: e.target.value }))}
                placeholder="Emergency contact number"
              />
            </div>
          </motion.div>
        )}

        {/* Step 4: Payment */}
        {currentStep === 4 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <h3 className="text-lg font-semibold">Payment Information</h3>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h4 className="font-medium mb-2">Booking Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Tour:</span>
                  <span>{selectedTour?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Dates:</span>
                  <span>
                    {bookingData.startDate} to {bookingData.endDate}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Group Size:</span>
                  <span>
                    {bookingData.groupSize} {bookingData.groupSize === 1 ? "person" : "people"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Price per person:</span>
                  <span>${selectedTour?.price.toLocaleString()}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total Amount:</span>
                  <span>${totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select
                value={bookingData.paymentMethod}
                onValueChange={(value) => setBookingData((prev) => ({ ...prev, paymentMethod: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit-card">Credit Card</SelectItem>
                  <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        )}

        {/* Step 5: Confirmation */}
        {currentStep === 5 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-green-600">Booking Confirmed!</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your booking has been successfully created. You will receive a confirmation email shortly.
            </p>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <h4 className="font-medium mb-2">Booking Details</h4>
              <div className="text-sm space-y-1">
                <p>
                  <strong>Tour:</strong> {selectedTour?.name}
                </p>
                <p>
                  <strong>Dates:</strong> {bookingData.startDate} to {bookingData.endDate}
                </p>
                <p>
                  <strong>Total:</strong> ${totalAmount.toLocaleString()}
                </p>
              </div>
            </div>
            <Button onClick={resetBooking} className="bg-gradient-to-r from-amber-600 to-orange-600">
              Book Another Tour
            </Button>
          </motion.div>
        )}

        {/* Navigation Buttons */}
        {currentStep < 5 && (
          <div className="flex justify-between pt-6">
            <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
              Previous
            </Button>

            {currentStep === 4 ? (
              <Button
                onClick={handleBookingSubmit}
                disabled={isLoading || !bookingData.paymentMethod}
                className="bg-gradient-to-r from-green-600 to-blue-600"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Confirm Booking
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && !bookingData.tourId) ||
                  (currentStep === 2 && (!bookingData.startDate || !bookingData.endDate)) ||
                  (currentStep === 3 && !bookingData.userId)
                }
                className="bg-gradient-to-r from-amber-600 to-orange-600"
              >
                Next
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
