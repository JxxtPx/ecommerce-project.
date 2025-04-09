import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import BottomNav from "./components/BottomNav";

import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/RegisterPage";
import CartPage from "./pages/CartPage";
import ShippingPage from "./pages/ShippingPage";
import PaymentPage from "./pages/PaymentPage";
import PlaceOrderPage from "./pages/PlaceOrderPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import ProfilePage from "./pages/ProfilePage";
import SupportPage from "./pages/SupportPage";
import CategoriesPage from "./pages/CategoriesPage";
import ComparePage from "./pages/ComparePage";
import CocktailPage from "./pages/CocktailPage";

// Admin Layout and Pages
import AdminLayout from "./pages/AdminLayout";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminProductsPage from "./pages/AdminProductsPage ";
import AdminEditProductPage from "./pages/AdminEditProductPage";
import AdminCreateProductPage from "./pages/AdminCreateProductPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import AdminReviewPage from "./pages/AdminReviewPage";
import AdminSupportPage from "./pages/AdminSupportPage";
import AdminAnalyticsPage from "./pages/AdminAnalyticsPage";

// 👇 Wrapper to conditionally render BottomNav
function AppWrapper() {
  const location = useLocation();
  const { pathname } = location;

  const hideBottomNav = pathname.startsWith("/admin") || pathname === "/login" || pathname === "/register";

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/shipping" element={<ShippingPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/placeorder" element={<PlaceOrderPage />} />
          <Route path="/order/:id" element={<OrderDetailsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/cocktail" element={<CocktailPage />} />



          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="products/:id/edit" element={<AdminEditProductPage />} />
            <Route path="products/create" element={<AdminCreateProductPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="reviews" element={<AdminReviewPage />} />
            <Route path="support" element={<AdminSupportPage />} />
            <Route path="analytics" element={<AdminAnalyticsPage />} />
          </Route>
        </Routes>
      </main>

      {/* Show BottomNav only if not admin/login/register */}
      {!hideBottomNav && <BottomNav />}

      <Footer />
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
