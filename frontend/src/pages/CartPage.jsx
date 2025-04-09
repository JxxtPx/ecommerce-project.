import React, { useEffect, useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";

function CartPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(items);
  }, []);

  const updateQty = (id, change) => {
    const updatedCart = cartItems.map((item) => {
      if (item._id === id) {
        const newQty = item.qty + change;
        if (newQty > 0 && newQty <= item.countInStock) {
          return { ...item, qty: newQty };
        }
      }
      return item;
    });
    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  };

  const removeFromCart = (id) => {
    const updated = cartItems.filter((item) => item._id !== id);
    setCartItems(updated);
    localStorage.setItem("cartItems", JSON.stringify(updated));
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        minHeight: "100vh",
        padding: "3rem 0",
      }}
    >
      <div className="container">
        <h2
          className="text-uppercase fw-bold mb-4 d-flex align-items-center"
          style={{
            fontSize: "2rem",
            borderBottom: "3px solid #400d18",
            paddingBottom: "0.5rem",
            letterSpacing: "1px",
            color: "#400d18",
          }}
        >
          <i
            className="fa-solid fa-cart-shopping me-3"
            style={{ fontSize: "1.8rem", color: "#c97b84" }}
          ></i>
          Shopping Cart
        </h2>

        {cartItems.length === 0 ? (
          <div className="text-center">
            <p>Your cart is empty.</p>
            <Link
              to="/"
              className="btn"
              style={{
                
                backgroundColor: "#c97b84",
                color: "#fff",
                borderRadius: "8px",
              }}
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="row">
            <div className="col-lg-8">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="d-flex justify-content-between align-items-center border rounded bg-white p-3 mb-3 shadow-sm"
                >
                  <div className="d-flex align-items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "contain",
                      }}
                      className="border rounded"
                    />
                    <div>
                      <h6 className="fw-semibold mb-1">{item.name}</h6>
                      <p className="text-muted mb-1">${item.price}</p>
                      <div className="d-flex align-items-center">
                        <button
                          className="btn btn-sm me-2"
                          style={{
                            border: "1px solid #c97b84",
                            color: "#c97b84",
                            backgroundColor: "transparent",
                          }}
                          onClick={() => updateQty(item._id, -1)}
                        >
                          <FaMinus />
                        </button>
                        <span className="mx-2">{item.qty}</span>
                        <button
                          className="btn btn-sm"
                          style={{
                            border: "1px solid #c97b84",
                            color: "#c97b84",
                            backgroundColor: "transparent",
                          }}
                          onClick={() => updateQty(item._id, 1)}
                        >
                          <FaPlus />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex flex-column align-items-end">
                    <button
                      className="btn btn-sm mb-2"
                      style={{
                        border: "1px solid #c97b84",
                        color: "#c97b84",
                        backgroundColor: "transparent",
                      }}
                      onClick={() => removeFromCart(item._id)}
                    >
                      <FaTrash className="me-1" /> Remove
                    </button>
                    <strong style={{ color: "#400d18" }}>
                      ${(item.price * item.qty).toFixed(2)}
                    </strong>
                  </div>
                </div>
              ))}
            </div>

            <div className="col-lg-4">
              <div
                className="card shadow-sm border-0"
                style={{ backgroundColor: "#fef2f4" }}
              >
                <div className="card-body">
                  <h5 className="card-title" style={{ color: "#400d18" }}>
                    Order Summary
                  </h5>
                  <p className="card-text d-flex justify-content-between">
                    <span>Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </p>
                  <p className="card-text d-flex justify-content-between">
                    <span>Tax</span>
                    <span>$0.00</span>
                  </p>
                  <hr />
                  <h6 className="d-flex justify-content-between">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </h6>
                  <button
                    className="btn w-100 mt-3"
                    style={{
                      backgroundColor: "#c97b84",
                      color: "#fff",
                      border: "none",
                    }}
                    onClick={() => navigate("/shipping")}
                  >
                    Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartPage;
