"use strict";

import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Menu, X, Search, User, LogOut, LogIn, UserPlus } from "lucide-react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import images from "@/assets/images";
import "../../index.css";
import { useToast } from "@/hooks/use-toast";
import CartIconWithCount from "../others/CartIconWithCount";
import { useAuth } from "@/Supabase/authcontext";
import supabase from "@/Supabase/supabase";

interface Product {
  id: number;
  product_code: number;
  product_name: string;
  description: string | null;
  price: number;
  category: string | null;
  stock: number;
  image_url: string | null;
}

export function NavbarSec() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [mobileSuggestions, setMobileSuggestions] = useState<Product[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 960) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchSuggestions = async (query: string, setSuggestionsFn: (products: Product[]) => void) => {
    if (!query.trim()) {
      setSuggestionsFn([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("products")
        .select("id, product_name, product_code, price, image_url")
        .ilike("product_name", `%${query}%`)
        .limit(5);

      if (error) throw error;

      setSuggestionsFn(data as Product[] || []);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch product suggestions",
      });
      setSuggestionsFn([]);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchSuggestions(searchQuery, setSuggestions);
    }, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchSuggestions(mobileSearchQuery, setMobileSuggestions);
    }, 300);
    return () => clearTimeout(debounce);
  }, [mobileSearchQuery]);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Shop All", path: "/shop-all" },
    { name: "About", path: "/about" },
    { name: "Gallery", path: "/gallery" },
    { name: "Contact", path: "/contact" },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Success",
        description: "Logged out successfully!",
      });
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log out",
      });
    }
  };

  const handleSuggestionClick = (productId: number, isMobile = false) => {
    if (isMobile) {
      setMobileSearchQuery("");
      setMobileSuggestions([]);
      setIsOpen(false); // Close the sheet on suggestion click
    } else {
      setSearchQuery("");
      setSuggestions([]);
    }
    navigate(`/product/${productId}`);
  };

  return (
    <nav className="w-full bg-[#521635] shadow-md py-4 px-6 flex flex-col items-center text-white sticky top-0 z-40">
      <div className="w-full flex justify-between items-center">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white rounded-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="p-6 flex flex-col gap-4 bg-[#521635] text-white w-64" // Fixed width for consistency
          >
            <div className="max-w-40">
              <img src={images.mainlogo2} alt="" />
            </div>

            {/* Mobile Search */}
            <div className="relative w-full">
              <Input
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 rounded-none bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#521635]"
                value={mobileSearchQuery}
                onChange={(e) => setMobileSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#521635] w-5 h-5" />
              {mobileSuggestions.length > 0 && (
                <div className="absolute top-full left-0 w-full bg-white shadow-lg z-50 max-h-60 overflow-y-auto mt-1">
                  {mobileSuggestions.map((product) => (
                    <div
                      key={product.id}
                      className="p-2 text-black hover:bg-gray-100 cursor-pointer flex items-center space-x-2"
                      onClick={() => handleSuggestionClick(product.id, true)}
                    >
                      {product.image_url && (
                        <img
                          src={product.image_url}
                          alt={product.product_name}
                          className="w-8 h-8 object-cover rounded-none"
                        />
                      )}
                      <div>
                        <p className="text-sm font-medium">{product.product_name}</p>
                        <p className="text-xs text-gray-500">
                          Code: {product.product_code} |{" "}
                          {new Intl.NumberFormat("en-us", {
                            style: "currency",
                            currency: "INR",
                          }).format(product.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Navigation and Icons */}
            <div className="mt-4 flex flex-col gap-4">
              <div className="flex gap-2">
                {user ? (
                  <>
                    <Link to="/profile">
                      <Button variant="ghost" size="icon" className="text-white rounded-none">
                        <User className="w-6 h-6" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white rounded-none"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-6 h-6" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login">
                      <Button variant="ghost" size="icon" className="text-white rounded-none">
                        <LogIn className="w-6 h-6" />
                      </Button>
                    </Link>
                    <Link to="/sign-up">
                      <Button variant="ghost" size="icon" className="text-white rounded-none">
                        <UserPlus className="w-6 h-6" />
                      </Button>
                    </Link>
                  </>
                )}
                <CartIconWithCount />
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
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>

        <div className="max-w-20 lg:max-w-52 font-semibold text-center flex-1">
          <Link to="/">
            <img src={images.mainlogo2} alt="Triveni Arts" />
          </Link>
        </div>

        {/* Desktop Search */}
        <div className="hidden md:flex items-center space-x-2 relative w-2/4">
          <div className="relative w-full">
            <Input
              placeholder="Search products..."
              className="w-full pl-12 pr-4 py-2 rounded-none bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#521635]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#521635] w-5 h-5" />
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-white shadow-lg z-50 max-h-60 overflow-y-auto mt-1">
                {suggestions.map((product) => (
                  <div
                    key={product.id}
                    className="p-2 text-black hover:bg-gray-100 cursor-pointer flex items-center space-x-2"
                    onClick={() => handleSuggestionClick(product.id)}
                  >
                    {product.image_url && (
                      <img
                        src={product.image_url}
                        alt={product.product_name}
                        className="w-8 h-8 object-cover rounded-none"
                      />
                    )}
                    <div>
                      <p className="text-sm font-medium">{product.product_name}</p>
                      <p className="text-xs text-gray-500">
                        Code: {product.product_code} |{" "}
                        {new Intl.NumberFormat("en-us", {
                          style: "currency",
                          currency: "INR",
                        }).format(product.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Icons (outside Sheet) */}
        <div className="flex items-center space-x-4 md:hidden">
          {user ? (
            <>
              <Link to="/profile">
                <Button variant="ghost" size="icon" className="text-white rounded-none">
                  <User className="w-6 h-6" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="text-white rounded-none"
                onClick={handleLogout}
              >
                <LogOut className="w-6 h-6" />
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="icon" className="text-white rounded-none">
                  <LogIn className="w-6 h-6" />
                </Button>
              </Link>
              <Link to="/sign-up">
                <Button variant="ghost" size="icon" className="text-white rounded-none">
                  <UserPlus className="w-6 h-6" />
                </Button>
              </Link>
            </>
          )}
          <CartIconWithCount />
        </div>

        {/* Desktop Icons */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <Link to="/profile">
                <Button variant="ghost" size="icon" className="text-white rounded-none">
                  <User className="w-6 h-6" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="text-white rounded-none"
                onClick={handleLogout}
              >
                <LogOut className="w-6 h-6" />
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="icon" className="text-white rounded-none">
                  <LogIn className="w-6 h-6" />
                </Button>
              </Link>
              <Link to="/sign-up">
                <Button variant="ghost" size="icon" className="text-white rounded-none">
                  <UserPlus className="w-6 h-6" />
                </Button>
              </Link>
            </>
          )}
          <CartIconWithCount />
          <div className="flex space-x-2">
            <Link to="https://www.facebook.com/profile.php?id=61573701290515">
              <FaFacebook className="w-6 h-6 text-white hover:text-blue-800" />
            </Link>
            <Link to="https://www.instagram.com/triveni_arts/">
              <FaInstagram className="w-6 h-6 text-white hover:text-pink-700" />
            </Link>
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