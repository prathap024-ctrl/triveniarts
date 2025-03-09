"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "../cartutils/CartContext";
import { useNavigate, Link } from "react-router-dom";
import supabase from "@/Supabase/supabase";
import { useToast } from "@/hooks/use-toast";
import images from "@/assets/images";

// Razorpay type definitions
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  image: string;
  handler: (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => void;
  prefill: { name: string; email: string; contact: string };
  notes: { orderId: string };
  theme: { color: string };
  modal: { ondismiss: () => void };
}

interface RazorpayInstance {
  open: () => void;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface UserData {
  id: string;
  fullName: string | null;
  address?: Address | null;
  email?: string;
  phone?: string;
}

interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const CheckOut: React.FC = () => {
  const { cartItems, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) {
        console.error("Auth error:", authError);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to authenticate. Please log in again.",
        });
        navigate("/login");
        return;
      }
      if (user) {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("display_name")
          .eq("id", user.id)
          .single();

        const { data: addressData, error: addressError } = await supabase
          .from("addresses")
          .select("id, street, city, state, zip")
          .eq("user_id", user.id)
          .limit(1)
          .single();

        if (profileError) console.error("Profile fetch error:", profileError);
        if (addressError && addressError.code !== "PGRST116")
          console.error("Address fetch error:", addressError);

        const fetchedUserData: UserData = {
          id: user.id,
          fullName: profileData?.display_name || user.user_metadata?.full_name || "User",
          address: addressData || null,
          email: user.email || "",
          phone: user.user_metadata?.phone || "",
        };
        setUserData(fetchedUserData);
      } else {
        navigate("/login");
      }
      setLoading(false);
    };
    fetchUserData();
  }, [navigate, toast]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const shipping = subtotal > 10000 ? 0 : 100;
  const total = subtotal + tax + shipping;

  const handleCheckout = async () => {
    if (!userData || cartItems.length === 0 || !userData.address) {
      toast({
        variant: "destructive",
        title: "Error",
        description: !userData
          ? "User data not loaded."
          : cartItems.length === 0
          ? "Your cart is empty."
          : "No address found.",
      });
      if (!userData?.address) navigate("/dashboard");
      return;
    }

    setProcessingPayment(true);

    try {
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: userData.id,
          date: new Date().toISOString(),
          total,
          status: "pending",
          shipping_address: `${userData.address.street}, ${userData.address.city}, ${userData.address.state} ${userData.address.zip}`,
        })
        .select("id, order_id")
        .single();

      if (orderError) throw orderError;

      const orderItems = cartItems.map((item) => ({
        order_id: orderData.id,
        name: item.name || "Unknown Item",
        price: item.price || 0,
        quantity: item.quantity || 1,
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
      if (itemsError) throw itemsError;

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !window.Razorpay) throw new Error("Failed to load Razorpay script");

      const response = await fetch("/api/create-razorpay-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Math.round(total * 100), orderId: orderData.id }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create Razorpay order: ${errorText}`);
      }

      const { orderId: razorpayOrderId, amount, currency } = await response.json();

      const options: RazorpayOptions = {
        key: import.meta.env.REACT_APP_RAZORPAY_KEY || "rzp_test_your_actual_key",
        amount,
        currency,
        order_id: razorpayOrderId,
        name: "Your Company Name",
        description: `Order #${orderData.order_id}`,
        image: images.mainlogo,
        handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;
          try {
            const verifyResponse = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ razorpay_payment_id, razorpay_order_id, razorpay_signature }),
            });

            if (!verifyResponse.ok) throw new Error("Payment verification failed");

            await supabase.from("orders").update({ status: "paid" }).eq("id", orderData.id);
            clearCart();
            navigate(`/order-details?orderId=${orderData.id}`);
          } catch (error) {
            toast({
              variant: "destructive",
              title: "Error",
              description: "Payment succeeded but verification failed. Contact support.",
            });
          }
        },
        prefill: {
          name: userData.fullName || "",
          email: userData.email || "",
          contact: userData.phone || "",
        },
        notes: { orderId: orderData.id },
        theme: { color: "#521635" },
        modal: {
          ondismiss: () => {
            setProcessingPayment(false);
            toast({ title: "Payment Cancelled", description: "You cancelled the payment." });
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      setProcessingPayment(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process payment.",
      });
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;

  return (
    <div className="abeezee-regular min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-[#521635] flex items-center">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="rounded-none border-[#521635] shadow-md">
              <CardHeader className="bg-[#521635] text-white">
                <CardTitle>Your Items</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row border-b border-gray-200 py-4 last:border-b-0"
                  >
                    <div className="w-full sm:w-32 h-auto bg-gray-200">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <h3 className="font-medium text-lg">{item.name}</h3>
                        <p className="text-gray-600 text-sm mb-2">Product Code: {item.id}00{item.id}</p>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
                        <div className="flex items-center space-x-1 border border-[#521635] rounded-none">
                          <Button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="text-[#521635] bg-transparent hover:bg-[#521635] rounded-none hover:text-white"
                          >
                            -
                          </Button>
                          <span className="px-2 py-1 min-w-8 text-center">{item.quantity}</span>
                          <Button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="text-[#521635] bg-transparent hover:bg-[#521635] rounded-none hover:text-white"
                          >
                            +
                          </Button>
                        </div>
                        <div className="flex items-center space-x-4">
                          <p className="font-semibold text-[#521635]">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </p>
                          <Button
                            onClick={() => removeItem(item.id)}
                            className="text-[#521635] bg-transparent hover:bg-[#521635] rounded-none hover:text-white"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="rounded-none border-[#521635] shadow-md">
              <CardHeader className="bg-[#521635] text-white">
                <CardTitle>Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <h2 className="mt-6 font-semibold">
                  Shipping to:{" "}
                  {userData?.address ? (
                    `${userData.address.street}, ${userData.address.city}, ${userData.address.state} ${userData.address.zip}`
                  ) : (
                    <span>
                      No address set. <Link to="/dashboard" className="text-[#521635] underline">Add an address</Link>
                    </span>
                  )}
                </h2>
                <Button
                  onClick={handleCheckout}
                  className="w-full mt-6 rounded-none bg-[#521635] hover:underline underline-offset-4 text-white py-3"
                  disabled={processingPayment}
                >
                  {processingPayment ? "Processing..." : "Pay with Razorpay"}
                </Button>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1">
            <Card className="shadow-md border-[#521635] sticky top-4 rounded-none">
              <CardHeader className="bg-[#521635] text-white">
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (8%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="border-t border-[#521635] pt-3 mt-3"></div>
                  <div className="flex justify-between font-semibold text-lg text-[#521635]">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  <p>Free shipping on orders over ₹10,000</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;