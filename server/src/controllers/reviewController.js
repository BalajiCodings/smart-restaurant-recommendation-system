import { Review } from "../models/Review.js";
import { Restaurant } from "../models/Restaurant.js";

export const createReview = async (req, res, next) => {
  try {
    const { restaurantId, rating, comment } = req.body;
    const existing = await Review.findOne({
      restaurant: restaurantId,
      user: req.user.id,
    });
    if (existing) {
      return res.status(400).json({ message: "You already reviewed this restaurant." });
    }
    const review = await Review.create({
      restaurant: restaurantId,
      user: req.user.id,
      rating,
      comment,
    });
    await Restaurant.findByIdAndUpdate(restaurantId, { $push: { reviews: review._id } });

    
    const restaurant = await Restaurant.findById(restaurantId).populate("reviews");
    const reviews = restaurant.reviews;
    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    restaurant.rating = avgRating;
    restaurant.reviewCount = reviews.length;
    await restaurant.save();

    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
};

export const editReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.findOne({ _id: req.params.reviewId, user: req.user.id });
    if (!review) return res.status(404).json({ message: "Review not found" });

    review.rating = rating ?? review.rating;
    review.comment = comment ?? review.comment;
    await review.save();

    // Optionally, update restaurant rating here (reuse your logic)
    const restaurant = await Restaurant.findById(review.restaurant).populate("reviews");
    const reviews = restaurant.reviews;
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    restaurant.rating = avgRating;
    restaurant.reviewCount = reviews.length;
    await restaurant.save();

    res.json(review);
  } catch (err) {
    next(err);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findOneAndDelete({ _id: req.params.reviewId, user: req.user.id });
    if (!review) return res.status(404).json({ message: "Review not found" });

    // Remove review from restaurant
    await Restaurant.findByIdAndUpdate(review.restaurant, { $pull: { reviews: review._id } });

    // Optionally, update restaurant rating here (reuse your logic)
    const restaurant = await Restaurant.findById(review.restaurant).populate("reviews");
    if (restaurant) {
      const reviews = restaurant.reviews;
      const avgRating = reviews.length
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;
      restaurant.rating = avgRating;
      restaurant.reviewCount = reviews.length;
      await restaurant.save();
    }

    res.json({ message: "Review deleted" });
  } catch (err) {
    next(err);
  }
};