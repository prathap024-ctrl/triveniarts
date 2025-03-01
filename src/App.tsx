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
import Dashboard from "./admin-layout/Dashboard/dashboard";
import { AdminLayout } from "./AdminLayout";
import { MainLayout } from "./MainLayout";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/admin"
          element={
            <AdminLayout>
              {" "}
              <Dashboard />
            </AdminLayout>
          }
        />
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />
        <Route
          path="/shop-all"
          element={
            <MainLayout>
              <ShopAll />
            </MainLayout>
          }
        />
        <Route
          path="/about"
          element={
            <MainLayout>
              <About />
            </MainLayout>
          }
        />
        <Route
          path="/blogs"
          element={
            <MainLayout>
              <Blogs />
            </MainLayout>
          }
        />
        <Route
          path="/gallery"
          element={
            <MainLayout>
              <Gallery />
            </MainLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <MainLayout>
              <ContactPage />
            </MainLayout>
          }
        />
        <Route
          path="/products"
          element={
            <MainLayout>
              <ProductCollection />
            </MainLayout>
          }
        />
        <Route
          path="/error"
          element={
            <MainLayout>
              <NotFound />
            </MainLayout>
          }
        />{" "}
        {/* Catch-all route */}
      </Routes>
    </Router>
  );
}

export default App;
