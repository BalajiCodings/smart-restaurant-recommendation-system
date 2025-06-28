// src/controllers/recommendationsController.js
import { User } from "../models/User.js";
import { Review } from "../models/Review.js";
import { Restaurant } from "../models/Restaurant.js";

// ✅ GET /api/restaurants/recommendations
export const getRecommendations = async (req, res, next) => {
  try {
    // 1. Get logged-in user with favorites
    const user = await User.findById(req.user.id).populate("favorites");
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2. Gather cuisines: from favorites, reviews, and user preferences
    const favoriteCuisines = user.favorites.map((r) => r.cuisine);
    const preferredCuisines = user.preferredCuisines || [];

    const userReviews = await Review.find({ user: req.user.id, rating: { $gte: 4 } })
      .populate("restaurant");

    const reviewedCuisines = userReviews.map((r) => r.restaurant?.cuisine).filter(Boolean);

    // 3. Combine all cuisines and count frequency
    const cuisineCount = {};
    [...favoriteCuisines, ...preferredCuisines, ...reviewedCuisines].forEach((cuisine) => {
      if (cuisine) cuisineCount[cuisine] = (cuisineCount[cuisine] || 0) + 1;
    });

    const sortedCuisines = Object.entries(cuisineCount)
      .sort((a, b) => b[1] - a[1])
      .map(([cuisine]) => cuisine);

    // 4. Exclude already interacted restaurants (favorites + reviewed)
    const excludeIds = new Set([
      ...user.favorites.map((r) => r._id.toString()),
      ...userReviews.map((r) => r.restaurant?._id.toString()),
    ]);

    // 5. Recommend based on top cuisines
    let recommendations = [];

    if (sortedCuisines.length > 0) {
      recommendations = await Restaurant.find({
        cuisine: { $in: sortedCuisines },
        _id: { $nin: [...excludeIds] },
      }).limit(10);
    } else {
      // Fallback: top-rated restaurants
      recommendations = await Restaurant.find().sort({ rating: -1 }).limit(10);
    }

    res.status(200).json({ recommendations });
  } catch (err) {
    next(err);
  }
};
