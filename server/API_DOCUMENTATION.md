# TastyTrack API Documentation

## Base URL
- **Development**: `http://localhost:5000`
- **Production**: `https://your-api-domain.vercel.app`

## Response Format
All API responses follow this standardized format:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data here
  }
}
```

For errors:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Optional validation errors
}
```

## Authentication
Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Authentication Endpoints

#### POST /api/auth/register
Register a new user.

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "jwt_token_here"
  }
}
```

#### POST /api/auth/login
Login user.

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** Same as register

#### POST /api/auth/refresh
Refresh JWT token.

**Body:**
```json
{
  "token": "current_jwt_token"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "token": "new_jwt_token_here"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

### Restaurant Endpoints

#### GET /api/restaurants
Get paginated list of restaurants.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "message": "Restaurants fetched successfully",
  "data": {
    "restaurants": [],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 10,
      "totalPages": 10,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

#### GET /api/restaurants/:id
Get restaurant by ID.

**Path Parameters:**
- `id` (required): Restaurant ID

**Response:**
```json
{
  "success": true,
  "message": "Restaurant fetched successfully",
  "data": {
    "restaurant": {
      "id": "restaurant_id",
      "name": "Pizza Palace",
      "cuisine": "Italian",
      "address": "123 Main St, City",
      "image": "https://example.com/image.jpg",
      "description": "Authentic Italian pizza",
      "rating": 4.5,
      "reviewCount": 150,
      "reviews": [
        {
          "id": "review_id",
          "user": "user_id",
          "rating": 5,
          "comment": "Amazing pizza!",
          "createdAt": "2025-07-01T12:00:00Z"
        }
      ]
    }
  }
}
```

#### GET /api/restaurants/search
Search restaurants.

**Query Parameters:**
- `q` (required): Search query
- `cuisine` (optional): Filter by cuisine
- `location` (optional): Filter by location

**Example Request:**
```
GET /api/restaurants/search?q=pizza&cuisine=Italian&location=downtown
```

**Response:**
```json
{
  "success": true,
  "message": "Search completed successfully",
  "data": {
    "query": "pizza",
    "count": 5,
    "restaurants": [
      {
        "id": "restaurant_id",
        "name": "Pizza Palace",
        "cuisine": "Italian",
        "address": "123 Main St, City",
        "image": "https://example.com/image.jpg",
        "description": "Authentic Italian pizza",
        "rating": 4.5,
        "reviewCount": 150
      }
    ]
  }
}
```

#### GET /api/restaurants/recommendations
Get personalized recommendations (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `limit` (optional): Number of recommendations (default: 10)

**Response:**
```json
{
  "success": true,
  "message": "Recommendations fetched successfully",
  "data": {
    "recommendations": [
      {
        "id": "restaurant_id",
        "name": "Sushi Master",
        "cuisine": "Japanese",
        "address": "456 Oak St, City",
        "image": "https://example.com/sushi.jpg",
        "description": "Fresh sushi daily",
        "rating": 4.8,
        "reviewCount": 89
      }
    ],
    "basedOn": "user_preferences",
    "preferredCuisines": ["Japanese", "Italian", "Mexican"]
  }
}
```

#### POST /api/restaurants
Create restaurant (admin only, requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Body:**
```json
{
  "name": "New Restaurant",
  "cuisine": "Mexican",
  "address": "789 Elm St, City",
  "image": "https://example.com/restaurant.jpg",
  "description": "Authentic Mexican cuisine"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Restaurant created successfully",
  "data": {
    "restaurant": {
      "id": "new_restaurant_id",
      "name": "New Restaurant",
      "cuisine": "Mexican",
      "address": "789 Elm St, City",
      "image": "https://example.com/restaurant.jpg",
      "description": "Authentic Mexican cuisine",
      "rating": 0,
      "reviewCount": 0,
      "reviews": [],
      "createdAt": "2025-07-01T12:00:00Z"
    }
  }
}
```

### Review Endpoints

#### POST /api/reviews/:restaurantId
Add review to restaurant (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Path Parameters:**
- `restaurantId` (required): Restaurant ID

**Body:**
```json
{
  "rating": 5,
  "comment": "Great food and excellent service!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Review added successfully",
  "data": {
    "review": {
      "id": "review_id",
      "restaurant": "restaurant_id",
      "user": "user_id",
      "rating": 5,
      "comment": "Great food and excellent service!",
      "createdAt": "2025-07-01T12:00:00Z"
    }
  }
}
```

#### PUT /api/reviews/:reviewId
Update review (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Path Parameters:**
- `reviewId` (required): Review ID

**Body:**
```json
{
  "rating": 4,
  "comment": "Updated: Good food, service could be better"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Review updated successfully",
  "data": {
    "review": {
      "id": "review_id",
      "restaurant": "restaurant_id",
      "user": "user_id",
      "rating": 4,
      "comment": "Updated: Good food, service could be better",
      "updatedAt": "2025-07-01T12:30:00Z"
    }
  }
}
```

#### DELETE /api/reviews/:reviewId
Delete review (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Path Parameters:**
- `reviewId` (required): Review ID

**Response:**
```json
{
  "success": true,
  "message": "Review deleted successfully"
}
```

### User Endpoints

#### GET /api/users/dashboard
Get user dashboard data (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Dashboard data fetched successfully",
  "data": {
    "user": {
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "preferredCuisines": ["Italian", "Japanese"],
      "favorites": [
        {
          "id": "restaurant_id",
          "name": "Pizza Palace",
          "cuisine": "Italian",
          "rating": 4.5
        }
      ]
    },
    "reviews": [
      {
        "id": "review_id",
        "restaurant": {
          "id": "restaurant_id",
          "name": "Pizza Palace",
          "cuisine": "Italian"
        },
        "rating": 5,
        "comment": "Amazing pizza!",
        "createdAt": "2025-07-01T12:00:00Z"
      }
    ]
  }
}
```

#### GET /api/users/profile
Get user profile (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Profile fetched successfully",
  "data": {
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "preferredCuisines": ["Italian", "Japanese"],
    "favorites": [
      {
        "id": "restaurant_id",
        "name": "Pizza Palace",
        "cuisine": "Italian"
      }
    ]
  }
}
```

#### GET /api/users/favorites
Get user favorites (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Fetched favorites successfully",
  "data": {
    "favorites": [
      {
        "id": "restaurant_id",
        "name": "Pizza Palace",
        "cuisine": "Italian",
        "address": "123 Main St, City",
        "image": "https://example.com/image.jpg",
        "rating": 4.5,
        "reviewCount": 150
      }
    ]
  }
}
```

#### POST /api/users/favorites/:restaurantId
Add restaurant to favorites (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Path Parameters:**
- `restaurantId` (required): Restaurant ID

**Response:**
```json
{
  "success": true,
  "message": "Added to favorites",
  "data": {
    "favorites": ["restaurant_id_1", "restaurant_id_2"]
  }
}
```

#### DELETE /api/users/favorites/:restaurantId
Remove restaurant from favorites (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Path Parameters:**
- `restaurantId` (required): Restaurant ID

**Response:**
```json
{
  "success": true,
  "message": "Removed from favorites",
  "data": {
    "favorites": ["restaurant_id_1"]
  }
}
```

#### PUT /api/users/preferences/cuisines
Update user preferred cuisines (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Body:**
```json
{
  "preferredCuisines": ["Italian", "Japanese", "Mexican"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Preferences updated successfully",
  "data": {
    "preferredCuisines": ["Italian", "Japanese", "Mexican"]
  }
}
```

## Error Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Server Error

## Error Response Examples

### Validation Error (422)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "type": "field",
      "value": "",
      "msg": "Name is required",
      "path": "name",
      "location": "body"
    },
    {
      "type": "field",
      "value": "invalid-email",
      "msg": "Valid email is required",
      "path": "email",
      "location": "body"
    }
  ]
}
```

### Authentication Error (401)
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

### Not Found Error (404)
```json
{
  "success": false,
  "message": "Restaurant not found"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Internal server error"
}
```

## Additional Endpoints

### Health Check
#### GET /health
Check API health status.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-07-01T12:00:00.000Z"
}
```

### API Info
#### GET /
Get API information and available endpoints.

**Response:**
```json
{
  "message": "🍽️ TastyTrack API Running",
  "version": "1.0.0",
  "endpoints": {
    "auth": "/api/auth",
    "users": "/api/users",
    "restaurants": "/api/restaurants",
    "reviews": "/api/reviews"
  }
}
```

## CORS Configuration

The API accepts requests from:
- `http://localhost:3000` (development)
- `http://localhost:3001` (development)
- `https://*.vercel.app` (all Vercel deployments)
- Custom frontend URL via `FRONTEND_URL` environment variable

## Rate Limiting

- **Limit**: 100 requests per 15 minutes per IP
- **Applies to**: All `/api/*` endpoints

## Environment Variables

Required environment variables for deployment:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
NODE_ENV=production
FRONTEND_URL=https://your-nextjs-app.vercel.app
PORT=5000
```

## Next.js Integration Example

```javascript
// utils/api.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (options.token) {
      config.headers.Authorization = `Bearer ${options.token}`;
    }

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async register(userData) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: userData,
    });
  }

  async login(credentials) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: credentials,
    });
  }

  async refreshToken(token) {
    return this.request('/api/auth/refresh', {
      method: 'POST',
      body: { token },
    });
  }

  // Restaurant methods
  async getRestaurants(page = 1, limit = 10) {
    return this.request(`/api/restaurants?page=${page}&limit=${limit}`);
  }

  async getRestaurant(id) {
    return this.request(`/api/restaurants/${id}`);
  }

  async searchRestaurants(query, filters = {}) {
    const params = new URLSearchParams({ q: query, ...filters });
    return this.request(`/api/restaurants/search?${params}`);
  }

  async getRecommendations(token, limit = 10) {
    return this.request(`/api/restaurants/recommendations?limit=${limit}`, {
      token,
    });
  }

  async createRestaurant(restaurantData, token) {
    return this.request('/api/restaurants', {
      method: 'POST',
      body: restaurantData,
      token,
    });
  }

  // User methods
  async getUserDashboard(token) {
    return this.request('/api/users/dashboard', { token });
  }

  async getUserProfile(token) {
    return this.request('/api/users/profile', { token });
  }

  async getFavorites(token) {
    return this.request('/api/users/favorites', { token });
  }

  async addFavorite(restaurantId, token) {
    return this.request(`/api/users/favorites/${restaurantId}`, {
      method: 'POST',
      token,
    });
  }

  async removeFavorite(restaurantId, token) {
    return this.request(`/api/users/favorites/${restaurantId}`, {
      method: 'DELETE',
      token,
    });
  }

  async updatePreferences(preferences, token) {
    return this.request('/api/users/preferences/cuisines', {
      method: 'PUT',
      body: preferences,
      token,
    });
  }

  // Review methods
  async addReview(restaurantId, reviewData, token) {
    return this.request(`/api/reviews/${restaurantId}`, {
      method: 'POST',
      body: reviewData,
      token,
    });
  }

  async updateReview(reviewId, reviewData, token) {
    return this.request(`/api/reviews/${reviewId}`, {
      method: 'PUT',
      body: reviewData,
      token,
    });
  }

  async deleteReview(reviewId, token) {
    return this.request(`/api/reviews/${reviewId}`, {
      method: 'DELETE',
      token,
    });
  }
}

