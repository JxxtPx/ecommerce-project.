import express from "express";
import { createProductReview, deleteReview, updateReview   } from "../controllers/productReviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:id/reviews", protect, createProductReview);
router.put("/:productId/reviews/:reviewId", protect, updateReview); // 👈 NEW

router.delete("/:productId/reviews/:reviewId", protect, deleteReview);

export default router;
