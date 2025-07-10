import { User } from "../models/User.js";
import { Review } from "../models/Review.js";
import { Restaurant } from "../models/Restaurant.js";

export const getRecommendations = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate("favorites");
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    const favoriteCuisines = user.favorites.map((r) => r.cuisine);
    const preferredCuisines = user.preferredCuisines || [];

    const userReviews = await Review.find({ user: req.user.id, rating: { $gte: 4 } })
      .populate("restaurant");

    const reviewedCuisines = userReviews.map((r) => r.restaurant?.cuisine).filter(Boolean);

    const cuisineCount = {};
    [...favoriteCuisines, ...preferredCuisines, ...reviewedCuisines].forEach((cuisine) => {
      if (cuisine) cuisineCount[cuisine] = (cuisineCount[cuisine] || 0) + 1;
    });

    const sortedCuisines = Object.entries(cuisineCount)
      .sort((a, b) => b[1] - a[1])
      .map(([cuisine]) => cuisine);

    const excludeIds = new Set([
      ...user.favorites.map((r) => r._id.toString()),
      ...userReviews.map((r) => r.restaurant?._id.toString()),
    ]);

    let recommendations = [];
    const limit = parseInt(req.query.limit) || 10;

    if (sortedCuisines.length > 0) {
      recommendations = await Restaurant.find({
        cuisine: { $in: sortedCuisines },
        _id: { $nin: [...excludeIds] },
      })
      .sort({ rating: -1 })
      .limit(limit)
      .lean();
    } else {
      
      recommendations = await Restaurant.find()
        .sort({ rating: -1 })
        .limit(limit)
        .lean();
    }

    res.status(200).json({ 
      success: true,
      message: "Recommendations fetched successfully",
      data: {
        recommendations,
        basedOn: sortedCuisines.length > 0 ? "user_preferences" : "top_rated",
        preferredCuisines: sortedCuisines.slice(0, 3)
      }
    });
  } catch (err) {
    next(err);
  }
};
