"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Filter, X, MapPin, DollarSign, Star, Clock, Leaf, Navigation } from "lucide-react"

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

interface AdvancedSearchProps {
  onFiltersChange: (filters: SearchFilters) => void
  loading?: boolean
}

export function AdvancedSearch({ onFiltersChange, loading = false }: AdvancedSearchProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [locations, setLocations] = useState<string[]>([])
  const [areas, setAreas] = useState<string[]>([])
  const [cuisines, setCuisines] = useState<Array<{value: string, label: string}>>([])
  const [loadingData, setLoadingData] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
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

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://tastytrack-backend-9tu1.onrender.com"

  // Fetch locations and cuisines from backend
  useEffect(() => {
    const fetchFilterData = async () => {
      setLoadingData(true)
      try {
        const [locationsRes, cuisinesRes] = await Promise.all([
          fetch(`${API_BASE}/api/restaurants/locations`),
          fetch(`${API_BASE}/api/restaurants/cuisines`)
        ])

        if (locationsRes.ok) {
          const locationData = await locationsRes.json()
          if (locationData.success) {
            setLocations(['', ...locationData.data.locations]) // Add empty option
            setAreas(['', ...locationData.data.areas])
          }
        }

        if (cuisinesRes.ok) {
          const cuisineData = await cuisinesRes.json()
          if (cuisineData.success) {
            // Create a map to store unique cuisines and avoid duplicates
            const uniqueCuisines = new Map<string, string>()
            
            cuisineData.data.cuisines.forEach((cuisine: string) => {
              // Normalize cuisine by sorting comma-separated values
              const normalizedValue = cuisine
                .toLowerCase()
                .split(',')
                .map(c => c.trim())
                .sort()
                .join(', ')
              
              // Use the original cuisine as the label if not already added
              if (!uniqueCuisines.has(normalizedValue)) {
                uniqueCuisines.set(normalizedValue, cuisine)
              }
            })
            
            const cuisineOptions = [
              { value: "all", label: "All Cuisines" },
              ...Array.from(uniqueCuisines.entries()).map(([value, label]) => ({
                value,
                label
              }))
            ]
            setCuisines(cuisineOptions)
          }
        }
      } catch (error) {
        console.error('Failed to fetch filter data:', error)
        // Fallback to static data
        setCuisines([
          { value: "all", label: "All Cuisines" },
          { value: "italian", label: "Italian" },
          { value: "chinese", label: "Chinese" },
          { value: "indian", label: "Indian" },
          { value: "american", label: "American" },
          { value: "japanese", label: "Japanese" }
        ])
      } finally {
        setLoadingData(false)
      }
    }

    fetchFilterData()
  }, [])

  // Get user's current location for nearby restaurants
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // For now, just show a message. You can implement nearby search later
          alert(`Your location: ${position.coords.latitude}, ${position.coords.longitude}`)
        },
        (error) => {
          console.error('Error getting location:', error)
          alert('Unable to get your location. Please check your browser permissions.')
        }
      )
    } else {
      alert('Geolocation is not supported by this browser.')
    }
  }

  const priceRanges = [
    { value: "budget", label: "Budget ($)", icon: "$" },
    { value: "mid-range", label: "Mid-range ($$)", icon: "$$" },
    { value: "expensive", label: "Expensive ($$$)", icon: "$$$" },
    { value: "fine-dining", label: "Fine Dining ($$$$)", icon: "$$$$" }
  ]

  const restaurantFeatures = [
    { value: "outdoor-seating", label: "Outdoor Seating" },
    { value: "delivery", label: "Delivery Available" },
    { value: "takeout", label: "Takeout" },
    { value: "parking", label: "Parking Available" },
    { value: "wifi", label: "Free WiFi" },
    { value: "wheelchair", label: "Wheelchair Accessible" },
    { value: "vegan", label: "Vegan Options" },
    { value: "live-music", label: "Live Music" }
  ]

  const updateFilters = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handlePriceRangeChange = (priceRange: string) => {
    const newPriceRanges = filters.priceRange.includes(priceRange)
      ? filters.priceRange.filter(p => p !== priceRange)
      : [...filters.priceRange, priceRange]
    updateFilters('priceRange', newPriceRanges)
  }

  const handleFeatureChange = (feature: string) => {
    const newFeatures = filters.features.includes(feature)
      ? filters.features.filter(f => f !== feature)
      : [...filters.features, feature]
    updateFilters('features', newFeatures)
  }

  const clearFilters = () => {
    const clearedFilters = {
      query: "",
      cuisine: "all",
      priceRange: [],
      rating: [0],
      location: "",
      area: "",
      openNow: false,
      features: [],
      veg: false
    }
    setFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.cuisine !== "all") count++
    if (filters.priceRange.length > 0) count++
    if (filters.rating[0] > 0) count++
    if (filters.location) count++
    if (filters.area) count++
    if (filters.openNow) count++
    if (filters.features.length > 0) count++
    if (filters.veg) count++
    return count
  }

  return (
    <Card className="w-full shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
            <Search className="h-5 w-5 mr-2 text-orange-600" />
            Find Your Perfect Restaurant
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-orange-600 hover:bg-orange-50"
          >
            <Filter className="h-4 w-4 mr-1" />
            Filters
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="ml-2 bg-orange-100 text-orange-800">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Main Search Bar */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search restaurants, cuisines, or dishes..."
              value={filters.query}
              onChange={(e) => updateFilters('query', e.target.value)}
              className="pl-10 pr-4 py-3 border-gray-200 focus:border-orange-300 focus:ring-orange-200 rounded-xl"
            />
          </div>
          
          {/* Quick Cuisine Filter */}
          <Select value={filters.cuisine} onValueChange={(value) => updateFilters('cuisine', value)}>
            <SelectTrigger className="w-48 border-gray-200 focus:border-orange-300 rounded-xl">
              <SelectValue placeholder="Cuisine" />
            </SelectTrigger>
            <SelectContent>
              {cuisines.map((cuisine, index) => (
                <SelectItem key={`${cuisine.value}-${index}`} value={cuisine.value}>
                  {cuisine.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Expanded Filters */}
        {isExpanded && (
          <div className="space-y-6 p-6 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">Advanced Filters</h3>
              {getActiveFiltersCount() > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-gray-500 hover:text-red-600"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Location Filters */}
              <div className="space-y-3">
                <label className="font-medium text-gray-700 flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-orange-600" />
                  City/Location
                </label>
                <Select value={filters.location} onValueChange={(value) => updateFilters('location', value)}>
                  <SelectTrigger className="border-gray-200 focus:border-orange-300 rounded-lg">
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Locations</SelectItem>
                    {locations.slice(1).map((location, index) => (
                      <SelectItem key={`location-${location}-${index}`} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <label className="font-medium text-gray-700 flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-orange-600" />
                  Area
                </label>
                <Select value={filters.area} onValueChange={(value) => updateFilters('area', value)}>
                  <SelectTrigger className="border-gray-200 focus:border-orange-300 rounded-lg">
                    <SelectValue placeholder="Select area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Areas</SelectItem>
                    {areas.slice(1).map((area, index) => (
                      <SelectItem key={`area-${area}-${index}`} value={area}>
                        {area}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Rating Filter */}
              <div className="space-y-3">
                <label className="font-medium text-gray-700 flex items-center">
                  <Star className="h-4 w-4 mr-2 text-orange-600" />
                  Minimum Rating: {filters.rating[0].toFixed(1)} stars
                </label>
                <Slider
                  value={filters.rating}
                  onValueChange={(value) => updateFilters('rating', value)}
                  max={5}
                  min={0}
                  step={0.5}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Any rating</span>
                  <span>5.0 stars</span>
                </div>
              </div>

              {/* Nearby Restaurants */}
              <div className="space-y-3">
                <label className="font-medium text-gray-700 flex items-center">
                  <Navigation className="h-4 w-4 mr-2 text-orange-600" />
                  Near Me
                </label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={getCurrentLocation}
                  className="w-full border-gray-200 hover:border-orange-300 rounded-lg"
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Find Nearby Restaurants
                </Button>
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="space-y-3">
              <label className="font-medium text-gray-700 flex items-center">
                <DollarSign className="h-4 w-4 mr-2 text-orange-600" />
                Price Range
              </label>
              <div className="flex flex-wrap gap-3">
                {priceRanges.map((range) => (
                  <div key={range.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={range.value}
                      checked={filters.priceRange.includes(range.value)}
                      onCheckedChange={() => handlePriceRangeChange(range.value)}
                      className="border-gray-300"
                    />
                    <label
                      htmlFor={range.value}
                      className="text-sm font-medium text-gray-700 cursor-pointer flex items-center"
                    >
                      <span className="font-bold text-green-600 mr-2">{range.icon}</span>
                      {range.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Filters */}
            <div className="space-y-3">
              <label className="font-medium text-gray-700">Quick Filters</label>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="pure-veg"
                    checked={filters.veg}
                    onCheckedChange={(checked) => updateFilters('veg', !!checked)}
                    className="border-gray-300"
                  />
                  <label
                    htmlFor="pure-veg"
                    className="text-sm font-medium text-gray-700 cursor-pointer flex items-center"
                  >
                    <Leaf className="h-4 w-4 mr-1 text-green-600" />
                    Pure Vegetarian Only
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="open-now"
                    checked={filters.openNow}
                    onCheckedChange={(checked) => updateFilters('openNow', !!checked)}
                    className="border-gray-300"
                  />
                  <label
                    htmlFor="open-now"
                    className="text-sm font-medium text-gray-700 cursor-pointer flex items-center"
                  >
                    <Clock className="h-4 w-4 mr-1 text-blue-600" />
                    Open Now
                  </label>
                </div>
              </div>
            </div>

            {/* Restaurant Features */}
            <div className="space-y-3">
              <label className="font-medium text-gray-700">Restaurant Features</label>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {restaurantFeatures.map((feature) => (
                  <div key={feature.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={feature.value}
                      checked={filters.features.includes(feature.value)}
                      onCheckedChange={() => handleFeatureChange(feature.value)}
                      className="border-gray-300"
                    />
                    <label
                      htmlFor={feature.value}
                      className="text-sm text-gray-700 cursor-pointer"
                    >
                      {feature.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Open Now Toggle */}
            <div className="flex items-center space-x-3">
              <Checkbox
                id="open-now"
                checked={filters.openNow}
                onCheckedChange={(checked) => updateFilters('openNow', checked)}
                className="border-gray-300"
              />
              <label htmlFor="open-now" className="font-medium text-gray-700 cursor-pointer flex items-center">
                <Clock className="h-4 w-4 mr-2 text-orange-600" />
                Open Now
              </label>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {getActiveFiltersCount() > 0 && (
          <div className="flex flex-wrap gap-2">
            {filters.cuisine !== "all" && (
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                {cuisines.find(c => c.value === filters.cuisine)?.label}
                <button
                  onClick={() => updateFilters('cuisine', 'all')}
                  className="ml-2 hover:text-orange-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.priceRange.map((price) => (
              <Badge key={price} variant="secondary" className="bg-green-100 text-green-800">
                {priceRanges.find(p => p.value === price)?.icon}
                <button
                  onClick={() => handlePriceRangeChange(price)}
                  className="ml-2 hover:text-green-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {filters.rating[0] > 0 && (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                {filters.rating[0]}+ stars
                <button
                  onClick={() => updateFilters('rating', [0])}
                  className="ml-2 hover:text-yellow-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.location && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {filters.location}
                <button
                  onClick={() => updateFilters('location', '')}
                  className="ml-2 hover:text-blue-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
