import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import { FaInfoCircle } from "react-icons/fa"; // At the top

function CocktailPage() {
  const [ingredients, setIngredients] = useState("");
  const [cocktail, setCocktail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showExample, setShowExample] = useState(false);


  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!ingredients.trim()) return toast.warn("Please enter ingredients");

    try {
      setLoading(true);
      setCocktail(null);

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axiosInstance.post(
        "/ai/cocktail",
        { ingredients },
        config
      );

      setCocktail(data.cocktail);
    } catch (err) {
      toast.error("Failed to generate cocktail");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <h3 style={{ color: "#400d18" }} className="mb-4">
        🍹 AI Cocktail Generator
      </h3>

      <form onSubmit={handleGenerate} className="mb-4">
        <label className="form-label fw-semibold" style={{ color: "#400d18" }}>
          Enter ingredients you have (comma separated):
        </label>

        <div className="input-group mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="e.g., vodka, lime, cranberry"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            style={{ borderColor: "#c97b84" }}
          />
          <span
            className="input-group-text bg-white"
            style={{ cursor: "pointer", borderColor: "#c97b84" }}
            onClick={() => setShowExample((prev) => !prev)}
          >
            <FaInfoCircle style={{ color: "#c97b84" }} />
          </span>
        </div>

        {showExample && (
          <div className="text-muted small mb-3" style={{ color: "#400d18" }}>
            Example: <em>vodka, lime, cranberry juice, sugar</em>
          </div>
        )}

        <button
          type="submit"
          className="btn fw-bold"
          style={{ backgroundColor: "#c97b84", color: "#fff" }}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Cocktail"}
        </button>
      </form>

      {cocktail && (
        <div
          className="p-4 bg-light rounded shadow-sm border"
          style={{ whiteSpace: "pre-wrap", color: "#400d18" }}
        >
          {cocktail}
        </div>
      )}
    </div>
  );
}

export default CocktailPage;
