import User from "../models/User.js";
import Product from "../models/Product.js";

// GET /api/wishlist — Get user's wishlist
export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist", "name price image category");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.wishlist);
  } catch (err) {
    console.error("Get wishlist error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/wishlist/add — Add product to wishlist
export const addToWishlist = async (req, res) => {
  const { productId } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if already in wishlist
    if (user.wishlist.includes(productId)) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    user.wishlist.push(productId);
    await user.save();

    res.status(200).json({ message: "Added to wishlist" });
  } catch (err) {
    console.error("Add to wishlist error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/wishlist/remove/:productId — Remove product from wishlist
export const removeFromWishlist = async (req, res) => {
  const { productId } = req.params;

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== productId.toString()
    );

    await user.save();

    res.status(200).json({ message: "Removed from wishlist" });
  } catch (err) {
    console.error("Remove from wishlist error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
