
import express from "express";
import {
  getUserDashboard,
  addFavorite,
  removeFavorite,
  getFavorites,
  getProfile,
  updatePreferredCuisines,
  getMyReviews,
  getAllUsers,
  changePassword,
} from "../controllers/userController.js";

import { authenticate, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard", authenticate, getUserDashboard);
router.get("/profile", authenticate, getProfile);
router.get("/favorites", authenticate, getFavorites);
router.post("/favorites/:restaurantId", authenticate, addFavorite);
router.delete("/favorites/:restaurantId", authenticate, removeFavorite);
router.put("/preferences/cuisines", authenticate, updatePreferredCuisines);
router.get("/reviews", authenticate, getMyReviews);
router.put("/change-password", authenticate, changePassword);


router.get("/admin/all", authenticate, requireRole("admin"), getAllUsers);

export default router;
