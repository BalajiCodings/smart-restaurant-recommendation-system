"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function SwiggyApiTest() {
  const [testResults, setTestResults] = useState<any>({})
  const [loading, setLoading] = useState(false)

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

  const runTests = async () => {
    setLoading(true)
    const results: any = {}

    try {
      // Test 1: Get all restaurants
      console.log('Testing: Get all restaurants')
      const restaurantsRes = await fetch(`${API_BASE}/api/restaurants?limit=5`)
      results.restaurants = {
        status: restaurantsRes.status,
        data: restaurantsRes.ok ? await restaurantsRes.json() : 'Failed'
      }

      // Test 2: Search restaurants
      console.log('Testing: Search restaurants')
      const searchRes = await fetch(`${API_BASE}/api/restaurants/search?q=pizza&limit=3`)
      results.search = {
        status: searchRes.status,
        data: searchRes.ok ? await searchRes.json() : 'Failed'
      }

      // Test 3: Get locations
      console.log('Testing: Get locations')
      const locationsRes = await fetch(`${API_BASE}/api/restaurants/locations`)
      results.locations = {
        status: locationsRes.status,
        data: locationsRes.ok ? await locationsRes.json() : 'Failed'
      }

      // Test 4: Get cuisines
      console.log('Testing: Get cuisines')
      const cuisinesRes = await fetch(`${API_BASE}/api/restaurants/cuisines`)
      results.cuisines = {
        status: cuisinesRes.status,
        data: cuisinesRes.ok ? await cuisinesRes.json() : 'Failed'
      }

      // Test 5: Location-based search
      console.log('Testing: Location-based search')
      const locationSearchRes = await fetch(`${API_BASE}/api/restaurants/search?location=Abohar&limit=3`)
      results.locationSearch = {
        status: locationSearchRes.status,
        data: locationSearchRes.ok ? await locationSearchRes.json() : 'Failed'
      }

      // Test 6: Vegetarian filter
      console.log('Testing: Vegetarian filter')
      const vegRes = await fetch(`${API_BASE}/api/restaurants/search?veg=true&limit=3`)
      results.veg = {
        status: vegRes.status,
        data: vegRes.ok ? await vegRes.json() : 'Failed'
      }

    } catch (error) {
      console.error('API Test Error:', error)
      results.error = error instanceof Error ? error.message : 'Unknown error'
    }

    setTestResults(results)
    setLoading(false)
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Swiggy Data API Testing Console</CardTitle>
          <Button onClick={runTests} disabled={loading} className="w-fit">
            {loading ? 'Running Tests...' : 'Run API Tests'}
          </Button>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        {Object.entries(testResults).map(([test, result]: [string, any]) => (
          <Card key={test}>
            <CardHeader>
              <CardTitle className="text-lg">{test.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</CardTitle>
              <div className={`text-sm font-medium ${result.status === 200 ? 'text-green-600' : 'text-red-600'}`}>
                Status: {result.status}
              </div>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-gray-100 p-4 rounded overflow-x-auto max-h-96">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
