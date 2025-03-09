"use client";

import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import supabase from "@/Supabase/supabase";
import { useCart } from "@/components/cartutils/CartContext";
import { useToast } from "@/hooks/use-toast";

const Success: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const updateOrderStatus = async () => {
      const orderId = searchParams.get("orderId");
      if (!orderId) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Invalid order ID.",
        });
        navigate("/dashboard");
        return;
      }

      try {
        const { error } = await supabase
          .from("orders")
          .update({ status: "paid" })
          .eq("id", orderId);

        if (error) throw error;

        clearCart();
        toast({
          title: "Success",
          description: "Payment completed and order placed successfully!",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to update order.",
        });
      } finally {
        navigate("/dashboard");
      }
    };

    updateOrderStatus();
  }, [searchParams, clearCart, navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <svg
        className="animate-spin h-8 w-8 text-[#521635]"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
    </div>
  );
};

export default Success;