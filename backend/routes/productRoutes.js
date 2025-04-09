import express from "express";
import { getProducts, getProductById, deleteProduct,createProduct,updateProduct,getRelatedProducts } from "../controllers/ProductController.js";
import { createProductReview, deleteReview, updateReview } from "../controllers/productReviewController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getProducts); // Fetch all products
router.get("/:id", getProductById); // Fetch single product by ID
router.get("/:id/related", getRelatedProducts);

//admin routes
router.post("/", protect, adminOnly, createProduct); // Add new product
router.put("/:id", protect, adminOnly, updateProduct); // Update product
router.delete("/:id", protect, adminOnly, deleteProduct);




router.post("/:id/reviews", protect, createProductReview);
router.delete("/:productId/reviews/:reviewId", protect, deleteReview);
router.put("/:productId/reviews/:reviewId", protect, updateReview);

export default router;
