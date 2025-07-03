import { Review } from "../models/Review.js";
import { Restaurant } from "../models/Restaurant.js";


const updateRestaurantRating = async (restaurantId) => {
  const restaurant = await Restaurant.findById(restaurantId).populate("reviews");

  if (restaurant) {
    const reviews = restaurant.reviews;
    const avgRating = reviews.length
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    restaurant.rating = avgRating;
    restaurant.reviewCount = reviews.length;
    await restaurant.save();
  }
};


export const addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const restaurantId = req.params.restaurantId;

    
    const existing = await Review.findOne({ restaurant: restaurantId, user: req.user.id });
    if (existing) {
      return res.status(400).json({ 
        success: false,
        message: "You already reviewed this restaurant." 
      });
    }

    const review = await Review.create({
      restaurant: restaurantId,
      user: req.user.id,
      rating,
      comment,
    });

    await Restaurant.findByIdAndUpdate(restaurantId, {
      $push: { reviews: review._id },
    });

    await updateRestaurantRating(restaurantId);

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: { review }
    });
  } catch (err) {
    next(err);
  }
};


export const editReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    const review = await Review.findOne({
      _id: req.params.reviewId,
      user: req.user.id,
    });

    if (!review) {
      return res.status(404).json({ 
        success: false,
        message: "Review not found" 
      });
    }

    review.rating = rating ?? review.rating;
    review.comment = comment ?? review.comment;
    await review.save();

    await updateRestaurantRating(review.restaurant);

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: { review }
    });
  } catch (err) {
    next(err);
  }
};


export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findOneAndDelete({
      _id: req.params.reviewId,
      user: req.user.id,
    });

    if (!review) {
      return res.status(404).json({ 
        success: false,
        message: "Review not found" 
      });
    }

    await Restaurant.findByIdAndUpdate(review.restaurant, {
      $pull: { reviews: review._id },
    });

    await updateRestaurantRating(review.restaurant);

    res.status(200).json({ 
      success: true,
      message: "Review deleted successfully" 
    });
  } catch (err) {
    next(err);
  }
};
