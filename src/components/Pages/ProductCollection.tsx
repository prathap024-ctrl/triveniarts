"use strict";


import { useState, useEffect } from "react";
import { FiSearch, FiHeart, FiShoppingCart } from "react-icons/fi";
import { AiFillStar } from "react-icons/ai";
import images from "@/assets/images";


const ProductCollection = () => {
  const [products] = useState([
    {
      id: 1,
      title: "Idol 1",
      price: 129.99,
      rating: 4.5,
      category: "Brass",
      stock: 15,
      image: images.image1,
      colors: ["Brown", "Black", "Tan"],
    },
    {
      id: 2,
      title: "idol 2",
      price: 299.99,
      rating: 4.8,
      category: "Collection",
      stock: 8,
      image: images.image2,
      colors: ["Black", "Silver", "White"],
    },
    {
      id: 3,
      title: "idol 3",
      price: 34.99,
      rating: 4.2,
      category: "Brass",
      stock: 25,
      image: images.image3,
      colors: ["White", "Gray", "Navy"],
    },
    {
      id: 4,
      title: "idol 4",
      price: 199.99,
      rating: 4.6,
      category: "Collection",
      stock: 12,
      image: images.image4,
      colors: ["Black", "Rose Gold"],
    },
    {
      id: 5,
      title: "idol 5",
      price: 49.99,
      rating: 4.3,
      category: "Bronze",
      stock: 20,
      image: images.image5,
      colors: ["White", "Black"],
    },
    {
      id: 6,
      title: "idol 6",
      price: 39.99,
      rating: 4.7,
      category: "Bronze",
      stock: 30,
      image: images.image6,
      colors: ["White", "Black", "Gray"],
    }
  ]);

  const [filteredProducts, setFilteredProducts] = useState(products);
  const [sortOption, setSortOption] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);

  const categories = ["All", ...new Set(products.map((product) => product.category))];

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
  }, []);

  useEffect(() => {
    let result = [...products];

    if (selectedCategory !== "All") {
      result = result.filter((product) => product.category === selectedCategory);
    }

    if (searchQuery) {
      result = result.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
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
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    setFilteredProducts(result);
  }, [products, sortOption, searchQuery, selectedCategory]);

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
      <div className="max-w-7xl mx-auto">
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
                <option value="rating">Rating</option>
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
                   {/* <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />  */}
                  <button
                    className="absolute top-4 right-4 p-2 bg-white rounded-full text-[#521635] hover:bg-gray-100 transition-colors"
                    aria-label="Add to wishlist"
                  >
                    <FiHeart />
                  </button>
                </div>
                <div className="p-4 space-y-3">
                  <h3 className="font-semibold text-lg truncate">
                    {product.title}
                  </h3>
                  <div className="flex items-center gap-1">
                    <AiFillStar className="text-yellow-400" />
                    <span>{product.rating}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">${product.price}</span>
                    <span
                      className={`text-sm ${product.stock < 10 ? "text-red-300" : "text-green-300"}`}
                    >
                      {product.stock} in stock
                    </span>
                  </div>
                  <div className="flex gap-2 mb-3">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        className="w-6 h-6 rounded-full border-2 border-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                        style={{ backgroundColor: color.toLowerCase() }}
                        aria-label={`Select ${color} color`}
                      ></button>
                    ))}
                  </div>
                  <button
                    className="w-full py-2 bg-white text-[#521635] font-semibold rounded-none hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                    aria-label={`Add ${product.title} to cart`}
                  >
                    <FiShoppingCart />
                    Add to Cart
                  </button>
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
