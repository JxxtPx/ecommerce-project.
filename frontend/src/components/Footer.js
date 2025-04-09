import React from "react";

function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#400d18",
        color: "#fef2f4",
        padding: "2rem 0",
        marginTop: "5rem",
      }}
    >
      <div className="container text-center">
        <h5 className="mb-3" style={{ color: "#c97b84", fontWeight: "600" }}>
          ReactMart
        </h5>
        <p className="mb-3">
          Your one-stop modern marketplace. Smooth, secure, and made with real
          passion.
        </p>

        <div className="d-flex justify-content-center gap-4 mb-3">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="fs-5"
            style={{
              color: "#fef2f4",
              transition: "color 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.color = "#c97b84")}
            onMouseLeave={(e) => (e.target.style.color = "#fef2f4")}
          >
            <i className="fa-brands fa-instagram"></i>
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            className="fs-5"
            style={{
              color: "#fef2f4",
              transition: "color 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.color = "#c97b84")}
            onMouseLeave={(e) => (e.target.style.color = "#fef2f4")}
          >
            <i className="fa-brands fa-facebook"></i>
          </a>
          <a
            href="https://x.com"
            target="_blank"
            rel="noreferrer"
            className="fs-5"
            style={{
              color: "#fef2f4",
              transition: "color 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.color = "#c97b84")}
            onMouseLeave={(e) => (e.target.style.color = "#fef2f4")}
          >
            <i className="fa-brands fa-x-twitter"></i>
          </a>
        </div>

        <p className="small mb-1" style={{ color: "#e2cfd1" }}>
          © {new Date().getFullYear()}{" "}
          <strong style={{ color: "#c97b84" }}>ReactMart</strong> | Created
          with ☕, bugs, and struggle by{" "}
          <strong style={{ color: "#c97b84" }}>Jeet #me</strong>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
