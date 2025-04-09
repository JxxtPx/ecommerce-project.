import express from "express";
import { getAllUsers, deleteUser } from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { getAnalyticsOverview } from "../controllers/analyticalCotroller.js";




const router = express.Router();


router.get("/users", protect, adminOnly, getAllUsers);      // ✅ View users
router.delete("/users/:id", protect, adminOnly, deleteUser);
router.get("/analytics", protect, adminOnly, getAnalyticsOverview);



export default router;