"use client"

import { useState, useEffect } from "react"
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

interface Pagination {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export const useRestaurants = (page = 1, limit = 10) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true)
        const response = await apiClient.getRestaurants(page, limit)

        if (response.success) {
          setRestaurants(response.data.restaurants)
          setPagination(response.data.pagination)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch restaurants")
      } finally {
        setLoading(false)
      }
    }

    fetchRestaurants()
  }, [page, limit])

  return { restaurants, pagination, loading, error }
}
