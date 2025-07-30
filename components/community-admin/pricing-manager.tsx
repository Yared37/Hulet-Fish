"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Save,
  History,
  Edit3,
  Calculator,
  Percent,
  AlertCircle,
  CheckCircle,
} from "lucide-react"
import { toast } from "sonner"

interface PricingData {
  id: string
  tourTitle: string
  currentPrice: number
  previousPrice: number
  category: string
  bookingsThisMonth: number
  revenue: number
  priceHistory: { date: string; price: number; reason: string }[]
  suggestedPrice: number
  competitorPrice: number
  status: "active" | "inactive"
}

const initialPricingData: PricingData[] = [
  {
    id: "1",
    tourTitle: "Traditional Coffee Ceremony",
    currentPrice: 800,
    previousPrice: 750,
    category: "Coffee Culture",
    bookingsThisMonth: 12,
    revenue: 9600,
    priceHistory: [
      { date: "2024-02-15", price: 750, reason: "Initial pricing" },
      { date: "2024-03-01", price: 800, reason: "Increased demand" },
    ],
    suggestedPrice: 850,
    competitorPrice: 900,
    status: "active",
  },
  {
    id: "2",
    tourTitle: "Injera Making Workshop",
    currentPrice: 1200,
    previousPrice: 1200,
    category: "Culinary Arts",
    bookingsThisMonth: 8,
    revenue: 9600,
    priceHistory: [{ date: "2024-01-01", price: 1200, reason: "Launch price" }],
    suggestedPrice: 1300,
    competitorPrice: 1400,
    status: "active",
  },
  {
    id: "3",
    tourTitle: "Traditional Dance & Music",
    currentPrice: 600,
    previousPrice: 650,
    category: "Cultural Arts",
    bookingsThisMonth: 15,
    revenue: 9000,
    priceHistory: [
      { date: "2024-01-15", price: 650, reason: "Initial pricing" },
      { date: "2024-02-20", price: 600, reason: "Promotional pricing" },
    ],
    suggestedPrice: 700,
    competitorPrice: 750,
    status: "active",
  },
]

