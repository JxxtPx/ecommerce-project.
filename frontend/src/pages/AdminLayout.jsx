import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaUsers,
  FaClipboardList,
  FaStar,
  FaEnvelopeOpenText,
  FaChartBar
} from "react-icons/fa";

const sidebarLinks = [
  { label: "Dashboard", icon: <FaTachometerAlt />, to: "/admin/dashboard" },
  { label: "Products", icon: <FaBoxOpen />, to: "/admin/products" },
  { label: "Orders", icon: <FaClipboardList />, to: "/admin/orders" },
  { label: "Users", icon: <FaUsers />, to: "/admin/users" },
  { label: "Reviews", icon: <FaStar />, to: "/admin/reviews" },
  { label: "Support", icon: <FaEnvelopeOpenText />, to: "/admin/support" },
  { label: "Analytics", icon: <FaChartBar />, to: "/admin/analytics" }

];

function AdminLayout() {
  const location = useLocation();

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "240px",
          backgroundColor: "#400d18",
          color: "#fef2f4",
          padding: "20px 15px",
          position: "sticky",
          top: 0,
          height: "100vh",
        }}
        className="d-none d-md-block"
      >
        <h4 className="fw-bold text-center mb-4" style={{ color: "#c97b84" }}>
          Admin Panel
        </h4>

        <ul className="nav flex-column">
          {sidebarLinks.map((link, index) => {
            const isActive = location.pathname === link.to;
            return (
              <li className="nav-item mb-2" key={index}>
                <Link
                  to={link.to}
                  className={`nav-link d-flex align-items-center gap-2 px-3 py-2 rounded ${
                    isActive ? "bg-white text-dark" : "text-light"
                  }`}
                  style={{
                    fontWeight: "500",
                    textDecoration: "none",
                    transition: "0.2s",
                  }}
                >
                  {link.icon} {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Main content */}
      <div className="flex-grow-1 p-4" style={{ backgroundColor: "#fef2f4" }}>
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
