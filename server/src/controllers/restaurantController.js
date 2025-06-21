import { Restaurant } from "../models/Restaurant.js";

export const getRestaurants = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const restaurants = await Restaurant.find().skip(skip).limit(limit).lean();
    res.json(restaurants);
  } catch (err) {
    next(err);
  }
};

export const getRestaurantById = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate("reviews").lean();
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
    res.json(restaurant);
  } catch (err) {
    next(err);
  }
};

export const createRestaurant = async (req, res, next) => {
  try {
    const { name, cuisine, address, image, description } = req.body;
    const restaurant = await Restaurant.create({ name, cuisine, address, image, description });
    res.status(201).json(restaurant);
  } catch (err) {
    next(err);
  }
};

export const searchRestaurants = async (req, res, next) => {
  try {
    const { q } = req.query;
    const regex = new RegExp(q, "i");
    const restaurants = await Restaurant.find({
      $or: [{ name: regex }, { cuisine: regex }],
    }).lean();
    res.json(restaurants);
  } catch (err) {
    next(err);
  }
};