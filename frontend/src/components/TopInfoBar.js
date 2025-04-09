import React from "react";
import {
  FaMapMarkerAlt,
  FaSyncAlt,
  FaHeadphonesAlt,
  FaInfoCircle,
  FaPhoneAlt,
} from "react-icons/fa";
import "./TopInfoBar.css";
import { Link } from "react-router-dom";

const TopInfoBar = ({ onCategorySelect, categories }) => {
  return (
    <div className="liquor-topbar px-3 py-2 d-flex justify-content-between align-items-center flex-wrap">
      {/* Category Dropdown */}
      <div className="dropdown">
        <button
          className="btn dropdown-toggle liquor-dropdown-toggle fw-bold"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Browse Categories
        </button>
        <ul className="dropdown-menu shadow">
          {categories.map((cat) => (
            <li key={cat}>
              <button
                className="dropdown-item text-dark"
                onClick={() => onCategorySelect(cat)}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Quick Links */}
      <div className="d-flex flex-wrap gap-4 align-items-center liquor-topbar-links">
        <span>
          <FaMapMarkerAlt className="me-1" /> Track Order
        </span>
        <Link to="/support" className="text-decoration-none support-link">
          <span>
            <FaHeadphonesAlt className="me-1" /> Support
          </span>
        </Link>
        <span>
          <FaSyncAlt /> Compare
        </span>
        <span>
          <FaInfoCircle className="me-1" /> Help
        </span>
        <span className="fw-bold contact-number">
          <FaPhoneAlt className="me-1" /> +61 0415 125 670
        </span>
      </div>
    </div>
  );
};

export default TopInfoBar;
