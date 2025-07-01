"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Navbar } from "@/components/navbar"
import { RestaurantCard } from "@/components/restaurant-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Heart, MessageSquare, TrendingUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DashboardData {
  user: {
    name: string
    email: string
    favorites: any[]
  }
  userReviews: any[]
  recommendations: any[]
}

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const { user, token } = useAuth()
  const { toast } = useToast()

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://tastytrack-backend-9tu1.onrender.com"

  useEffect(() => {
    if (user && token) {
      fetchDashboardData()
    }
  }, [user, token])

  const fetchDashboardData = async () => {
    try {
      const [dashboardRes, recommendationsRes] = await Promise.all([
        fetch(`${API_BASE}/api/users/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE}/api/restaurants/recommendations`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      const [dashboardResult, recommendationsResult] = await Promise.all([
        dashboardRes.json(),
        recommendationsRes.json(),
      ])

      if (dashboardResult.success && recommendationsResult.success) {
        setDashboardData({
          user: {
            ...dashboardResult.data.user,
            favorites: dashboardResult.data.user.favorites || [],
          },
          userReviews: dashboardResult.data.reviews || [],
          recommendations: recommendationsResult.data.recommendations || [],
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Please log in to view your dashboard</h1>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="bg-gray-300 h-8 rounded mb-6"></div>
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-gray-300 h-24 rounded"></div>
              ))}
            </div>
            <div className="bg-gray-300 h-96 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  const renderStars = (rating: number) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(<Star key={i} className={`h-4 w-4 ${i <= rating ? "text-yellow-500" : "text-gray-300"}`} />)
    }
    return stars
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.name}!</h1>
          <p className="text-gray-600">Here's your dining activity overview</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.userReviews.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Favorite Restaurants</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.user.favorites.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating Given</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData?.userReviews.length
                  ? (
                      dashboardData.userReviews.reduce((acc, review) => acc + review.rating, 0) /
                      dashboardData.userReviews.length
                    ).toFixed(1)
                  : "0.0"}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recommendations</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.recommendations.length || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="recommendations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="reviews">My Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="recommendations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recommended for You</CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardData?.recommendations.length ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dashboardData.recommendations.map((restaurant) => (
                      <RestaurantCard key={restaurant._id} restaurant={restaurant} />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No recommendations available. Add some favorites and reviews to get personalized suggestions!
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Favorite Restaurants</CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardData?.user.favorites.length ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dashboardData.user.favorites.map((restaurant) => (
                      <RestaurantCard key={restaurant._id} restaurant={restaurant} />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No favorite restaurants yet. Start exploring and add restaurants to your favorites!
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Recent Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardData?.userReviews.length ? (
                  <div className="space-y-4">
                    {dashboardData.userReviews.slice(0, 5).map((review) => (
                      <div key={review._id || Math.random()} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">{review.restaurant?.name}</h4>
                          <div className="flex items-center gap-1">{renderStars(review.rating)}</div>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{review.comment}</p>
                        <span className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No reviews yet. Visit some restaurants and share your experiences!
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
