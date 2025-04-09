import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance.js"; 
import ProductCard from "../components/ProductCard";
import { motion } from "framer-motion";
import Countdown from "react-countdown";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

import {
  FaBeer,
  FaWineGlassAlt,
  FaGlassWhiskey,
  FaGlassMartiniAlt,
  FaCocktail,
  FaWineBottle,
} from "react-icons/fa";

// Helper to read query string
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function HomePage() {
  const query = useQuery();
  const initialCategory = query.get("category") || "All";

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");

  const categories = [
    "All",
    "Whiskey",
    "Vodka",
    "Rum",
    "Gin",
    "Beer",
    "Wine",
    "Tequila",
    "Brandy",
    "Other",
  ];

  useEffect(() => {
    const fetchData = async () => {
      const res = await axiosInstance.get("/products");
      setProducts(res.data);
      filterProducts(initialCategory, searchTerm, sortOption, res.data);
    };
    fetchData();
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    filterProducts(category, searchTerm, sortOption, products);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterProducts(selectedCategory, value, sortOption, products);
  };

  const handleSort = (e) => {
    const value = e.target.value;
    setSortOption(value);
    filterProducts(selectedCategory, searchTerm, value, products);
  };

  const filterProducts = (
    category,
    search,
    sort,
    sourceProducts = products
  ) => {
    let filtered = [...sourceProducts];

    if (category !== "All") {
      filtered = filtered.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (search) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sort === "priceLow") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === "priceHigh") {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(filtered);
  };

  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh" }}>
      {/* Promo Banner */}
      <motion.div
        className="text-dark text-center py-2 mb-3"
        style={{ backgroundColor: "#eeeeee", fontWeight: 500 }}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        🥂 Flash Sale Ends in <Countdown date={Date.now() + 3600000} /> — Don't
        Miss Out!
      </motion.div>

      {/* Hero Section */}
      <motion.div
        className="text-white text-center p-5 mb-4 rounded"
        style={{ backgroundColor: "#400d18" }}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="display-4">Welcome to ReactMart Liquor</h1>
        <p className="lead">Top shelf deals delivered to your door.</p>
      </motion.div>

      {/* Category Icons */}
      <div className="container my-5">
        <div className="d-flex justify-content-center flex-wrap gap-3 my-2 ">
          {[
            { icon: <FaBeer size={24} />, label: "Beer" },
            { icon: <FaWineGlassAlt size={24} />, label: "Wine" },
            { icon: <FaGlassWhiskey size={24} />, label: "Whiskey" },
            { icon: <FaGlassMartiniAlt size={24} />, label: "Vodka" },
            { icon: <FaCocktail size={24} />, label: "Rum" },
            { icon: <FaWineBottle size={24} />, label: "All" },
          ].map((item) => (
            <button
              key={item.label}
              className="btn d-flex flex-column align-items-center mx-4"
              style={{
                backgroundColor:
                  selectedCategory === item.label ? "#c97b84" : "transparent",
                color: selectedCategory === item.label ? "#fff" : "#400d18",
                border: "2px solid #c97b84",
                borderRadius: "10px",
                width: "70px",
                height: "70px",
                justifyContent: "center",
              }}
              onClick={() => handleCategoryChange(item.label)}
              title={item.label}
            >
              {item.icon}
              <small style={{ fontSize: "0.75rem", marginTop: "4px" }}>
                {item.label}
              </small>
            </button>
          ))}
        </div>
      </div>

      <div className="container mb-3 d-none d-md-flex justify-content-end">
        <Link
          to="/cocktail"
          className="btn"
          style={{
            backgroundColor: "#c97b84",
            color: "#fff",
            fontWeight: "500",
            borderRadius: "8px",
          }}
        >
          🍹 Cocktail Suggestion
        </Link>
      </div>

      {/* Search + Sort */}
      <div className="container d-flex flex-wrap justify-content-between align-items-center mt-4 mb-4">
        <input
          type="text"
          placeholder="Search products..."
          className="form-control w-50 me-2"
          value={searchTerm}
          onChange={handleSearch}
          style={{
            border: "1px solid #c97b84",
            backgroundColor: "#fff",
            color: "#400d18",
          }}
        />
        <select
          className="form-select w-auto"
          value={sortOption}
          onChange={handleSort}
          style={{
            border: "1px solid #c97b84",
            backgroundColor: "#fff",
            color: "#400d18",
          }}
        >
          <option value="">Sort by</option>
          <option value="priceLow">Price: Low to High</option>
          <option value="priceHigh">Price: High to Low</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className="container mb-5">
        {filteredProducts.length === 0 ? (
          <p className="text-center">No products found.</p>
        ) : (
          <div className="row g-4">
            {filteredProducts.map((product) => (
              <div
                className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex"
                key={product._id}
              >
                <motion.div
                  className="w-100 h-100"
                  whileHover={{ scale: 1.03 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="d-md-none">
  <Link
    to="/cocktail"
    className="btn"
    style={{
      position: "fixed",
      bottom: "70px",
      right: "20px",
      zIndex: 999,
      backgroundColor: "#c97b84",
      color: "#fff",
      fontWeight: "500",
      borderRadius: "50%",
      width: "55px",
      height: "55px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    }}
    title="Cocktail AI"
  >
    🍹
  </Link>
</div>

    </div>
  );
}

export default HomePage;
