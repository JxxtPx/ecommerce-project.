import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createSupportQuery,
  getAllSupportQueries,
  replyToSupportQuery,
  updateSupportQueryStatus,
  getMySupportQueries 
} from "../controllers/supportController.js";

const router = express.Router();

// User: Submit a support query
router.post("/", protect, createSupportQuery);

// Admin: View all queries
router.get("/admin", protect, getAllSupportQueries);

// Admin: Reply to a query
router.put("/admin/:id/reply", protect, replyToSupportQuery);

// Admin: Update status (e.g., close a query)
router.put("/admin/:id/status", protect, updateSupportQueryStatus);
router.get("/mine", protect, getMySupportQueries);

export default router;
