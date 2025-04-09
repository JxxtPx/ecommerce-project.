import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { FaCog } from "react-icons/fa";

function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [activeOrderId, setActiveOrderId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    handleSearchAndSort();
  }, [orders, searchTerm, sortBy]);

  const fetchOrders = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axiosInstance.get("/orders", config);
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    }
  };

  const handleMarkDelivered = async (id) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axiosInstance.put(`/orders/${id}/deliver`, {}, config);
      fetchOrders();
      setActiveOrderId(null);
    } catch (error) {
      console.error("Delivery update failed", error);
    }
  };

  const handleMarkPaid = async (id) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axiosInstance.put(`/orders/admin/${id}/pay`, {}, config);
      fetchOrders();
      setActiveOrderId(null);
    } catch (error) {
      console.error("Payment update failed", error);
    }
  };

  const handleSearchAndSort = () => {
    let updated = [...orders];
    if (searchTerm) {
      updated = updated.filter(
        (order) =>
          order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (sortBy === "latest") {
      updated.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "price") {
      updated.sort((a, b) => b.totalPrice - a.totalPrice);
    }
    setFilteredOrders(updated);
  };

  return (
    <div className="container mt-5 mb-5">
      <h2 className="mb-4 fw-bold" style={{ color: "#400d18" }}>
        📦 Manage Orders
      </h2>

      <div className="d-flex flex-column flex-md-row justify-content-between gap-2 mb-3">
        <input
          type="text"
          className="form-control"
          style={{ borderColor: "#c97b84" }}
          placeholder="Search by ID or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="form-select"
          style={{ borderColor: "#c97b84", maxWidth: "200px" }}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="latest">Sort by Latest</option>
          <option value="price">Sort by Price</option>
        </select>
      </div>

      <div className="table-responsive">
        <table className="table align-middle table-hover table-bordered">
          <thead style={{ backgroundColor: "#400d18", color: "#fff" }}>
            <tr>
              <th>#</th>
              <th>User Email</th>
              <th>Total Price ($)</th>
              <th>Paid</th>
              <th>Delivered</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center text-muted py-3">
                  No orders found.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order, index) => (
                <tr key={order._id}>
                  <td>{index + 1}</td>
                  <td className="text-break">{order.user?.email || "N/A"}</td>
                  <td>${order.totalPrice.toFixed(2)}</td>
                  <td>
                    <span
                      className={`badge ${
                        order.isPaid ? "bg-success" : "bg-danger"
                      }`}
                    >
                      {order.isPaid ? "Yes" : "No"}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        order.isDelivered ? "bg-success" : "bg-warning text-dark"
                      }`}
                    >
                      {order.isDelivered ? "Yes" : "No"}
                    </span>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="position-relative">
                    <button
                      className="btn btn-sm"
                      style={{
                        borderColor: "#400d18",
                        color: "#400d18",
                        fontWeight: "500",
                      }}
                      onClick={() =>
                        setActiveOrderId((prev) =>
                          prev === order._id ? null : order._id
                        )
                      }
                    >
                      <FaCog />
                    </button>

                    {activeOrderId === order._id && (
                      <div
                        className="shadow p-3 rounded border bg-white position-absolute"
                        style={{
                          top: "40px",
                          right: "0",
                          zIndex: 1050,
                          width: "180px",
                          boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
                        }}
                      >
                        {!order.isPaid && (
                          <button
                            className="btn btn-sm btn-outline-success mb-2 w-100"
                            onClick={() => handleMarkPaid(order._id)}
                          >
                            Mark as Paid
                          </button>
                        )}
                        {!order.isDelivered && (
                          <button
                            className="btn btn-sm btn-outline-primary w-100"
                            onClick={() => handleMarkDelivered(order._id)}
                          >
                            Mark as Delivered
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminOrdersPage;
