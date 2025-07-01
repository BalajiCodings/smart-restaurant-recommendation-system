// API utility class for TastyTrack
// Default to deployed backend if no environment variable is set
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://tastytrack-backend-9tu1.onrender.com"

interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  errors?: any[]
}

interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  body?: any
}

class ApiClient {
  private baseURL: string

  constructor() {
    this.baseURL = API_BASE_URL
  }

  async request<T = any>(endpoint: string, options: ApiRequestOptions = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    if (config.body && typeof config.body === "object" && !(config.body instanceof FormData)) {
      config.body = JSON.stringify(config.body)
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Request failed")
      }

      return data
    } catch (error) {
      console.error("API Request failed:", error)
      throw error
    }
  }

  // Authentication methods
  async register(userData: { name: string; email: string; password: string }) {
    return this.request("/api/auth/register", {
      method: "POST",
      body: userData,
    })
  }

  async login(credentials: { email: string; password: string }) {
    return this.request("/api/auth/login", {
      method: "POST",
      body: credentials,
    })
  }

  async refreshToken(token: string) {
    return this.request("/api/auth/refresh", {
      method: "POST",
      body: { token },
    })
  }

  // Restaurant methods
  async getRestaurants(page = 1, limit = 10) {
    return this.request(`/api/restaurants?page=${page}&limit=${limit}`)
  }

  async getRestaurant(id: string) {
    return this.request(`/api/restaurants/${id}`)
  }

  async searchRestaurants(query: string, filters: Record<string, string> = {}) {
    const params = new URLSearchParams({ q: query, ...filters })
    return this.request(`/api/restaurants/search?${params}`)
  }

  async getRecommendations(token: string, limit = 10) {
    return this.request(`/api/restaurants/recommendations?limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }

  async createRestaurant(restaurantData: any, token: string) {
    return this.request("/api/restaurants", {
      method: "POST",
      body: restaurantData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }

  // User methods
  async getUserDashboard(token: string) {
    return this.request("/api/users/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }

  async getUserProfile(token: string) {
    return this.request("/api/users/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }

  async getFavorites(token: string) {
    return this.request("/api/users/favorites", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }

  async addFavorite(restaurantId: string, token: string) {
    return this.request(`/api/users/favorites/${restaurantId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }

  async removeFavorite(restaurantId: string, token: string) {
    return this.request(`/api/users/favorites/${restaurantId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }

  async updatePreferences(preferences: { preferredCuisines: string[] }, token: string) {
    return this.request("/api/users/preferences/cuisines", {
      method: "PUT",
      body: preferences,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }

  // Review methods
  async addReview(restaurantId: string, reviewData: { rating: number; comment: string }, token: string) {
    return this.request(`/api/reviews/${restaurantId}`, {
      method: "POST",
      body: reviewData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }

  async updateReview(reviewId: string, reviewData: { rating: number; comment: string }, token: string) {
    return this.request(`/api/reviews/${reviewId}`, {
      method: "PUT",
      body: reviewData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }

  async deleteReview(reviewId: string, token: string) {
    return this.request(`/api/reviews/${reviewId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }
}

export const apiClient = new ApiClient()
