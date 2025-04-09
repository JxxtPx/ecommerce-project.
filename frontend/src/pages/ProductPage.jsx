import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { addToCart } from "../utils/cartUtils";
import { FaStar, FaTrashAlt, FaEdit } from "react-icons/fa";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [review, setReview] = useState({ rating: 0, comment: "" });
  const [hoveredStar, setHoveredStar] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const userInfo = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await axiosInstance.get(`/products/${id}`);
      const res2 = await axiosInstance.get(`/products/${id}/related`);
      setProduct(res.data);
      setRelatedProducts(res2.data);
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    const added = addToCart(product, qty);
    if (added) toast.success("Added to cart!");
    else toast.error("⚠️ Max stock reached.");
  };

  const handleAddToWishlist = async () => {
    if (!userInfo) {
      toast.error("Please log in to add to wishlist");
      return;
    }
    try {
      await axiosInstance.post(
        "/wishlist/add",
        { productId: product._id },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      toast.success("Added to wishlist!");
    } catch (err) {
      toast.error("Failed to add to wishlist");
    }
  };

  const handleCompareClick = () => {
    navigate("/compare", { state: { products: [product] } });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      if (editingReviewId) {
        await axiosInstance.put(`/products/${id}/reviews/${editingReviewId}`, review, config);
        toast.success("Review updated!");
      } else {
        await axiosInstance.post(`/products/${id}/reviews`, review, config);
        toast.success("Review added!");
      }

      setReview({ rating: 0, comment: "" });
      setEditingReviewId(null);
      setShowForm(false);

      const updated = await axiosInstance.get(`/products/${id}`);
      setProduct(updated.data);
    } catch (err) {
      toast.error("Failed to submit review");
    }
  };

  const handleEditClick = (rev) => {
    setReview({ rating: rev.rating, comment: rev.comment });
    setEditingReviewId(rev._id);
    setShowForm(true);
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axiosInstance.delete(`/products/${id}/reviews/${reviewId}`, config);
      const updated = await axiosInstance.get(`/products/${id}`);
      setProduct(updated.data);
      
    } catch (err) {
      toast.error("Failed to delete review");
    }
  };

  if (!product) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-5">
      <div className="row mb-5">
        <motion.div className="col-md-6 mb-4" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <div className="d-flex justify-content-center">
            <img
              src={product.image}
              alt={product.name}
              style={{ maxHeight: "300px", objectFit: "contain" }}
              className="img-fluid"
            />
          </div>
        </motion.div>

        <motion.div className="col-md-6" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <div className="card-body">
            <h2 style={{ color: "#400d18" }}>{product.name}</h2>
            <div className="d-flex align-items-center mb-2">
              <div className="text-warning me-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} color={i < Math.round(product.rating) ? "#ffc107" : "#e4e5e9"} />
                ))}
              </div>
              <small className="text-muted">({product.numReviews} Reviews)</small>
            </div>

            <p className="text-muted">{product.category}</p>
            <h4 style={{ color: "#c97b84" }} className="my-3">${product.price}</h4>
            <p>{product.description}</p>

            <p><strong>In Stock:</strong> {product.countInStock}</p>

            <div className="mb-3" style={{ maxWidth: "150px" }}>
              <label className="form-label">Quantity</label>
              <select className="form-select" value={qty} onChange={(e) => setQty(Number(e.target.value))}>
                {[...Array(product.countInStock).keys()].map((x) => <option key={x + 1}>{x + 1}</option>)}
              </select>
            </div>

            <div className="d-flex flex-column flex-md-row gap-2">
              <button className="btn" onClick={handleAddToCart} style={{ backgroundColor: "#c97b84", color: "#fff", borderRadius: "8px" }}>
                Add to Cart <i className="fa-solid fa-cart-shopping mx-2"></i>
              </button>

              <button className="btn" onClick={handleAddToWishlist} style={{ border: "1px solid #c97b84", color: "#c97b84", backgroundColor: "transparent", borderRadius: "8px" }}>
                <i className="fa fa-heart me-1"></i> Wishlist
              </button>

              <button className="btn" onClick={handleCompareClick} style={{ border: "1px dashed #c97b84", color: "#c97b84", backgroundColor: "transparent", borderRadius: "8px" }}>
                Compare
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Reviews */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h4 style={{ color: "#400d18" }} className="mb-3">Customer Reviews</h4>
        <div className="row">
          {product.reviews.length === 0 && <p>No reviews yet.</p>}
          {product.reviews.map((rev, i) => {
            const isOwner = userInfo && (userInfo._id === rev.user || userInfo.id === rev.user || userInfo.id === rev.user?._id);
            return (
              <div className="col-md-6 mb-3" key={i}>
                <div className="p-3 h-100" style={{ backgroundColor: "#fef2f4", borderRadius: "10px" }}>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <strong>{rev.name || "Unknown"}</strong>
                    {isOwner && (
                      <div>
                        <button className="btn btn-sm btn-outline-danger me-2" onClick={() => handleDeleteReview(rev._id)}>
                          <FaTrashAlt />
                        </button>
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => handleEditClick(rev)}>
                          <FaEdit />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="text-warning">{[...Array(rev.rating)].map((_, idx) => <FaStar key={idx} />)}</div>
                  <small className="text-muted">{new Date(rev.createdAt).toLocaleDateString()}</small>
                  <p>{rev.comment}</p>
                </div>
              </div>
            );
          })}
        </div>

        {userInfo && (
          <div className="text-center mt-4">
            <button
              className="btn"
              onClick={() => {
                setShowForm(!showForm);
                setEditingReviewId(null);
                setReview({ rating: 0, comment: "" });
              }}
              style={{ border: "1px solid #c97b84", color: "#c97b84", borderRadius: "8px", backgroundColor: "transparent" }}
            >
              {showForm ? "Close" : editingReviewId ? "Edit Review" : "Add a Review"}
            </button>
          </div>
        )}

        {showForm && userInfo && (
          <div className="mt-4">
            <h5 style={{ color: "#400d18" }}>{editingReviewId ? "Edit Your Review" : "Write a Review"}</h5>
            <form onSubmit={handleReviewSubmit}>
              <div className="mb-3">
                <label className="form-label d-block">Your Rating:</label>
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    size={24}
                    color={hoveredStar >= star || review.rating >= star ? "#ffc107" : "#e4e5e9"}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(null)}
                    onClick={() => setReview({ ...review, rating: star })}
                    style={{ cursor: "pointer", marginRight: "5px" }}
                  />
                ))}
              </div>
              <div className="mb-3">
                <label className="form-label">Comment:</label>
                <textarea className="form-control" rows="3" value={review.comment} onChange={(e) => setReview({ ...review, comment: e.target.value })} required />
              </div>
              <button type="submit" className="btn" style={{ backgroundColor: "#c97b84", color: "#fff", border: "none", borderRadius: "8px" }}>
                {editingReviewId ? "Update Review" : "Submit Review"}
              </button>
            </form>
          </div>
        )}
      </motion.div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="my-5">
          <h4 style={{ color: "#400d18" }} className="mb-3">Suggested Products</h4>
          <div className="row">
            {relatedProducts.map((rel) => (
              <div className="col-md-3 mb-4" key={rel._id}>
                <div className="card h-100 shadow-sm">
                  <img src={rel.image} className="card-img-top p-3" alt={rel.name} style={{ height: "200px", objectFit: "contain" }} />
                  <div className="card-body">
                    <h6 className="card-title">{rel.name}</h6>
                    <p className="card-text text-muted mb-2">${rel.price}</p>
                    <Link
                      className="btn btn-sm"
                      to={`/product/${rel._id}`}
                      style={{ border: "1px solid #c97b84", color: "#c97b84", borderRadius: "8px", backgroundColor: "transparent" }}
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductPage;
