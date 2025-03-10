import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import supabase from "@/Supabase/supabase";
import { FaWhatsapp } from "react-icons/fa";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const [carouselIndices, setCarouselIndices] = useState<Record<number, number>>({});

  useEffect(() => {
    const fetchRecentProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("id", { ascending: false })
          .limit(6);

        if (error) throw new Error("Failed to fetch products: " + error.message);

        setProducts(
          data.map((product: Product) => ({
            ...product,
            description: product.description || "No description available.",
          }))
        );
        setCarouselIndices(
          (data || []).reduce((acc, product) => {
            acc[product.id] = 0;
            return acc;
          }, {} as Record<number, number>)
        );
      } catch (err) {
        console.error((err as Error).message);
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
    <div className="abeezee-regular w-full py-6 sm:py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-6">
          {/* Header Section */}
          <div className="space-y-3">
            <Badge variant="secondary">New Arrivals</Badge>
            <h2 className="text-lg sm:text-xl font-semibold tracking-tight">
              Recently Added Products
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md">
              Check out our latest additions to the collection!
            </p>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="w-6 h-6 border-3 border-t-3 border-[#521635] rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {products.map((product) => {
                const currentIndex = carouselIndices[product.id] || 0;
                const imageCount = product.image_urls?.length || 0;

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-md shadow-sm overflow-hidden transition-transform hover:scale-105 flex flex-col"
                  >
                    {/* Carousel Section */}
                    <div className="relative w-full h-32 bg-gray-100">
                      {product.image_urls?.length > 0 ? (
                        <div className="relative h-full">
                          <button
                            className="absolute left-1 top-1/2 -translate-y-1/2 bg-gray-200 hover:bg-gray-300 rounded-full p-1 z-10"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              handlePrevImage(product.id, imageCount);
                            }}
                            disabled={imageCount <= 1}
                          >
                            <ChevronLeft className="h-3 w-3 text-gray-600" />
                          </button>
                          <Link to={`/product/${product.id}`} className="block h-full">
                            <img
                              src={product.image_urls[currentIndex]}
                              alt={`${product.product_name} ${currentIndex + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </Link>
                          <button
                            className="absolute right-1 top-1/2 -translate-y-1/2 bg-gray-200 hover:bg-gray-300 rounded-full p-1 z-10"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              handleNextImage(product.id, imageCount);
                            }}
                            disabled={imageCount <= 1}
                          >
                            <ChevronRight className="h-3 w-3 text-gray-600" />
                          </button>
                          {imageCount > 1 && (
                            <div className="absolute bottom-1 left-0 right-0 flex justify-center space-x-1">
                              {product.image_urls.map((_, index) => (
                                <span
                                  key={index}
                                  className={`h-1 w-1 rounded-full ${
                                    index === currentIndex ? "bg-[#521635]" : "bg-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <Link to={`/product/${product.id}`} className="block h-full">
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <span className="text-xs text-gray-500">No Image</span>
                          </div>
                        </Link>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-3 flex flex-col flex-1">
                      <Link to={`/product/${product.id}`} className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-800 truncate hover:text-[#521635]">
                          {product.product_name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          Code: {product.product_code || "N/A"}
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm font-bold text-[#521635]">
                            Contact for Price
                          </span>
                          <span
                            className={`text-xs ${
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
                        className="mt-2 w-full py-1.5 bg-[#521635] text-white text-xs font-medium rounded-sm hover:bg-[#6a2542] flex items-center justify-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FaWhatsapp className="text-sm" />
                        Chat
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