import { User } from "../models/User.js";
import { Review } from "../models/Review.js";
import bcrypt from "bcryptjs";

// ✅ GET /api/users/dashboard
export const getUserDashboard = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate("favorites");
    if (!user) return res.status(404).json({ message: "User not found" });

    const userReviews = await Review.find({ user: req.user.id }).populate("restaurant");

    res.status(200).json({
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        preferredCuisines: user.preferredCuisines,
        favorites: user.favorites,
      },
      reviews: userReviews,
    });
  } catch (err) {
    next(err);
  }
};

// ✅ POST /api/users/favorites/:restaurantId
export const addFavorite = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.favorites.includes(req.params.restaurantId)) {
      user.favorites.push(req.params.restaurantId);
      await user.save();
    }

    res.status(200).json({
      message: "Added to favorites",
      favorites: user.favorites,
    });
  } catch (err) {
    next(err);
  }
};

// ✅ DELETE /api/users/favorites/:restaurantId
export const removeFavorite = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    user.favorites = user.favorites.filter(
      (id) => id.toString() !== req.params.restaurantId
    );
    await user.save();

    res.status(200).json({
      message: "Removed from favorites",
      favorites: user.favorites,
    });
  } catch (err) {
    next(err);
  }
};

// ✅ GET /api/users/favorites
export const getFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate("favorites");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      message: "Fetched favorites successfully",
      favorites: user.favorites,
    });
  } catch (err) {
    next(err);
  }
};

// ✅ GET /api/users/profile
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate("favorites");

    res.status(200).json({
      name: user.name,
      email: user.email,
      role: user.role,
      preferredCuisines: user.preferredCuisines,
      favorites: user.favorites,
    });
  } catch (err) {
    next(err);
  }
};

// ✅ PUT /api/users/preferences/cuisines
export const updatePreferredCuisines = async (req, res, next) => {
  try {
    const { preferredCuisines } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { preferredCuisines },
      { new: true }
    );

    res.status(200).json({
      message: "Preferred cuisines updated",
      preferredCuisines: user.preferredCuisines,
    });
  } catch (err) {
    next(err);
  }
};

// ✅ GET /api/users/reviews
export const getMyReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ user: req.user.id }).populate("restaurant");

    res.status(200).json(reviews);
  } catch (err) {
    next(err);
  }
};

// ✅ GET /api/users/admin/all
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password").lean();

    res.status(200).json({
      message: "All users fetched successfully",
      count: users.length,
      users,
    });
  } catch (err) {
    next(err);
  }
};

// ✅ PUT /api/users/change-password
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both fields are required" });
    }

    const user = await User.findById(req.user.id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    next(err);
  }
};