export default function PricingManager() {
  const [pricingData, setPricingData] = useState<PricingData[]>(initialPricingData)
  const [editingPrice, setEditingPrice] = useState<string | null>(null)
  const [newPrice, setNewPrice] = useState<number>(0)
  const [priceReason, setPriceReason] = useState<string>("")
  const [bulkUpdatePercentage, setBulkUpdatePercentage] = useState<number>(0)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const handlePriceUpdate = (tourId: string) => {
    if (!newPrice || !priceReason) {
      toast.error("Please enter both new price and reason for change")
      return
    }

    setPricingData(
      pricingData.map((tour) => {
        if (tour.id === tourId) {
          return {
            ...tour,
            previousPrice: tour.currentPrice,
            currentPrice: newPrice,
            priceHistory: [
              ...tour.priceHistory,
              {
                date: new Date().toISOString().split("T")[0],
                price: newPrice,
                reason: priceReason,
              },
            ],
          }
        }
        return tour
      }),
    )

    setEditingPrice(null)
    setNewPrice(0)
    setPriceReason("")
    toast.success("Price updated successfully! 💰")
  }

  const handleBulkPriceUpdate = () => {
    if (bulkUpdatePercentage === 0) {
      toast.error("Please enter a percentage for bulk update")
      return
    }

    const filteredTours =
      selectedCategory === "all" ? pricingData : pricingData.filter((tour) => tour.category === selectedCategory)

    setPricingData(
      pricingData.map((tour) => {
        if (filteredTours.some((ft) => ft.id === tour.id)) {
          const newPrice = Math.round(tour.currentPrice * (1 + bulkUpdatePercentage / 100))
          return {
            ...tour,
            previousPrice: tour.currentPrice,
            currentPrice: newPrice,
            priceHistory: [
              ...tour.priceHistory,
              {
                date: new Date().toISOString().split("T")[0],
                price: newPrice,
                reason: `Bulk update: ${bulkUpdatePercentage > 0 ? "+" : ""}${bulkUpdatePercentage}%`,
              },
            ],
          }
        }
        return tour
      }),
    )

    setBulkUpdatePercentage(0)
    setSelectedCategory("all")
    toast.success("Bulk price update completed! 🎉")
  }

  const getPriceChangeIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="w-4 h-4 text-green-600" />
    if (current < previous) return <TrendingDown className="w-4 h-4 text-red-600" />
    return <DollarSign className="w-4 h-4 text-gray-600" />
  }

  const getPriceChangeColor = (current: number, previous: number) => {
    if (current > previous) return "text-green-600"
    if (current < previous) return "text-red-600"
    return "text-gray-600"
  }

  const totalRevenue = pricingData.reduce((sum, tour) => sum + tour.revenue, 0)
  const totalBookings = pricingData.reduce((sum, tour) => sum + tour.bookingsThisMonth, 0)
  const averagePrice = Math.round(totalRevenue / totalBookings)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Pricing Management</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Monitor and adjust your tour prices to maximize bookings and revenue
        </p>
      </div>

      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">ETB {totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Bookings</p>
                <p className="text-2xl font-bold text-blue-600">{totalBookings}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Average Price</p>
                <p className="text-2xl font-bold text-purple-600">ETB {averagePrice}</p>
              </div>
              <Calculator className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Tours</p>
                <p className="text-2xl font-bold text-orange-600">
                  {pricingData.filter((t) => t.status === "active").length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Price Update */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Percent className="w-5 h-5 mr-2 text-blue-600" />
            Bulk Price Update
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="category-filter">Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Coffee Culture">Coffee Culture</SelectItem>
                  <SelectItem value="Culinary Arts">Culinary Arts</SelectItem>
                  <SelectItem value="Cultural Arts">Cultural Arts</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label htmlFor="bulk-percentage">Percentage Change</Label>
              <Input
                id="bulk-percentage"
                type="number"
                value={bulkUpdatePercentage}
                onChange={(e) => setBulkUpdatePercentage(Number(e.target.value))}
                placeholder="e.g., 10 for +10% or -5 for -5%"
              />
            </div>
            <Button
              onClick={handleBulkPriceUpdate}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={bulkUpdatePercentage === 0}
            >
              <Calculator className="w-4 h-4 mr-2" />
              Apply Bulk Update
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {selectedCategory === "all"
              ? `This will update prices for all ${pricingData.length} tours`
              : `This will update prices for ${pricingData.filter((t) => t.category === selectedCategory).length} tours in ${selectedCategory}`}
          </p>
        </CardContent>
      </Card>

      {/* Individual Tour Pricing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {pricingData.map((tour) => (
          <Card key={tour.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg line-clamp-2">{tour.tourTitle}</CardTitle>
                  <Badge variant="outline" className="mt-2">
                    {tour.category}
                  </Badge>
                </div>
                <Badge
                  className={tour.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                >
                  {tour.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current Price Display */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Current Price</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      ETB {tour.currentPrice.toLocaleString()}
                    </p>
                    {getPriceChangeIcon(tour.currentPrice, tour.previousPrice)}
                  </div>
                  {tour.currentPrice !== tour.previousPrice && (
                    <p className={`text-sm ${getPriceChangeColor(tour.currentPrice, tour.previousPrice)}`}>
                      {tour.currentPrice > tour.previousPrice ? "+" : ""}
                      {(((tour.currentPrice - tour.previousPrice) / tour.previousPrice) * 100).toFixed(1)}% from ETB{" "}
                      {tour.previousPrice.toLocaleString()}
                    </p>
                  )}
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    setEditingPrice(tour.id)
                    setNewPrice(tour.currentPrice)
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Edit3 className="w-4 h-4 mr-1" />
                  Edit Price
                </Button>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Bookings</p>
                  <p className="text-lg font-semibold text-blue-600">{tour.bookingsThisMonth}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Revenue</p>
                  <p className="text-lg font-semibold text-green-600">ETB {tour.revenue.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Avg/Booking</p>
                  <p className="text-lg font-semibold text-purple-600">
                    ETB {Math.round(tour.revenue / tour.bookingsThisMonth).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Price Recommendations */}
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Price Insights</p>
                    <p className="text-xs text-yellow-700 dark:text-yellow-400">
                      Suggested: ETB {tour.suggestedPrice} • Competitor avg: ETB {tour.competitorPrice}
                    </p>
                    {tour.currentPrice < tour.suggestedPrice && (
                      <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
                        💡 Consider increasing price by ETB {tour.suggestedPrice - tour.currentPrice} based on demand
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Price History */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Recent Price Changes</p>
                  <Button variant="ghost" size="sm">
                    <History className="w-4 h-4 mr-1" />
                    View All
                  </Button>
                </div>
                <div className="space-y-2 max-h-24 overflow-y-auto">
                  {tour.priceHistory.slice(-2).map((entry, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-xs p-2 bg-gray-50 dark:bg-gray-800 rounded"
                    >
                      <span className="text-gray-600 dark:text-gray-400">{entry.date}</span>
                      <span className="font-medium">ETB {entry.price}</span>
                      <span className="text-gray-500 text-xs max-w-24 truncate">{entry.reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Edit Price Form */}
              {editingPrice === tour.id && (
                <div className="p-4 border-2 border-blue-200 dark:border-blue-700 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-3">Update Price</p>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="new-price">New Price (ETB)</Label>
                      <Input
                        id="new-price"
                        type="number"
                        value={newPrice}
                        onChange={(e) => setNewPrice(Number(e.target.value))}
                        placeholder="Enter new price"
                      />
                    </div>
                    <div>
                      <Label htmlFor="price-reason">Reason for Change</Label>
                      <Input
                        id="price-reason"
                        value={priceReason}
                        onChange={(e) => setPriceReason(e.target.value)}
                        placeholder="e.g., Increased demand, Seasonal adjustment"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handlePriceUpdate(tour.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Save className="w-4 h-4 mr-1" />
                        Update Price
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingPrice(null)
                          setNewPrice(0)
                          setPriceReason("")
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
