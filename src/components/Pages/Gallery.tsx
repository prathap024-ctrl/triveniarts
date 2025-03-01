"use strict";

import { Link } from "react-router";
import images from "@/assets/images";

export function Gallery() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <div className="grid gap-4">
        <div>
          <Link to="/shop-all">
          <img
            className="h-auto max-w-full rounded-lg object-cover object-center"
            src={images.image1}
            alt="gallery-photo"
          /></Link>
        </div>
        <div>
          <img
            className="h-auto max-w-full rounded-lg object-cover object-center "
            src={images.image2}
            alt="gallery-photo"
          />
        </div>
        <div>
          <img
            className="h-auto max-w-full rounded-lg object-cover object-center"
            src={images.image3}
            alt="gallery-photo"
          />
        </div>
      </div>
      <div className="grid gap-4">
        <div>
          <img
            className="h-auto max-w-full rounded-lg object-cover object-center"
            src={images.image4}
            alt="gallery-photo"
          />
        </div>
        <div>
          <img
            className="h-auto max-w-full rounded-lg object-cover object-center"
            src={images.image5}
          />
        </div>
        <div>
          <img
            className="h-auto max-w-full rounded-lg object-cover object-center "
            src={images.image6}
            alt="gallery-photo"
          />
        </div>
      </div>
      <div className="grid gap-4">
        <div>
          <img
            className="h-auto max-w-full rounded-lg object-cover object-center"
            src={images.image7}
            alt="gallery-photo"
          />
        </div>
        <div>
          <img
            className="h-auto max-w-full rounded-lg object-cover object-center "
            src={images.image8}
            alt="gallery-photo"
          />
        </div>
        <div>
          <img
            className="h-auto max-w-full rounded-lg object-cover object-center"
            src={images.image9}
            alt="gallery-photo"
          />
        </div>
      </div>
      <div className="grid gap-4">
        <div>
          <img
            className="h-auto max-w-full rounded-lg object-cover object-center"
            src={images.image1}
            alt="gallery-photo"
          />
        </div>
        <div>
          <img
            className="h-auto max-w-full rounded-lg object-cover object-center"
            src={images.image2}
            alt="gallery-photo"
          />
        </div>
      </div>
    </div>
  );
}

export default Gallery;