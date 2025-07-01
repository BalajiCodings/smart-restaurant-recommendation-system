"use client"

import type React from "react"

import Link from "next/link"
import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, MapPin, DollarSign } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Restaurant {
  _id: string
  name: string
  cuisine: string
  address: string
  description: string
  rating: number
  reviewCount?: number
  priceRange?: string
  image?: string
}

interface RestaurantCardProps {
  restaurant: Restaurant
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(false)
  const { user, token } = useAuth()
  const { toast } = useToast()

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://tastytrack-backend-9tu1.onrender.com"

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!user || !token) {
      toast({
        title: "Login required",
        description: "Please login to add favorites",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const method = isFavorite ? "DELETE" : "POST"
      const response = await fetch(`${API_BASE}/api/users/favorites/${restaurant._id}`, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setIsFavorite(!isFavorite)
          toast({
            title: result.message,
            description: `${restaurant.name} ${isFavorite ? "removed from" : "added to"} your favorites`,
          })
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ))
  }

  const getPriceSymbol = (priceRange?: string) => {
    switch (priceRange?.toLowerCase()) {
      case "budget":
        return "$"
      case "mid-range":
        return "$$"
      case "expensive":
        return "$$$"
      default:
        return "$$"
    }
  }

  return (
    <Link href={`/restaurants/${restaurant._id}`}>
      <Card className="h-full group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white rounded-2xl transform hover:-translate-y-2">
        {/* Image Placeholder with Gradient */}
        <div className="relative h-48 bg-gradient-to-br from-orange-400 via-red-400 to-pink-400 overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute top-4 left-4">
            <Badge 
              variant="secondary" 
              className="bg-white/90 text-gray-800 backdrop-blur-sm border-0 font-medium px-3 py-1 rounded-full"
            >
              {restaurant.cuisine}
            </Badge>
          </div>
          {user && (
            <div className="absolute top-4 right-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleFavorite} 
                disabled={loading} 
                className="bg-white/90 hover:bg-white backdrop-blur-sm rounded-full w-10 h-10 transition-all duration-300 hover:scale-110"
              >
                <Heart 
                  className={`h-5 w-5 transition-colors duration-300 ${
                    isFavorite ? "text-red-500 fill-current" : "text-gray-600"
                  }`} 
                />
              </Button>
            </div>
          )}
          {/* Decorative Elements */}
          <div className="absolute bottom-0 right-0 w-20 h-20 bg-white/10 rounded-full transform translate-x-10 translate-y-10"></div>
          <div className="absolute top-0 left-0 w-16 h-16 bg-white/10 rounded-full transform -translate-x-8 -translate-y-8"></div>
        </div>

        <CardHeader className="pb-3">
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-xl text-gray-900 group-hover:text-orange-600 transition-colors duration-300 line-clamp-1">
                {restaurant.name}
              </h3>
              <div className="flex items-center text-sm text-gray-600 bg-gray-100 rounded-full px-2 py-1 ml-2">
                <DollarSign className="h-3 w-3 mr-1" />
                <span className="font-medium">{getPriceSymbol(restaurant.priceRange)}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {renderStars(restaurant.rating)}
                <span className="text-sm font-semibold text-gray-700 ml-1">
                  {restaurant.rating?.toFixed(1) || "0.0"}
                </span>
              </div>
              <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                {restaurant.reviewCount || 0} review{(restaurant.reviewCount || 0) !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0 space-y-4">
          <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
            {restaurant.description}
          </p>

          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full">
              <MapPin className="h-4 w-4 text-orange-600" />
            </div>
            <span className="text-sm text-gray-700 truncate flex-1 font-medium">
              {restaurant.address}
            </span>
          </div>

          {/* Hover Effect Indicator */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
            <span className="text-orange-600 text-sm font-medium">Click to view details →</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
