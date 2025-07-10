"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Navbar } from "@/components/navbar"
import { RestaurantCard } from "@/components/restaurant-card"
import { DashboardSkeleton } from "@/components/loading-skeletons"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Star, 
  Heart, 
  MessageSquare, 
  TrendingUp, 
  Users, 
  MapPin, 
  Calendar,
  Award,
  Clock,
  ChefHat,
  Target,
  Activity
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface UserStats {
  totalReviews: number
  averageRating: number
  favoritesCount: number
  restaurantsVisited: number
  cuisinePreferences: { [key: string]: number }
  monthlyActivity: { [key: string]: number }
  reviewStreak: number
  badgesEarned: string[]
}

interface RecentActivity {
  type: string
  restaurant: string
  date: string
  details: string
  rating?: number
  _id: string
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  earned: boolean
  progress?: number
  maxProgress?: number
}

export default function EnhancedDashboardPage() {
  const [stats, setStats] = useState<UserStats>({
    totalReviews: 0,
    averageRating: 0,
    favoritesCount: 0,
    restaurantsVisited: 0,
    cuisinePreferences: {},
    monthlyActivity: {},
    reviewStreak: 0,
    badgesEarned: []
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [favoriteRestaurants, setFavoriteRestaurants] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  
  const { user, token } = useAuth()
  const { toast } = useToast()

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://tastytrack-backend-9tu1.onrender.com"

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      // Fetch user stats
      const statsResponse = await fetch(`${API_BASE}/api/users/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      // Fetch favorites
      const favoritesResponse = await fetch(`${API_BASE}/api/users/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      // Fetch recommendations
      const recommendationsResponse = await fetch(`${API_BASE}/api/restaurants/recommendations`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      // Fetch recent activity
      const activityResponse = await fetch(`${API_BASE}/api/users/activity`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const results = await Promise.all([
        statsResponse.json(),
        favoritesResponse.json(),
        recommendationsResponse.json(),
        activityResponse.json(),
      ])

      if (results[0].success) {
        setStats(results[0].data)
      }

      if (results[1].success) {
        setFavoriteRestaurants(results[1].data.favorites || [])
      }

      if (results[2].success) {
        setRecommendations(results[2].data.restaurants?.slice(0, 3) || [])
      }

      if (results[3].success) {
        setRecentActivity(results[3].data.activities?.slice(0, 5) || [])
      }

      // Generate achievements based on stats
      generateAchievements(results[0].data)
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

  const generateAchievements = (userStats: UserStats) => {
    const achievements: Achievement[] = [
      {
        id: "first-review",
        title: "First Review",
        description: "Write your first restaurant review",
        icon: "MessageSquare",
        earned: userStats.totalReviews >= 1,
        progress: Math.min(userStats.totalReviews, 1),
        maxProgress: 1
      },
      {
        id: "review-master",
        title: "Review Master",
        description: "Write 10 restaurant reviews",
        icon: "Award",
        earned: userStats.totalReviews >= 10,
        progress: Math.min(userStats.totalReviews, 10),
        maxProgress: 10
      },
      {
        id: "foodie-explorer",
        title: "Foodie Explorer",
        description: "Visit 25 different restaurants",
        icon: "MapPin",
        earned: userStats.restaurantsVisited >= 25,
        progress: Math.min(userStats.restaurantsVisited, 25),
        maxProgress: 25
      },
      {
        id: "curator",
        title: "Curator",
        description: "Add 5 restaurants to favorites",
        icon: "Heart",
        earned: userStats.favoritesCount >= 5,
        progress: Math.min(userStats.favoritesCount, 5),
        maxProgress: 5
      },
      {
        id: "streak-warrior",
        title: "Streak Warrior",
        description: "Maintain a 7-day review streak",
        icon: "Target",
        earned: userStats.reviewStreak >= 7,
        progress: Math.min(userStats.reviewStreak, 7),
        maxProgress: 7
      }
    ]
    setAchievements(achievements)
  }

  const getTopCuisines = () => {
    const cuisines = Object.entries(stats.cuisinePreferences || {})
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
    
    return cuisines.map(([cuisine, count]) => ({ cuisine, count }))
  }

  const getActivityTypeIcon = (type: string) => {
    switch (type) {
      case 'review': return MessageSquare
      case 'favorite': return Heart
      case 'visit': return MapPin
      default: return Activity
    }
  }

  const formatActivityDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <Card className="p-8 text-center border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">Login Required</CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Please login to view your personalized dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/login">
                <Button size="lg" className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
                  Login to Continue
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Welcome back, <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">{user.name}</span>!
          </h1>
          <p className="text-xl text-gray-600">
            Here's what's happening with your culinary journey 🍽️
          </p>
        </div>

        {loading ? (
          <DashboardSkeleton />
        ) : (
          <div className="space-y-8">
            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full transform translate-x-10 -translate-y-10"></div>
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Total Reviews</p>
                      <p className="text-3xl font-bold">{stats.totalReviews}</p>
                      <p className="text-blue-200 text-xs mt-1">
                        {stats.reviewStreak > 0 && `${stats.reviewStreak}-day streak! 🔥`}
                      </p>
                    </div>
                    <MessageSquare className="h-10 w-10 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-r from-green-500 to-green-600 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full transform translate-x-10 -translate-y-10"></div>
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium">Avg Rating Given</p>
                      <p className="text-3xl font-bold">{stats.averageRating.toFixed(1)}</p>
                      <div className="flex items-center mt-1">
                        {Array.from({ length: Math.floor(stats.averageRating) }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 text-yellow-300 fill-current" />
                        ))}
                      </div>
                    </div>
                    <Star className="h-10 w-10 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-r from-red-500 to-red-600 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full transform translate-x-10 -translate-y-10"></div>
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-100 text-sm font-medium">Favorites</p>
                      <p className="text-3xl font-bold">{stats.favoritesCount}</p>
                      <p className="text-red-200 text-xs mt-1">Curated collection</p>
                    </div>
                    <Heart className="h-10 w-10 text-red-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full transform translate-x-10 -translate-y-10"></div>
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm font-medium">Places Visited</p>
                      <p className="text-3xl font-bold">{stats.restaurantsVisited}</p>
                      <p className="text-purple-200 text-xs mt-1">Explorer level</p>
                    </div>
                    <MapPin className="h-10 w-10 text-purple-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Main Stats */}
              <div className="lg:col-span-2 space-y-8">
                {/* Cuisine Preferences */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-gray-900">
                      <ChefHat className="h-5 w-5 mr-2 text-orange-600" />
                      Your Cuisine Preferences
                    </CardTitle>
                    <CardDescription>Based on your reviews and favorites</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {getTopCuisines().length > 0 ? (
                      <div className="space-y-4">
                        {getTopCuisines().map(({ cuisine, count }, index) => (
                          <div key={cuisine} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                                index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                              }`}>
                                {index + 1}
                              </div>
                              <span className="font-medium text-gray-900 capitalize">{cuisine}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Progress 
                                value={(count / Math.max(...Object.values(stats.cuisinePreferences || {}))) * 100} 
                                className="w-20 h-2" 
                              />
                              <span className="text-sm text-gray-600 font-medium">{count}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <ChefHat className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Start reviewing to see your preferences!</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-gray-900">
                      <Activity className="h-5 w-5 mr-2 text-orange-600" />
                      Recent Activity
                    </CardTitle>
                    <CardDescription>Your latest restaurant interactions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {recentActivity.length > 0 ? (
                      <div className="space-y-4">
                        {recentActivity.map((activity) => {
                          const IconComponent = getActivityTypeIcon(activity.type)
                          return (
                            <div key={activity._id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                              <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-full">
                                <IconComponent className="h-5 w-5 text-orange-600" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">{activity.details}</p>
                                <p className="text-sm text-gray-600">{activity.restaurant}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-500">{formatActivityDate(activity.date)}</p>
                                {activity.rating && (
                                  <div className="flex items-center mt-1">
                                    <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                                    <span className="text-xs font-medium">{activity.rating}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No recent activity</p>
                        <Link href="/restaurants">
                          <Button variant="outline" className="mt-4">
                            Start Exploring
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-6">
                {/* Achievements */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-gray-900">
                      <Award className="h-5 w-5 mr-2 text-orange-600" />
                      Achievements
                    </CardTitle>
                    <CardDescription>Track your progress</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {achievements.map((achievement) => (
                      <div key={achievement.id} className={`p-4 rounded-xl border-2 transition-all ${
                        achievement.earned 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-gray-50 border-gray-200'
                      }`}>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className={`font-semibold ${
                              achievement.earned ? 'text-green-800' : 'text-gray-700'
                            }`}>
                              {achievement.title}
                            </h4>
                            <p className={`text-sm ${
                              achievement.earned ? 'text-green-600' : 'text-gray-500'
                            }`}>
                              {achievement.description}
                            </p>
                          </div>
                          {achievement.earned && (
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                              Earned!
                            </Badge>
                          )}
                        </div>
                        {!achievement.earned && achievement.maxProgress && (
                          <div className="space-y-1">
                            <Progress 
                              value={(achievement.progress! / achievement.maxProgress) * 100} 
                              className="h-2" 
                            />
                            <p className="text-xs text-gray-500">
                              {achievement.progress} / {achievement.maxProgress}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Favorite Restaurants */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-gray-900">
                      <Heart className="h-5 w-5 mr-2 text-red-600" />
                      Quick Favorites
                    </CardTitle>
                    <CardDescription>Your top picks</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {favoriteRestaurants.length > 0 ? (
                      <div className="space-y-3">
                        {favoriteRestaurants.slice(0, 3).map((restaurant: any) => (
                          <Link key={restaurant._id} href={`/restaurants/${restaurant._id}`}>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                              <div>
                                <h4 className="font-semibold text-gray-900 text-sm">{restaurant.name}</h4>
                                <p className="text-xs text-gray-600">{restaurant.cuisine}</p>
                              </div>
                              <div className="flex items-center">
                                <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                                <span className="text-xs font-medium">{restaurant.rating?.toFixed(1)}</span>
                              </div>
                            </div>
                          </Link>
                        ))}
                        <Link href="/favorites">
                          <Button variant="outline" size="sm" className="w-full">
                            View All ({favoriteRestaurants.length})
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <Heart className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">No favorites yet</p>
                        <Link href="/restaurants">
                          <Button variant="outline" size="sm" className="mt-3">
                            Explore
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Recommendations */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-gray-900">
                      <TrendingUp className="h-5 w-5 mr-2 text-orange-600" />
                      For You
                    </CardTitle>
                    <CardDescription>Personalized picks</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {recommendations.length > 0 ? (
                      <div className="space-y-3">
                        {recommendations.map((restaurant: any) => (
                          <Link key={restaurant._id} href={`/restaurants/${restaurant._id}`}>
                            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg hover:from-orange-100 hover:to-red-100 transition-colors cursor-pointer">
                              <div>
                                <h4 className="font-semibold text-gray-900 text-sm">{restaurant.name}</h4>
                                <p className="text-xs text-gray-600">{restaurant.cuisine}</p>
                              </div>
                              <div className="flex items-center">
                                <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                                <span className="text-xs font-medium">{restaurant.rating?.toFixed(1)}</span>
                              </div>
                            </div>
                          </Link>
                        ))}
                        <Link href="/recommendations">
                          <Button variant="outline" size="sm" className="w-full">
                            More Recommendations
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <TrendingUp className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">Add reviews to get recommendations</p>
                        <Link href="/restaurants">
                          <Button variant="outline" size="sm" className="mt-3">
                            Start Reviewing
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}