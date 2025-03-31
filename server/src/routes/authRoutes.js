import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const router = express.Router();

// Signup route
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ token, user: { id: newUser._id, name, email } });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Fetch user dashboard data
router.get("/user", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Example: Fetch user-specific data (e.g., reviews)
    const userReviews = await Restaurant.find({ "reviews.userName": user.name });

    res.json({ user, userReviews });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Fetch user dashboard data
router.get("/dashboard", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userReviews = await Restaurant.find({ "reviews.userName": user.name });
    res.json({ user, userReviews });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Add a restaurant to favorites
router.post("/favorites", authenticate, async (req, res) => {
  try {
    const { restaurantId } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.favorites.includes(restaurantId)) {
      user.favorites.push(restaurantId);
      await user.save();
    }

    res.json({ message: "Restaurant added to favorites", favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Remove a restaurant from favorites
router.delete("/favorites/:restaurantId", authenticate, async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.favorites = user.favorites.filter((id) => id.toString() !== restaurantId);
    await user.save();

    res.json({ message: "Restaurant removed from favorites", favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Fetch user's favorite restaurants
router.get("/favorites", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("favorites");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;