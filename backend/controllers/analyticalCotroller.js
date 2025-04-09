import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import SupportQuery from "../models/SupportQuery.js";

export const getAnalyticsOverview = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Total Revenue This Month
    const thisMonthOrders = await Order.find({ createdAt: { $gte: startOfMonth } });
    const totalRevenueThisMonth = thisMonthOrders.reduce((sum, order) => sum + order.totalPrice, 0);

    // Average Order Value
    const averageOrderValue = thisMonthOrders.length
      ? (totalRevenueThisMonth / thisMonthOrders.length).toFixed(2)
      : 0;

    // Total Products Sold
    const totalProductsSold = thisMonthOrders.reduce((total, order) => {
      return total + order.orderItems.reduce((sum, item) => sum + item.qty, 0);
    }, 0);

    // Monthly New Users
    const monthlyNewUsers = await User.countDocuments({ createdAt: { $gte: startOfMonth } });

    // Open Support Tickets
    const openTickets = await SupportQuery.countDocuments({ status: "open" });

    // Monthly Revenue Chart Data (last 6 months)
    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(now.getFullYear(), now.getMonth() - 5, 1) },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          total: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Sales by Category
    const allOrders = await Order.find({});
    const categorySales = {};

    allOrders.forEach((order) => {
      order.orderItems.forEach((item) => {
        const cat = item.category || "Uncategorized";
        categorySales[cat] = (categorySales[cat] || 0) + item.qty;
      });
    });

    const categoryChartData = Object.entries(categorySales).map(([category, qty]) => ({
      category,
      qty,
    }));

    // User Growth Chart
    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(now.getFullYear(), now.getMonth() - 5, 1) },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Top Rated Products (Bar)
    const topRatedProducts = await Product.find({})
      .sort({ rating: -1 })
      .limit(5)
      .select("name rating");

      res.json({
        totalRevenue: totalRevenueThisMonth,
        averageOrderValue: parseFloat(averageOrderValue),
        totalProductsSold,
        openSupportTickets: openTickets,
        monthlyRevenue: monthlyRevenue.map((item) => ({
          month: item._id,
          revenue: item.total,
        })),
        salesByCategory: categoryChartData.map((item) => ({
          category: item.category,
          sales: item.qty,
        })),
        monthlyNewUsers: userGrowth.map((item) => ({
          month: item._id,
          users: item.count,
        })),
        topRatedProducts,
      });
      
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Analytics fetch failed" });
  }
};
