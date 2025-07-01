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
      success: true,
      message: "Restaurants fetched successfully",
      data: {
        restaurants,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1
        }
      }
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
      return res.status(404).json({ 
        success: false,
        message: "Restaurant not found" 
      });
    }

    res.status(200).json({
      success: true,
      message: "Restaurant fetched successfully",
      data: { restaurant }
    });
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
      success: true,
      message: "Restaurant created successfully",
      data: { restaurant }
    });
  } catch (err) {
    next(err);
  }
};

// ✅ GET /api/restaurants/search?q=query
export const searchRestaurants = async (req, res, next) => {
  try {
    const { q, cuisine, location } = req.query;
    
    if (!q || q.trim().length === 0) {
      return res.status(400).json({ 
        success: false,
        message: "Search query cannot be empty" 
      });
    }

    const searchRegex = new RegExp(q.trim(), "i");
    const searchQuery = {
      $or: [
        { name: searchRegex }, 
        { cuisine: searchRegex },
        { description: searchRegex }
      ],
    };

    // Add additional filters if provided
    if (cuisine) {
      searchQuery.cuisine = new RegExp(cuisine, "i");
    }
    if (location) {
      searchQuery.address = new RegExp(location, "i");
    }

    const results = await Restaurant.find(searchQuery).lean();

    res.status(200).json({ 
      success: true,
      message: "Search completed successfully",
      data: {
        query: q,
        count: results.length,
        restaurants: results
      }
    });
  } catch (err) {
    next(err);
  }
};
