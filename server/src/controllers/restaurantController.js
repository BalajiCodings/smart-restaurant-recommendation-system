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
    const { q, cuisine, location, area, veg, sortBy = 'rating', order = 'desc' } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const searchQuery = {};

    // Text search
    if (q && q.trim().length > 0) {
      const searchRegex = new RegExp(q.trim(), "i");
      searchQuery.$or = [
        { name: searchRegex }, 
        { cuisine: searchRegex },
        { description: searchRegex },
        { area: searchRegex }
      ];
    }

    // Filters
    if (cuisine) {
      searchQuery.cuisine = new RegExp(cuisine, "i");
    }
    if (location) {
      searchQuery.location = new RegExp(location, "i");
    }
    if (area) {
      searchQuery.area = new RegExp(area, "i");
    }
    if (veg === 'true') {
      searchQuery.isPureVeg = true;
    }

    // Sort options
    const sortOptions = {};
    if (sortBy === 'rating') {
      sortOptions.rating = order === 'asc' ? 1 : -1;
    } else if (sortBy === 'name') {
      sortOptions.name = order === 'asc' ? 1 : -1;
    } else if (sortBy === 'price') {
      sortOptions.averagePrice = order === 'asc' ? 1 : -1;
    }

    const [results, total] = await Promise.all([
      Restaurant.find(searchQuery)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean(),
      Restaurant.countDocuments(searchQuery)
    ]);

    res.status(200).json({ 
      success: true,
      message: "Search completed successfully",
      data: {
        query: q || '',
        filters: { cuisine, location, area, veg },
        count: results.length,
        total,
        restaurants: results,
        pagination: {
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

// ✅ GET /api/restaurants/nearby?lat=12.9716&lng=77.5946&radius=5000
export const getNearbyRestaurants = async (req, res, next) => {
  try {
    const { lat, lng, radius = 5000, limit = 20 } = req.query; // radius in meters
    
    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required"
      });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const radiusInMeters = parseInt(radius);
    const limitNum = parseInt(limit);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        success: false,
        message: "Invalid latitude or longitude"
      });
    }

    const nearbyRestaurants = await Restaurant.find({
      coordinates: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude]
          },
          $maxDistance: radiusInMeters
        }
      }
    })
    .limit(limitNum)
    .lean();

    res.status(200).json({
      success: true,
      message: "Nearby restaurants fetched successfully",
      data: {
        center: { latitude, longitude },
        radius: radiusInMeters,
        count: nearbyRestaurants.length,
        restaurants: nearbyRestaurants
      }
    });
  } catch (err) {
    next(err);
  }
};

// ✅ GET /api/restaurants/locations - Get all unique locations
export const getLocations = async (req, res, next) => {
  try {
    const locations = await Restaurant.distinct('location');
    const areas = await Restaurant.distinct('area');
    
    res.status(200).json({
      success: true,
      message: "Locations fetched successfully",
      data: {
        locations: locations.filter(loc => loc && loc.trim() !== ''),
        areas: areas.filter(area => area && area.trim() !== '')
      }
    });
  } catch (err) {
    next(err);
  }
};

// ✅ GET /api/restaurants/cuisines - Get all unique cuisines
export const getCuisines = async (req, res, next) => {
  try {
    const cuisines = await Restaurant.distinct('cuisine');
    
    res.status(200).json({
      success: true,
      message: "Cuisines fetched successfully",
      data: {
        cuisines: cuisines.filter(cuisine => cuisine && cuisine.trim() !== '')
      }
    });
  } catch (err) {
    next(err);
  }
};
