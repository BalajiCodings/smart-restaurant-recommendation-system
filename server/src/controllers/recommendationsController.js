import { User } from "../models/User.js";
import { Review } from "../models/Review.js";
import { Restaurant } from "../models/Restaurant.js";

export const getRecommendations = async (req, res, next) => {
  try {
    // 1. Get user's favorite restaurants and reviews
    const user = await User.findById(req.user.id).populate("favorites");
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2. Collect cuisines from favorites and preferredCuisines
    const favoriteCuisines = user.favorites.map(r => r.cuisine);
    const preferredCuisines = user.preferredCuisines || [];

    // 3. Collect cuisines from highly-rated reviews (rating >= 4)
    const userReviews = await Review.find({ user: req.user.id, rating: { $gte: 4 } }).populate("restaurant");
    const reviewedCuisines = userReviews.map(r => r.restaurant.cuisine);

    // 4. Combine and count cuisines
    const cuisineCounts = {};
    [...favoriteCuisines, ...reviewedCuisines, ...preferredCuisines].forEach(cuisine => {
      if (cuisine) cuisineCounts[cuisine] = (cuisineCounts[cuisine] || 0) + 1;
    });

    // 5. Get top cuisines
    const sortedCuisines = Object.entries(cuisineCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([cuisine]) => cuisine);

    // 6. Recommend restaurants matching top cuisines, excluding already favored/reviewed
    const excludeIds = [
      ...user.favorites.map(r => r._id.toString()),
      ...userReviews.map(r => r.restaurant._id.toString())
    ];

    let recommendations = [];
    if (sortedCuisines.length > 0) {
      recommendations = await Restaurant.find({
        cuisine: { $in: sortedCuisines },
        _id: { $nin: excludeIds }
      }).limit(10);
    } else {
      // Fallback: recommend top-rated restaurants
      recommendations = await Restaurant.find().sort({ rating: -1 }).limit(10);
    }

    res.json({ recommendations });
  } catch (err) {
    next(err);
  }
};