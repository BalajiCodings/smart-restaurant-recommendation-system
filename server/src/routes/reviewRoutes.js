import express from "express";
import { addReview, editReview, deleteReview } from "../controllers/reviewController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:restaurantId", authenticate, addReview);
router.put("/:reviewId", authenticate, editReview);
router.delete("/:reviewId", authenticate, deleteReview);

export default router;