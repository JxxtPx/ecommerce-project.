import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { updateUserProfileImage, getUserProfile } from "../controllers/userController.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Upload profile image and update user model
router.put("/profile/upload", protect, upload.single("image"), updateUserProfileImage);

// Optional: Get user profile details (if not already handled elsewhere)
router.get("/profile", protect, getUserProfile);

export default router;