export const apiClient = new ApiClient();

// React Hook Examples
import { useState, useEffect } from 'react';

// Custom hook for restaurants
export const useRestaurants = (page = 1, limit = 10) => {
  const [restaurants, setRestaurants] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getRestaurants(page, limit);
        setRestaurants(response.data.restaurants);
        setPagination(response.data.pagination);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [page, limit]);

  return { restaurants, pagination, loading, error };
};

// Custom hook for authentication
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await apiClient.login(credentials);
      setUser(response.data.user);
      setToken(response.data.token);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return { user, token, loading, login, logout };
};
```

## Usage Examples

### Authentication Flow
```javascript
// pages/login.js
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
      router.push('/dashboard');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### Restaurant Listing
```javascript
// pages/restaurants.js
import { useRestaurants } from '../hooks/useRestaurants';

export default function Restaurants() {
  const { restaurants, pagination, loading, error } = useRestaurants();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Restaurants</h1>
      {restaurants.map((restaurant) => (
        <div key={restaurant.id}>
          <h3>{restaurant.name}</h3>
          <p>{restaurant.cuisine}</p>
          <p>Rating: {restaurant.rating}/5</p>
        </div>
      ))}
      
      {pagination && (
        <div>
          Page {pagination.page} of {pagination.totalPages}
        </div>
      )}
    </div>
  );
}
```
