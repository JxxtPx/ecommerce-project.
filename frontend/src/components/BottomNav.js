import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaThList, FaUser, FaShoppingCart } from "react-icons/fa";

function BottomNav() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const activeColor = "#c97b84";
  const inactiveColor = "#6c757d";

  return (
    <nav
      className="d-md-none fixed-bottom bg-white border-top shadow-sm d-flex justify-content-around align-items-center"
      style={{ zIndex: 1030, height: "60px" }}
    >
      {/* Home */}
      <Link to="/" className="text-center text-decoration-none">
        <FaHome size={20} color={isActive("/") ? activeColor : inactiveColor} />
        <div style={{ fontSize: "12px", color: isActive("/") ? activeColor : inactiveColor }}>
          Home
        </div>
      </Link>

      {/* Categories */}
      <Link to="/categories" className="text-center text-decoration-none">
        <FaThList
          size={20}
          color={isActive("/categories") ? activeColor : inactiveColor}
        />
        <div
          style={{
            fontSize: "12px",
            color: isActive("/categories") ? activeColor : inactiveColor,
          }}
        >
          Categories
        </div>
      </Link>

      {/* Cart */}
      <Link to="/cart" className="text-center text-decoration-none">
        <FaShoppingCart
          size={20}
          color={isActive("/cart") ? activeColor : inactiveColor}
        />
        <div
          style={{
            fontSize: "12px",
            color: isActive("/cart") ? activeColor : inactiveColor,
          }}
        >
          Cart
        </div>
      </Link>

      {/* Profile (only if user is logged in) */}
      {user && (
        <Link to="/profile" className="text-center text-decoration-none">
          {user.profileImage ? (
            <img
              src={user.profileImage}
              alt="Profile"
              style={{
                width: "25px",
                height: "25px",
                borderRadius: "50%",
                objectFit: "cover",
                border: isActive("/profile") ? `2px solid ${activeColor}` : "none",
              }}
            />
          ) : (
            <FaUser
              size={20}
              color={isActive("/profile") ? activeColor : inactiveColor}
            />
          )}
          <div
            style={{
              fontSize: "12px",
              color: isActive("/profile") ? activeColor : inactiveColor,
            }}
          >
            Profile
          </div>
        </Link>
      )}
    </nav>
  );
}

export default BottomNav;
