import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { FaCheckCircle } from "react-icons/fa";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

function PlaceOrderPage() {
  const [cartItems, setCartItems] = useState([]);
  const [shippingInfo, setShippingInfo] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cartItems")) || [];
    const shipping = JSON.parse(localStorage.getItem("shippingInfo")) || {};
    const payment = localStorage.getItem("paymentMethod") || "";

    setCartItems(cart);
    setShippingInfo(shipping);
    setPaymentMethod(payment);
  }, []);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const handlePlaceOrder = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          "Content-Type": "application/json",
        },
      };

      const orderItems = cartItems.map((item) => ({
        name: item.name,
        qty: item.qty,
        price: item.price,
        image: item.image,
        product: item._id,
      }));

      const orderData = {
        orderItems,
        shippingAddress: shippingInfo,
        paymentMethod,
        totalPrice,
      };

      const { data: order } = await axiosInstance.post(
        "/orders",
        orderData,
        config
      );

      if (paymentMethod === "Stripe") {
        const { data: stripeData } = await axiosInstance.post(
          "/payments/create-checkout-session",
          { cartItems, orderId: order._id },
          config
        );
        const stripe = await stripePromise;
        await stripe.redirectToCheckout({ sessionId: stripeData.id });
      } else {
        localStorage.removeItem("cartItems");
        navigate(`/order/${order._id}`);
      }
    } catch (err) {
      alert("❌ Failed to place order");
      console.error(err);
    }
  };

  return (
    <div
      className="container d-flex flex-column align-items-center justify-content-center"
      style={{ minHeight: "80vh", padding: "2rem", backgroundColor: "#ffffff" }}
    >
      <div className="text-center mb-4" style={{ color: "#c97b84", fontSize: "3rem" }}>
        <FaCheckCircle />
      </div>

      <h2 className="text-center mb-2 fw-bold" style={{ color: "#400d18" }}>
        Ready to Place Your Order?
      </h2>
      <p className="text-muted text-center mb-4">
        Please review your order before confirming.
      </p>

      <div
        className="shadow-sm p-4 rounded"
        style={{
          maxWidth: "600px",
          width: "100%",
          backgroundColor: "#fff",
          border: "1px solid #eee",
        }}
      >
        <h5 className="fw-semibold mb-3" style={{ color: "#400d18" }}>
          Order Summary
        </h5>

        {cartItems.map((item) => (
          <div
            key={item._id}
            className="d-flex justify-content-between align-items-center border-bottom py-2"
          >
            <div className="d-flex align-items-center gap-3">
              <img
                src={item.image}
                alt={item.name}
                style={{ width: "50px", height: "50px", objectFit: "contain" }}
              />
              <div>
                <div className="fw-medium">{item.name}</div>
                <small className="text-muted">
                  Qty: {item.qty} × ${item.price}
                </small>
              </div>
            </div>
            <div className="fw-bold" style={{ color: "#c97b84" }}>
              ${(item.qty * item.price).toFixed(2)}
            </div>
          </div>
        ))}

        <div className="d-flex justify-content-between mt-3">
          <span className="fw-bold" style={{ color: "#400d18" }}>Total</span>
          <span className="fw-bold" style={{ color: "#400d18" }}>
            ${totalPrice.toFixed(2)}
          </span>
        </div>

        <hr />

        <div className="mb-2">
          <strong style={{ color: "#400d18" }}>Shipping To:</strong>
          <p className="mb-1 text-muted">
            {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.postalCode},{" "}
            {shippingInfo.country}
          </p>
        </div>

        <div className="mb-3">
          <strong style={{ color: "#400d18" }}>Payment Method:</strong>
          <p className="mb-0 text-muted">{paymentMethod}</p>
        </div>

        <button
          onClick={handlePlaceOrder}
          className="btn w-100 mt-2"
          style={{
            backgroundColor: "#c97b84",
            color: "#fff",
            fontWeight: "600",
            borderRadius: "6px",
            border: "none",
          }}
        >
          ✅ Place Order
        </button>
      </div>
    </div>
  );
}

export default PlaceOrderPage;
