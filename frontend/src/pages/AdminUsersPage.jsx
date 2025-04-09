import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      const { data } = await axiosInstance.get("/admin/users", config);
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const confirmDelete = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      await axiosInstance.delete(`/admin/users/${selectedUser._id}`, config);
      fetchUsers();
      setShowModal(false);
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  return (
    <div className="container mt-5" style={{ backgroundColor: "#fef2f4", borderRadius: "10px", padding: "20px" }}>
      <h2 className="mb-4 fw-bold text-center" style={{ color: "#400d18" }}>
        👥 Manage Users
      </h2>
      <div className="table-responsive">
        <table className="table align-middle table-bordered shadow-sm">
          <thead style={{ backgroundColor: "#400d18", color: "#fff" }}>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th style={{ width: "120px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span
                      className="badge"
                      style={{
                        backgroundColor: user.role === "admin" ? "#c97b84" : "#ccc",
                        color: user.role === "admin" ? "#fff" : "#000",
                        padding: "6px 12px",
                        borderRadius: "20px",
                      }}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm"
                      style={{
                        backgroundColor: "#c97b84",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                      }}
                      onClick={() => confirmDelete(user)}
                    >
                      <i className="fa-solid fa-trash-can me-1"></i> Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: "#fef2f4" }}>
          <Modal.Title style={{ color: "#400d18" }}>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{selectedUser?.name}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            style={{ backgroundColor: "#c97b84", border: "none" }}
            onClick={handleConfirmDelete}
          >
            Yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AdminUsersPage;
