"use client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Pages/Home";
import ShopAll from "./components/Pages/ShopAll";
import NotFound from "./components/Pages/NotFound"; // 404 Page
import About from "./components/Pages/About";
import Blogs from "./components/Pages/Blogs";
import Gallery from "./components/Pages/Gallery";
import ContactPage from "./components/Pages/Contact";
import ProductCollection from "./components/Pages/ProductCollection";
import { FooterSec } from "./components/Footer/FooterSec";
import NavbarSec from "./components/Navbar/Navbar";
import ShoppingCart from "./components/Pages/ShoppingCart";



function App() {
  return (
    <Router>
      <NavbarSec />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/shop-all" element={<ShopAll />} />
        <Route path="/about" element={<About />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/products" element={<ProductCollection />} />
        <Route path="/cart" element={<ShoppingCart /> }/>
        <Route path="/error" element={<NotFound />} /> {/* Catch-all route */}
      </Routes>
      <FooterSec />
    </Router>
  );
}

export default App;
