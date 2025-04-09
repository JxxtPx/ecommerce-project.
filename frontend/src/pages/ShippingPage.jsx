import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";


function ShippingPage() {
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [error, setError] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("shippingInfo"));
    
    if (saved) {
      setAddress(saved.address || "");
      setCity(saved.city || "");
      setPostalCode(saved.postalCode || "");
      setCountry(saved.country || "");
    }
    const items = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(items);
    setLoading(false);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!address || !city || !postalCode || !country) {
      setError("Please fill in all fields");
      return;
    }
    setError("");
    const shippingInfo = { address, city, postalCode, country };
    localStorage.setItem("shippingInfo", JSON.stringify(shippingInfo));
    navigate("/payment");
  };

  
  if (loading) return <Loader />;

  return (
    <div className="container py-5" style={{ backgroundColor: "#fff" }}>
      <h2 className="mb-4 fw-bold" style={{ color: "#400d18" }}>
        Checkout
      </h2>
      <div className="row g-4">
        {/* Shipping Form */}
        <div className="col-md-6">
          <div className="bg-white p-4 shadow rounded border">
            <h5 className="mb-3" style={{ color: "#400d18" }}>Shipping Address</h5>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Address *</label>
                <input
                  type="text"
                  className="form-control"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Main Street"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">City *</label>
                <input
                  type="text"
                  className="form-control"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Postal Code *</label>
                <input
                  type="text"
                  className="form-control"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="ZIP Code"
                />
              </div>
              <div className="mb-4">
                <label className="form-label">Country *</label>
                <input
                  type="text"
                  className="form-control"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Country"
                />
              </div>
              <button
                type="submit"
                className="btn w-100"
                style={{
                  backgroundColor: "#c97b84",
                  color: "#fff",
                  fontWeight: 600,
                  border: "none",
                }}
              >
                Continue to Payment →
              </button>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="col-md-6">
          <div className="bg-white p-4 shadow rounded border">
            <h5 className="mb-3" style={{ color: "#400d18" }}>Your Order</h5>
            {cartItems.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item._id}
                  className="d-flex align-items-center justify-content-between border-bottom py-2"
                >
                  <div className="d-flex align-items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: "60px", height: "60px", objectFit: "contain" }}
                    />
                    <div>
                      <div className="fw-semibold">{item.name}</div>
                      <small className="text-muted">
                        Qty: {item.qty} × ${item.price}
                      </small>
                    </div>
                  </div>
                  <div className="fw-bold" style={{ color: "#c97b84" }}>
                    ${(item.qty * item.price).toFixed(2)}
                  </div>
                </div>
              ))
            )}

            {cartItems.length > 0 && (
              <div className="text-end mt-3">
                <h6 className="fw-bold">
                  Total: $
                  {cartItems
                    .reduce((acc, item) => acc + item.qty * item.price, 0)
                    .toFixed(2)}
                </h6>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShippingPage;
