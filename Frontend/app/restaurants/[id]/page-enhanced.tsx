"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Navbar } from "@/components/navbar"
import { ReviewForm } from "@/components/review-form"
import { ReviewCard } from "@/components/review-card"
import { RestaurantInfoCard } from "@/components/restaurant-info-card"
import { RestaurantDetailSkeleton } from "@/components/loading-skeletons"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { 
  Star, 
  Heart, 
  MapPin, 
  DollarSign, 
  Share2, 
  Award,
  TrendingUp,
  MessageCircle,
  Bookmark,
  Users
} from "lucide-react"
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
  website?: string
  features?: string[]
}

interface Review {
  _id: string
  user: {
    _id?: string
    name: string
    email?: string
  }
  rating: number
  comment: string
  createdAt: string
  helpful?: number
}

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

export default function RestaurantDetailPage() {
  const params = useParams()
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<RestaurantStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [userReview, setUserReview] = useState<Review | null>(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [shareLoading, setShareLoading] = useState(false)
  
  const { user, token } = useAuth()
  const { toast } = useToast()

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
          const restaurantData = result.data.restaurant
          setRestaurant(restaurantData)
          setReviews(restaurantData.reviews || [])
          
          // Generate mock stats
          generateMockStats(restaurantData)
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

  const generateMockStats = (restaurantData: Restaurant) => {
    const reviews = restaurantData.reviews || []
    const totalReviews = reviews.length
    
    if (totalReviews === 0) {
      setStats({
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: {},
        topReviewKeywords: [],
        verificationStatus: "Verified",
        priceLevel: 2
      })
      return
    }

    // Calculate rating distribution
    const ratingDistribution: { [key: number]: number } = {}
    reviews.forEach(review => {
      const rating = Math.floor(review.rating)
      ratingDistribution[rating] = (ratingDistribution[rating] || 0) + 1
    })

    // Generate mock keywords
    const keywords = ["delicious", "great service", "cozy atmosphere", "fresh ingredients"]
    
    setStats({
      averageRating: restaurantData.rating,
      totalReviews,
      ratingDistribution,
      topReviewKeywords: keywords.slice(0, 4),
      verificationStatus: "Verified Business",
      estimatedWaitTime: Math.floor(Math.random() * 30) + 10,
      priceLevel: getPriceLevel(restaurantData.priceRange)
    })
  }

  const getPriceLevel = (priceRange?: string) => {
    switch (priceRange?.toLowerCase()) {
      case "budget": return 1
      case "mid-range": return 2
      case "expensive": return 3
      case "fine-dining": return 4
      default: return 2
    }
  }

  const checkFavoriteStatus = async () => {
    if (!params?.id || !token) return
    
    try {
      const response = await fetch(`${API_BASE}/api/users/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          const favorites = result.data.favorites || []
          setIsFavorite(favorites.some((fav: any) => fav._id === params.id))
        }
      }
    } catch (error) {
      console.error("Failed to check favorite status:", error)
    }
  }

  const checkUserReview = async () => {
    if (!params?.id || !token) return
    
    try {
      const response = await fetch(`${API_BASE}/api/reviews/user/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data.review) {
          setUserReview(result.data.review)
        }
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

  const handleShare = async () => {
    setShareLoading(true)
    try {
      if (navigator.share) {
        await navigator.share({
          title: restaurant?.name,
          text: `Check out ${restaurant?.name} - ${restaurant?.cuisine} cuisine`,
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        toast({
          title: "Link copied!",
          description: "Restaurant link has been copied to your clipboard",
        })
      }
    } catch (error) {
      console.error("Error sharing:", error)
    } finally {
      setShareLoading(false)
    }
  }

  const handleReviewUpdated = () => {
    fetchRestaurantDetails()
    checkUserReview()
    setShowReviewForm(false)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ))
  }

  const getRestaurantImage = (name: string, cuisine: string, index: number = 0) => {
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
    
    const nameHash = name.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
    const imageId = (nameHash % 100) + 1 + index
    
    return `https://images.unsplash.com/photo-${1500000000000 + imageId}?w=800&h=600&fit=crop&auto=format&q=80&${imageQuery}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <RestaurantDetailSkeleton />
        </div>
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Restaurant not found</h1>
        </div>
      </div>
    )
  }

  const mockGalleryImages = [
    getRestaurantImage(restaurant.name, restaurant.cuisine, 0),
    getRestaurantImage(restaurant.name, restaurant.cuisine, 1),
    getRestaurantImage(restaurant.name, restaurant.cuisine, 2),
    getRestaurantImage(restaurant.name, restaurant.cuisine, 3),
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section with Image Gallery */}
        <div className="relative h-96 rounded-2xl overflow-hidden mb-8 shadow-2xl">
          <img
            src={mockGalleryImages[activeImageIndex]}
            alt={restaurant.name}
            className="w-full h-full object-cover transition-all duration-500"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = `https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop&auto=format&q=80`
            }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          
          {/* Content Overlay */}
          <div className="absolute inset-0 flex items-end">
            <div className="p-8 text-white w-full">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="bg-white/90 text-gray-800">
                      {restaurant.cuisine}
                    </Badge>
                    {stats?.verificationStatus && (
                      <Badge className="bg-green-500/90 text-white">
                        <Award className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  
                  <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                    {restaurant.name}
                  </h1>
                  
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      {renderStars(restaurant.rating)}
                      <span className="text-lg font-semibold">
                        {restaurant.rating.toFixed(1)}
                      </span>
                      <span className="text-white/80">
                        ({reviews.length} reviews)
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      <span className="font-medium">
                        {restaurant.priceRange || "Mid-range"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-white/90">
                    <MapPin className="h-5 w-5" />
                    <span>{restaurant.address}</span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  {user && (
                    <Button
                      onClick={toggleFavorite}
                      variant="secondary"
                      size="lg"
                      className={`bg-white/90 hover:bg-white backdrop-blur-sm transition-all duration-300 ${
                        isFavorite ? 'text-red-600' : 'text-gray-700'
                      }`}
                    >
                      <Heart className={`h-5 w-5 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                      {isFavorite ? 'Favorited' : 'Add to Favorites'}
                    </Button>
                  )}
                  
                  <Button
                    onClick={handleShare}
                    variant="secondary"
                    size="lg"
                    disabled={shareLoading}
                    className="bg-white/90 hover:bg-white backdrop-blur-sm text-gray-700"
                  >
                    <Share2 className="h-5 w-5 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Image Gallery Thumbnails */}
          <div className="absolute bottom-4 left-8 flex gap-2">
            {mockGalleryImages.slice(0, 4).map((image, index) => (
              <button
                key={index}
                onClick={() => setActiveImageIndex(index)}
                className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                  activeImageIndex === index ? 'border-white' : 'border-white/50'
                }`}
              >
                <img
                  src={image}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                  <TrendingUp className="h-6 w-6 mr-3 text-orange-600" />
                  About {restaurant.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {restaurant.description}
                </p>
                
                {restaurant.features && restaurant.features.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Features & Amenities</h4>
                    <div className="flex flex-wrap gap-2">
                      {restaurant.features.map((feature) => (
                        <Badge key={feature} variant="outline" className="border-orange-200 text-orange-700">
                          {feature.replace('-', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                    <MessageCircle className="h-6 w-6 mr-3 text-orange-600" />
                    Reviews ({reviews.length})
                  </CardTitle>
                  
                  {user && !userReview && (
                    <Button
                      onClick={() => setShowReviewForm(!showReviewForm)}
                      className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                    >
                      Write a Review
                    </Button>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Review Form */}
                {showReviewForm && (
                  <div className="border-2 border-orange-200 rounded-xl p-6 bg-orange-50/50">
                    <ReviewForm
                      restaurantId={restaurant._id}
                      onReviewSubmitted={handleReviewUpdated}
                    />
                  </div>
                )}

                {/* User's Existing Review */}
                {userReview && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <Bookmark className="h-4 w-4 mr-2 text-orange-600" />
                      Your Review
                    </h4>
                    <ReviewCard
                      review={userReview}
                      isOwner={true}
                      onReviewUpdated={handleReviewUpdated}
                    />
                    <Separator className="my-6" />
                  </div>
                )}

                {/* Other Reviews */}
                {reviews.length > 0 ? (
                  <div className="space-y-6">
                    <h4 className="font-semibold text-gray-900 flex items-center">
                      <Users className="h-4 w-4 mr-2 text-orange-600" />
                      All Reviews
                    </h4>
                    {reviews
                      .filter(review => review._id !== userReview?._id)
                      .map((review) => (
                        <ReviewCard
                          key={review._id}
                          review={review}
                          onReviewUpdated={handleReviewUpdated}
                        />
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No reviews yet
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Be the first to share your experience at {restaurant.name}!
                    </p>
                    {user && !showReviewForm && (
                      <Button
                        onClick={() => setShowReviewForm(true)}
                        className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                      >
                        Write the First Review
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Restaurant Info */}
          <div>
            <RestaurantInfoCard 
              restaurant={{
                _id: restaurant._id,
                name: restaurant.name,
                phone: restaurant.phone,
                hours: restaurant.hours,
                website: restaurant.website,
                priceRange: restaurant.priceRange,
                features: restaurant.features
              }}
              stats={stats || undefined}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
