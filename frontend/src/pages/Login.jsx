import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance"; 
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await axiosInstance.post(
        "/auth/login",
        {
          email,
          password,
        }
      );
      localStorage.setItem("userInfo", JSON.stringify(data));
      if (data.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError("Invalid email or password");
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
        <h4 className="text-center fw-bold mb-2" style={{ color: "#400d18" }}>
          Welcome Back
        </h4>
        <p className="text-center text-muted mb-4">Please enter your details</p>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label" style={{ color: "#400d18" }}>
              Email Address
            </label>
            <div className="input-group">
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
            className="btn w-100 fw-semibold"
            style={{
              backgroundColor: "#c97b84",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
            }}
          >
            Continue
          </button>
        </form>

        <p className="text-center small text-muted mt-3">
          No account?{" "}
          <Link to="/register" style={{ color: "#c97b84", fontWeight: "500" }}>
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
