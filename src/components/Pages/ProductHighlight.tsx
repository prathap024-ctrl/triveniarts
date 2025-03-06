import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCart } from "../cartutils/CartContext"; // Assuming this is your cart context
import { useToast } from "@/hooks/use-toast";
import supabase from "@/Supabase/supabase";
import { FaWhatsapp } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";

// Define product interface to match Supabase schema
interface Product {
  id: number;
  product_name: string;
  product_code: string;
  price: number;
  stock: number;
  category: string;
  image_url: string;
  description?: string; // Optional field for detailed description
  features?: string[]; // Optional field for features
}

const ProductHighlight: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();
  const { toast } = useToast();

  // Fetch product data from Supabase
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", productId)
          .single(); // Fetch a single product by ID

        if (error) throw new Error("Failed to fetch product: " + error.message);

        // Add default features if not present in Supabase data
        const productData: Product = {
          ...data,
          description: data.description || "No detailed description available.",
          features: data.features || ["Feature not specified"],
        };

        setProduct(productData);
      } catch (err) {
        const error = err as Error;
        console.error(error.message);
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("en-us", {
      style: "currency",
      currency: "INR",
    }).format(price || 0);
  };

  const handleAddToCart = () => {
    if (!product) return;

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
      duration: 3000,
      className: "text-[#521635]",
    });
  };

  const generateWhatsAppLink = (product: Product) => {
    const phoneNumber = "+918105871804";
    const message = `Hi, I'm interested in ${product.product_name} (Code: ${product.product_code}). Can you provide more details including the price?`;
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-8">
        <div className="text-center py-8 text-xl">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto p-8">
        <div className="text-center py-8 text-xl text-red-600">
          Product not found
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Product Image Section */}
        <Card className="rounded-none border-none shadow-none">
          <CardContent className="p-0">
            <img
              src={product.image_url || "/api/placeholder/400/400"}
              alt={product.product_name}
              className="w-full h-auto object-cover"
            />
          </CardContent>
        </Card>

        {/* Product Details Section */}
        <Card className="rounded-none border-none shadow-none">
          <CardHeader className="p-6">
            <CardTitle className="text-3xl font-bold">
              {product.product_name}
            </CardTitle>
            <CardDescription
              className="text-xl font-bold"
              style={{ color: "#521635" }}
            >
              {product.price > 10000
                ? "Contact for Price"
                : formatPrice(product.price)}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <p className="text-gray-600 leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Stock Info */}
            <p
              className={`text-sm mb-6 ${
                product.stock < 10 ? "text-red-600" : "text-green-600"
              }`}
            >
              {product.stock} in stock
            </p>

            {/* Call to Action */}
            <a
              href={generateWhatsAppLink(product)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-start"
              aria-label={`Contact via WhatsApp for ${product.product_name}`}
              onClick={(e) => e.stopPropagation()} // Prevent navigation on WhatsApp click
            >
                <Button className="rounded-none w-full md:w-auto px-8 py-3 text-white hover:underline underline-offset-4"
                 style={{
                    backgroundColor: "#521635",
                  }}
                >

              <FaWhatsapp />
              Chat on WhatsApp
                </Button>
            </a><br />
            <Button
              className="rounded-none w-full md:w-auto px-8 py-3 text-white hover:underline underline-offset-4"
              style={{
                backgroundColor: "#521635",
              }}
              onClick={handleAddToCart}
            >
                <FiShoppingCart />
              Add to Cart
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductHighlight;
