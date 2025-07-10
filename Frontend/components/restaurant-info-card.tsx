"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Star, Users, TrendingUp, Calendar, MapPin, Award, Clock, Phone } from "lucide-react"

interface RestaurantStats {
  averageRating: number
  totalReviews: number
  ratingDistribution: { [key: number]: number }
  topReviewKeywords: string[]
  verificationStatus: string
  estimatedWaitTime?: number
  priceLevel: number
  popularTimes?: { [key: string]: number }
}

interface RestaurantInfoCardProps {
  restaurant: {
    _id: string
    name: string
    phone?: string
    hours?: string
    website?: string
    priceRange?: string
    features?: string[]
  }
  stats?: RestaurantStats
}

export function RestaurantInfoCard({ restaurant, stats }: RestaurantInfoCardProps) {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const formatHours = (hours?: string) => {
    if (!hours) return "Hours not available"
    return hours
  }

  const isOpenNow = (hours?: string) => {
    if (!hours) return false
    // Simple check - in a real app, you'd parse the hours properly
    const hour = currentTime.getHours()
    return hour >= 9 && hour <= 22 // Assume open 9 AM - 10 PM
  }

  const getRatingDistribution = () => {
    if (!stats?.ratingDistribution) {
      return Array.from({ length: 5 }, (_, i) => ({ rating: 5 - i, count: 0, percentage: 0 }))
    }

    const total = Object.values(stats.ratingDistribution).reduce((sum, count) => sum + count, 0)
    return Array.from({ length: 5 }, (_, i) => {
      const rating = 5 - i
      const count = stats.ratingDistribution[rating] || 0
      return {
        rating,
        count,
        percentage: total > 0 ? (count / total) * 100 : 0
      }
    })
  }

  const getPriceSymbol = (priceRange?: string) => {
    switch (priceRange?.toLowerCase()) {
      case "budget": return "$"
      case "mid-range": return "$$"
      case "expensive": return "$$$"
      case "fine-dining": return "$$$$"
      default: return "$$"
    }
  }

  return (
    <div className="space-y-6">
      {/* Contact & Hours Card */}
      <Card className="border-0 shadow-lg bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-orange-600" />
            Restaurant Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Operating Hours */}
          <div className="flex items-start justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-full">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Operating Hours</div>
                <div className="text-sm text-gray-600">{formatHours(restaurant.hours)}</div>
              </div>
            </div>
            <Badge 
              variant={isOpenNow(restaurant.hours) ? "default" : "secondary"}
              className={isOpenNow(restaurant.hours) 
                ? "bg-green-100 text-green-800 border-green-200" 
                : "bg-red-100 text-red-800 border-red-200"
              }
            >
              {isOpenNow(restaurant.hours) ? "Open Now" : "Closed"}
            </Badge>
          </div>

          {/* Contact Info */}
          {restaurant.phone && (
            <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                <Phone className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Phone</div>
                <a 
                  href={`tel:${restaurant.phone}`} 
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {restaurant.phone}
                </a>
              </div>
            </div>
          )}

          {/* Price Level */}
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
                <span className="text-green-600 font-bold">$</span>
              </div>
              <div>
                <div className="font-medium text-gray-900">Price Level</div>
                <div className="text-sm text-gray-600">
                  {restaurant.priceRange || "Mid-range"}
                </div>
              </div>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {getPriceSymbol(restaurant.priceRange)}
            </div>
          </div>

          {/* Wait Time */}
          {stats?.estimatedWaitTime && (
            <div className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-xl">
              <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-full">
                <Calendar className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Estimated Wait Time</div>
                <div className="text-sm text-gray-600">{stats.estimatedWaitTime} minutes</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rating Statistics Card */}
      {stats && (
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
              <Star className="h-5 w-5 mr-2 text-orange-600" />
              Rating Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Overall Rating */}
            <div className="text-center p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {stats.averageRating.toFixed(1)}
              </div>
              <div className="flex justify-center mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-6 w-6 ${
                      i < Math.floor(stats.averageRating) 
                        ? "text-yellow-400 fill-current" 
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <div className="text-sm text-gray-600">
                Based on {stats.totalReviews} reviews
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Rating Distribution</h4>
              {getRatingDistribution().map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1 w-12">
                    <span className="text-sm font-medium text-gray-600">{rating}</span>
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  </div>
                  <div className="flex-1">
                    <Progress value={percentage} className="h-2" />
                  </div>
                  <div className="text-sm text-gray-500 w-12 text-right">
                    {count}
                  </div>
                </div>
              ))}
            </div>

            {/* Top Keywords */}
            {stats.topReviewKeywords && stats.topReviewKeywords.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">What people are saying</h4>
                <div className="flex flex-wrap gap-2">
                  {stats.topReviewKeywords.slice(0, 6).map((keyword, index) => (
                    <Badge 
                      key={keyword} 
                      variant="secondary" 
                      className="bg-blue-100 text-blue-800"
                    >
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Verification Status */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <Award className="h-5 w-5 text-green-600" />
                <span className="font-medium text-gray-900">Verification Status</span>
              </div>
              <Badge 
                variant="default" 
                className="bg-green-100 text-green-800 border-green-200"
              >
                {stats.verificationStatus || "Verified"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Features Card */}
      {restaurant.features && restaurant.features.length > 0 && (
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-orange-600" />
              Features & Amenities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {restaurant.features.map((feature) => (
                <div key={feature} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700 capitalize">
                    {feature.replace('-', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
