"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { 
  Settings, 
  ChefHat, 
  DollarSign, 
  MapPin, 
  Bell, 
  Star, 
  Heart,
  Filter,
  Save,
  RotateCcw,
  Eye,
  Mail,
  Phone
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface UserPreferences {
  cuisines: string[]
  priceRange: string[]
  maxDistance: number
  minRating: number
  dietaryRestrictions: string[]
  notifications: {
    newRecommendations: boolean
    restaurantUpdates: boolean
    reviewReplies: boolean
    weeklyDigest: boolean
  }
  privacy: {
    profileVisible: boolean
    reviewsVisible: boolean
    favoritesVisible: boolean
  }
  location: {
    autoDetect: boolean
    city: string
    radius: number
  }
}

export default function PreferencesPage() {
  const [preferences, setPreferences] = useState<UserPreferences>({
    cuisines: [],
    priceRange: [],
    maxDistance: 25,
    minRating: 3.0,
    dietaryRestrictions: [],
    notifications: {
      newRecommendations: true,
      restaurantUpdates: false,
      reviewReplies: true,
      weeklyDigest: true
    },
    privacy: {
      profileVisible: true,
      reviewsVisible: true,
      favoritesVisible: false
    },
    location: {
      autoDetect: false,
      city: "",
      radius: 25
    }
  })
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  
  const { user, token } = useAuth()
  const { toast } = useToast()

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://tastytrack-backend-9tu1.onrender.com"

  const cuisineOptions = [
    { value: "italian", label: "Italian", emoji: "🍝" },
    { value: "chinese", label: "Chinese", emoji: "🥢" },
    { value: "mexican", label: "Mexican", emoji: "🌮" },
    { value: "indian", label: "Indian", emoji: "🍛" },
    { value: "american", label: "American", emoji: "🍔" },
    { value: "japanese", label: "Japanese", emoji: "🍣" },
    { value: "thai", label: "Thai", emoji: "🍜" },
    { value: "french", label: "French", emoji: "🥐" },
    { value: "mediterranean", label: "Mediterranean", emoji: "🥙" },
    { value: "korean", label: "Korean", emoji: "🍲" },
    { value: "vietnamese", label: "Vietnamese", emoji: "🍲" },
    { value: "greek", label: "Greek", emoji: "🥗" }
  ]

  const priceRangeOptions = [
    { value: "budget", label: "Budget ($)", description: "Under $15 per person" },
    { value: "mid-range", label: "Mid-range ($$)", description: "$15-30 per person" },
    { value: "expensive", label: "Expensive ($$$)", description: "$30-60 per person" },
    { value: "fine-dining", label: "Fine Dining ($$$$)", description: "$60+ per person" }
  ]

  const dietaryOptions = [
    { value: "vegetarian", label: "Vegetarian", emoji: "🥬" },
    { value: "vegan", label: "Vegan", emoji: "🌱" },
    { value: "gluten-free", label: "Gluten-Free", emoji: "🌾" },
    { value: "dairy-free", label: "Dairy-Free", emoji: "🥛" },
    { value: "keto", label: "Keto", emoji: "🥑" },
    { value: "halal", label: "Halal", emoji: "☪️" },
    { value: "kosher", label: "Kosher", emoji: "✡️" },
    { value: "low-sodium", label: "Low Sodium", emoji: "🧂" }
  ]

  useEffect(() => {
    if (user) {
      fetchPreferences()
    }
  }, [user])

  const fetchPreferences = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/users/preferences`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data.preferences) {
          setPreferences({ ...preferences, ...result.data.preferences })
        }
      }
    } catch (error) {
      console.error("Failed to fetch preferences:", error)
    } finally {
      setLoading(false)
    }
  }

  const savePreferences = async () => {
    setSaving(true)
    try {
      const response = await fetch(`${API_BASE}/api/users/preferences`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(preferences),
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setHasChanges(false)
          toast({
            title: "Preferences saved",
            description: "Your preferences have been updated successfully",
          })
        }
      } else {
        throw new Error("Failed to save preferences")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save preferences",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const resetPreferences = () => {
    setPreferences({
      cuisines: [],
      priceRange: [],
      maxDistance: 25,
      minRating: 3.0,
      dietaryRestrictions: [],
      notifications: {
        newRecommendations: true,
        restaurantUpdates: false,
        reviewReplies: true,
        weeklyDigest: true
      },
      privacy: {
        profileVisible: true,
        reviewsVisible: true,
        favoritesVisible: false
      },
      location: {
        autoDetect: false,
        city: "",
        radius: 25
      }
    })
    setHasChanges(true)
  }

  const updatePreferences = (section: keyof UserPreferences, key: string, value: any) => {
    setPreferences(prev => {
      const sectionData = prev[section]
      if (typeof sectionData === 'object' && sectionData !== null) {
        return {
          ...prev,
          [section]: {
            ...sectionData,
            [key]: value
          }
        }
      }
      return prev
    })
    setHasChanges(true)
  }

  const toggleArrayValue = (array: string[], value: string) => {
    return array.includes(value)
      ? array.filter(item => item !== value)
      : [...array, value]
  }

  const handleCuisineToggle = (cuisine: string) => {
    const newCuisines = toggleArrayValue(preferences.cuisines, cuisine)
    setPreferences(prev => ({ ...prev, cuisines: newCuisines }))
    setHasChanges(true)
  }

  const handlePriceRangeToggle = (priceRange: string) => {
    const newPriceRanges = toggleArrayValue(preferences.priceRange, priceRange)
    setPreferences(prev => ({ ...prev, priceRange: newPriceRanges }))
    setHasChanges(true)
  }

  const handleDietaryToggle = (dietary: string) => {
    const newDietary = toggleArrayValue(preferences.dietaryRestrictions, dietary)
    setPreferences(prev => ({ ...prev, dietaryRestrictions: newDietary }))
    setHasChanges(true)
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
                Please login to manage your preferences
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <Settings className="inline h-10 w-10 mr-4 text-orange-600" />
            Preferences
          </h1>
          <p className="text-xl text-gray-600">
            Customize your restaurant discovery experience
          </p>
        </div>

        {/* Save/Reset Actions */}
        <div className="flex justify-between items-center mb-8 p-4 bg-white rounded-xl shadow-lg border">
          <div className="flex items-center gap-4">
            {hasChanges && (
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                Unsaved changes
              </Badge>
            )}
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={resetPreferences}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Defaults
            </Button>
            <Button
              onClick={savePreferences}
              disabled={saving || !hasChanges}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save Preferences"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Cuisine Preferences */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900">
                  <ChefHat className="h-5 w-5 mr-2 text-orange-600" />
                  Favorite Cuisines
                </CardTitle>
                <CardDescription>
                  Select cuisines you enjoy to get better recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {cuisineOptions.map((cuisine) => (
                    <div
                      key={cuisine.value}
                      className={`flex items-center space-x-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        preferences.cuisines.includes(cuisine.value)
                          ? 'border-orange-300 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-200'
                      }`}
                      onClick={() => handleCuisineToggle(cuisine.value)}
                    >
                      <Checkbox
                        checked={preferences.cuisines.includes(cuisine.value)}
                        onChange={() => {}} // Handled by onClick above
                      />
                      <span className="text-xl">{cuisine.emoji}</span>
                      <span className="text-sm font-medium">{cuisine.label}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Price Range */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900">
                  <DollarSign className="h-5 w-5 mr-2 text-orange-600" />
                  Price Range
                </CardTitle>
                <CardDescription>
                  Select your preferred price ranges
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {priceRangeOptions.map((range) => (
                  <div
                    key={range.value}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      preferences.priceRange.includes(range.value)
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-200 hover:border-green-200'
                    }`}
                    onClick={() => handlePriceRangeToggle(range.value)}
                  >
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={preferences.priceRange.includes(range.value)}
                        onChange={() => {}} // Handled by onClick above
                      />
                      <div>
                        <div className="font-medium">{range.label}</div>
                        <div className="text-sm text-gray-600">{range.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Dietary Restrictions */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900">
                  <Heart className="h-5 w-5 mr-2 text-orange-600" />
                  Dietary Preferences
                </CardTitle>
                <CardDescription>
                  Help us find restaurants that match your dietary needs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {dietaryOptions.map((dietary) => (
                    <div
                      key={dietary.value}
                      className={`flex items-center space-x-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        preferences.dietaryRestrictions.includes(dietary.value)
                          ? 'border-blue-300 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-200'
                      }`}
                      onClick={() => handleDietaryToggle(dietary.value)}
                    >
                      <Checkbox
                        checked={preferences.dietaryRestrictions.includes(dietary.value)}
                        onChange={() => {}} // Handled by onClick above
                      />
                      <span className="text-lg">{dietary.emoji}</span>
                      <span className="text-sm font-medium">{dietary.label}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Search Preferences */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900">
                  <Filter className="h-5 w-5 mr-2 text-orange-600" />
                  Search Preferences
                </CardTitle>
                <CardDescription>
                  Fine-tune your search and recommendation settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Minimum Rating */}
                <div className="space-y-3">
                  <label className="font-medium text-gray-700 flex items-center">
                    <Star className="h-4 w-4 mr-2 text-orange-600" />
                    Minimum Rating: {preferences.minRating.toFixed(1)} stars
                  </label>
                  <Slider
                    value={[preferences.minRating]}
                    onValueChange={(value) => {
                      setPreferences(prev => ({ ...prev, minRating: value[0] }))
                      setHasChanges(true)
                    }}
                    max={5}
                    min={1}
                    step={0.5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>1.0 stars</span>
                    <span>5.0 stars</span>
                  </div>
                </div>

                {/* Max Distance */}
                <div className="space-y-3">
                  <label className="font-medium text-gray-700 flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-orange-600" />
                    Maximum Distance: {preferences.maxDistance} km
                  </label>
                  <Slider
                    value={[preferences.maxDistance]}
                    onValueChange={(value) => {
                      setPreferences(prev => ({ ...prev, maxDistance: value[0] }))
                      setHasChanges(true)
                    }}
                    max={100}
                    min={1}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>1 km</span>
                    <span>100 km</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900">
                  <Bell className="h-5 w-5 mr-2 text-orange-600" />
                  Notifications
                </CardTitle>
                <CardDescription>
                  Choose what updates you'd like to receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div>
                    <div className="font-medium">New Recommendations</div>
                    <div className="text-sm text-gray-600">Get notified about new restaurant suggestions</div>
                  </div>
                  <Switch
                    checked={preferences.notifications.newRecommendations}
                    onCheckedChange={(checked) => updatePreferences('notifications', 'newRecommendations', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div>
                    <div className="font-medium">Restaurant Updates</div>
                    <div className="text-sm text-gray-600">Menu changes, hours, and special offers</div>
                  </div>
                  <Switch
                    checked={preferences.notifications.restaurantUpdates}
                    onCheckedChange={(checked) => updatePreferences('notifications', 'restaurantUpdates', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div>
                    <div className="font-medium">Review Replies</div>
                    <div className="text-sm text-gray-600">When restaurants respond to your reviews</div>
                  </div>
                  <Switch
                    checked={preferences.notifications.reviewReplies}
                    onCheckedChange={(checked) => updatePreferences('notifications', 'reviewReplies', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div>
                    <div className="font-medium">Weekly Digest</div>
                    <div className="text-sm text-gray-600">Summary of new restaurants and trending spots</div>
                  </div>
                  <Switch
                    checked={preferences.notifications.weeklyDigest}
                    onCheckedChange={(checked) => updatePreferences('notifications', 'weeklyDigest', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900">
                  <Eye className="h-5 w-5 mr-2 text-orange-600" />
                  Privacy Settings
                </CardTitle>
                <CardDescription>
                  Control what others can see about your activity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div>
                    <div className="font-medium">Public Profile</div>
                    <div className="text-sm text-gray-600">Allow others to view your profile</div>
                  </div>
                  <Switch
                    checked={preferences.privacy.profileVisible}
                    onCheckedChange={(checked) => updatePreferences('privacy', 'profileVisible', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div>
                    <div className="font-medium">Public Reviews</div>
                    <div className="text-sm text-gray-600">Show your reviews to other users</div>
                  </div>
                  <Switch
                    checked={preferences.privacy.reviewsVisible}
                    onCheckedChange={(checked) => updatePreferences('privacy', 'reviewsVisible', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div>
                    <div className="font-medium">Public Favorites</div>
                    <div className="text-sm text-gray-600">Let others see your favorite restaurants</div>
                  </div>
                  <Switch
                    checked={preferences.privacy.favoritesVisible}
                    onCheckedChange={(checked) => updatePreferences('privacy', 'favoritesVisible', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}