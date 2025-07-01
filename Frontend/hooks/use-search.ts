"use client"

import { useState, useCallback } from "react"
import { apiClient } from "@/utils/api"

interface Restaurant {
  id: string
  name: string
  cuisine: string
  address: string
  image: string
  description: string
  rating: number
  reviewCount: number
}

export const useSearch = () => {
  const [results, setResults] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = useCallback(async (query: string, filters: Record<string, string> = {}) => {
    if (!query.trim()) {
      setResults([])
      return
    }

    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.searchRestaurants(query, filters)

      if (response.success) {
        setResults(response.data.restaurants)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed")
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  const clearResults = useCallback(() => {
    setResults([])
    setError(null)
  }, [])

  return { results, loading, error, search, clearResults }
}
