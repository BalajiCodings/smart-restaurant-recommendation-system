"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Navbar } from "@/components/navbar"
import { RestaurantCard } from "@/components/restaurant-card"
import { AdvancedSearch } from "@/components/advanced-search"
import { SearchResultsSkeleton, RestaurantCardSkeleton } from "@/components/loading-skeletons"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, MapPin, Star, Clock, TrendingUp, Grid, List } from "lucide-react"
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
  image?: string
  features?: string[]
  openNow?: boolean
  
  // Swiggy data fields
  numberOfRatings?: string
  averagePrice?: string
  numberOfOffers?: number
  offerNames?: string[]
  area?: string
  isPureVeg?: boolean
  location?: string
}

interface SearchFilters {
  query: string
  cuisine: string
  priceRange: string[]
  rating: number[]
  location: string
  area: string
  openNow: boolean
  features: string[]
  veg: boolean
}

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('rating')
  const [currentFilters, setCurrentFilters] = useState<SearchFilters>({
    query: "",
    cuisine: "all",
    priceRange: [],
    rating: [0],
    location: "",
    area: "",
    openNow: false,
    features: [],
    veg: false
  })
  
  const { token } = useAuth()
  const { toast } = useToast()

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://tastytrack-backend-9tu1.onrender.com"

  const fetchRestaurants = async (pageNum = 1, filters: SearchFilters) => {
    setSearchLoading(true)
    try {
      let url = `${API_BASE}/api/restaurants?page=${pageNum}&limit=12&sort=${sortBy}`

      // Add search query
      if (filters.query) {
        url = `${API_BASE}/api/restaurants/search?q=${encodeURIComponent(filters.query)}&page=${pageNum}&limit=12&sort=${sortBy}`
      }

      // Add cuisine filter
      if (filters.cuisine !== "all") {
        url += `${filters.query ? "&" : "?"}cuisine=${encodeURIComponent(filters.cuisine)}`
      }

      // Add location filters
      if (filters.location) {
        url += `${url.includes('?') ? "&" : "?"}location=${encodeURIComponent(filters.location)}`
      }
      
      if (filters.area) {
        url += `${url.includes('?') ? "&" : "?"}area=${encodeURIComponent(filters.area)}`
      }

      // Add vegetarian filter
      if (filters.veg) {
        url += `${url.includes('?') ? "&" : "?"}veg=true`
      }

      const response = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          const fetchedRestaurants = result.data.restaurants || result.data
          
          if (pageNum === 1) {
            setRestaurants(fetchedRestaurants)
          } else {
            setRestaurants((prev) => [...prev, ...fetchedRestaurants])
          }
          setHasMore(fetchedRestaurants.length === 12)
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
      setSearchLoading(false)
    }
  }

  const applyClientSideFilters = (restaurants: Restaurant[], filters: SearchFilters) => {
    let filtered = [...restaurants]

    // Price range filter
    if (filters.priceRange.length > 0) {
      filtered = filtered.filter(r => 
        filters.priceRange.includes(r.priceRange?.toLowerCase() || 'mid-range')
      )
    }

    // Rating filter
    if (filters.rating[0] > 0) {
      filtered = filtered.filter(r => r.rating >= filters.rating[0])
    }

    // Location filter (simple text match)
    if (filters.location) {
      filtered = filtered.filter(r => 
        r.address.toLowerCase().includes(filters.location.toLowerCase())
      )
    }

    // Open now filter (mock implementation)
    if (filters.openNow) {
      filtered = filtered.filter(r => r.openNow !== false) // Assume open if not specified
    }

    // Features filter
    if (filters.features.length > 0) {
      filtered = filtered.filter(r => 
        filters.features.some(feature => 
          r.features?.includes(feature) || false
        )
      )
    }

    return filtered
  }

  useEffect(() => {
    setLoading(true)
    setPage(1)
    fetchRestaurants(1, currentFilters)
  }, [sortBy])

  useEffect(() => {
    const filtered = applyClientSideFilters(restaurants, currentFilters)
    setFilteredRestaurants(filtered)
  }, [restaurants, currentFilters])

  const handleFiltersChange = (filters: SearchFilters) => {
    setCurrentFilters(filters)
    setPage(1)
    
    // Only fetch new data if query, cuisine, location, area, or veg changed (server-side filters)
    const needsNewFetch = 
      filters.query !== currentFilters.query || 
      filters.cuisine !== currentFilters.cuisine ||
      filters.location !== currentFilters.location ||
      filters.area !== currentFilters.area ||
      filters.veg !== currentFilters.veg
    
    if (needsNewFetch) {
      fetchRestaurants(1, filters)
    }
  }

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchRestaurants(nextPage, currentFilters)
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (currentFilters.cuisine !== "all") count++
    if (currentFilters.priceRange.length > 0) count++
    if (currentFilters.rating[0] > 0) count++
    if (currentFilters.location) count++
    if (currentFilters.area) count++
    if (currentFilters.openNow) count++
    if (currentFilters.features.length > 0) count++
    if (currentFilters.veg) count++
    return count
  }

  const sortOptions = [
    { value: 'rating', label: 'Rating', icon: Star },
    { value: 'name', label: 'Name A-Z', icon: Filter },
    { value: 'reviewCount', label: 'Most Reviewed', icon: TrendingUp },
    { value: 'distance', label: 'Distance', icon: MapPin }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-16 px-4 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-200 to-red-200 rounded-full opacity-20 transform translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-yellow-200 to-orange-200 rounded-full opacity-20 transform -translate-x-24 translate-y-24"></div>
        
        <div className="relative max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Discover Amazing
            <span className="block bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Restaurants
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Find your next favorite dining spot with our smart recommendation system
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-16">
        {/* Advanced Search */}
        <div className="mb-8">
          <AdvancedSearch onFiltersChange={handleFiltersChange} loading={searchLoading} />
        </div>

        {/* Results Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {currentFilters.query ? 'Search Results' : 'All Restaurants'}
            </h2>
            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
              {filteredRestaurants.length} found
            </Badge>
            {getActiveFiltersCount() > 0 && (
              <Badge variant="outline" className="border-orange-200 text-orange-600">
                {getActiveFiltersCount()} filters active
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Sort Dropdown */}
            <Tabs value={sortBy} onValueChange={setSortBy} className="w-auto">
              <TabsList className="grid grid-cols-4 w-auto">
                {sortOptions.map((option) => (
                  <TabsTrigger 
                    key={option.value} 
                    value={option.value}
                    className="text-xs px-3 py-2"
                  >
                    <option.icon className="h-3 w-3 mr-1" />
                    {option.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-orange-100 text-orange-600' : ''}`}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-orange-100 text-orange-600' : ''}`}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <SearchResultsSkeleton />
        ) : (
          <>
            {/* Results */}
            {filteredRestaurants.length > 0 ? (
              <div className="space-y-6">
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {filteredRestaurants.map((restaurant) => (
                    <RestaurantCard 
                      key={restaurant._id} 
                      restaurant={restaurant}
                    />
                  ))}
                </div>

                {/* Load More */}
                {hasMore && !searchLoading && (
                  <div className="text-center">
                    <Button 
                      onClick={loadMore}
                      size="lg"
                      variant="outline"
                      className="bg-white hover:bg-orange-50 border-orange-200 text-orange-600"
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Load More Restaurants
                    </Button>
                  </div>
                )}

                {searchLoading && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <RestaurantCardSkeleton key={i} />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Card className="border-0 shadow-lg bg-white text-center py-16">
                <CardContent>
                  <Search className="h-16 w-16 text-gray-300 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    No restaurants found
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    {currentFilters.query || getActiveFiltersCount() > 0
                      ? "Try adjusting your search criteria or filters to find more restaurants."
                      : "It looks like there are no restaurants available at the moment."
                    }
                  </p>
                  <Button 
                    onClick={() => handleFiltersChange({
                      query: "",
                      cuisine: "all",
                      priceRange: [],
                      rating: [0],
                      location: "",
                      area: "",
                      openNow: false,
                      features: [],
                      veg: false
                    })}
                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                  >
                    Clear All Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  )
}