// import multer from "multer";
// import { CloudinaryStorage } from "multer-storage-cloudinary";
// import {cloudinary} from "../utils/cloudinary.js";

// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: "products", // Your Cloudinary folder
//     allowed_formats: ["jpg", "jpeg", "png", "webp"],
//   },
// });

// const upload = multer({ storage });

// export default upload;


import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinary } from "../utils/cloudinary.js";

// Dynamic folder setup based on query or route
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folderName = "products"; // default

    // Optional: you can check from query, body, or route
    if (req.baseUrl.includes("/users") || req.url.includes("profile")) {
      folderName = "userProfiles";
    }

    return {
      folder: folderName,
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
    };
  },
});

const upload = multer({ storage });
export default upload;

