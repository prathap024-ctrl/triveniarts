import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import images from "@/assets/images";
import { FaFacebook, FaInstagram } from "react-icons/fa";

function FooterSec() {
  return (
    <footer className="bg-[#521635] py-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center">
          <div className="mb-8 rounded-none bg-primary/10">
            <img src={images.mainLogo} alt="Triveni Arts" className="w-40" />
          </div>
          <nav className="mb-8 flex flex-wrap justify-center gap-6 text-white">
            <Link
              to="/"
              className=" hover:underline underline-offset-4 text-base"
            >
              Home
            </Link>
            <Link
              to="/shop-all"
              className=" hover:underline underline-offset-4 text-base"
            >
              Shop All
            </Link>
            <Link
              to="/about"
              className=" hover:underline underline-offset-4 text-base"
            >
              About
            </Link>
            <Link
              to="/contact"
              className=" hover:underline underline-offset-4 text-base"
            >
              Contact
            </Link>
          </nav>
          <div className="mb-8 flex space-x-4">
            <Button variant="outline" size="icon" className="rounded-full">
              <FaFacebook className="h-4 w-4" />
              <span className="sr-only">Facebook</span>
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <FaInstagram className="h-4 w-4" />
              <span className="sr-only">Instagram</span>
            </Button>
          </div>
          <div className="text-center">
            <p className="text-sm text-white">
              © Triveni Arts. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export { FooterSec };
