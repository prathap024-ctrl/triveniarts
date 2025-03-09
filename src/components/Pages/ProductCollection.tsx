"use strict";

import { useState, useEffect } from "react";
import { FiSearch, FiHeart } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import supabase from "@/Supabase/supabase";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Add lucide-react for carousel arrows

interface Product {
  id: number;
  product_name: string;
  product_code: string;
  price: number;
  stock: number;
  category: string;
  image_urls: string[]; // Changed to array of strings
}

const ProductCollection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [sortOption, setSortOption] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [carouselIndices, setCarouselIndices] = useState<Record<number, number>>({}); // Track carousel index per product

  const navigate = useNavigate();

  const categories = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("id", { ascending: true });

        if (error)
          throw new Error("Failed to fetch products: " + error.message);

        setProducts(data || []);
        setFilteredProducts(data || []);
        // Initialize carousel indices
        const initialIndices = (data || []).reduce((acc, product) => {
          acc[product.id] = 0;
          return acc;
        }, {} as Record<number, number>);
        setCarouselIndices(initialIndices);
      } catch (err) {
        const error = err as Error;
        setError(error.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    let result = [...products];

    if (selectedCategory !== "All") {
      result = result.filter(
        (product) => product.category === selectedCategory
      );
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

  const generateWhatsAppLink = (product: Product) => {
    const phoneNumber = "+918105871804";
    const message = `Hi, I'm interested in ${product.product_name} (Code: ${product.product_code}). Can you provide more details including the price?`;
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  };

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  const handlePrevImage = (productId: number, imageCount: number) => {
    setCarouselIndices((prev) => ({
      ...prev,
      [productId]: (prev[productId] - 1 + imageCount) % imageCount,
    }));
  };

  const handleNextImage = (productId: number, imageCount: number) => {
    setCarouselIndices((prev) => ({
      ...prev,
      [productId]: (prev[productId] + 1) % imageCount,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="flex justify-center items-center h-48">
          <div className="w-6 h-6 border-3 border-t-3 border-[#521635] border-solid rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600 mb-3">Error</h2>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="abeezee-regular max-w-7xl mx-auto">
        <div className="mb-6 space-y-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="relative flex-1 max-w-lg">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-8 pr-3 py-1 text-sm border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:ring-[#521635] md:pl-10 md:py-2 md:text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FiSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm md:left-3 md:text-base" />
            </div>
            <div className="flex flex-col md:flex-row gap-3">
              <select
                className="px-3 py-1 text-sm border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:ring-[#521635] md:px-4 md:py-2 md:text-base"
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
                className="px-3 py-1 text-sm border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:ring-[#521635] md:px-4 md:py-2 md:text-base"
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
          <div className="text-center py-10">
            <h2 className="text-xl font-bold text-gray-600 mb-3">
              No products found
            </h2>
            <p className="text-sm text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredProducts.map((product) => {
              const currentIndex = carouselIndices[product.id] || 0;
              const imageCount = product.image_urls?.length || 0;

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:scale-105 cursor-pointer flex flex-col"
                  onClick={() => handleProductClick(product.id)}
                >
                  {/* Carousel Section */}
                  <div className="relative w-full h-48 bg-gray-100">
                    {product.image_urls && product.image_urls.length > 0 ? (
                      <div className="relative h-full flex items-center justify-center">
                        <button
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 rounded-full p-1 z-10"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePrevImage(product.id, imageCount);
                          }}
                          disabled={imageCount <= 1}
                        >
                          <ChevronLeft className="h-4 w-4 text-gray-600" />
                        </button>
                        <img
                          src={product.image_urls[currentIndex]}
                          alt={`${product.product_name} image ${currentIndex + 1}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <button
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 rounded-full p-1 z-10"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNextImage(product.id, imageCount);
                          }}
                          disabled={imageCount <= 1}
                        >
                          <ChevronRight className="h-4 w-4 text-gray-600" />
                        </button>
                        {imageCount > 1 && (
                          <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1">
                            {product.image_urls.map((_, index) => (
                              <span
                                key={index}
                                className={`h-2 w-2 rounded-full ${
                                  index === currentIndex ? "bg-[#521635]" : "bg-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-sm text-gray-500">No Image</span>
                      </div>
                    )}
                    <button
                      className="absolute top-2 right-2 p-1 bg-white rounded-full text-[#521635] hover:bg-gray-100 transition-colors"
                      aria-label="Add to wishlist"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FiHeart className="text-base" />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 truncate">
                        {product.product_name || "Unnamed Product"}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Code: {product.product_code || "N/A"}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Category: {product.category || "Uncategorized"}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-md font-bold text-[#521635]">
                          Contact for Price
                        </span>
                        <span
                          className={`text-sm ${
                            product.stock < 10 ? "text-red-600" : "text-green-600"
                          }`}
                        >
                          {product.stock} <span className="text-xs">in stock</span>
                        </span>
                      </div>
                    </div>
                    <a
                      href={generateWhatsAppLink(product)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 w-full py-2 bg-[#521635] text-white font-semibold rounded-none hover:bg-[#6a2542] transition-colors flex items-center justify-center gap-2 text-sm"
                      aria-label={`Contact via WhatsApp for ${product.product_name}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FaWhatsapp className="text-base" />
                      Chat on WhatsApp
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCollection;