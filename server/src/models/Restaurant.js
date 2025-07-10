import mongoose from "mongoose";

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cuisine: { type: String, required: true },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  address: { type: String, required: true },
  image: { type: String },
  description: { type: String },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  
  // Swiggy data fields
  numberOfRatings: { type: String },
  averagePrice: { type: String },
  numberOfOffers: { type: Number, default: 0 },
  offerNames: [{ type: String }],
  area: { type: String },
  isPureVeg: { type: Boolean, default: false },
  location: { type: String }, // City/Location
  
  // Geolocation for nearby feature (can be added later)
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    }
  }
}, {
  timestamps: true
});

// Add geospatial index for location-based queries
RestaurantSchema.index({ coordinates: '2dsphere' });
RestaurantSchema.index({ location: 1 });
RestaurantSchema.index({ area: 1 });
RestaurantSchema.index({ cuisine: 1 });
RestaurantSchema.index({ rating: -1 });

export const Restaurant = mongoose.model("Restaurant", RestaurantSchema);