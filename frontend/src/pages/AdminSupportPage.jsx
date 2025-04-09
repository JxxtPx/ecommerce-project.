import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AdminSupportPage() {
  const [queries, setQueries] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [replyModal, setReplyModal] = useState(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    fetchQueries();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [search, statusFilter, queries]);

  const fetchQueries = async () => {
    try {
      const { token } = JSON.parse(localStorage.getItem("userInfo"));
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axiosInstance.get("/support/admin", config);
      setQueries(data);
    } catch (err) {
      toast.error("Failed to fetch queries");
    }
  };

  const applyFilters = () => {
    let results = [...queries];
    if (search) {
      results = results.filter((q) =>
        `${q.subject} ${q.message} ${q.user?.name || ""} ${q.user?.email || ""}`
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }
    if (statusFilter) {
      results = results.filter((q) => q.status === statusFilter);
    }
    setFiltered(results);
  };
  

  const handleReplySubmit = async () => {
    try {
      const { token } = JSON.parse(localStorage.getItem("userInfo"));
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axiosInstance.put(
        `/support/admin/${replyModal._id}/reply`,
        { adminReply: replyText },
        config
      );
      toast.success("Reply sent ✅");
      setQueries((prev) => prev.map((q) => (q._id === data.query._id ? data.query : q)));
      setReplyModal(null);
      setReplyText("");
    } catch (err) {
      toast.error("Failed to send reply");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const { token } = JSON.parse(localStorage.getItem("userInfo"));
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axiosInstance.put(
        `/support/admin/${id}/status`,
        { status: newStatus },
        config
      );
      toast.success("Status updated");
      setQueries((prev) => prev.map((q) => (q._id === data.query._id ? data.query : q)));
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const statusBadge = (status) => {
    const map = {
      open: "#f4c430",
      replied: "#0dcaf0",
      closed: "#6c757d",
    };
    const textColor = status === "open" ? "#000" : "#fff";
    return (
      <span className="badge" style={{ backgroundColor: map[status], color: textColor }}>
        {status}
      </span>
    );
  };

  return (
    <div className="container mt-5 mb-5">
      <h2 className="mb-4 fw-bold" style={{ color: "#400d18" }}>
        📩 Admin Support Center
      </h2>

      <div className="row mb-3 g-2">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search by subject, user, message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ borderColor: "#c97b84" }}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ borderColor: "#c97b84" }}
          >
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="replied">Replied</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Table for desktop */}
      <div className="table-responsive d-none d-md-block">
        <table className="table table-hover align-middle border rounded overflow-hidden">
          <thead style={{ backgroundColor: "#400d18", color: "#fff" }}>
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Status</th>
              <th>Reply</th>
              <th>Order</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center text-muted">No queries found.</td>
              </tr>
            ) : (
              filtered.map((q, idx) => (
                <tr key={q._id}>
                  <td>{idx + 1}</td>
                  <td>
                    <strong>{q.user?.name}</strong><br />
                    <small>{q.user?.email}</small>
                  </td>
                  <td>{q.subject}</td>
                  <td>{q.message}</td>
                  <td>{statusBadge(q.status)}</td>
                  <td>{q.adminReply || <em className="text-muted">No reply</em>}</td>
                  <td>{q.order ? `$${q.order.totalPrice}` : "-"}</td>
                  <td>{new Date(q.createdAt).toLocaleDateString()}</td>
                  <td className="d-flex gap-2 flex-column">
                    <button
                      className="btn btn-sm"
                      style={{ backgroundColor: "#c97b84", color: "#fff" }}
                      onClick={() => {
                        setReplyModal(q);
                        setReplyText(q.adminReply || "");
                      }}
                    >
                      Reply
                    </button>
                    <select
                      className="form-select form-select-sm"
                      value={q.status}
                      onChange={(e) => handleStatusChange(q._id, e.target.value)}
                    >
                      <option value="open">Open</option>
                      <option value="replied">Replied</option>
                      <option value="closed">Closed</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="d-md-none">
        {filtered.length === 0 ? (
          <div className="alert alert-info">No queries found.</div>
        ) : (
          filtered.map((q, idx) => (
            <div className="card mb-3 shadow-sm" key={q._id}>
              <div className="card-body">
                <h6 className="fw-bold">{q.subject}</h6>
                <p className="mb-1"><strong>User:</strong> {q.user?.name}</p>
                <p className="mb-1"><strong>Email:</strong> {q.user?.email}</p>
                <p className="mb-1"><strong>Message:</strong> {q.message}</p>
                <p className="mb-1"><strong>Status:</strong> {statusBadge(q.status)}</p>
                <p className="mb-1"><strong>Order:</strong> {q.order ? `$${q.order.totalPrice}` : "-"}</p>
                <p className="mb-1"><strong>Date:</strong> {new Date(q.createdAt).toLocaleDateString()}</p>
                <p className="mb-1"><strong>Reply:</strong> {q.adminReply || <em className="text-muted">No reply</em>}</p>

                <button
                  className="btn btn-sm mt-2 w-100"
                  style={{ backgroundColor: "#c97b84", color: "#fff" }}
                  onClick={() => {
                    setReplyModal(q);
                    setReplyText(q.adminReply || "");
                  }}
                >
                  Reply
                </button>

                <select
                  className="form-select form-select-sm mt-2"
                  value={q.status}
                  onChange={(e) => handleStatusChange(q._id, e.target.value)}
                >
                  <option value="open">Open</option>
                  <option value="replied">Replied</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reply Modal */}
      {replyModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ backgroundColor: "rgba(0,0,0,0.4)", zIndex: 999 }}
        >
          <div className="bg-white p-4 rounded shadow" style={{ width: "90%", maxWidth: "500px" }}>
            <h5 className="mb-3" style={{ color: "#400d18" }}>Reply to Query</h5>
            <p><strong>Subject:</strong> {replyModal.subject}</p>
            <p><strong>Message:</strong> {replyModal.message}</p>

            <textarea
              className="form-control mb-3"
              rows={4}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              style={{ borderColor: "#c97b84" }}
            />

            <div className="d-flex justify-content-end gap-2">
              <button className="btn btn-secondary" onClick={() => setReplyModal(null)}>
                Cancel
              </button>
              <button className="btn" style={{ backgroundColor: "#c97b84", color: "#fff" }} onClick={handleReplySubmit}>
                Send Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminSupportPage;
