"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { ReviewForm } from "@/components/review-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Star, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Review {
  _id: string
  user: {
    name: string
  }
  rating: number
  comment: string
  createdAt: string
}

interface ReviewCardProps {
  review: Review
  isOwner?: boolean
  onReviewUpdated?: () => void
}

export function ReviewCard({ review, isOwner = false, onReviewUpdated }: ReviewCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const { token } = useAuth()
  const { toast } = useToast()

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://tastytrack-backend-9tu1.onrender.com"

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this review?")) return

    setLoading(true)
    try {
      const response = await fetch(`${API_BASE}/api/reviews/${review._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          toast({
            title: result.message,
            description: "Your review has been deleted successfully",
          })
          onReviewUpdated?.()
        }
      } else {
        throw new Error("Failed to delete review")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete review",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (isEditing) {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h4 className="font-semibold">Edit Review</h4>
            <Button variant="ghost" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ReviewForm
            restaurantId=""
            existingReview={{
              _id: review._id,
              rating: review.rating,
              comment: review.comment,
            }}
            onReviewSubmitted={() => {
              setIsEditing(false)
              onReviewUpdated?.()
            }}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold">{review.user.name}</span>
              <div className="flex items-center gap-1">{renderStars(review.rating)}</div>
            </div>
            <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
          </div>
          {isOwner && (
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleDelete} disabled={loading}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-gray-700">{review.comment}</p>
      </CardContent>
    </Card>
  )
}
