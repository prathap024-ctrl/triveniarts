// src/Routes.tsx
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/Firebase/firebase"; // Adjust path to your firebase config
import LoginPage from "@/components/Signup-pages/LoginPage"; // Adjust path
import SignupPage from "@/components/Signup-pages/SignupPage"; // Adjust path
import { Button } from "@/components/ui/button"; // Shadcn Button
import { useToast } from "@/hooks/use-toast"; // Shadcn Toast

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  if (!user) return null; // Or add a loading spinner here
  return children;
};

// Home Page Component
const HomePage = () => {
 

  

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      
      <Link to="/checkout">
        <Button className="bg-[#521635] rounded-none hover:underline underline-offset-4">
          Go to Checkout
        </Button>
      </Link>
    </div>
  );
};

// Checkout Page Component
const CheckoutPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCheckout = () => {
    // Simulate a checkout process
    toast({
      title: "Success",
      description: "Checkout completed successfully!",
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-bold mb-4">Checkout</h1>
      <p className="mb-4">You must be logged in to see this page.</p>
      <Button
        onClick={handleCheckout}
        className="bg-[#521635] rounded-none hover:underline underline-offset-4"
      >
        Complete Checkout
      </Button>
    </div>
  );
};

// Main Routes Component
export default function AppRoutes() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <nav className="p-4 bg-gray-100 flex justify-between items-center">
        <div>
          <Link to="/" className="text-[#521635] font-medium mr-4">
            Home
          </Link>
          {user && (
            <Link to="/checkout" className="text-[#521635] font-medium mr-4">
              Checkout
            </Link>
          )}
        </div>
        <div>
          {user ? (
            <span className="text-gray-700">
              Logged in as {user.email}
            </span>
          ) : (
            <>
              <Link to="/login" className="text-[#521635] font-medium mr-4">
                Login
              </Link>
              <Link to="/sign-up" className="text-[#521635] font-medium">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignupPage />} />
        <Route path="/" element={<HomePage />} />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}