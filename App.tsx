"use client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { NavbarSec } from "./components/Navbar/Navbar";
import Home from "./components/Pages/Home";
import ShopAll from "./components/Pages/ShopAll";
import NotFound from "./components/Pages/NotFound"; // 404 Page
import About from "./components/Pages/About";
import Blogs from "./components/Pages/Blogs";
import Gallery from "./components/Pages/Gallery";

import ContactPage from "./components/Pages/Contact";

import FooterSec from "./components/Footer/Footer";
import ProductCollection from "./components/Pages/ProductCollection";
import Dashboard from "./admin-layout/Dashboard/dashboard";

import { ClerkProvider } from "@clerk/clerk-react";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <Router>
        <NavbarSec />
        <Routes>
          <Route path="/admin" element={<Dashboard />} />
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/shop-all" element={<ShopAll />} />
          <Route path="/about" element={<About />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/products" element={<ProductCollection />} />
          <Route path="/error" element={<NotFound />} /> {/* Catch-all route */}
        </Routes>
        <FooterSec />
      </Router>
    </ClerkProvider>
  );
}

export default App;
