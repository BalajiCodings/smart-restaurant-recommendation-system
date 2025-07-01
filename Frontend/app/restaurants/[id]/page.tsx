"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Navbar } from "@/components/navbar"
import { ReviewForm } from "@/components/review-form"
import { ReviewCard } from "@/components/review-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Star, Heart, MapPin, DollarSign, Phone, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Restaurant {
  _id: string
  name: string
  cuisine: string
  address: string
  description: string
  rating: number
  reviews: Review[]
  image?: string
  priceRange?: string
  phone?: string
  hours?: string
}

interface Review {
  _id: string
  user: {
    name: string
  }
  rating: number
  comment: string
  createdAt: string
}

export default function RestaurantDetailPage() {
  const params = useParams()
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [userReview, setUserReview] = useState<Review | null>(null)
  const { user, token } = useAuth()
  const { toast } = useToast()

  // Use environment variable or fallback to deployed backend
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://tastytrack-backend-9tu1.onrender.com"

  useEffect(() => {
    if (params?.id) {
      fetchRestaurantDetails()
      if (user) {
        checkFavoriteStatus()
        checkUserReview()
      }
    }
  }, [params?.id, user])

  const fetchRestaurantDetails = async () => {
    if (!params?.id) return
    
    try {
      const response = await fetch(`${API_BASE}/api/restaurants/${params.id}`)
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setRestaurant(result.data.restaurant)
          setReviews(result.data.restaurant.reviews || [])
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch restaurant details",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const checkFavoriteStatus = async () => {
    if (!params?.id) return
    
    try {
      const response = await fetch(`${API_BASE}/api/users/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          const favorites = result.data.favorites
          setIsFavorite(favorites.some((fav: any) => fav.id === params.id))
        }
      }
    } catch (error) {
      console.error("Failed to check favorite status:", error)
    }
  }

  const checkUserReview = async () => {
    if (!params?.id) return
    
    try {
      const response = await fetch(`${API_BASE}/users/reviews`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const userReviews = await response.json()
        const existingReview = userReviews.find(
          (review: any) => review.restaurant._id === params.id || review.restaurant.id === params.id,
        )
        setUserReview(existingReview || null)
      }
    } catch (error) {
      console.error("Failed to check user review:", error)
    }
  }

  const toggleFavorite = async () => {
    if (!user || !token || !params?.id) {
      toast({
        title: "Login required",
        description: "Please login to add favorites",
        variant: "destructive",
      })
      return
    }

    try {
      const method = isFavorite ? "DELETE" : "POST"
      const response = await fetch(`${API_BASE}/api/users/favorites/${params.id}`, {
        method,
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setIsFavorite(!isFavorite)
          toast({
            title: result.message,
            description: `${restaurant?.name} ${isFavorite ? "removed from" : "added to"} your favorites`,
          })
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive",
      })
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="bg-gray-300 h-8 rounded mb-4"></div>
            <div className="bg-gray-300 h-64 rounded mb-6"></div>
            <div className="bg-gray-300 h-4 rounded mb-2"></div>
            <div className="bg-gray-300 h-4 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Restaurant not found</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section with Restaurant Header */}
        <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden mb-8 border border-gray-100">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-red-50 opacity-50"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-200 to-red-200 rounded-full opacity-20 transform translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-yellow-200 to-orange-200 rounded-full opacity-20 transform -translate-x-12 translate-y-12"></div>
          
          <div className="relative p-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <h1 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    {restaurant.name}
                  </h1>
                  <div className="flex items-center gap-1">
                    {renderStars(restaurant.rating)}
                    <span className="text-xl font-bold text-amber-600 ml-1">
                      {restaurant.rating?.toFixed(1) || "0.0"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <Badge variant="secondary" className="text-sm px-3 py-1 bg-orange-100 text-orange-800 border-orange-200">
                    {restaurant.cuisine}
                  </Badge>
                  <div className="flex items-center text-gray-600 bg-gray-100 rounded-full px-3 py-1">
                    <DollarSign className="h-4 w-4 mr-1" />
                    <span className="font-medium">{getPriceSymbol(restaurant.priceRange)}</span>
                  </div>
                  <div className="flex items-center text-gray-600 bg-gray-100 rounded-full px-3 py-1">
                    <span className="text-sm">
                      {restaurant.reviews?.length || 0} review{(restaurant.reviews?.length || 0) !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                <p className="text-gray-700 text-lg leading-relaxed mb-6 max-w-3xl">
                  {restaurant.description}
                </p>

                {/* Contact Information */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-white/80 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-full">
                      <MapPin className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Location</p>
                      <p className="text-sm font-medium text-gray-900">{restaurant.address}</p>
                    </div>
                  </div>
                  
                  {restaurant.phone && (
                    <div className="flex items-center gap-3 p-3 bg-white/80 rounded-xl border border-gray-200">
                      <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
                        <Phone className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                        <p className="text-sm font-medium text-gray-900">{restaurant.phone}</p>
                      </div>
                    </div>
                  )}
                  
                  {restaurant.hours && (
                    <div className="flex items-center gap-3 p-3 bg-white/80 rounded-xl border border-gray-200">
                      <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                        <Clock className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Hours</p>
                        <p className="text-sm font-medium text-gray-900">{restaurant.hours}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Favorite Button */}
              {user && (
                <div className="lg:ml-6">
                  <Button 
                    variant="outline" 
                    onClick={toggleFavorite} 
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                      isFavorite 
                        ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100' 
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Heart className={`h-5 w-5 transition-colors duration-300 ${
                      isFavorite ? "text-red-500 fill-current" : "text-gray-400"
                    }`} />
                    <span className="font-medium">
                      {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                    </span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <Card className="bg-white rounded-2xl shadow-xl border-0 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-1">Reviews & Ratings</CardTitle>
                <p className="text-gray-600">What others are saying about this restaurant</p>
              </div>
              {user && !userReview && (
                <Button 
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 rounded-xl px-6 py-3 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <Star className="h-4 w-4 mr-2" />
                  {showReviewForm ? "Cancel" : "Write Review"}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-8">
            {showReviewForm && (
              <>
                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200 mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Star className="h-5 w-5 text-orange-500 mr-2" />
                    Share Your Experience
                  </h3>
                  <ReviewForm
                    restaurantId={restaurant._id}
                    onReviewSubmitted={() => {
                      setShowReviewForm(false)
                      fetchRestaurantDetails()
                      checkUserReview()
                    }}
                  />
                </div>
                <Separator className="my-8" />
              </>
            )}

            {userReview && (
              <>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Heart className="h-5 w-5 text-blue-500 mr-2 fill-current" />
                    Your Review
                  </h3>
                  <ReviewCard
                    review={userReview}
                    isOwner={true}
                    onReviewUpdated={() => {
                      fetchRestaurantDetails()
                      checkUserReview()
                    }}
                  />
                </div>
                <Separator className="my-8" />
              </>
            )}

            <div className="space-y-6">
              {reviews.length > 0 ? (
                <>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full mr-3">
                      <span className="text-sm font-bold text-gray-600">{reviews.filter(review => review._id !== userReview?._id).length}</span>
                    </div>
                    Other Reviews
                  </h3>
                  {reviews
                    .filter((review) => review._id !== userReview?._id)
                    .map((review, index) => (
                      <div 
                        key={review._id} 
                        className="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                          <ReviewCard review={review} />
                        </div>
                      </div>
                    ))}
                </>
              ) : (
                <div className="text-center py-16">
                  <div className="flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mx-auto mb-6">
                    <Star className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No reviews yet</h3>
                  <p className="text-gray-500 text-lg mb-6 max-w-md mx-auto">
                    Be the first to share your experience at this restaurant!
                  </p>
                  {user && !userReview && (
                    <Button 
                      onClick={() => setShowReviewForm(true)}
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 rounded-xl px-8 py-3 text-lg transition-all duration-300 hover:scale-105 shadow-lg"
                    >
                      <Star className="h-5 w-5 mr-2" />
                      Write First Review
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
