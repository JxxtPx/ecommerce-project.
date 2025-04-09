import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

function AdminDashboardPage() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const COLORS = ["#c97b84", "#ffb6b9", "#f9d5d3", "#e4b7b2"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

        const [ordersRes, productsRes, usersRes] = await Promise.all([
          axiosInstance.get("/orders", config),
          axiosInstance.get("/products"),
          axiosInstance.get("/admin/users", config),
        ]);

        setOrders(ordersRes.data);
        setProducts(productsRes.data);
        setUsers(usersRes.data);

        const salesByDay = {};
        ordersRes.data.forEach((order) => {
          const date = new Date(order.createdAt).toLocaleDateString();
          salesByDay[date] = (salesByDay[date] || 0) + order.totalPrice;
        });
        setSalesData(
          Object.entries(salesByDay).map(([date, total]) => ({ date, total }))
        );

        const productSalesMap = {};
        ordersRes.data.forEach((order) => {
          order.orderItems.forEach((item) => {
            productSalesMap[item.name] = (productSalesMap[item.name] || 0) + item.qty;
          });
        });

        const sortedProducts = Object.entries(productSalesMap)
          .map(([name, qty]) => ({ name, qty }))
          .sort((a, b) => b.qty - a.qty)
          .slice(0, 5);

        setTopProducts(sortedProducts);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container py-5" style={{ background: "#fef2f4", color: "#400d18" }}>
      <h2 className="mb-4 text-center fw-bold">📊 Admin Dashboard</h2>

      <div className="row g-4 mb-4">
        {/* Stats Cards */}
        {[
          {
            icon: "fa-users",
            label: "Users",
            value: users.length,
            color: "#c97b84",
            link: "/admin/users",
          },
          {
            icon: "fa-boxes-stacked",
            label: "Products",
            value: products.length,
            color: "#400d18",
            link: "/admin/products",
          },
          {
            icon: "fa-receipt",
            label: "Orders",
            value: orders.length,
            color: "#ffb6b9",
            link: "/admin/orders",
          },
          {
            icon: "fa-star",
            label: "Reviews",
            value: "Manage",
            color: "#f9d5d3",
            link: "/admin/reviews",
          },
        ].map((item, i) => (
          <div className="col-md-3" key={i}>
            <div className="card shadow border-0">
              <div className="card-body text-center">
                <h5 className="card-title">
                  <i className={`fa-solid ${item.icon} me-2`} style={{ color: item.color }}></i>
                  {item.label}
                </h5>
                <h3 className="fw-bold">{item.value}</h3>
                <Link to={item.link} className="btn btn-sm" style={{
                  backgroundColor: "#c97b84",
                  color: "#fff",
                  borderRadius: "8px"
                }}>
                  Manage {item.label}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="row g-4">
        <div className="col-md-8">
          <div className="card shadow border-0 p-3">
            <h5 className="mb-3">📈 Sales Overview</h5>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#c97b84" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow border-0 p-3">
            <h5 className="mb-3">🧮 Orders by Status</h5>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  dataKey="value"
                  data={[
                    { name: "Paid", value: orders.filter(o => o.isPaid).length },
                    { name: "Unpaid", value: orders.filter(o => !o.isPaid).length },
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {COLORS.map((color, i) => (
                    <Cell key={i} fill={color} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="row g-4 mt-4">
        <div className="col-md-12">
          <div className="card shadow border-0 p-3">
            <h5 className="mb-3">🏆 Top Selling Products</h5>
            <ul className="list-group">
              {topProducts.map((prod, idx) => (
                <li key={idx} className="list-group-item d-flex justify-content-between">
                  <span>{prod.name}</span>
                  <span className="fw-bold">{prod.qty} sold</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
