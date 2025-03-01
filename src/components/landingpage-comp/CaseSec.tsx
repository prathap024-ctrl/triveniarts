"use client";

import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import images from "@/assets/images";

// Array of craft brand names and placeholder images
const craftBrands = [
  { name: "Anantashayana", imgSrc: images.image1 },
  { name: "BalRama", imgSrc: images.image2 },
  { name: "Lakshmi Varaha Swamy", imgSrc: images.image3 },
  { name: "Ganesha", imgSrc: images.image4 },
  { name: "Lakshmi Narasimha Swamy", imgSrc: images.image5 },
  { name: "Mirror Lady", imgSrc: images.image6 },
  { name: "Narayana Sridevi Budevi", imgSrc: images.image7 },
  { name: "Rajarajeshwari", imgSrc: images.image8 },
  { name: "Rama Set", imgSrc: images.image9 },
];

function CaseSec() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    const timer = setTimeout(() => {
      if (api.selectedScrollSnap() + 1 === api.scrollSnapList().length) {
        setCurrent(0);
        api.scrollTo(0);
      } else {
        api.scrollNext();
        setCurrent(current + 1);
      }
    }, 3000);

    return () => clearTimeout(timer); // Clean up the timeout when component unmounts or dependencies change
  }, [api, current]);

  return (
    <div className="w-full bg-[#521635] py-10 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 sm:gap-10">
          <h2 className="abeezee-regular text-lg text-white sm:text-xl md:text-3xl lg:text-4xl xl:text-5xl tracking-tighter font-normal text-left max-w-full sm:max-w-2xl lg:max-w-xl">
            Trusted by craft enthusiasts across the globe.
          </h2>
          <Carousel setApi={setApi} className="w-full">
            <CarouselContent className="-ml-2 sm:-ml-4">
              {craftBrands.map((brand, index) => (
                <CarouselItem
                  className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 pl-2 sm:pl-4"
                  key={index}
                >
                  <div className="flex flex-col rounded-none aspect-auto bg-muted items-center justify-center p-4 sm:p-6 h-full">
                    <img
                      src={brand.imgSrc}
                      alt={brand.name}
                      className="w-full h-auto max-h-24 sm:max-h-28 md:max-h-32 object-contain mb-2"
                    />
                    <span className="text-xs sm:text-sm md:text-base text-center font-medium mt-2 line-clamp-2">
                      {brand.name}
                    </span>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </div>
  );
}

export { CaseSec };
