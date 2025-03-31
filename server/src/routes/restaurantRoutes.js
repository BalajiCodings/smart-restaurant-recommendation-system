import express from "express";
import { Restaurant } from "../models/Restaurant.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// Fetch all restaurants with filters and pagination
router.get("/", async (req, res) => {
  try {
    const { search, cuisine, sort, page = 1, limit = 10 } = req.query;

    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } },
        { cuisine: { $regex: search, $options: "i" } },
      ];
    }
    if (cuisine) {
      query.cuisine = { $regex: cuisine, $options: "i" };
    }

    let restaurants = await Restaurant.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    if (sort === "rating") {
      restaurants = restaurants.sort((a, b) => b.rating - a.rating);
    } else if (sort === "reviews") {
      restaurants = restaurants.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    const totalRestaurants = await Restaurant.countDocuments(query);
    const totalPages = Math.ceil(totalRestaurants / limit);

    res.json({ restaurants, totalPages });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Fetch a single restaurant by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Add a new restaurant
router.post("/", async (req, res) => {
  try {
    const newRestaurant = new Restaurant(req.body);
    await newRestaurant.save();
    res.status(201).json(newRestaurant);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Add a review to a restaurant
router.post("/:id/reviews", async (req, res) => {
  try {
    const { id } = req.params;
    const { userName, rating, comment } = req.body;

    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const review = {
      userName,
      rating,
      date: new Date(),
      comment,
    };

    restaurant.reviews.push(review);
    restaurant.reviewCount = restaurant.reviews.length;
    restaurant.rating =
      restaurant.reviews.reduce((acc, review) => acc + review.rating, 0) /
      restaurant.reviewCount;

    await restaurant.save();
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Example: Protect user dashboard route
router.get("/user", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
