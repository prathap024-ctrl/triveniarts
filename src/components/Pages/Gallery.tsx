// components/ImageGallery.tsx
"use client";

import supabase from "@/Supabase/supabase";
import React, { useState, useEffect } from "react";



// Types (adapted from your Product interface)
interface GalleryImage {
  id: number;
  url: string;
  name: string;
}

const Gallery: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [imageCount, setImageCount] = useState<number>(0);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);

        // First, get the count of products with images
        const { count, error: countError } = await supabase
          .from("products")
          .select("id", { count: "exact", head: true })
          .not("image_url", "is", null);

        if (countError) {
          console.error("Supabase count error:", countError);
          throw new Error(`Count error: ${countError.message}`);
        }

        setImageCount(count || 0);

        // Then fetch the actual image data
        const { data, error } = await supabase
          .from("products")
          .select("id, product_name, image_url")
          .not("image_url", "is", null)
          .order("id", { ascending: false });

        if (error) {
          console.error("Supabase query error:", error);
          throw new Error(`Query error: ${error.message}`);
        }

        if (!data || data.length === 0) {
          console.log("No products with images found in the table");
          setImages([]);
          return;
        }

        const imageData: GalleryImage[] = data.map((product) => ({
          id: product.id,
          url: product.image_url!,
          name: product.product_name || "Unnamed Product",
        }));

        console.log("Fetched images:", imageData);

        const validImages = imageData.filter((img) => {
          if (!img.url) {
            console.warn("Invalid URL for product:", img.name);
            return false;
          }
          return true;
        });

        setImages(validImages);
      } catch (err) {
        console.error("Fetch images error:", err);
        setError(
          `Failed to load images: ${
            err instanceof Error ? err.message : "Unknown error"
          }`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  // Loading state with skeleton
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Image Gallery
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(imageCount || 4)].map((_, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-none shadow-lg"
            >
              <div className="w-full h-64 bg-gray-200 animate-pulse"></div>
              <div className="absolute bottom-0 w-full h-12 bg-black bg-opacity-40">
                <div className="h-4 bg-gray-300 animate-pulse m-4 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>{error}</p>
        <p className="text-sm text-gray-600 mt-2">
          Check console for detailed error information. Ensure products with images exist in the 'products' table.
        </p>
      </div>
    );
  }

  // Main gallery render
  return (
    <div className="abeezee-regular container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Image Gallery
      </h1>

      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {images.map((image) => (
          <div
            key={image.id}
            className="group relative overflow-hidden rounded-none shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <img
              src={image.url}
              alt={image.name}
              className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
              onError={(e) => {
                console.error("Image failed to load:", image.url);
                e.currentTarget.style.display = "none";
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-end">
              <p className="text-white p-4 w-full text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {image.name}
              </p>
            </div>
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          No images found in the gallery. Add products with images to display them here.
        </div>
      )}
    </div>
  );
};

export default Gallery;