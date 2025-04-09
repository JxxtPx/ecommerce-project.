import mongoose from "mongoose";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

// ✅ Directly connect to MongoDB
await mongoose.connect(
  "mongodb+srv://jeet:Jeet2611@ecom.mqr6o.mongodb.net/e-commerce?retryWrites=true&w=majority&appName=Ecom",

  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// 🛍️ Sample Products
const products = [
  {
    name: "kokabura ",
    description: "Classic Aussie bat with great memories",
    price: 3499,
    category: "Sports",
    image: "https://tpc.googlesyndication.com/simgad/11875789242722971411?sqp=-oaymwEMCMgBEMgBIAFQAVgB&rs=AOga4qlEOmdbegTSswWbFkQxD7qR-DnoRw",
    countInStock: 12,
  },
  {
    name: "Cricket ball",
    description: "Comfortable swing ball",
    price: 1999,
    category: "Sports",
    image: "https://cdn-5c84bc36-b681cbc1.mysagestore.com/b522fd52e101edc926c3308c230445d5/contents/1A1104/thumbnail/middle_1A1104.jpg",
    countInStock: 2,
  },
];

// 🔁 Insert Products
const seedProducts = async () => {
  try {
    await Product.insertMany(products);
    console.log("✅ Products seeded successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
};

seedProducts();
