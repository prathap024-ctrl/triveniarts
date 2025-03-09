"use strict";

import { useState, useEffect } from "react";
import { Link } from "react-router";
import images from "@/assets/images";

// Array of images to cycle through
const imageList = [
  images.image1,
  images.image4,
  images.image5,
  images.image6,
  images.image7,
  images.image8,
];

export default function HeroSec() {
  // State to track the current image index
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // UseEffect to cycle through images every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === imageList.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <div className="relative overflow-hidden bg-white">
      <div className="pt-8 pb-12 sm:pt-12 sm:pb-16 md:pt-16 md:pb-20 lg:pt-20 lg:pb-24">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col-reverse items-center justify-between lg:flex-row lg:space-x-12">
            {/* Text Section */}
            <div className="abeezee-regular sm:max-w-lg text-center lg:text-left mt-6 lg:mt-0">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl">
                Authentic Hoysala Traditional Arts Brought to Life by Triveni
                Arts.
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:text-lg md:text-xl">
                Discover the timeless beauty of Hoysala traditional arts, where
                heritage meets craftsmanship in every piece.
              </p>
              <div className="mt-4 sm:mt-6 md:mt-8">
                <Link
                  to="/shop-all"
                  className="inline-block border border-transparent bg-[#521635] px-4 py-2 text-sm font-medium text-white sm:px-6 sm:py-3 md:px-8 md:py-4"
                >
                  Explore Collection
                </Link>
              </div>
            </div>

            {/* Single Image Slot with Fade Animation */}
            <div
              aria-hidden="true"
              className="w-full max-w-[10rem] sm:max-w-[14rem] md:max-w-[16rem] lg:max-w-lg"
            >
              <div className="relative aspect-w-4 aspect-h-3 lg:aspect-w-3 lg:aspect-h-4 flex justify-center">
                <img
                  key={currentImageIndex} // Use key to force re-render on image change
                  alt=""
                  src={imageList[currentImageIndex]}
                  className="w-20 sm:w-28 md:w-60 lg:w-full h-full object-center fade rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}