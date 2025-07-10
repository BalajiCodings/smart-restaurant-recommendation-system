"use client"

import type React from "react"

import Link from "next/link"
import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, MapPin, DollarSign, Leaf, Gift } from "lucide-react"
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
  
  // Swiggy data fields
  numberOfRatings?: string
  averagePrice?: string
  numberOfOffers?: number
  offerNames?: string[]
  area?: string
  isPureVeg?: boolean
  location?: string
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

  // Generate restaurant image based on cuisine type
  const getRestaurantImage = (name: string, cuisine: string) => {
    const cuisineImages = {
      italian: "pizza-margherita-pasta-italian-food",
      chinese: "chinese-food-dumplings-noodles",
      mexican: "tacos-mexican-food-restaurant",
      indian: "indian-curry-spices-restaurant",
      american: "burger-fries-american-diner",
      japanese: "sushi-japanese-restaurant-food",
      thai: "thai-food-pad-thai-restaurant",
      french: "french-cuisine-fine-dining-restaurant",
      default: "restaurant-interior-dining-food"
    }
    
    const cuisineKey = cuisine.toLowerCase() as keyof typeof cuisineImages
    const imageQuery = cuisineImages[cuisineKey] || cuisineImages.default
    
    // Use restaurant name hash to ensure consistent images
    const nameHash = name.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
    const imageId = (nameHash % 100) + 1
    
    return `https://images.unsplash.com/photo-${1500000000000 + imageId}?w=400&h=300&fit=crop&auto=format&q=80&${imageQuery}`
  }

  return (
    <Link href={`/restaurants/${restaurant._id}`}>
      <Card className="h-full group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white rounded-2xl transform hover:-translate-y-2">
        {/* Restaurant Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={restaurant.image || getRestaurantImage(restaurant.name, restaurant.cuisine)}
            alt={restaurant.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              // Fallback to a generic restaurant image
              const target = e.target as HTMLImageElement
              target.src = `https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop&auto=format&q=80`
            }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>
          
          {/* Cuisine Badge */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <Badge 
              variant="secondary" 
              className="bg-white/95 text-gray-800 backdrop-blur-sm border-0 font-medium px-3 py-1 rounded-full shadow-lg"
            >
              {restaurant.cuisine}
            </Badge>
            {restaurant.isPureVeg && (
              <Badge 
                variant="secondary" 
                className="bg-green-100/95 text-green-800 backdrop-blur-sm border-0 font-medium px-3 py-1 rounded-full shadow-lg flex items-center gap-1"
              >
                <Leaf className="h-3 w-3" />
                Veg
              </Badge>
            )}
          </div>
          
          {/* Rating Badge */}
          <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
            <Star className="h-3 w-3 text-yellow-500 fill-current" />
            <span className="text-sm font-semibold text-gray-800">
              {restaurant.rating?.toFixed(1) || "0.0"}
            </span>
          </div>
          
          {/* Favorite Button */}
          {user && (
            <div className="absolute bottom-4 right-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleFavorite} 
                disabled={loading} 
                className="bg-white/95 hover:bg-white backdrop-blur-sm rounded-full w-10 h-10 transition-all duration-300 hover:scale-110 shadow-lg"
              >
                <Heart 
                  className={`h-5 w-5 transition-colors duration-300 ${
                    isFavorite ? "text-red-500 fill-current" : "text-gray-600"
                  }`} 
                />
              </Button>
            </div>
          )}
          
          {/* Price Range */}
          <div className="absolute bottom-4 left-4">
            <div className="flex items-center text-white bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
              <DollarSign className="h-3 w-3 mr-1" />
              <span className="font-medium text-sm">{getPriceSymbol(restaurant.priceRange)}</span>
            </div>
          </div>
        </div>

        <CardHeader className="pb-3">
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-xl text-gray-900 group-hover:text-orange-600 transition-colors duration-300 line-clamp-1">
                {restaurant.name}
              </h3>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {renderStars(restaurant.rating)}
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                  {restaurant.numberOfRatings || `${restaurant.reviewCount || 0} review${(restaurant.reviewCount || 0) !== 1 ? "s" : ""}`}
                </span>
                {restaurant.averagePrice && (
                  <div className="text-xs text-gray-600 mt-1 font-medium">
                    ₹{restaurant.averagePrice}
                  </div>
                )}
              </div>
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
            <div className="flex-1">
              <span className="text-sm text-gray-700 truncate block font-medium">
                {restaurant.area && restaurant.location 
                  ? `${restaurant.area}, ${restaurant.location}`
                  : restaurant.address
                }
              </span>
              {restaurant.location && restaurant.area && (
                <span className="text-xs text-gray-500">
                  {restaurant.location}
                </span>
              )}
            </div>
          </div>

          {/* Offers */}
          {restaurant.numberOfOffers && restaurant.numberOfOffers > 0 && (
            <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg border border-orange-100">
              <Gift className="h-4 w-4 text-orange-600" />
              <span className="text-sm text-orange-700 font-medium">
                {restaurant.numberOfOffers} offer{restaurant.numberOfOffers !== 1 ? 's' : ''} available
              </span>
            </div>
          )}

          {/* Hover Effect Indicator */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
            <span className="text-orange-600 text-sm font-medium">Click to view details →</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
