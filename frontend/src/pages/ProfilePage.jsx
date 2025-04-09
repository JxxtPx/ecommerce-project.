import axiosInstance from "../utils/axiosInstance";
import React, { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import "react-toastify/dist/ReactToastify.css";

function ProfilePage() {
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [error, setError] = useState("");
  const [openOrderId, setOpenOrderId] = useState(null);
  const [showOrders, setShowOrders] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(true);

  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem("userInfo"))
  );

  useEffect(() => {
    const fetchAll = async () => {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };

      try {
        setLoading(true);
        const [profileRes, ordersRes, wishlistRes] = await Promise.all([
          axiosInstance.get("/users/profile", config),
          axiosInstance.get("/orders/myorders", config),
          axiosInstance.get("/wishlist", config),
        ]);

        const updated = {
          ...userInfo,
          profileImage: profileRes.data.profileImage,
        };
        setUserInfo(updated);
        localStorage.setItem("userInfo", JSON.stringify(updated));
        setOrders(ordersRes.data);
        setWishlist(wishlistRes.data);
      } catch (err) {
        console.error("❌ Fetching error:", err);
        setError("Failed to load profile data.");
        toast.error("Error loading profile info.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage) return;
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("image", selectedImage);

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axiosInstance.put(
        "/users/profile/upload",
        formData,
        config
      );

      const updated = { ...userInfo, profileImage: data.profileImage };
      setUserInfo(updated);
      localStorage.setItem("userInfo", JSON.stringify(updated));
      toast.success("✅ Profile picture updated");
    } catch (err) {
      toast.error("❌ Image upload failed");
    } finally {
      setUploading(false);
      setSelectedImage(null);
      setPreviewUrl("");
    }
  };

  const handleRemoveWishlist = async (productId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axiosInstance.delete(
        `/wishlist/remove/${productId}`,
        config
      );
      setWishlist((prev) => prev.filter((p) => p._id !== productId));
      toast.success("Removed from wishlist");
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  if (loading) return <Loader />;

  return (
    <div
      className="container my-5"
      style={{ backgroundColor: "#ffffff", color: "#400d18" }}
    >
      {/* User Info Card */}
      <div className="card shadow-sm border-0 mb-4 p-4">
        <div className="row align-items-center">
          <div className="col-4 text-center">
            <label htmlFor="uploadInput" style={{ cursor: "pointer" }}>
              <img
                src={
                  previewUrl || userInfo?.profileImage || "/default-avatar.png"
                }
                alt="Profile"
                className="rounded-circle shadow"
                style={{ width: "120px", height: "120px", objectFit: "cover" }}
              />
            </label>
            <input
              type="file"
              id="uploadInput"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
            <div className="mt-2">
              <button
                className="btn btn-sm"
                onClick={handleImageUpload}
                disabled={uploading || !selectedImage}
                style={{
                  backgroundColor: "#c97b84",
                  color: "#fff",
                  fontWeight: "500",
                  padding: "5px 12px",
                }}
              >
                {uploading ? "Uploading..." : "Edit"}
              </button>
            </div>
          </div>

          <div className="col-8 text-start">
            <h5 className="fw-bold mb-1">{userInfo?.name}</h5>
            <p className="text-muted mb-3">{userInfo?.email}</p>
            <button
              className="btn"
              style={{
                border: "1px solid #c97b84",
                color: "#c97b84",
                backgroundColor: "transparent",
                borderRadius: "6px",
                fontWeight: "500",
              }}
              onClick={() => setShowOrders(!showOrders)}
            >
              {showOrders ? "Hide Orders" : "View My Orders"}
            </button>
          </div>
        </div>
      </div>

      {/* Orders Section */}
      {error && <div className="alert alert-danger">{error}</div>}

      {showOrders && (
        <div className="mb-5">
          <h5 className="mb-3">🧾 Your Orders</h5>
          {orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <div className="d-flex flex-column gap-4">
              {orders.map((order) => {
                const isOpen = openOrderId === order._id;
                return (
                  <motion.div
                    key={order._id}
                    className="card border-0 shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div
                      className="card-body d-flex justify-content-between align-items-center"
                      style={{ cursor: "pointer" }}
                      onClick={() => setOpenOrderId(isOpen ? null : order._id)}
                    >
                      <div>
                        <h6 className="mb-0">
                          <strong>Order:</strong> #{order._id.slice(-6)}
                        </h6>
                        <small className="text-muted">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </small>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <span
                          className={`badge ${
                            order.isDelivered
                              ? "bg-success"
                              : "bg-warning text-dark"
                          }`}
                        >
                          {order.isDelivered ? "Delivered" : "Pending"}
                        </span>
                        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                      </div>
                    </div>

                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="px-4 pb-4"
                      >
                        {order.orderItems.map((item) => (
                          <div
                            key={item._id}
                            className="d-flex justify-content-between align-items-center border-bottom py-2"
                          >
                            <div className="d-flex align-items-center gap-3">
                              <img
                                src={item.image}
                                alt={item.name}
                                style={{
                                  width: "60px",
                                  height: "60px",
                                  objectFit: "contain",
                                }}
                                className="border rounded"
                              />
                              <div>
                                <div className="fw-semibold">{item.name}</div>
                                <small className="text-muted">
                                  Qty: {item.qty} × ${item.price}
                                </small>
                              </div>
                            </div>
                            <strong>
                              ${(item.qty * item.price).toFixed(2)}
                            </strong>
                          </div>
                        ))}
                        <div className="d-flex justify-content-between pt-3">
                          <div>
                            <strong>Total:</strong> $
                            {order.totalPrice.toFixed(2)}
                          </div>
                          <a
                            href={`/order/${order._id}`}
                            className="btn btn-sm"
                            style={{
                              border: "1px solid #c97b84",
                              color: "#c97b84",
                              backgroundColor: "transparent",
                              borderRadius: "5px",
                            }}
                          >
                            View Details
                          </a>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Wishlist Section */}
      <div className="card shadow-sm border-0 p-4">
        <h5 className="mb-4">❤️ My Wishlist</h5>
        {wishlist.length === 0 ? (
          <p>No items in your wishlist.</p>
        ) : (
          <div className="row">
            {wishlist.map((product) => (
              <div className="col-md-4 mb-4" key={product._id}>
                <div className="card h-100 shadow-sm border-0">
                  <img
                    src={product.image}
                    className="card-img-top p-3"
                    alt={product.name}
                    style={{ height: "220px", objectFit: "contain" }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h6 className="card-title text-truncate">{product.name}</h6>
                    <p className="text-muted">${product.price}</p>
                    <div className="mt-auto d-flex justify-content-between">
                      <a
                        href={`/product/${product._id}`}
                        className="btn btn-sm"
                        style={{
                          border: "1px solid #c97b84",
                          color: "#c97b84",
                          backgroundColor: "transparent",
                          borderRadius: "5px",
                        }}
                      >
                        View
                      </a>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleRemoveWishlist(product._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
