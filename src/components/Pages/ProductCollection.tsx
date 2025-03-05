"use strict";

import { useState, useEffect } from "react";
import { FiSearch, FiHeart, FiShoppingCart } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { createClient } from "@supabase/supabase-js";
import { useCart } from "../cartutils/CartContext"; // Import the useCart hook
import { useToast } from "@/hooks/use-toast"; // Import the useToast hook from shadcn/ui

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL or Anon Key is missing in environment variables");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Product {
  id: number;
  product_name: string;
  product_code: string;
  price: number;
  stock: number;
  category: string;
  image_url: string;
}

const ProductCollection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [sortOption, setSortOption] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart(); // Use the cart context
  const { toast } = useToast(); // Use the toast hook from shadcn/ui

  const categories = ["All", ...new Set(products.map((product) => product.category))];

  // Fetch products from Supabase
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("id", { ascending: true });

        if (error) {
          throw new Error("Failed to fetch products: " + error.message);
        }

        setProducts(data || []);
        setFilteredProducts(data || []);
      } catch (err) {
        const error = err as Error;
        setError(error.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Handle filtering and sorting
  useEffect(() => {
    let result = [...products];

    if (selectedCategory !== "All") {
      result = result.filter((product) => product.category === selectedCategory);
    }

    if (searchQuery) {
      result = result.filter((product) =>
        product.product_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    switch (sortOption) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        result.sort((a, b) => a.product_name.localeCompare(b.product_name));
        break;
      default:
        break;
    }

    setFilteredProducts(result);
  }, [products, sortOption, searchQuery, selectedCategory]);

  // Function to generate WhatsApp link
  const generateWhatsAppLink = (product: Product) => {
    const phoneNumber = "+918105871804"; // Replace with your WhatsApp number
    const message = `Hi, I'm interested in ${product.product_name} (Code: ${product.product_code}). Can you provide more details including the price?`;
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  };

  // Function to handle adding to cart with toast
  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.product_name,
      price: product.price,
      image: product.image_url || "/api/placeholder/400/300",
      quantity: 1,
    });
    toast({
      title: "Added to Cart",
      description: `${product.product_name} has been added to your cart.`,
      duration: 3000, // Toast disappears after 3 seconds
      className:"text-[#521635]"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="animate-pulse bg-white rounded-lg overflow-hidden shadow-lg"
            >
              <div className="h-64 bg-gray-300"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="h-8 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="abeezee-regular max-w-7xl mx-auto">
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1 max-w-xl">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-[#521635]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <select
                className="px-4 py-2 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-[#521635]"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <select
                className="px-4 py-2 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-[#521635]"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="">Sort by</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Alphabetical</option>
              </select>
            </div>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-600 mb-4">
              No products found
            </h2>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-[#521635] text-white overflow-hidden transition-transform duration-300 hover:scale-105"
              >
                <div className="relative h-64 overflow-hidden">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.product_name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}
                  <button
                    className="absolute top-4 right-4 p-2 bg-white rounded-full text-[#521635] hover:bg-gray-100 transition-colors"
                    aria-label="Add to wishlist"
                  >
                    <FiHeart />
                  </button>
                </div>
                <div className="p-4 space-y-3">
                  <h3 className="font-semibold text-lg truncate">
                    {product.product_name || "Unnamed Product"}
                  </h3>
                  <p className="text-sm text-gray-300">
                    Code: {product.product_code || "N/A"}
                  </p>
                  <div className="flex justify-between items-center">
                    {product.price > 10000 ? (
                      <span className="text-xl font-bold">Contact for Price</span>
                    ) : (
                      <span className="text-xl font-bold">
                        {new Intl.NumberFormat("en-us", {
                          style: "currency",
                          currency: "INR",
                        }).format(product.price || 0)}
                      </span>
                    )}
                    <span
                      className={`text-sm ${
                        product.stock < 10 ? "text-red-300" : "text-green-300"
                      }`}
                    >
                      {product.stock} in stock
                    </span>
                  </div>
                  <p className="text-sm text-gray-300">
                    Category: {product.category || "Uncategorized"}
                  </p>
                  {product.price > 8000 ? (
                    <a
                      href={generateWhatsAppLink(product)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 bg-white text-[#521635] font-semibold rounded-none hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                      aria-label={`Contact via WhatsApp for ${product.product_name}`}
                    >
                      <FaWhatsapp />
                      Chat on WhatsApp
                    </a>
                  ) : (
                    <button
                      onClick={() => handleAddToCart(product)} // Use the new handler
                      className="w-full py-2 bg-white text-[#521635] font-semibold rounded-none hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                      aria-label={`Add ${product.product_name} to cart`}
                    >
                      <FiShoppingCart />
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCollection;