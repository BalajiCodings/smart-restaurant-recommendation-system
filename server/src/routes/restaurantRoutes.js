import express from "express";
import { body } from "express-validator";
import { getRestaurants, getRestaurantById, createRestaurant, searchRestaurants } from "../controllers/restaurantController.js";
import { getRecommendations } from "../controllers/recommendationsController.js";
import { authenticate, requireRole } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

// ✅ Order matters: specific routes before parameterized ones
router.get("/search", searchRestaurants);
router.get("/recommendations", authenticate, getRecommendations);
router.get("/", getRestaurants);
router.get("/:id", getRestaurantById);
router.post(
  "/",
  authenticate,
  requireRole("admin"),
  [
    body("name").notEmpty().withMessage("Restaurant name is required"),
    body("cuisine").notEmpty().withMessage("Cuisine type is required"),
    body("address").notEmpty().withMessage("Address is required"),
  ],
  validate,
  createRestaurant
);

export default router;
