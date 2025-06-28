// src/controllers/restaurantController.js
import { Restaurant } from "../models/Restaurant.js";

// ✅ GET /api/restaurants
export const getRestaurants = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [restaurants, total] = await Promise.all([
      Restaurant.find().skip(skip).limit(limit).lean(),
      Restaurant.countDocuments()
    ]);

    res.status(200).json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      restaurants,
    });
  } catch (err) {
    next(err);
  }
};

// ✅ GET /api/restaurants/:id
export const getRestaurantById = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
      .populate("reviews")
      .lean();

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json(restaurant);
  } catch (err) {
    next(err);
  }
};

// ✅ POST /api/restaurants  (admin only)
export const createRestaurant = async (req, res, next) => {
  try {
    const { name, cuisine, address, image, description } = req.body;

    const restaurant = await Restaurant.create({
      name,
      cuisine,
      address,
      image,
      description,
    });

    res.status(201).json({
      message: "Restaurant created successfully",
      restaurant,
    });
  } catch (err) {
    next(err);
  }
};

// ✅ GET /api/restaurants/search?q=query
export const searchRestaurants = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length === 0) {
      return res.status(400).json({ message: "Search query cannot be empty" });
    }

    const regex = new RegExp(q, "i");
    const results = await Restaurant.find({
      $or: [{ name: regex }, { cuisine: regex }],
    }).lean();

    res.status(200).json({ count: results.length, results });
  } catch (err) {
    next(err);
  }
};
