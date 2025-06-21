import { User } from "../models/User.js";
import { Review } from "../models/Review.js";
import { Restaurant } from "../models/Restaurant.js";

export const getUserDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("favorites");
    if (!user) return res.status(404).json({ message: "User not found" });

    const userReviews = await Review.find({ user: req.user.id }).populate("restaurant");
    res.json({ user, userReviews });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


export const addFavorite = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.favorites.includes(req.params.restaurantId)) {
      user.favorites.push(req.params.restaurantId);
      await user.save();
    }
    res.json(user.favorites);
  } catch (err) {
    next(err);
  }
};


export const removeFavorite = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    user.favorites = user.favorites.filter(
      (id) => id.toString() !== req.params.restaurantId
    );
    await user.save();
    res.json(user.favorites);
  } catch (err) {
    next(err);
  }
};

export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("favorites");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate("favorites");
    res.json({
      name: user.name,
      email: user.email,
      favorites: user.favorites,
    });
  } catch (err) {
    next(err);
  }
};

export const updatePreferredCuisines = async (req, res, next) => {
  try {
    const { preferredCuisines } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { preferredCuisines },
      { new: true }
    );
    res.json({ preferredCuisines: user.preferredCuisines });
  } catch (err) {
    next(err);
  }
};

export const getMyReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ user: req.user.id }).populate("restaurant");
    res.json(reviews);
  } catch (err) {
    next(err);
  }
};