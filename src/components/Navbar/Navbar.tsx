"use strict";

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Menu, X, ShoppingCart, Search } from "lucide-react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import mainlogo from "../../assets/main-logo2.png";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/clerk-react";
import "../../index.css";

export function NavbarSec() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 960) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Shop All", path: "/shop-all" },
    { name: "About", path: "/about" },
    { name: "Blogs", path: "/blogs" },
    { name: "Gallery", path: "/gallery" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className=" w-full bg-[#521635] shadow-md py-4 px-6 flex flex-col items-center text-white sticky top-0 z-40">
      <div className=" w-full flex justify-between items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white rounded-none"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="p-6 flex flex-col gap-4 bg-[#521635] text-white"
          >
            <div className="max-w-40">
              <img src={mainlogo} alt="" />
            </div>
            <div className="mt-4 flex gap-2">
              <SignedOut>
                <SignInButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>

              <Link to="/cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white rounded-none"
                >
                  <ShoppingCart className="w-6 h-6" />
                </Button>
              </Link>
            </div>

            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-white ${
                  location.pathname === item.path
                    ? "underline underline-offset-[5.5px]"
                    : ""
                }`}
              >
                {item.name}
              </Link>
            ))}
          </SheetContent>
        </Sheet>

        <div className="max-w-20 lg:max-w-52 font-semibold text-center flex-1">
          <Link to="/">
            {" "}
            <img src={mainlogo} alt="Triveni Arts" />
          </Link>
        </div>
        <div className="hidden md:flex items-center space-x-2 relative w-2/4">
          <div className="relative w-full">
            <Input
              placeholder="Search..."
              className="w-full pl-12 pr-4 py-2 rounded-none bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#521635]"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#521635] w-5 h-5" />
          </div>
        </div>
        <div className="flex items-center space-x-4 md:hidden">
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
          <Link to="/cart">
            <Button
              variant="ghost"
              size="icon"
              className="text-white rounded-none "
            >
              <ShoppingCart className="w-6 h-6" />
            </Button>
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>

          <Link to="/cart">
            <Button
              variant="ghost"
              size="icon"
              className="text-white rounded-none"
            >
              <ShoppingCart className="w-6 h-6 " />
            </Button>
          </Link>
          <div className="flex space-x-2">
            <a href="#">
              <FaFacebook className="w-6 h-6 text-white hover:text-blue-800" />
            </a>
            <a href="#">
              <FaInstagram className="w-6 h-6 text-white hover:text-pink-700" />
            </a>
          </div>
        </div>
      </div>

      <div className="hidden abeezee-regular md:flex w-full justify-center gap-6 mt-2 border-t border-gray-300 pt-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`text-white relative cursor-pointer transition-all ease-in-out before:transition-[width] before:ease-in-out before:duration-100 before:absolute before:bg-white before:origin-center before:h-[1px] before:w-0 hover:before:w-[50%] before:bottom-0 before:left-[50%] after:transition-[width] after:ease-in-out after:duration-100 after:absolute after:bg-white after:origin-center after:h-[1px] after:w-0 hover:after:w-[50%] after:bottom-0 after:right-[50%] ${
              location.pathname === item.path
                ? "underline underline-offset-[5.5px]"
                : ""
            }`}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default NavbarSec;
