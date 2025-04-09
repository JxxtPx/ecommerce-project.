import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaWineBottle,
  FaGlassWhiskey,
  FaCocktail,
  FaBeer,
  FaGlassMartiniAlt,
  FaGlassCheers,
  FaWineGlassAlt,
} from "react-icons/fa";

const categories = [
  { name: "Whiskey", icon: <FaGlassWhiskey size={28} /> },
  { name: "Vodka", icon: <FaGlassMartiniAlt size={28} /> },
  { name: "Rum", icon: <FaCocktail size={28} /> },
  { name: "Gin", icon: <FaGlassCheers size={28} /> },
  { name: "Beer", icon: <FaBeer size={28} /> },
  { name: "Wine", icon: <FaWineGlassAlt size={28} /> },
  { name: "Tequila", icon: <FaWineBottle size={28} /> },
  { name: "Brandy", icon: <FaGlassWhiskey size={28} /> },
  { name: "Other", icon: <FaGlassMartiniAlt size={28} /> },
];

function CategoriesPage() {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/?category=${category}`);
  };

  return (
    <div className="container py-4">
      <h4 className="fw-bold text-center mb-4" style={{ color: "#400d18" }}>
        🍾 Shop by Liquor Type
      </h4>

      <div className="row g-3">
        {categories.map((cat, i) => (
          <div key={i} className="col-4 col-sm-3 col-md-2 text-center">
            <div
              className="rounded-circle d-flex flex-column align-items-center justify-content-center mx-auto mb-2 shadow-sm"
              onClick={() => handleCategoryClick(cat.name)}
              style={{
                width: "70px",
                height: "70px",
                backgroundColor: "#fef2f4",
                border: "2px solid #c97b84",
                cursor: "pointer",
              }}
            >
              <div style={{ color: "#400d18" }}>{cat.icon}</div>
            </div>
            <div style={{ fontSize: "13px", color: "#400d18", fontWeight: 500 }}>
              {cat.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoriesPage;
