import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance"; 
import { toast, ToastContainer } from "react-toastify";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import Loader from "../components/Loader";
import "react-toastify/dist/ReactToastify.css";

function SupportPage() {
  const [queries, setQueries] = useState([]);
  const [filteredQueries, setFilteredQueries] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [order, setOrder] = useState("");
  const [showQueries, setShowQueries] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    if (!userInfo || !userInfo.token) {
      toast.error("User not logged in.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

        const [queriesRes, ordersRes] = await Promise.all([
          axiosInstance.get("/support/mine", config),
          axiosInstance.get("/orders/myorders", config),
        ]);

        setQueries(queriesRes.data || []);
        setOrders(ordersRes.data || []);
      } catch (err) {
        console.error("❌ Error fetching support data:", err);
        toast.error("Failed to load support data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (filterStatus === "all") {
      setFilteredQueries(queries);
    } else {
      setFilteredQueries(queries.filter((q) => q.status === filterStatus));
    }
  }, [filterStatus, queries]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject || !message) {
      toast.warn("Subject and message are required.");
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axiosInstance.post(
        "/support",
        { subject, message, order },
        config
      );
      setQueries([data.query, ...queries]);
      setSubject("");
      setMessage("");
      setOrder("");
      toast.success("Support query submitted successfully!");
    } catch (err) {
      toast.error("Failed to submit query.");
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <ToastContainer position="top-right" autoClose={3000} />

      <h2 className="mb-4" style={{ color: "#400d18" }}>
        <i className="fa-regular fa-envelope me-2"></i>Contact Support
      </h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="border p-4 rounded shadow-sm mb-5"
        style={{ backgroundColor: "#fef2f4" }}
      >
        <div className="mb-3">
          <label className="form-label fw-bold" style={{ color: "#400d18" }}>
            Subject *
          </label>
          <input
            type="text"
            className="form-control"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            placeholder="Issue subject..."
            style={{ borderColor: "#c97b84" }}
          />
        </div>
        <div className="mb-3">
          <label className="form-label fw-bold" style={{ color: "#400d18" }}>
            Message *
          </label>
          <textarea
            className="form-control"
            rows="4"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            placeholder="Describe your issue..."
            style={{ borderColor: "#c97b84" }}
          ></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label fw-bold" style={{ color: "#400d18" }}>
            Order (optional)
          </label>
          <select
            className="form-select"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            style={{ borderColor: "#c97b84" }}
          >
            <option value="">-- Select an Order --</option>
            {orders.map((o) => (
              <option key={o._id} value={o._id}>
                #{o._id.slice(-6)} – ${o.totalPrice.toFixed(2)}
              </option>
            ))}
          </select>
        </div>
        <button
          className="btn w-100 fw-semibold"
          type="submit"
          style={{
            backgroundColor: "#c97b84",
            border: "none",
            color: "#fff",
            borderRadius: "8px",
          }}
        >
          <i className="fa-solid fa-paper-plane me-2"></i>Send Query
        </button>
      </form>

      {/* Toggle */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0" style={{ color: "#400d18" }}>
          Previous Queries
        </h4>
        {queries.length > 0 && (
          <button
            className="btn btn-sm"
            style={{
              border: "1px solid #c97b84",
              backgroundColor: showQueries ? "#c97b84" : "transparent",
              color: showQueries ? "#fff" : "#c97b84",
              borderRadius: "8px",
            }}
            onClick={() => setShowQueries(!showQueries)}
          >
            {showQueries ? "Hide Queries" : "View All Queries"}
          </button>
        )}
      </div>

      {/* Display */}
      {showQueries && (
        <>
          {/* Filter */}
          <div className="mb-3">
            <label className="form-label fw-bold" style={{ color: "#400d18" }}>
              Filter by Status
            </label>
            <select
              className="form-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ borderColor: "#c97b84" }}
            >
              <option value="all">All</option>
              <option value="open">Open</option>
              <option value="replied">Replied</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {loading ? (
            <Loader />
          ) : !filteredQueries || filteredQueries.length === 0 ? (
            <div className="alert alert-info">
              You haven't submitted any queries yet.
            </div>
          ) : (
            <div className="row">
              {filteredQueries.map((q) => (
                <div className="col-md-6 mb-4" key={q._id}>
                  <div
                    className="card border-0 shadow-sm h-100"
                    style={{ backgroundColor: "#ffffff", borderRadius: "12px" }}
                  >
                    <div className="card-body">
                      <h5 className="card-title" style={{ color: "#400d18" }}>
                        <i className="fa-solid fa-circle-question me-2"></i>
                        {q.subject}
                      </h5>
                      <p className="mb-1 text-muted">
                        <i className="fa-regular fa-clock me-1"></i>
                        {new Date(q.createdAt).toLocaleString()}
                      </p>
                      <p className="mb-2">
                        <strong>Message:</strong> {q.message}
                      </p>
                      {q.order && (
                        <p className="mb-2">
                          <strong>Order:</strong> #{q.order.slice(-6)}
                        </p>
                      )}
                      <span
                        className="badge"
                        style={{
                          backgroundColor:
                            q.status === "open"
                              ? "#f4c430"
                              : q.status === "replied"
                              ? "#17a2b8"
                              : "#6c757d",
                          color: q.status === "open" ? "#000" : "#fff",
                        }}
                      >
                        {q.status.toUpperCase()}
                      </span>

                      {q.adminReply && (
                        <div className="alert alert-success mt-3 mb-0">
                          <FaCheckCircle className="me-2" />
                          <strong>Admin Reply:</strong> {q.adminReply}
                        </div>
                      )}

                      {!q.adminReply && q.status === "closed" && (
                        <div className="alert alert-danger mt-3 mb-0">
                          <FaTimesCircle className="me-2" />
                          <strong>Closed:</strong> This query was closed without reply.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SupportPage;
