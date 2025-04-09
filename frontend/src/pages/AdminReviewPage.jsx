import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editReview, setEditReview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllReviews();
  }, []);

  const fetchAllReviews = async () => {
    try {
      const { token } = JSON.parse(localStorage.getItem("userInfo"));
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axiosInstance.get("/products", config);
      const allReviews = [];
      data.forEach((product) => {
        product.reviews.forEach((review) => {
          allReviews.push({ ...review, productId: product._id, productName: product.name });
        });
      });
      setProducts(data);
      setReviews(allReviews);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const { token } = JSON.parse(localStorage.getItem("userInfo"));
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axiosInstance.delete(
        `/products/${deleteConfirm.productId}/reviews/${deleteConfirm._id}`,
        config
      );
      setReviews((prev) => prev.filter((r) => r._id !== deleteConfirm._id));
      setDeleteConfirm(null);
    } catch (err) {
      console.error("Failed to delete review:", err);
    }
  };

  const handleUpdate = async () => {
    try {
      const { token } = JSON.parse(localStorage.getItem("userInfo"));
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { rating, comment, productId, _id } = editReview;
      await axiosInstance.put(
        `/products/${productId}/reviews/${_id}`,
        { rating, comment },
        config
      );
      setReviews((prev) =>
        prev.map((r) => (r._id === _id ? { ...r, rating, comment } : r))
      );
      setEditReview(null);
    } catch (err) {
      console.error("Failed to update review:", err);
      alert("❌ Update failed. You might not be authorized.");
    }
  };

  const filtered = reviews
    .filter((r) =>
      `${r.productName} ${r.name} ${r.comment}`.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((r) => (selectedProduct ? r.productId === selectedProduct : true))
    .filter((r) => (selectedUser ? r.name === selectedUser : true))
    .sort((a, b) =>
      sortBy === "rating"
        ? b.rating - a.rating
        : new Date(b.createdAt) - new Date(a.createdAt)
    );

  const usersList = [...new Set(reviews.map((r) => r.name))];

  return (
    <div className="container mt-5 mb-5">
      <h2 className="mb-4 fw-bold" style={{ color: "#400d18" }}>
        📝 Manage Product Reviews
      </h2>

      {/* Filters */}
      <div className="row mb-3 g-2">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            style={{ borderColor: "#c97b84" }}
            placeholder="Search by product, user, comment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            style={{ borderColor: "#c97b84" }}
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
          >
            <option value="">All Products</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            style={{ borderColor: "#c97b84" }}
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <option value="">All Users</option>
            {usersList.map((u, idx) => (
              <option key={idx} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            style={{ borderColor: "#c97b84" }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="latest">Sort by Latest</option>
            <option value="rating">Sort by Rating</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <p>Loading reviews...</p>
      ) : filtered.length === 0 ? (
        <p>No reviews match your filter.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead style={{ backgroundColor: "#400d18", color: "#fff" }}>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>User</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((review, idx) => (
                <tr key={review._id}>
                  <td>{idx + 1}</td>
                  <td>{review.productName}</td>
                  <td>{review.name}</td>
                  <td>{review.rating} ⭐</td>
                  <td>{review.comment}</td>
                  <td>{new Date(review.createdAt).toLocaleDateString()}</td>
                  <td className="d-flex gap-2">
                    <button
                      className="btn btn-sm"
                      style={{ backgroundColor: "#c97b84", color: "#fff" }}
                      onClick={() => setEditReview(review)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => setDeleteConfirm(review)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirm Popup */}
      {deleteConfirm && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: "rgba(0,0,0,0.4)", zIndex: 1000 }}>
          <div className="bg-white p-4 rounded shadow" style={{ width: "320px" }}>
            <h5 className="mb-3">Are you sure?</h5>
            <p className="text-muted mb-4">
              Delete review by <strong>{deleteConfirm.name}</strong> on{" "}
              <strong>{deleteConfirm.productName}</strong>?
            </p>
            <div className="d-flex justify-content-end gap-2">
              <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Review Modal */}
      {editReview && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: "rgba(0,0,0,0.4)", zIndex: 1000 }}>
          <div className="bg-white p-4 rounded shadow" style={{ width: "400px" }}>
            <h5 className="mb-3" style={{ color: "#400d18" }}>Edit Review</h5>
            <div className="mb-3">
              <label className="form-label">Rating</label>
              <select
                className="form-select"
                value={editReview.rating}
                onChange={(e) =>
                  setEditReview((prev) => ({ ...prev, rating: Number(e.target.value) }))
                }
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n} ⭐
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Comment</label>
              <textarea
                className="form-control"
                rows={3}
                value={editReview.comment}
                onChange={(e) =>
                  setEditReview((prev) => ({ ...prev, comment: e.target.value }))
                }
              ></textarea>
            </div>
            <div className="d-flex justify-content-end gap-2">
              <button className="btn btn-secondary" onClick={() => setEditReview(null)}>Cancel</button>
              <button className="btn" style={{ backgroundColor: "#c97b84", color: "#fff" }} onClick={handleUpdate}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminReviewsPage;
