import mongoose from "mongoose";

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cuisine: { type: String, required: true },
  rating: { type: Number, required: true },
  reviewCount: { type: Number, default: 0 },
  address: { type: String, required: true },
  image: { type: String },
  description: { type: String },
  reviews: [
    {
      userName: String,
      rating: Number,
      date: Date,
      comment: String,
    },
  ],
});

export const Restaurant = mongoose.model("Restaurant", RestaurantSchema);
