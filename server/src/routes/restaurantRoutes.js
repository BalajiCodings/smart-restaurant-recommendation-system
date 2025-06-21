import express from "express";
import { body } from "express-validator";
import { getRestaurants, getRestaurantById, createRestaurant, searchRestaurants } from "../controllers/restaurantController.js";
import { getRecommendations } from "../controllers/recommendationsController.js";
import { authenticate, requireRole } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.get("/search", searchRestaurants);
router.get("/", getRestaurants);
router.get("/:id", getRestaurantById);
router.post(
  "/",
  authenticate,
  requireRole("admin"),
  [
    body("name").notEmpty(),
    body("cuisine").notEmpty(),
    body("address").notEmpty(),
  ],
  validate,
  createRestaurant
);
router.get("/recommendations", authenticate, getRecommendations);

export default router;
