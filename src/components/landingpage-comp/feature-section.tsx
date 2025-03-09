import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import supabase from "@/Supabase/supabase";
import { FaWhatsapp } from "react-icons/fa";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Add lucide-react for carousel arrows

// Define product interface matching your Supabase schema with image_urls as an array
interface Product {
  id: number;
  product_name: string;
  product_code: string;
  description?: string;
  price: number;
  stock: number;
  category: string;
  image_urls: string[];
}

export function FeatureSec() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [carouselIndices, setCarouselIndices] = useState<Record<number, number>>({}); // Track carousel index per product

  // Fetch the 6 most recently added products from Supabase
  useEffect(() => {
    const fetchRecentProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("id", { ascending: false })
          .limit(6);

        if (error)
          throw new Error("Failed to fetch products: " + error.message);

        setProducts(
          data.map((product: Product) => ({
            ...product,
            description: product.description || "No description available.",
          }))
        );
        // Initialize carousel indices
        const initialIndices = (data || []).reduce((acc, product) => {
          acc[product.id] = 0;
          return acc;
        }, {} as Record<number, number>);
        setCarouselIndices(initialIndices);
      } catch (err) {
        const error = err as Error;
        console.error(error.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentProducts();
  }, []);

  const generateWhatsAppLink = (product: Product) => {
    const phoneNumber = "+918105871804";
    const message = `Hi, I'm interested in ${product.product_name} (Code: ${product.product_code}). Can you provide more details including the price?`;
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
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

  return (
    <div className="abeezee-regular w-full py-8 sm:py-12 md:py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:gap-8 md:gap-12 lg:gap-16">
          {/* Header Section */}
          <div className="flex gap-4 flex-col items-start">
            <div>
              <Badge variant="secondary">New Arrivals</Badge>
            </div>
            <div className="flex gap-3 flex-col">
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl tracking-tighter font-semibold text-left">
                Recently Added Products
              </h2>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg lg:max-w-2xl leading-relaxed tracking-tight text-muted-foreground text-left">
                Check out our latest additions to the collection, fresh and
                ready for you!
              </p>
            </div>
          </div>

          {/* Products Grid with Spinner */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-8 h-8 border-4 border-t-4 border-[#521635] border-solid rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
              {products.map((product) => {
                const currentIndex = carouselIndices[product.id] || 0;
                const imageCount = product.image_urls?.length || 0;

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:scale-105 flex flex-col"
                  >
                    {/* Carousel Section */}
                    <div className="relative w-full h-48 bg-gray-100">
                      {product.image_urls && product.image_urls.length > 0 ? (
                        <div className="relative h-full flex items-center justify-center">
                          <button
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 rounded-full p-1 z-10"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault(); // Prevent Link navigation
                              handlePrevImage(product.id, imageCount);
                            }}
                            disabled={imageCount <= 1}
                          >
                            <ChevronLeft className="h-4 w-4 text-gray-600" />
                          </button>
                          <Link to={`/product/${product.id}`} className="w-full h-full">
                            <img
                              src={product.image_urls[currentIndex]}
                              alt={`${product.product_name} image ${currentIndex + 1}`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </Link>
                          <button
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 rounded-full p-1 z-10"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault(); // Prevent Link navigation
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
                        <Link to={`/product/${product.id}`} className="w-full h-full">
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <span className="text-sm text-gray-500">No Image</span>
                          </div>
                        </Link>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <Link to={`/product/${product.id}`} className="flex flex-col flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 truncate hover:text-[#521635] transition-colors">
                          {product.product_name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Code: {product.product_code || "N/A"}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Category: {product.category || "Uncategorized"}
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-lg font-bold text-[#521635]">
                            Contact for Price
                          </span>
                          <span
                            className={`text-sm ${
                              product.stock < 10 ? "text-red-600" : "text-green-600"
                            }`}
                          >
                            {product.stock} in stock
                          </span>
                        </div>
                      </Link>
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
    </div>
  );
}

export default FeatureSec;