import express from "express";
import {
  getUserDashboard,
  addFavorite,
  removeFavorite,
  getProfile,
  updatePreferredCuisines,
  getMyReviews,
} from "../controllers/userController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard", authenticate, getUserDashboard);
router.post("/favorites/:restaurantId", authenticate, addFavorite);
router.delete("/favorites/:restaurantId", authenticate, removeFavorite);
router.get("/profile", authenticate, getProfile);
router.put("/preferences/cuisines", authenticate, updatePreferredCuisines);
router.get("/reviews", authenticate, getMyReviews);

export default router;