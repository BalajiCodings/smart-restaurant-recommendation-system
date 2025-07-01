"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Navbar } from "@/components/navbar"
import { RestaurantCard } from "@/components/restaurant-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Star, Heart, Sparkles, Search, Settings } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface Restaurant {
  _id: string
  name: string
  cuisine: string
  address: string
  description: string
  rating: number
  reviewCount: number
  priceRange: string
}

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const { user, token } = useAuth()
  const { toast } = useToast()

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://tastytrack-backend-9tu1.onrender.com"

  useEffect(() => {
    if (user && token) {
      fetchRecommendations()
    }
  }, [user, token])

  const fetchRecommendations = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/restaurants/recommendations`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setRecommendations(result.data.recommendations || [])
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch recommendations",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-100">
            <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mx-auto mb-6">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Get Personalized Recommendations</h1>
            <p className="text-gray-600 text-lg mb-8">
              Please log in to receive AI-powered restaurant recommendations tailored just for you
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl">
                  Log In
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50 px-6 py-3 rounded-xl">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Navbar />

      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-300 to-purple-300 rounded-full opacity-20 transform translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-300 to-pink-300 rounded-full opacity-20 transform -translate-x-24 translate-y-24"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mx-auto mb-6">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Recommended
              <span className="block text-blue-200">Just for You</span>
            </h1>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              AI-powered restaurant suggestions based on your unique taste preferences and dining history
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* How it works */}
        <Card className="mb-12 border-0 shadow-xl bg-gradient-to-r from-white to-purple-50 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-purple-100">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              How Our AI Recommends
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Our intelligent system analyzes multiple factors to suggest restaurants you'll love
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                  <Heart className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Your Favorites</h3>
                  <p className="text-sm text-gray-600">Restaurants and cuisines you've loved</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full">
                  <Star className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Your Reviews</h3>
                  <p className="text-sm text-gray-600">Patterns from your highly-rated experiences</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
                  <TrendingUp className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Trending Now</h3>
                  <p className="text-sm text-gray-600">Popular spots in your area</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse border border-gray-100">
                <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-48 rounded-xl mb-4"></div>
                <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-6 rounded-lg mb-3"></div>
                <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-4 rounded-lg w-2/3 mb-2"></div>
                <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-4 rounded-lg w-1/2"></div>
              </div>
            ))}
          </div>
        ) : recommendations.length > 0 ? (
          <>
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Badge variant="secondary" className="bg-purple-100 text-purple-800 px-4 py-2 text-sm font-medium">
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI Powered
                </Badge>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {recommendations.length} Restaurant{recommendations.length !== 1 ? 's' : ''} Recommended for You
              </h2>
              <p className="text-gray-600">
                Handpicked based on your preferences and dining history
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {recommendations.map((restaurant, index) => (
                <div 
                  key={restaurant._id}
                  className="transform transition-all duration-500 hover:scale-105"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <RestaurantCard restaurant={restaurant} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="bg-white rounded-2xl shadow-xl p-12 max-w-2xl mx-auto border border-gray-100">
              <div className="flex items-center justify-center w-24 h-24 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full mx-auto mb-6">
                <Sparkles className="h-12 w-12 text-purple-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Building Your Recommendations</h3>
              <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">
                Help us understand your taste by adding favorites, writing reviews, and setting your preferences!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/restaurants">
                  <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl">
                    <Search className="h-5 w-5 mr-2" />
                    Explore Restaurants
                  </Button>
                </Link>
                <Link href="/preferences">
                  <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50 px-6 py-3 rounded-xl">
                    <Settings className="h-5 w-5 mr-2" />
                    Set Preferences
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
