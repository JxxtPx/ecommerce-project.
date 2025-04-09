import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const [activeIndex, setActiveIndex] = useState(null);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  const logoLink = user?.role === "admin" ? "/admin/dashboard" : "/";

  const handleClick = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
    collapseNavbar();
  };

  const collapseNavbar = () => {
    const navbar = document.getElementById("navbarNav");
    if (navbar && navbar.classList.contains("show")) {
      const bsCollapse = new window.bootstrap.Collapse(navbar, {
        toggle: false,
      });
      bsCollapse.hide();
    }
  };

  const navStyle = {
    backgroundColor: "#2a0e15",
    color: "#fef2f4",
    fontWeight: 500,
    borderBottom: "1px solid #4f1a23",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
  };

  const navLinkStyle = {
    color: "#fef2f4",
    padding: "8px 16px",
    borderRadius: "10px",
    textDecoration: "none",
    fontSize: "16px",
    transition: "all 0.3s ease",
    display: "block",
  };

  const navLinkHover = {
    backgroundColor: "#c97b8422",
    color: "#c97b84",
    boxShadow: "0 0 5px #c97b8455",
  };

  const renderItem = (text, path, index) => (
    <li key={index} className="nav-item my-1" onClick={() => handleClick(index)}>
      <Link
        to={path}
        className="nav-link"
        style={{
          ...navLinkStyle,
          ...(activeIndex === index ? navLinkHover : {}),
        }}
      >
        {text}
      </Link>
    </li>
  );

  return (
    <nav className="navbar navbar-expand-lg px-3" style={navStyle}>
      <div className="container-fluid">
        <Link
          className="navbar-brand d-flex align-items-center"
          to={logoLink}
          style={{ color: "#c97b84", fontWeight: "600", fontSize: "20px" }}
        >
          <img
            src="/logo.png"
            alt="ReactMart"
            style={{ height: "36px", marginRight: "10px" }}
          />
          ReactMart
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" style={{ filter: "invert(1)" }}></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav text-center d-flex flex-column flex-lg-row align-items-lg-center gap-lg-2">
            {!user ? (
              <>
                {renderItem("Login", "/login", 0)}
                {renderItem("Signup", "/register", 1)}
              </>
            ) : user.role === "customer" ? (
              <>
                {renderItem(
                  user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt="Profile"
                      style={{
                        width: "32px",
                        height: "32px",
                        objectFit: "cover",
                        borderRadius: "50%",
                        border: "2px solid #c97b84",
                      }}
                    />
                  ) : (
                    <i className="fa-solid fa-user"></i>
                  ),
                  "/profile",
                  3
                )}
                {renderItem("Cart", "/cart", 2)}
                {renderItem("Support", "/support", 5)}
                <li className="nav-item my-1">
                  <button
                    onClick={handleLogout}
                    className="btn w-100 w-lg-auto"
                    style={{
                      borderRadius: "8px",
                      padding: "6px 14px",
                      border: "1px solid #c97b84",
                      backgroundColor: "transparent",
                      color: "#fef2f4",
                      transition: "all 0.3s",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#c97b8422";
                      e.target.style.color = "#c97b84";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "transparent";
                      e.target.style.color = "#fef2f4";
                    }}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                {renderItem("Support", "/admin/support", 5)}
                {renderItem("Dashboard", "/admin/dashboard", 4)}
                <li className="nav-item my-1">
                  <button
                    onClick={handleLogout}
                    className="btn w-100 w-lg-auto"
                    style={{
                      borderRadius: "8px",
                      padding: "6px 14px",
                      border: "1px solid #c97b84",
                      backgroundColor: "transparent",
                      color: "#fef2f4",
                      transition: "all 0.3s",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#c97b8422";
                      e.target.style.color = "#c97b84";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "transparent";
                      e.target.style.color = "#fef2f4";
                    }}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
