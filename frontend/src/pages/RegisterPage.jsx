import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import Loader from "../components/Loader";

import { FaUser, FaEnvelope, FaEye, FaLock, FaEyeSlash } from "react-icons/fa";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const role = email.includes("@ecom") ? "admin" : "customer";

    try {
      const { data } = await axiosInstance.post(
        "/auth/register",
        {
          name,
          email,
          password,
          role,
        }
      );

      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate(data.role === "admin" ? "/admin/dashboard" : "/");
    } catch (err) {
      setError("Registration failed. Email may already exist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}
    >
      <div
        className="shadow p-4 rounded"
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "#fef2f4",
          borderRadius: "12px",
        }}
      >
        <h3 className="text-center mb-3" style={{ color: "#400d18" }}>
          Create Account
        </h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3 input-group">
            <span className="input-group-text bg-white">
              <FaUser />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3 input-group">
            <span className="input-group-text bg-white">
              <FaEnvelope />
            </span>
            <input
              type="email"
              className="form-control"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label" style={{ color: "#400d18" }}>
              Password
            </label>
            <div className="input-group">
              <span className="input-group-text bg-white">
                <FaLock />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="input-group-text bg-white"
                style={{ cursor: "pointer" }}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="btn w-100 fw-semibold d-flex justify-content-center align-items-center"
            disabled={loading}
            style={{
              backgroundColor: "#c97b84",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
            }}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                />
                Signing Up...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className="text-center mt-3 small text-muted">
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#c97b84", fontWeight: "500" }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
