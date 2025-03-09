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
import { Toaster } from "./components/ui/toaster";
import ProductHighlight from "./components/Pages/ProductHighlight";

function App() {
  return (
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
        <Route path="/error" element={<NotFound />} /> {/* Catch-all route */}
      </Routes>
      <Toaster />
      <FooterSec />
    </Router>
  );
}

export default App;
