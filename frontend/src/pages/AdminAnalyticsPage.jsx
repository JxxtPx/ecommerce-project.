import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

function AdminAnalyticsPage() {
  const [stats, setStats] = useState(null);

  const COLORS = ["#c97b84", "#400d18", "#f4c2c2", "#ffc107", "#0dcaf0"];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { token } = JSON.parse(localStorage.getItem("userInfo"));
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const { data } = await axiosInstance.get(
          "/admin/analytics",
          config
        );

        setStats(data);
      } catch (err) {
        console.error("Failed to load analytics:", err);
      }
    };

    fetchStats();
  }, []);

  if (!stats) return <div className="text-center mt-5">Loading analytics...</div>;

  return (
    <div className="container mt-5 mb-5">
      <h2 className="fw-bold text-center mb-4" style={{ color: "#400d18" }}>
        📊 Admin Analytics Dashboard
      </h2>

      {/* Key Metrics */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow text-center">
            <div className="card-body">
              <h6 className="text-muted">Total Revenue</h6>
              <h4 className="fw-bold">${stats.totalRevenue.toFixed(2)}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow text-center">
            <div className="card-body">
              <h6 className="text-muted">Avg Order Value</h6>
              <h4 className="fw-bold">${stats.averageOrderValue.toFixed(2)}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow text-center">
            <div className="card-body">
              <h6 className="text-muted">Products Sold</h6>
              <h4 className="fw-bold">{stats.totalProductsSold}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow text-center">
            <div className="card-body">
              <h6 className="text-muted">Open Tickets</h6>
              <h4 className="fw-bold">{stats.openSupportTickets}</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="row g-4">
        {/* Revenue Line Chart */}
        <div className="col-md-6">
          <div className="card border-0 shadow p-3">
            <h6 className="mb-3">📉 Monthly Revenue</h6>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={stats.monthlyRevenue}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#c97b84" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales by Category Bar */}
        <div className="col-md-6">
          <div className="card border-0 shadow p-3">
            <h6 className="mb-3">🛒 Sales by Category</h6>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats.salesByCategory}>
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#400d18" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Growth Line Chart */}
        <div className="col-md-6">
          <div className="card border-0 shadow p-3">
            <h6 className="mb-3">👤 Monthly New Users</h6>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={stats.monthlyNewUsers}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#0dcaf0" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Rated Products Pie */}
        <div className="col-md-6">
          <div className="card border-0 shadow p-3">
            <h6 className="mb-3">⭐ Top Rated Products</h6>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={stats.topRatedProducts}
                  dataKey="rating"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {stats.topRatedProducts.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAnalyticsPage;
