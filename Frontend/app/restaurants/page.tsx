"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Navbar } from "@/components/navbar"
import { RestaurantCard } from "@/components/restaurant-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [cuisineFilter, setCuisineFilter] = useState("All Cuisines")
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const { token } = useAuth()
  const { toast } = useToast()

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://tastytrack-backend-9tu1.onrender.com"

  const fetchRestaurants = async (pageNum = 1, search = "", cuisine = "") => {
    try {
      let url = `${API_BASE}/api/restaurants?page=${pageNum}&limit=12`

      if (search) {
        url = `${API_BASE}/api/restaurants/search?q=${encodeURIComponent(search)}&page=${pageNum}&limit=12`
      }

      if (cuisine !== "All Cuisines") {
        url += `${search ? "&" : "?"}cuisine=${encodeURIComponent(cuisine)}`
      }

      const response = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          const restaurants = result.data.restaurants || result.data

          if (pageNum === 1) {
            setRestaurants(restaurants)
          } else {
            setRestaurants((prev) => [...prev, ...restaurants])
          }
          setHasMore(restaurants.length === 12)
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch restaurants",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    setPage(1)
    fetchRestaurants(1, searchQuery, cuisineFilter)
  }, [searchQuery, cuisineFilter])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchRestaurants(1, searchQuery, cuisineFilter)
  }

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchRestaurants(nextPage, searchQuery, cuisineFilter)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-orange-600 to-red-600 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-yellow-300 to-orange-300 rounded-full opacity-20 transform translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-red-300 to-orange-300 rounded-full opacity-20 transform -translate-x-24 translate-y-24"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">
              Discover Amazing 
              <span className="block text-yellow-300">Restaurants</span>
            </h1>
            <p className="text-xl text-orange-100 max-w-2xl mx-auto">
              Find your next favorite dining spot from our curated collection of restaurants
            </p>
          </div>

          {/* Search and Filter */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-white/20">
              <div className="flex flex-col lg:flex-row gap-4">
                <form onSubmit={handleSearch} className="flex-1 flex gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      placeholder="Search restaurants, cuisines, or locations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 py-3 text-lg border-gray-200 focus:border-orange-400 focus:ring-orange-400 rounded-xl"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    <Search className="h-5 w-5 mr-2" />
                    Search
                  </Button>
                </form>

                <Select value={cuisineFilter} onValueChange={setCuisineFilter}>
                  <SelectTrigger className="w-full lg:w-64 py-3 border-gray-200 focus:border-orange-400 focus:ring-orange-400 rounded-xl">
                    <Filter className="h-5 w-5 mr-2 text-gray-500" />
                    <SelectValue placeholder="All Cuisines" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-gray-200">
                    <SelectItem value="All Cuisines" className="focus:bg-orange-50">🌍 All Cuisines</SelectItem>
                    <SelectItem value="Italian" className="focus:bg-orange-50">🍝 Italian</SelectItem>
                    <SelectItem value="Chinese" className="focus:bg-orange-50">🥢 Chinese</SelectItem>
                    <SelectItem value="Mexican" className="focus:bg-orange-50">🌮 Mexican</SelectItem>
                    <SelectItem value="Indian" className="focus:bg-orange-50">🍛 Indian</SelectItem>
                    <SelectItem value="American" className="focus:bg-orange-50">🍔 American</SelectItem>
                    <SelectItem value="Japanese" className="focus:bg-orange-50">🍣 Japanese</SelectItem>
                    <SelectItem value="Thai" className="focus:bg-orange-50">🍜 Thai</SelectItem>
                    <SelectItem value="French" className="focus:bg-orange-50">🥖 French</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">

        {/* Results Section */}
        {loading && restaurants.length === 0 ? (
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
        ) : (
          <>
            {restaurants.length > 0 && (
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {searchQuery || cuisineFilter !== "All Cuisines" 
                    ? `Found ${restaurants.length} restaurant${restaurants.length !== 1 ? 's' : ''}`
                    : `Discover ${restaurants.length} Amazing Restaurant${restaurants.length !== 1 ? 's' : ''}`
                  }
                </h2>
                <p className="text-gray-600">
                  {searchQuery && `Results for "${searchQuery}"`}
                  {cuisineFilter !== "All Cuisines" && !searchQuery && `Showing ${cuisineFilter} cuisine`}
                  {cuisineFilter !== "All Cuisines" && searchQuery && ` in ${cuisineFilter} cuisine`}
                </p>
              </div>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {restaurants.map((restaurant, index) => (
                <div 
                  key={restaurant._id}
                  className="transform transition-all duration-500 hover:scale-105"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <RestaurantCard restaurant={restaurant} />
                </div>
              ))}
            </div>

            {restaurants.length === 0 && !loading && (
              <div className="text-center py-20">
                <div className="flex items-center justify-center w-24 h-24 bg-gradient-to-r from-orange-100 to-red-100 rounded-full mx-auto mb-6">
                  <Search className="h-12 w-12 text-orange-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No restaurants found</h3>
                <p className="text-gray-500 text-lg mb-6 max-w-md mx-auto">
                  We couldn't find any restaurants matching your search. Try adjusting your filters or search terms.
                </p>
                <Button 
                  onClick={() => {
                    setSearchQuery("")
                    setCuisineFilter("All Cuisines")
                  }}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl"
                >
                  Clear Filters
                </Button>
              </div>
            )}

            {hasMore && restaurants.length > 0 && (
              <div className="text-center mt-12">
                <Button 
                  onClick={loadMore} 
                  variant="outline" 
                  disabled={loading}
                  className="px-8 py-3 rounded-xl border-2 border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300 transition-all duration-300"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-600 mr-2"></div>
                      Loading...
                    </>
                  ) : (
                    "Load More Restaurants"
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
