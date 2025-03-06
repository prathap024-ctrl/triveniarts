"use client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Pages/Home";
import ShopAll from "./components/Pages/ShopAll";
import NotFound from "./components/Pages/NotFound"; // 404 Page
import About from "./components/Pages/About";
import Gallery from "./components/Pages/Gallery";
import ContactPage from "./components/Pages/Contact";
import ProductCollection from "./components/Pages/ProductCollection";
import { FooterSec } from "./components/Footer/FooterSec";
import NavbarSec from "./components/Navbar/Navbar";
import ShoppingCart from "./components/Pages/ShoppingCart";
import LoginPage from "./components/Signup-pages/LoginPage";
import SignupPage from "./components/Signup-pages/SignupPage";
import { Toaster } from "./components/ui/toaster";
import CheckOut from "./components/Pages/CheckOut";
import { CartProvider } from "./components/cartutils/CartContext";
import ProductHighlight from "./components/Pages/ProductHighlight";
import Dashboard from "./components/UserProfile/userDashboard";
import { AuthProvider } from "./Supabase/authcontext";
import ProtectedRoute from "./Supabase/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <NavbarSec />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/shop-all" element={<ShopAll />} />
            <Route path="/about" element={<About />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/products" element={<ProductCollection />} />
            <Route path="/product/:productId" element={<ProductHighlight />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/cart" element={<ShoppingCart />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/sign-up" element={<SignupPage />} />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <CheckOut />
                </ProtectedRoute>
              }
            />
            <Route path="/error" element={<NotFound />} />{" "}
            {/* Catch-all route */}
          </Routes>
          <Toaster />
          <FooterSec />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
