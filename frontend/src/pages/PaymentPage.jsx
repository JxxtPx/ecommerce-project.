import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaMoneyBillWave } from "react-icons/fa";
import { motion } from "framer-motion";

function PaymentPage() {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");

  useEffect(() => {
    const saved = localStorage.getItem("paymentMethod");
    if (saved) {
      setPaymentMethod(saved);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("paymentMethod", paymentMethod);
    navigate("/placeorder");
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          <motion.h4
            className="mb-4 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            style={{ color: "#400d18" }}
          >
            💸 How Would You Like to Pay?
          </motion.h4>

          <form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
            {/* Cash on Delivery - Styled Card */}
            <motion.div
              className={`payment-method p-3 mt-4 rounded shadow-sm border ${
                paymentMethod === "Cash on Delivery" ? "selected" : ""
              }`}
              whileHover={{ scale: 1.02 }}
              style={{
                backgroundColor:
                  paymentMethod === "Cash on Delivery" ? "#fef2f4" : "#fff",
                border: `2px solid ${
                  paymentMethod === "Cash on Delivery" ? "#c97b84" : "#ddd"
                }`,
                cursor: "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
              onClick={() => setPaymentMethod("Cash on Delivery")}
            >
              <FaMoneyBillWave
                size={28}
                style={{
                  color:
                    paymentMethod === "Cash on Delivery" ? "#c97b84" : "#999",
                  flexShrink: 0,
                }}
              />
              <div>
                <h6
                  className="mb-1"
                  style={{ color: "#400d18", fontWeight: "600" }}
                >
                  Pay with Cash
                </h6>
                <small className="text-muted">
                  Pay when your order arrives at your doorstep.
                </small>
              </div>
              <input
                type="radio"
                name="payment"
                value="Cash on Delivery"
                checked={paymentMethod === "Cash on Delivery"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="d-none"
              />
            </motion.div>

            {/* Stripe Card - Credit Card Style */}
            {/* Stripe Card - Flip Design with SVGs */}
            <motion.div
              className="stripe-card-wrapper mt-4 rounded shadow-sm"
              whileHover={{ scale: 1.02 }}
              onClick={() => setPaymentMethod("Stripe")}
              style={{
                cursor: "pointer",
                border: `2px solid ${
                  paymentMethod === "Stripe" ? "#c97b84" : "#ddd"
                }`,
                backgroundColor:
                  paymentMethod === "Stripe" ? "#fef2f4" : "#fff",
                perspective: "1000px",
                height: "180px",
                position: "relative",
              }}
            >
              <motion.div
                className="stripe-card-inner"
                animate={{
                  rotateY: paymentMethod === "Stripe" ? 180 : 0,
                }}
                transition={{ duration: 0.6 }}
                style={{
                  width: "100%",
                  height: "100%",
                  position: "relative",
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Front of the card */}
                <div
                  style={{
                    backfaceVisibility: "hidden",
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    borderRadius: "10px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src="/front.svg"
                    alt="Card Front"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>

                {/* Back of the card */}
                <div
                  style={{
                    transform: "rotateY(180deg)",
                    backfaceVisibility: "hidden",
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    borderRadius: "10px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src="/back.svg"
                    alt="Card Back"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>
              </motion.div>

              <input
                type="radio"
                name="payment"
                value="Stripe"
                checked={paymentMethod === "Stripe"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="d-none"
              />
            </motion.div>

            <button
              type="submit"
              className="btn w-100 fw-semibold"
              style={{
                backgroundColor: "#c97b84",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
              }}
            >
              Continue to Order Summary →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;
