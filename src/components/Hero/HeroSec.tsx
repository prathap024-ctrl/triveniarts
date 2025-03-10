"use strict";
import { Link } from "react-router";
import images from "@/assets/images";

export default function HeroSec() {
  return (
    <div className="relative overflow-hidden bg-white">
      <div className="pt-8 pb-12 sm:pt-12 sm:pb-16 md:pt-16 md:pb-20 lg:pt-20 lg:pb-24">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Background image for mobile */}
          <div 
            className="absolute inset-0 sm:hidden bg-cover bg-right-top h-screen"
            style={{ backgroundImage: `url(${images.image6})` }}
            aria-hidden="true"
          >
            {/* Optional overlay for better text readability */}
            <div className="absolute inset-0 bg-white/70"></div>
          </div>

          <div className="relative flex flex-col-reverse items-center justify-between lg:flex-row lg:space-x-12">
            {/* Text Section */}
            <div className="abeezee-regular sm:max-w-lg text-center lg:text-left mt-6 lg:mt-0 z-10">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl">
                Authentic Hoysala Traditional Arts Brought to Life by Triveni
                Arts.
              </h1>
              <p className="mt-3 text-base text-gray-700 sm:text-lg md:text-xl">
                Discover the timeless beauty of Hoysala traditional arts, where
                heritage meets craftsmanship in every piece.
              </p>
              <div className="mt-4 sm:mt-6 md:mt-8">
                <Link
                  to="/shop-all"
                  className="inline-block border border-transparent bg-[#521635] px-4 py-2 text-sm font-medium text-white sm:px-6 sm:py-3 md:px-8 md:py-4 hover:bg-[#6a2542] transition-colors"
                >
                  Explore Collection
                </Link>
              </div>
            </div>

            {/* Image for larger screens */}
            <div
              aria-hidden="true"
              className="hidden sm:block w-full max-w-[10rem] sm:max-w-[14rem] md:max-w-[16rem] lg:max-w-lg"
            >
              <div className="relative aspect-w-4 aspect-h-3 lg:aspect-w-3 lg:aspect-h-4 flex justify-center">
                <img 
                  src={images.image6} 
                  className="w-20 sm:w-28 md:w-60 lg:w-full h-full object-center rounded-lg" 
                  alt="Hoysala Traditional Art"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}