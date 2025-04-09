import express from "express";
import upload from "../middleware/uploadMiddleware.js"; // multer middleware
import { uploadImageToCloudinary } from "../controllers/uploadController.js";

const router = express.Router();

router.post("/", upload.single("image"), uploadImageToCloudinary);

export default router;
