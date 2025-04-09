import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} from "../controllers/wishlistController.js";

const router = express.Router();

// GET wishlist
router.get("/", protect, getWishlist);

// POST add to wishlist
router.post("/add", protect, addToWishlist);

// DELETE remove from wishlist
router.delete("/remove/:productId", protect, removeFromWishlist);

export default router;
