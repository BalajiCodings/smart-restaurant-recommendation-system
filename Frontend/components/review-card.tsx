"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { ReviewForm } from "@/components/review-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star, Edit, Trash2, ThumbsUp, MessageCircle, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Review {
  _id: string
  user: {
    _id?: string
    name: string
    email?: string
  }
  rating: number
  comment: string
  createdAt: string
  helpful?: number
}

interface ReviewCardProps {
  review: Review
  isOwner?: boolean
  onReviewUpdated?: () => void
}

export function ReviewCard({ review, isOwner = false, onReviewUpdated }: ReviewCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [helpful, setHelpful] = useState(review.helpful || 0)
  const [hasVoted, setHasVoted] = useState(false)
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
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`
    
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getRatingLabel = (rating: number) => {
    if (rating >= 4.5) return { label: "Excellent", color: "bg-green-100 text-green-800" }
    if (rating >= 4) return { label: "Very Good", color: "bg-blue-100 text-blue-800" }
    if (rating >= 3) return { label: "Good", color: "bg-yellow-100 text-yellow-800" }
    if (rating >= 2) return { label: "Fair", color: "bg-orange-100 text-orange-800" }
    return { label: "Poor", color: "bg-red-100 text-red-800" }
  }

  const handleHelpful = () => {
    if (!hasVoted) {
      setHelpful(helpful + 1)
      setHasVoted(true)
      toast({
        title: "Thanks for your feedback!",
        description: "Your vote helps other users find helpful reviews.",
      })
    }
  }

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (isEditing) {
    return (
      <Card className="border-2 border-orange-200 bg-orange-50/50">
        <CardHeader className="bg-orange-100/50">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-orange-800 flex items-center">
              <Edit className="h-4 w-4 mr-2" />
              Edit Review
            </h4>
            <Button 
              variant="ghost" 
              onClick={() => setIsEditing(false)}
              className="text-orange-600 hover:bg-orange-100"
            >
              Cancel
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
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

  const ratingInfo = getRatingLabel(review.rating)

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-4">
            {/* User Avatar */}
            <Avatar className="h-12 w-12 ring-2 ring-gray-200">
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold">
                {getUserInitials(review.user?.name || "Anonymous User")}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              {/* User Info and Rating */}
              <div className="flex items-center gap-3 mb-2">
                <span className="font-semibold text-gray-900 text-lg">
                  {review.user?.name || "Anonymous User"}
                </span>
                <Badge variant="secondary" className={`text-xs px-2 py-1 ${ratingInfo.color}`}>
                  {ratingInfo.label}
                </Badge>
              </div>
              
              {/* Stars and Date */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {renderStars(review.rating)}
                  <span className="font-semibold text-gray-700 ml-1">
                    {review.rating.toFixed(1)}
                  </span>
                </div>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500 flex items-center">
                  <MessageCircle className="h-3 w-3 mr-1" />
                  {formatDate(review.createdAt)}
                </span>
              </div>
            </div>
          </div>
          
          {/* Owner Actions */}
          {isOwner && (
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsEditing(true)}
                className="text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleDelete} 
                disabled={loading}
                className="text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-4">
        {/* Review Text */}
        <div className="bg-gray-50 rounded-xl p-4 border-l-4 border-orange-300">
          <p className="text-gray-700 leading-relaxed text-base">
            "{review.comment}"
          </p>
        </div>
        
        {/* Helpful Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleHelpful}
              disabled={hasVoted}
              className={`text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors ${
                hasVoted ? 'text-green-600 bg-green-50' : ''
              }`}
            >
              <ThumbsUp className={`h-4 w-4 mr-2 ${hasVoted ? 'fill-current' : ''}`} />
              Helpful ({helpful})
            </Button>
          </div>
          
          {isOwner && (
            <Badge variant="outline" className="text-xs text-orange-600 border-orange-200">
              Your Review
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
