import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";

import { Link } from "react-router-dom";

import supabase from "@/Supabase/supabase";

import { FaWhatsapp } from "react-icons/fa";

// Define product interface matching your Supabase schema
interface Product {
  id: number;
  product_name: string;
  product_code: string;
  description?: string; // Optional field
  price: number;
  stock: number;
  category: string;
  image_url: string;
}

export function FeatureSec() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch the 6 most recently added products from Supabase
  useEffect(() => {
    const fetchRecentProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("id", { ascending: false }) // Assuming higher ID means more recent
          .limit(6); // Fetch only 6 products

        if (error)
          throw new Error("Failed to fetch products: " + error.message);

        setProducts(
          data.map((product: Product) => ({
            ...product,
            description: product.description || "No description available.",
          }))
        );
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

  return (
    <div className="abeezee-regular w-full py-12 md:py-20 lg:py-32 xl:py-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:gap-12 lg:gap-16">
          {/* Header Section */}
          <div className="flex gap-4 flex-col items-start">
            <div>
              <Badge variant="secondary">New Arrivals</Badge>
            </div>
            <div className="flex gap-3 flex-col">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tighter font-semibold text-left">
                Recently Added Products
              </h2>
              <p className="text-base sm:text-lg md:max-w-xl lg:max-w-2xl leading-relaxed tracking-tight text-muted-foreground text-left">
                Check out our latest additions to the collection, fresh and
                ready for you!
              </p>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-3 p-4 rounded-lg bg-muted/50 animate-pulse h-[400px]"
                >
                  <div className="rounded-none aspect-square mb-2 bg-gray-300"></div>
                  <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                  <div className="h-10 bg-gray-300 rounded mt-auto"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col gap-3 p-4 rounded-lg hover:bg-muted/50 transition-all duration-300 group h-full min-h-[400px]"
                >
                  {/* Link to ProductHighlight page */}
                  <Link
                    to={`/product/${product.id}`}
                    className="flex flex-col flex-1"
                  >
                    {/* Image Container */}
                    <div className="rounded-none aspect-square mb-2 overflow-hidden">
                      <img
                        src={product.image_url || "/api/placeholder/400/400"}
                        alt={product.product_name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    {/* Product Info */}
                    <div className="flex flex-col flex-1">
                      <h3 className="text-lg sm:text-xl font-semibold tracking-tight group-hover:text-primary transition-colors">
                        {product.product_name}
                      </h3>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed flex-1">
                        {product.category}
                      </p>
                      <p
                        className="text-xl font-bold mt-2"
                        style={{ color: "#521635" }}
                      >
                        Contact for Price
                      </p>
                    </div>
                  </Link>

                  <a
                    href={generateWhatsAppLink(product)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 bg-[#521635] text-white rounded-none hover:underline underline-offset-4 transition-colors flex items-center justify-center gap-2"
                    aria-label={`Contact via WhatsApp for ${product.product_name}`}
                    onClick={(e) => e.stopPropagation()} // Prevent navigation on WhatsApp click
                  >
                    <FaWhatsapp />
                    Chat on WhatsApp
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FeatureSec;
