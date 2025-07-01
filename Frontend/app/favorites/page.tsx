"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Navbar } from "@/components/navbar"
import { RestaurantCard } from "@/components/restaurant-card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Heart, Search, Sparkles } from "lucide-react"
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

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const { user, token } = useAuth()
  const { toast } = useToast()

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://tastytrack-backend-9tu1.onrender.com"

  useEffect(() => {
    if (user && token) {
      fetchFavorites()
    }
  }, [user, token])

  const fetchFavorites = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/users/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setFavorites(result.data.favorites || [])
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch favorites",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-100">
            <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mx-auto mb-6">
              <Heart className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Your Favorites</h1>
            <p className="text-gray-600 text-lg mb-8">
              Please log in to view and manage your favorite restaurants
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-6 py-3 rounded-xl">
                  Log In
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50 px-6 py-3 rounded-xl">
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <Navbar />

      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-red-600 to-pink-600 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-pink-300 to-red-300 rounded-full opacity-20 transform translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-red-300 to-orange-300 rounded-full opacity-20 transform -translate-x-24 translate-y-24"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mx-auto mb-6">
              <Heart className="h-8 w-8 text-white fill-current" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Your Favorite
              <span className="block text-pink-200">Restaurants</span>
            </h1>
            <p className="text-xl text-red-100 max-w-2xl mx-auto">
              All your saved restaurants in one place - never lose track of a great dining spot again
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
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
        ) : favorites.length > 0 ? (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {favorites.length} Favorite Restaurant{favorites.length !== 1 ? 's' : ''}
              </h2>
              <p className="text-gray-600">
                Your curated collection of amazing dining spots
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {favorites.map((restaurant, index) => (
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
              <div className="flex items-center justify-center w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full mx-auto mb-6">
                <Heart className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No favorite restaurants yet</h3>
              <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">
                Start exploring amazing restaurants and add them to your favorites by clicking the heart icon!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/restaurants">
                  <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl">
                    <Search className="h-5 w-5 mr-2" />
                    Explore Restaurants
                  </Button>
                </Link>
                <Link href="/recommendations">
                  <Button variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50 px-6 py-3 rounded-xl">
                    <Sparkles className="h-5 w-5 mr-2" />
                    Get Recommendations
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
