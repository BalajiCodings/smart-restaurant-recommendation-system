"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Star } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ReviewFormProps {
  restaurantId: string
  onReviewSubmitted: () => void
  existingReview?: {
    _id: string
    rating: number
    comment: string
  }
}

export function ReviewForm({ restaurantId, onReviewSubmitted, existingReview }: ReviewFormProps) {
  const [rating, setRating] = useState(existingReview?.rating || 0)
  const [comment, setComment] = useState(existingReview?.comment || "")
  const [hoveredRating, setHoveredRating] = useState(0)
  const [loading, setLoading] = useState(false)
  const { token } = useAuth()
  const { toast } = useToast()

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://tastytrack-backend-9tu1.onrender.com"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const url = existingReview
        ? `${API_BASE}/api/reviews/${existingReview._id}`
        : `${API_BASE}/api/reviews/${restaurantId}`

      const method = existingReview ? "PUT" : "POST"

      const body = { rating, comment }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          toast({
            title: result.message,
            description: `Your review has been ${existingReview ? "updated" : "submitted"} successfully`,
          })
          onReviewSubmitted()
          if (!existingReview) {
            setRating(0)
            setComment("")
          }
        }
      } else {
        const error = await response.json()
        throw new Error(error.message)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit review",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label className="text-base font-medium">Rating</Label>
        <div className="flex items-center gap-1 mt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setRating(i + 1)}
              onMouseEnter={() => setHoveredRating(i + 1)}
              onMouseLeave={() => setHoveredRating(0)}
              className="p-1"
            >
              <Star
                className={`h-6 w-6 ${
                  i < (hoveredRating || rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                }`}
              />
            </button>
          ))}
          <span className="ml-2 text-sm text-gray-600">{rating > 0 && `${rating} star${rating !== 1 ? "s" : ""}`}</span>
        </div>
      </div>

      <div>
        <Label htmlFor="comment" className="text-base font-medium">
          Review
        </Label>
        <Textarea
          id="comment"
          placeholder="Share your experience at this restaurant..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="mt-2 min-h-[100px]"
          required
        />
      </div>

      <Button type="submit" disabled={loading || rating === 0}>
        {loading
          ? existingReview
            ? "Updating..."
            : "Submitting..."
          : existingReview
            ? "Update Review"
            : "Submit Review"}
      </Button>
    </form>
  )
}
