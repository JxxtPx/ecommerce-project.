import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";

function AdminProductPage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { token } = JSON.parse(localStorage.getItem("userInfo"));
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axiosInstance.get("/products", config);
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const confirmDelete = (id) => {
    setDeleteTargetId(id);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      const { token } = JSON.parse(localStorage.getItem("userInfo"));
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axiosInstance.delete(`/products/${deleteTargetId}`, config);
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold" style={{ color: "#400d18" }}>
          🛍️ Product Management
        </h3>
        <button
          className="btn"
          style={{ backgroundColor: "#c97b84", color: "#fff" }}
          onClick={() => navigate("/admin/products/create")}
        >
          <FaPlus className="me-1" /> Add New Product
        </button>
      </div>

      <div className="mb-4 d-flex justify-content-end">
        <input
          type="text"
          className="form-control"
          style={{ maxWidth: "300px", borderColor: "#c97b84" }}
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-responsive shadow-sm rounded">
        <table className="table table-striped align-middle">
          <thead style={{ backgroundColor: "#400d18", color: "#fff" }}>
            <tr>
              <th>#</th>
              <th>Product</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Price ($)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-muted">
                  No products found.
                </td>
              </tr>
            ) : (
              filteredProducts.map((product, idx) => (
                <tr key={product._id}>
                  <td>{idx + 1}</td>
                  <td>
                    <strong>{product.name}</strong>
                    <br />
                    <small className="text-muted">#{product._id.slice(-6)}</small>
                  </td>
                  <td>{product.category}</td>
                  <td>
                    <span
                      className={`badge rounded-pill ${
                        product.countInStock === 0
                          ? "bg-danger"
                          : product.countInStock < 10
                          ? "bg-warning text-dark"
                          : "bg-success"
                      }`}
                    >
                      {product.countInStock}
                    </span>
                  </td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>
                    <Link
                      to={`/admin/products/${product._id}/edit`}
                      className="btn btn-sm"
                      style={{ borderColor: "#c97b84", color: "#c97b84" }}
                    >
                      <FaEdit /> Edit
                    </Link>
                    <button
                      className="btn btn-sm ms-2"
                      style={{ borderColor: "#400d18", color: "#400d18" }}
                      onClick={() => confirmDelete(product._id)}
                    >
                      <FaTrash /> Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="modal show fade d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-danger">Confirm Deletion</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this product? This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={handleDelete}>
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProductPage;
