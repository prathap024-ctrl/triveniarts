"use strict";

import { Link } from "react-router";
import images from "@/assets/images";

export default function HeroSec() {
  return (
    <div className="relative overflow-hidden bg-white">
      <div className="pb-80 pt-16 sm:pb-40 sm:pt-24 lg:pb-48 lg:pt-40">
        <div className="relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8">
          <div className="abeezee-regular sm:max-w-lg">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Authentic Hoysala Traditional Arts Brought to Life by Triveni
              Arts.
            </h1>
            <p className="mt-4 text-xl text-gray-500">
              Discover the timeless beauty of Hoysala traditional arts, where
              heritage meets craftsmanship in every piece.
            </p>
          </div>
          <div>
            <div className="mt-10">
              {/* Decorative image grid */}
              <div
                aria-hidden="true"
                className="pointer-events-none lg:absolute lg:inset-y-0 lg:mx-auto lg:w-full lg:max-w-7xl"
              >
                <div className="absolute transform sm:left-1/2 sm:top-0 sm:translate-x-8 lg:left-1/2 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-8">
                  <div className="flex items-center space-x-6 lg:space-x-8">
                    <div className="grid shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                      <div className="h-64 w-44 overflow-hidden rounded-none sm:opacity-0 lg:opacity-100">
                        <img
                          alt=""
                          src={images.image6}
                          className="size-full object-cover"
                        />
                      </div>
                      <div className="h-64 w-44 overflow-hidden rounded-none">
                        <img
                          alt=""
                          src={images.image4}
                          className="size-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="grid shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                      <div className="h-64 w-44 overflow-hidden rounded-none">
                        <img
                          alt=""
                          src={images.image1}
                          className="size-full object-cover"
                        />
                      </div>
                      <div className="h-64 w-44 overflow-hidden rounded-none">
                        <img
                          alt=""
                          src={images.image8}
                          className="size-full object-cover"
                        />
                      </div>
                      <div className="h-64 w-44 overflow-hidden rounded-none">
                        <img
                          alt=""
                          src={images.image5}
                          className="size-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="grid shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                      <div className="h-64 w-44 overflow-hidden rounded-none">
                        <img
                          alt=""
                          src={images.image4}
                          className="size-full object-cover"
                        />
                      </div>
                      <div className="h-64 w-44 overflow-hidden rounded-none">
                        <img
                          alt=""
                          src={images.image7}
                          className="size-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Link
                to="/shop-all"
                className="inline-block border border-transparent bg-[#521635] px-8 py-3 text-center font-medium text-white "
              >
                Explore Collection
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
