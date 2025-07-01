"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

const AVAILABLE_CUISINES = [
  "Italian",
  "Chinese",
  "Mexican",
  "Indian",
  "American",
  "Japanese",
  "Thai",
  "French",
  "Mediterranean",
  "Korean",
  "Vietnamese",
  "Greek",
  "Spanish",
  "Turkish",
  "Lebanese",
]

export default function PreferencesPage() {
  const [preferredCuisines, setPreferredCuisines] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { user, token } = useAuth()
  const { toast } = useToast()

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://tastytrack-backend-9tu1.onrender.com"

  useEffect(() => {
    if (user && token) {
      fetchPreferences()
    }
  }, [user, token])

  const fetchPreferences = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setPreferredCuisines(result.data.preferredCuisines || [])
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch preferences",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCuisineToggle = (cuisine: string) => {
    setPreferredCuisines((prev) => (prev.includes(cuisine) ? prev.filter((c) => c !== cuisine) : [...prev, cuisine]))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch(`${API_BASE}/api/users/preferences/cuisines`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ preferredCuisines }),
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          toast({
            title: result.message,
            description: "Your cuisine preferences have been updated successfully",
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Please log in to manage preferences</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Preferences</h1>
          <p className="text-gray-600">Customize your experience to get better recommendations</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Preferred Cuisines</CardTitle>
            <CardDescription>
              Select your favorite types of cuisine to get personalized restaurant recommendations. You can select
              multiple options.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="grid md:grid-cols-3 gap-4">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-2 animate-pulse">
                    <div className="bg-gray-300 h-4 w-4 rounded"></div>
                    <div className="bg-gray-300 h-4 w-20 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  {AVAILABLE_CUISINES.map((cuisine) => (
                    <div key={cuisine} className="flex items-center space-x-2">
                      <Checkbox
                        id={cuisine}
                        checked={preferredCuisines.includes(cuisine)}
                        onCheckedChange={() => handleCuisineToggle(cuisine)}
                      />
                      <Label
                        htmlFor={cuisine}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {cuisine}
                      </Label>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    {preferredCuisines.length} cuisine{preferredCuisines.length !== 1 ? "s" : ""} selected
                  </p>
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? "Saving..." : "Save Preferences"}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {preferredCuisines.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Your Selected Cuisines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {preferredCuisines.map((cuisine) => (
                  <span key={cuisine} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                    {cuisine}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
