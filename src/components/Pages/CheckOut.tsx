// CheckOut.tsx
import React, { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "../cartutils/CartContext";
import { useNavigate } from "react-router-dom";


interface FormData {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

const CheckOut: React.FC = () => {
  const { cartItems, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.08;
  const shipping = subtotal > 10000 ? 0 : 100; // Updated to match ShoppingCart
  const total = subtotal + tax + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const cardNumberRegex = /^\d{16}$/;
    const cvvRegex = /^\d{3}$/;
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;

    return (
      formData.fullName.trim() !== "" &&
      formData.address.trim() !== "" &&
      formData.city.trim() !== "" &&
      formData.postalCode.trim() !== "" &&
      formData.country.trim() !== "" &&
      cardNumberRegex.test(formData.cardNumber) &&
      expiryRegex.test(formData.expiryDate) &&
      cvvRegex.test(formData.cvv)
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Please fill in all fields correctly");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }

    // Simulate order processing
    console.log("Order submitted:", { formData, cartItems });
    clearCart();
    alert("Order placed successfully!");
    navigate("/"); // Redirect to home page after successful order
  };

  return (
    <div className="abeezee-regular min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-[#521635] flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2"
          >
            <circle cx="8" cy="21" r="1" />
            <circle cx="19" cy="21" r="1" />
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
          </svg>
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Cart Items and Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cart Items */}
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
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <h3 className="font-medium text-lg">{item.name}</h3>
                        <p className="text-gray-600 text-sm mb-2">
                          Product Code: {item.id}00{item.id}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
                        <div className="flex items-center space-x-1 border border-[#521635] rounded-none">
                          <Button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="text-[#521635] bg-transparent rounded-none hover:bg-[#521635] hover:text-white transition-colors"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M5 12h14" />
                            </svg>
                          </Button>
                          <span className="px-2 py-1 min-w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="text-[#521635] bg-transparent rounded-none hover:bg-[#521635] hover:text-white transition-colors"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M12 5v14M5 12h14" />
                            </svg>
                          </Button>
                        </div>
                        <div className="flex items-center space-x-4">
                          <p className="font-semibold text-[#521635]">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </p>
                          <Button
                            onClick={() => removeItem(item.id)}
                            className="text-[#521635] bg-transparent rounded-none hover:bg-[#521635] hover:text-white transition-colors"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                              <line x1="10" x2="10" y1="11" y2="17" />
                              <line x1="14" x2="14" y1="11" y2="17" />
                            </svg>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Shipping and Payment Form */}
            <Card className="rounded-none border-[#521635] shadow-md">
              <CardHeader className="bg-[#521635] text-white">
                <CardTitle>Shipping & Payment</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Shipping Information */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-[#521635]">
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="rounded-none border-[#521635] focus:ring-[#521635]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-[#521635]">
                      Address
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="rounded-none border-[#521635] focus:ring-[#521635]"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-[#521635]">
                        City
                      </Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="rounded-none border-[#521635] focus:ring-[#521635]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode" className="text-[#521635]">
                        Postal Code
                      </Label>
                      <Input
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        required
                        className="rounded-none border-[#521635] focus:ring-[#521635]"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-[#521635]">
                      Country
                    </Label>
                    <Input
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                      className="rounded-none border-[#521635] focus:ring-[#521635]"
                    />
                  </div>

                  {/* Payment Information */}
                  <div className="pt-4">
                    <h3 className="text-lg font-semibold mb-4 text-[#521635]">
                      Payment Information
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber" className="text-[#521635]">
                          Card Number
                        </Label>
                        <Input
                          id="cardNumber"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          required
                          maxLength={16}
                          className="rounded-none border-[#521635] focus:ring-[#521635]"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="expiryDate"
                            className="text-[#521635]"
                          >
                            Expiry Date
                          </Label>
                          <Input
                            id="expiryDate"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            placeholder="MM/YY"
                            required
                            className="rounded-none border-[#521635] focus:ring-[#521635]"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv" className="text-[#521635]">
                            CVV
                          </Label>
                          <Input
                            id="cvv"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            required
                            maxLength={3}
                            className="rounded-none border-[#521635] focus:ring-[#521635]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full rounded-none bg-[#521635] hover:bg-[#3d1127] text-white py-3"
                  >
                    Place Order
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
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
                    <span>
                      {shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="border-t border-[#521635] pt-3 mt-3"></div>
                  <div className="flex justify-between font-semibold text-lg text-[#521635]">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  <p>Free shipping on orders over ₹10,000</p>
                  <p className="mt-2">Need help? Contact our support team</p>
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
