import React, { useEffect, useRef, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useParams } from "react-router-dom";

function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const invoiceRef = useRef();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const { data } = await axiosInstance.get(`/orders/${id}`, config);
        setOrder(data);
      } catch (err) {
        setError("Failed to fetch order details.");
      }
    };
    fetchOrder();
  }, [id]);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const markOrderAsPaid = async () => {
      if (order && order.paymentMethod === "Stripe" && !order.isPaid) {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
            "Content-Type": "application/json",
          },
        };

        await axiosInstance.put(`/orders/${order._id}/pay`, {
          id: "stripe-payment-id",
          status: "paid",
          update_time: new Date().toISOString(),
          email_address: order.user.email,
        }, config);

        const { data } = await axiosInstance.get(`/orders/${order._id}`, config);
        setOrder(data);
      }
      localStorage.removeItem("cartItems");
    };
    if (order) markOrderAsPaid();
  }, [order]);

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    const styles = `
      <style>
        body { font-family: Arial, sans-serif; background: #f8f9fa; padding: 30px; }
        .invoice-box {
          background: #fff;
          padding: 30px;
          max-width: 700px;
          margin: auto;
          border-radius: 10px;
          box-shadow: 0 0 15px rgba(0,0,0,0.1);
        }
        h2 { color: #c97b84; text-align: center; }
        .section { margin-top: 20px; }
        .section h4 { margin-bottom: 5px; font-size: 1rem; color: #333; }
        .summary-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        .summary-table th, .summary-table td { border: 1px solid #ccc; padding: 8px; text-align: left; }
        .summary-table th { background: #f1f1f1; }
        .text-right { text-align: right; }
        .total { font-weight: bold; color: #400d18; font-size: 1.1rem; }
      </style>
    `;

    const content = `
      <html>
        <head><title>Invoice</title>${styles}</head>
        <body>
          <div class="invoice-box">
            <h2>Thank you for your purchase</h2>

            <div class="section">
              <h4>Order ID:</h4>
              <p>${order._id}</p>
            </div>

            <div class="section">
              <h4>Customer Name:</h4>
              <p>${order.user.name}</p>
              <h4>Customer Email:</h4>
              <p>${order.user.email}</p>
              <h4>Shipping Address:</h4>
              <p>${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}</p>
            </div>

            <div class="section">
              <h4>Order Items</h4>
              <table class="summary-table">
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${order.orderItems.map(item => `
                    <tr>
                      <td>${item.name}</td>
                      <td>${item.qty}</td>
                      <td>$${item.price.toFixed(2)}</td>
                      <td>$${(item.price * item.qty).toFixed(2)}</td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>

            <div class="section order-summary">
              <p class="text-right total">Grand Total: $${order.totalPrice.toFixed(2)}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  if (error) return <div className="alert alert-danger mt-4">{error}</div>;
  if (!order) return <h3 className="text-center mt-5">Loading...</h3>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold ">🧾 Order Details</h2>
        <button className="btn" style={{ border: "1px solid #c97b84", color: "#c97b84" }} onClick={handlePrint}>
          🖨️ Print Invoice
        </button>
      </div>

      <div className="row g-4">
        <div className="col-md-8">
          <div className="bg-white p-4 rounded shadow-sm">
            <h5 className="mb-3" style={{ color: "#c97b84" }}>Customer Information</h5>
            <p><strong>Name:</strong> {order.user.name}</p>
            <p><strong>Email:</strong> {order.user.email}</p>

            <h5 className="mt-4 mb-3" style={{ color: "#c97b84" }}>Shipping</h5>
            <p>{order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
            <p><strong>Delivered:</strong> {order.isDelivered ? <span className="text-success">Yes</span> : <span className="text-danger">No</span>}</p>

            <h5 className="mt-4 mb-3" style={{ color: "#c97b84" }}>Payment</h5>
            <p><strong>Method:</strong> {order.paymentMethod}</p>
            <p><strong>Paid:</strong> {order.isPaid ? <span className="text-success">Yes</span> : <span className="text-danger">No</span>}</p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="bg-light p-4 rounded shadow-sm">
            <h5 className="mb-3">Order Summary</h5>
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Total:</strong> ${order.totalPrice.toFixed(2)}</p>
            {order.paidAt && <p><strong>Paid At:</strong> {new Date(order.paidAt).toLocaleString()}</p>}
            {order.deliveredAt && <p><strong>Delivered At:</strong> {new Date(order.deliveredAt).toLocaleString()}</p>}
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow-sm mt-4">
        <h5 className="mb-3">Products</h5>
        {order.orderItems.map((item, index) => (
          <div key={index} className="d-flex align-items-center justify-content-between border-bottom py-2">
            <div className="d-flex align-items-center">
              <img src={item.image} alt={item.name} style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px", marginRight: "12px" }} />
              <div>
                <p className="mb-0 fw-semibold">{item.name}</p>
                <small className="text-muted">Qty: {item.qty}</small>
              </div>
            </div>
            <strong>${(item.qty * item.price).toFixed(2)}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderDetailsPage;
