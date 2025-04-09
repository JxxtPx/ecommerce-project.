import Product from "../models/Product.js";

export const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: "Product already reviewed" });
    }

    const newReview = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(newReview);
    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, r) => acc + r.rating, 0) /
      product.reviews.length;

    await product.save();

    res.status(201).json({ message: "Review added successfully" });
  } catch (error) {
    console.error("Create review error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const review = product.reviews.find((r) => r._id.toString() === reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    const userId = req.user._id?.toString?.() || req.user.id;
    const isOwner = review.user.toString() === userId;
    const isAdmin = req.user.role === "admin";


    // console.log("Review User:", review.user.toString(), "Logged In:", userId);

    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this review" });
    }

    product.reviews = product.reviews.filter(
      (r) => r._id.toString() !== reviewId
    );
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, r) => acc + r.rating, 0) /
      (product.reviews.length || 1);

    await product.save();

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;
    const { rating, comment } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const review = product.reviews.find((r) => r._id.toString() === reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    const userId = req.user._id?.toString?.() || req.user.id;
    const isOwner = review.user.toString() === userId;
    const isAdmin = req.user.role === "admin";


    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to update this review" });
    }

    // Update values
    review.rating = rating;
    review.comment = comment;

    // Recalculate average
    product.rating =
      product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

    await product.save();

    return res.status(200).json({ message: "Review updated successfully" });
  } catch (error) {
    console.error("Update review error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

