"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { format } from "date-fns"
import {
  Clock,
  Users,
  CreditCard,
  Smartphone,
  Wallet,
  Landmark,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Star,
  MapPin,
  Languages,
  Plus,
  Minus,
  AlertCircle,
  Loader2,
  Download,
  Share2,
} from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import {
  getExperienceById,
  getAvailableDates,
  addOns,
  paymentMethods,
  discountCodes,
  type ExperienceType,
} from "@/lib/booking-mock-data"

interface EnhancedBookingModalProps {
  isOpen: boolean
  onClose: () => void
  experienceId?: string
}

type BookingStep = "details" | "date" | "guests" | "addons" | "payment" | "confirmation"

interface BookingFormData {
  experienceId: string
  date: Date | null
  time: string
  guests: {
    adults: number
    children: number
  }
  contactInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    specialRequests: string
  }
  selectedAddOns: string[]
  paymentMethod: string
  discountCode: string
  agreedToTerms: boolean
}

export default function EnhancedBookingModal({
  isOpen,
  onClose,
  experienceId = "coffee-ceremony",
}: EnhancedBookingModalProps) {
  const [currentStep, setCurrentStep] = useState<BookingStep>("details")
  const [progress, setProgress] = useState(0)
  const [experience, setExperience] = useState<ExperienceType | null>(null)
  const [availableDates, setAvailableDates] = useState<{ date: string; available: boolean }[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingComplete, setBookingComplete] = useState(false)
  const [bookingReference, setBookingReference] = useState("")
  const [discountApplied, setDiscountApplied] = useState<{ amount: number; type: string } | null>(null)
  const [isValidatingCode, setIsValidatingCode] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)

  const [formData, setFormData] = useState<BookingFormData>({
    experienceId: experienceId,
    date: null,
    time: "",
    guests: {
      adults: 1,
      children: 0,
    },
    contactInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      specialRequests: "",
    },
    selectedAddOns: [],
    paymentMethod: "",
    discountCode: "",
    agreedToTerms: false,
  })

  // Load experience data
  useEffect(() => {
    if (experienceId) {
      const exp = getExperienceById(experienceId)
      if (exp) {
        setExperience(exp)
        setFormData((prev) => ({ ...prev, experienceId, time: exp.availableTimes[0] || "" }))
      }
    }

    // Get available dates
    setAvailableDates(getAvailableDates())
  }, [experienceId])

  // Update progress based on current step
  useEffect(() => {
    const steps: BookingStep[] = ["details", "date", "guests", "addons", "payment", "confirmation"]
    const currentIndex = steps.indexOf(currentStep)
    setProgress(((currentIndex + 1) / steps.length) * 100)
  }, [currentStep])

  const handleNextStep = () => {
    const steps: BookingStep[] = ["details", "date", "guests", "addons", "payment", "confirmation"]
    const currentIndex = steps.indexOf(currentStep)

    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1])
    }
  }

  const handlePreviousStep = () => {
    const steps: BookingStep[] = ["details", "date", "guests", "addons", "payment", "confirmation"]
    const currentIndex = steps.indexOf(currentStep)

    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1])
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    // Handle nested properties
    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof BookingFormData],
          [child]: value,
        },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleGuestChange = (type: "adults" | "children", operation: "increase" | "decrease") => {
    setFormData((prev) => {
      const currentValue = prev.guests[type]
      let newValue = operation === "increase" ? currentValue + 1 : currentValue - 1

      // Ensure we don't go below minimum values
      if (type === "adults") {
        newValue = Math.max(1, newValue) // At least 1 adult
      } else {
        newValue = Math.max(0, newValue) // Can have 0 children
      }

      // Ensure we don't exceed maximum group size
      const totalGuests = type === "adults" ? newValue + prev.guests.children : prev.guests.adults + newValue

      if (experience && totalGuests > experience.maxGroupSize) {
        return prev // Don't update if exceeding max group size
      }

      return {
        ...prev,
        guests: {
          ...prev.guests,
          [type]: newValue,
        },
      }
    })
  }

  const handleAddOnToggle = (addonId: string) => {
    setFormData((prev) => {
      const isSelected = prev.selectedAddOns.includes(addonId)

      if (isSelected) {
        return {
          ...prev,
          selectedAddOns: prev.selectedAddOns.filter((id) => id !== addonId),
        }
      } else {
        return {
          ...prev,
          selectedAddOns: [...prev.selectedAddOns, addonId],
        }
      }
    })
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({ ...prev, date }))
    }
  }

  const handleTimeSelect = (time: string) => {
    setFormData((prev) => ({ ...prev, time }))
  }

  const handlePaymentMethodSelect = (method: string) => {
    setFormData((prev) => ({ ...prev, paymentMethod: method }))
    setPaymentError(null)
  }

  const validateDiscountCode = () => {
    setIsValidatingCode(true)

    // Simulate API call to validate code
    setTimeout(() => {
      const code = discountCodes.find((c) => c.code === formData.discountCode.toUpperCase())

      if (code) {
        setDiscountApplied({
          amount: code.discount,
          type: code.type,
        })
      } else {
        setDiscountApplied(null)
      }

      setIsValidatingCode(false)
    }, 1000)
  }

  const calculateSubtotal = () => {
    if (!experience) return 0

    const basePrice = experience.basePrice * (formData.guests.adults + formData.guests.children * 0.5)

    const addOnsTotal = formData.selectedAddOns.reduce((total, addonId) => {
      const addon = addOns.find((a) => a.id === addonId)
      return total + (addon?.price || 0)
    }, 0)

    return basePrice + addOnsTotal
  }

  const calculateDiscount = () => {
    if (!discountApplied) return 0

    const subtotal = calculateSubtotal()

    if (discountApplied.type === "percentage") {
      return subtotal * (discountApplied.amount / 100)
    } else {
      return discountApplied.amount
    }
  }

  const calculatePaymentSurcharge = () => {
    const selectedMethod = paymentMethods.find((m) => m.id === formData.paymentMethod)
    if (!selectedMethod || !selectedMethod.surcharge) return 0

    return calculateSubtotal() * (selectedMethod.surcharge / 100)
  }

  const calculatePaymentDiscount = () => {
    const selectedMethod = paymentMethods.find((m) => m.id === formData.paymentMethod)
    if (!selectedMethod || !selectedMethod.discount) return 0

    return calculateSubtotal() * (selectedMethod.discount / 100)
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    const discount = calculateDiscount()
    const surcharge = calculatePaymentSurcharge()
    const paymentDiscount = calculatePaymentDiscount()

    return subtotal - discount - paymentDiscount + surcharge
  }

  const handleSubmitBooking = () => {
    setIsSubmitting(true)
    setPaymentError(null)

    // Simulate payment processing
    setTimeout(() => {
      // Randomly simulate payment failure (10% chance)
      if (Math.random() < 0.1) {
        setPaymentError("Payment processing failed. Please try again or use a different payment method.")
        setIsSubmitting(false)
        return
      }

      // Generate a random booking reference
      const reference = `ETH-${Math.floor(100000 + Math.random() * 900000)}`
      setBookingReference(reference)

      setIsSubmitting(false)
      setBookingComplete(true)
      setCurrentStep("confirmation")
    }, 2000)
  }

  const handleClose = () => {
    // Reset form state when closing
    setCurrentStep("details")
    setBookingComplete(false)
    setBookingReference("")
    setDiscountApplied(null)
    setPaymentError(null)
    onClose()
  }

  if (!experience) {
    return null
  }

  const isDateStepValid = formData.date !== null && formData.time !== ""
  const isGuestStepValid = formData.guests.adults >= 1
  const isContactInfoValid =
    formData.contactInfo.firstName.trim() !== "" &&
    formData.contactInfo.lastName.trim() !== "" &&
    formData.contactInfo.email.trim() !== "" &&
    formData.contactInfo.phone.trim() !== ""
  const isPaymentStepValid = formData.paymentMethod !== "" && formData.agreedToTerms

  const renderStepContent = () => {
    switch (currentStep) {
      case "details":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="relative h-60 rounded-lg overflow-hidden">
                <Image
                  src={experience.image || "/placeholder.svg"}
                  alt={experience.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <Badge className="bg-white/20 text-white border-white/30 mb-2">{experience.category}</Badge>
                  <h3 className="text-xl font-bold">{experience.name}</h3>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="font-medium">{experience.rating}</span>
                  <span className="text-gray-500">({experience.reviews.length} reviews)</span>
                </div>
                <div className="text-xl font-bold">
                  {experience.basePrice} ETB
                  <span className="text-sm font-normal text-gray-500 ml-1">per person</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <span>{experience.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-gray-500" />
                  <span>Up to {experience.maxGroupSize} people</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <span>{experience.location.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Languages className="w-5 h-5 text-gray-500" />
                  <span>{experience.languages.join(", ")}</span>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">About this experience</h4>
                <p className="text-gray-600 dark:text-gray-300">{experience.description}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">What's included</h4>
                <ul className="grid grid-cols-2 gap-2">
                  {experience.includes.map((item, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Meet your host</h4>
                <div className="flex items-center space-x-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={experience.host.image || "/placeholder.svg"}
                      alt={experience.host.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{experience.host.name}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                      <span>
                        {experience.host.rating} · {experience.host.reviewCount} reviews
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleNextStep} className="w-full sm:w-auto">
                Select Date & Time
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )

      case "date":
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Select a date</h3>
                <div className="border rounded-md p-4">
                  <Calendar
                    mode="single"
                    selected={formData.date || undefined}
                    onSelect={handleDateSelect}
                    disabled={(date) => {
                      // Disable dates before today
                      const today = new Date()
                      today.setHours(0, 0, 0, 0)

                      // Find if the date is in our available dates
                      const dateString = date.toISOString().split("T")[0]
                      const dateInfo = availableDates.find((d) => d.date === dateString)

                      return date < today || (dateInfo && !dateInfo.available)
                    }}
                    className="rounded-md border"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Select a time</h3>
                <div className="grid grid-cols-2 gap-3">
                  {experience.availableTimes.map((time) => (
                    <Button
                      key={time}
                      type="button"
                      variant={formData.time === time ? "default" : "outline"}
                      onClick={() => handleTimeSelect(time)}
                      className={cn("justify-start text-left font-normal", formData.time === time && "text-white")}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      {time}
                    </Button>
                  ))}
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Selected date & time</h3>
                  {formData.date ? (
                    <div className="text-lg">
                      <span className="font-medium">{format(formData.date, "EEEE, MMMM d, yyyy")}</span>
                      {formData.time && <span> at {formData.time}</span>}
                    </div>
                  ) : (
                    <p className="text-gray-500">Please select a date and time</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handlePreviousStep}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={handleNextStep} disabled={!isDateStepValid}>
                Continue to Guests
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )

      case "guests":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Guest Information</h3>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="contactInfo.firstName"
                      value={formData.contactInfo.firstName}
                      onChange={handleInputChange}
                      placeholder="Your first name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="contactInfo.lastName"
                      value={formData.contactInfo.lastName}
                      onChange={handleInputChange}
                      placeholder="Your last name"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="contactInfo.email"
                      type="email"
                      value={formData.contactInfo.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="contactInfo.phone"
                      value={formData.contactInfo.phone}
                      onChange={handleInputChange}
                      placeholder="+251 xxx xxx xxx"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                  <Textarea
                    id="specialRequests"
                    name="contactInfo.specialRequests"
                    value={formData.contactInfo.specialRequests}
                    onChange={handleInputChange}
                    placeholder="Any dietary restrictions, accessibility needs, or other special requests..."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-4">Number of Guests</h3>
              <p className="text-sm text-gray-500 mb-4">
                This experience can accommodate up to {experience.maxGroupSize} guests.
              </p>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Adults</p>
                    <p className="text-sm text-gray-500">Age 13+</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleGuestChange("adults", "decrease")}
                      disabled={formData.guests.adults <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{formData.guests.adults}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleGuestChange("adults", "increase")}
                      disabled={formData.guests.adults + formData.guests.children >= experience.maxGroupSize}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Children</p>
                    <p className="text-sm text-gray-500">Ages 2-12</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleGuestChange("children", "decrease")}
                      disabled={formData.guests.children <= 0}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{formData.guests.children}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleGuestChange("children", "increase")}
                      disabled={formData.guests.adults + formData.guests.children >= experience.maxGroupSize}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Total guests</p>
                    <p className="text-sm text-gray-500">
                      {formData.guests.adults} {formData.guests.adults === 1 ? "adult" : "adults"}
                      {formData.guests.children > 0 &&
                        `, ${formData.guests.children} ${formData.guests.children === 1 ? "child" : "children"}`}
                    </p>
                  </div>
                  <div className="text-lg font-bold">
                    {experience.basePrice * formData.guests.adults +
                      experience.basePrice * formData.guests.children * 0.5}{" "}
                    ETB
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handlePreviousStep}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={handleNextStep} disabled={!isGuestStepValid || !isContactInfoValid}>
                Continue to Add-ons
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )

      case "addons":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Enhance Your Experience</h3>
              <p className="text-gray-500 mb-4">Customize your experience with these optional add-ons.</p>

              <div className="grid md:grid-cols-2 gap-4">
                {addOns.map((addon) => {
                  const isSelected = formData.selectedAddOns.includes(addon.id)

                  return (
                    <div
                      key={addon.id}
                      className={cn(
                        "border rounded-lg p-4 cursor-pointer transition-all",
                        isSelected ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "hover:border-gray-300",
                      )}
                      onClick={() => handleAddOnToggle(addon.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-3">
                          <Checkbox checked={isSelected} onCheckedChange={() => handleAddOnToggle(addon.id)} />
                          <div>
                            <h4 className="font-medium">{addon.name}</h4>
                            <p className="text-sm text-gray-500">{addon.description}</p>
                          </div>
                        </div>
                        <div className="font-medium">{addon.price} ETB</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="font-medium mb-3">Selected Add-ons</h4>

              {formData.selectedAddOns.length > 0 ? (
                <div className="space-y-2">
                  {formData.selectedAddOns.map((addonId) => {
                    const addon = addOns.find((a) => a.id === addonId)
                    if (!addon) return null

                    return (
                      <div key={addonId} className="flex justify-between items-center">
                        <div className="flex items-center">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                          <span>{addon.name}</span>
                        </div>
                        <span>{addon.price} ETB</span>
                      </div>
                    )
                  })}

                  <Separator className="my-2" />

                  <div className="flex justify-between items-center font-medium">
                    <span>Add-ons Subtotal</span>
                    <span>
                      {formData.selectedAddOns.reduce((total, addonId) => {
                        const addon = addOns.find((a) => a.id === addonId)
                        return total + (addon?.price || 0)
                      }, 0)}{" "}
                      ETB
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No add-ons selected</p>
              )}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handlePreviousStep}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={handleNextStep}>
                Continue to Payment
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )

      case "payment":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Payment Method</h3>

              <RadioGroup
                value={formData.paymentMethod}
                onValueChange={handlePaymentMethodSelect}
                className="space-y-3"
              >
                {paymentMethods.map((method) => {
                  const IconComponent =
                    method.icon === "credit-card"
                      ? CreditCard
                      : method.icon === "smartphone"
                        ? Smartphone
                        : method.icon === "wallet"
                          ? Wallet
                          : method.icon === "landmark"
                            ? Landmark
                            : CreditCard

                  return (
                    <div key={method.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={method.id} id={method.id} />
                      <Label htmlFor={method.id} className="flex items-center cursor-pointer">
                        <IconComponent className="w-5 h-5 mr-2" />
                        {method.name}
                        {method.discount && (
                          <Badge className="ml-2 bg-green-100 text-green-800 border-green-200">
                            {method.discount}% off
                          </Badge>
                        )}
                        {method.surcharge && (
                          <Badge className="ml-2 bg-yellow-100 text-yellow-800 border-yellow-200">
                            +{method.surcharge}% fee
                          </Badge>
                        )}
                      </Label>
                    </div>
                  )
                })}
              </RadioGroup>

              {paymentError && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{paymentError}</AlertDescription>
                </Alert>
              )}
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-4">Discount Code</h3>

              <div className="flex space-x-2">
                <Input
                  name="discountCode"
                  value={formData.discountCode}
                  onChange={handleInputChange}
                  placeholder="Enter discount code"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={validateDiscountCode}
                  disabled={!formData.discountCode || isValidatingCode}
                >
                  {isValidatingCode ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Validating...
                    </>
                  ) : (
                    "Apply"
                  )}
                </Button>
              </div>

              {discountApplied && (
                <div className="mt-2 p-2 bg-green-50 text-green-700 rounded-md flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  <span>
                    {discountApplied.type === "percentage"
                      ? `${discountApplied.amount}% discount applied!`
                      : `${discountApplied.amount} ETB discount applied!`}
                  </span>
                </div>
              )}
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-4">Booking Summary</h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{experience.name}</p>
                    <p className="text-sm text-gray-500">
                      {formData.date && format(formData.date, "EEEE, MMMM d, yyyy")} at {formData.time}
                    </p>
                  </div>
                  <div className="font-medium">
                    {experience.basePrice * formData.guests.adults +
                      experience.basePrice * formData.guests.children * 0.5}{" "}
                    ETB
                  </div>
                </div>

                {formData.selectedAddOns.length > 0 && (
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">Selected Add-ons</p>
                      <p className="text-sm text-gray-500">{formData.selectedAddOns.length} item(s)</p>
                    </div>
                    <div className="font-medium">
                      {formData.selectedAddOns.reduce((total, addonId) => {
                        const addon = addOns.find((a) => a.id === addonId)
                        return total + (addon?.price || 0)
                      }, 0)}{" "}
                      ETB
                    </div>
                  </div>
                )}

                {discountApplied && (
                  <div className="flex justify-between text-green-600">
                    <div>
                      <p className="font-medium">Discount</p>
                      <p className="text-sm">Code: {formData.discountCode}</p>
                    </div>
                    <div className="font-medium">-{calculateDiscount()} ETB</div>
                  </div>
                )}

                {calculatePaymentSurcharge() > 0 && (
                  <div className="flex justify-between text-yellow-600">
                    <p className="font-medium">Payment Surcharge</p>
                    <div className="font-medium">{calculatePaymentSurcharge()} ETB</div>
                  </div>
                )}

                {calculatePaymentDiscount() > 0 && (
                  <div className="flex justify-between text-green-600">
                    <p className="font-medium">Payment Method Discount</p>
                    <div className="font-medium">-{calculatePaymentDiscount()} ETB</div>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <p>Total</p>
                  <div>{calculateTotal()} ETB</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.agreedToTerms}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, agreedToTerms: checked === true }))}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the terms and conditions
                  </Label>
                  <p className="text-sm text-gray-500">
                    By checking this box, you agree to our Terms of Service, Privacy Policy, and Cancellation Policy.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handlePreviousStep}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={handleSubmitBooking} disabled={!isPaymentStepValid || isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Complete Booking
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )

      case "confirmation":
        return (
          <div className="space-y-6 text-center">
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Booking Confirmed!</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Your booking for {experience.name} has been confirmed.
              </p>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4 w-full max-w-xs">
                <p className="text-sm text-gray-500 mb-1">Booking Reference</p>
                <p className="text-xl font-bold">{bookingReference}</p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 border rounded-lg p-6 text-left">
              <h4 className="font-medium mb-4">Booking Details</h4>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-gray-500">Experience</p>
                    <p className="font-medium">{experience.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date & Time</p>
                    <p className="font-medium">
                      {formData.date && format(formData.date, "MMMM d, yyyy")} at {formData.time}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-gray-500">Guests</p>
                    <p className="font-medium">
                      {formData.guests.adults} {formData.guests.adults === 1 ? "adult" : "adults"}
                      {formData.guests.children > 0 &&
                        `, ${formData.guests.children} ${formData.guests.children === 1 ? "child" : "children"}`}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Paid</p>
                    <p className="font-medium">{calculateTotal()} ETB</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-gray-500 mb-1">Location</p>
                  <p className="font-medium">{experience.location.address}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Host</p>
                  <div className="flex items-center">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden mr-2">
                      <Image
                        src={experience.host.image || "/placeholder.svg"}
                        alt={experience.host.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="font-medium">{experience.host.name}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-gray-600 dark:text-gray-300">
                A confirmation email has been sent to {formData.contactInfo.email}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" className="flex-1">
                  <Download className="mr-2 h-4 w-4" />
                  Download Receipt
                </Button>
                <Button variant="outline" className="flex-1">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Experience
                </Button>
              </div>

              <div className="pt-4">
                <Button onClick={handleClose} className="w-full">
                  Close
                </Button>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{currentStep === "confirmation" ? "Booking Confirmed" : `Book ${experience.name}`}</DialogTitle>
          <DialogDescription>
            {currentStep === "confirmation"
              ? `Reference: ${bookingReference}`
              : `${experience.duration} experience with ${experience.host.name}`}
          </DialogDescription>
        </DialogHeader>

        {currentStep !== "confirmation" && (
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-1">
              <span>Booking Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {renderStepContent()}
      </DialogContent>
    </Dialog>
  )
}
