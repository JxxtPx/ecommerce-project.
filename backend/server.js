import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import Product from "./models/Product.js";
import adminRoutes from "./routes/adminRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import paymentRoutes from './routes/paymentRoutes.js';
import wishlistRoutes from "./routes/wishlistRoutes.js";
import supportRoutes from "./routes/supportRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";


// import reviewRoutes from "./routes/productReviewRoutes.js";





dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/auth", authRoutes);
app.use("/api/products",productRoutes)
app.use("/api/orders",orderRoutes)
app.use("/api/admin",adminRoutes)
app.use("/api/upload", uploadRoutes);
app.use('/api/payments', paymentRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ai", aiRoutes);

// app.use("/api/products", reviewRoutes);




app.get("/", (req, res) => {
  res.send("Routes are working");
});

app.listen(PORT,"0.0.0.0", () => console.log(`Server running on port ${PORT}`));
