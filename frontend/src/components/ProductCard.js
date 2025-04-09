import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsHeart, BsHeartFill, BsStarFill } from "react-icons/bs";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance";

function ProductCard({ product }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const avgRating = product.rating || 0;
  const navigate = useNavigate();

  useEffect(() => {
    const checkWishlist = async () => {
      if (userInfo) {
        try {
          const { data } = await axiosInstance.get("/wishlist", {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          });
          const inWishlist = data.some((item) => item._id === product._id);
          setIsWishlisted(inWishlist);
        } catch (err) {
          console.error("Wishlist fetch error");
        }
      }
    };
    checkWishlist();
  }, [userInfo, product._id]);

  const handleAddToCart = () => {
    let cart = JSON.parse(localStorage.getItem("cartItems")) || [];
    const existing = cart.find((item) => item._id === product._id);

    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        qty: 1,
        countInStock: product.countInStock,
      });
    }

    localStorage.setItem("cartItems", JSON.stringify(cart));
    toast.success("Added to cart!");
  };

  const toggleWishlist = async () => {
    if (!userInfo) {
      toast.error("Please log in to manage wishlist");
      return;
    }

    try {
      if (isWishlisted) {
        await axiosInstance.delete(`/wishlist/remove/${product._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setIsWishlisted(false);
        toast.info("Removed from wishlist");
      } else {
        await axiosInstance.post(
          "/wishlist/add",
          { productId: product._id },
          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
        setIsWishlisted(true);
        toast.success("Added to wishlist!");
      }
    } catch (err) {
      toast.error("Wishlist action failed");
    }
  };

  const handleCompare = () => {
    navigate("/compare", {
      state: {
        fromProduct: {
          name: product.name,
          description: product.description || "No description available",
        },
      },
    });
  };

  return (
    <div
      className="card position-relative shadow-sm border-0 h-100 d-flex flex-column"
      style={{
        backgroundColor: "#ffffff",
        color: "#400d18",
        borderRadius: "12px",
      }}
    >
      {/* Rating */}
      <div className="position-absolute top-0 end-0 mt-2 me-2 bg-white px-2 py-1 rounded d-flex align-items-center shadow-sm">
        {[...Array(Math.floor(avgRating))].map((_, i) => (
          <BsStarFill key={i} className="text-warning me-1" style={{ fontSize: "12px" }} />
        ))}
        <span style={{ fontSize: "12px", color: "#333" }}>({avgRating})</span>
      </div>

      {/* Image */}
      <Link to={`/product/${product._id}`}>
        <img
          src={product.image}
          alt={product.name}
          className="img-fluid p-3 mt-4"
          style={{
            height: "160px",
            objectFit: "contain",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
          }}
        />
      </Link>

      {/* Details */}
      <div className="card-body text-center d-flex flex-column">
        <h6 className="fw-bold text-uppercase text-truncate">{product.name}</h6>
        <p className="text-muted small">{product.category || "Alcohol"}</p>
        <h5 style={{ color: "#c97b84" }}>${product.price.toFixed(2)}</h5>
        <p className="text-muted small">{product.volume || "750ML"}</p>

        {/* Buttons */}
        <div className="mt-auto d-flex flex-column gap-2">
          <Link
            to={`/product/${product._id}`}
            className="btn btn-sm fw-bold"
            style={{
              backgroundColor: "#c97b84",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
            }}
          >
            View Product
          </Link>

          <button
            onClick={handleCompare}
            className="btn btn-sm fw-bold"
            style={{
              backgroundColor: "transparent",
              color: "#c97b84",
              border: "1px solid #c97b84",
              borderRadius: "6px",
            }}
          >
            Compare
          </button>

          <div className="d-flex justify-content-center gap-2">
            <button
              className="btn btn-sm w-50"
              onClick={handleAddToCart}
              style={{
                border: "1px solid #c97b84",
                color: "#c97b84",
                backgroundColor: "transparent",
                fontWeight: "500",
                borderRadius: "6px",
              }}
            >
              Add to Cart
            </button>

            <button
              className="btn btn-sm"
              onClick={toggleWishlist}
              style={{
                border: "1px solid #c97b84",
                backgroundColor: "transparent",
                color: isWishlisted ? "red" : "#c97b84",
                borderRadius: "6px",
              }}
            >
              {isWishlisted ? <BsHeartFill color="red" /> : <BsHeart />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
