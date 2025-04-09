import express from "express";
import { compareProductsAI,generateCocktail } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/ai/compare
router.post("/compare", protect, compareProductsAI);
router.post("/cocktail", protect, generateCocktail);


export default router;
