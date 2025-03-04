import React, { useState } from 'react';
import { Button } from '../ui/button';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const ShoppingCart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: 1, name: 'Minimalist Desk Lamp', price: 59.99, quantity: 1, image: '/api/placeholder/400/300' },
    { id: 2, name: 'Ergonomic Office Chair', price: 249.99, quantity: 1, image: '/api/placeholder/400/300' },
    { id: 3, name: 'Wireless Bluetooth Headphones', price: 129.99, quantity: 2, image: '/api/placeholder/400/300' }
  ]);

  const updateQuantity = (id: number, change: number): void => {
    setCartItems(cartItems.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const removeItem = (id: number): void => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + tax + shipping;

  return (
    <div className="abeezee-regular min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <circle cx="8" cy="21" r="1" />
            <circle cx="19" cy="21" r="1" />
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
          </svg>
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {cartItems.length > 0 ? (
              <div className="space-y-4">
                {cartItems.map(item => (
                  <div key={item.id} className="overflow-hidden border-0 shadow-md rounded-none bg-white">
                    <div className="p-0">
                      <div className="flex flex-col sm:flex-row">
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
                            <p className="text-gray-600 text-sm mb-2">SKU: {item.id}00{item.id}</p>
                          </div>
                          <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
                            <div className="flex items-center space-x-1 border border-gray-200 rounded-none">
                              <Button 
                                onClick={() => updateQuantity(item.id, -1)}
                                className="text-[#521635] bg-transparent rounded-none hover:bg-[#521635] hover:text-white transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M5 12h14" />
                                </svg>
                              </Button>
                              <span className="px-2 py-1 min-w-8 text-center">{item.quantity}</span>
                              <Button 
                                onClick={() => updateQuantity(item.id, 1)}
                                className="text-[#521635] bg-transparent rounded-none hover:bg-[#521635] hover:text-white transition-colors"
                                aria-label="Increase quantity"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M12 5v14M5 12h14" />
                                </svg>
                              </Button>
                            </div>
                            <div className="flex items-center space-x-4">
                              <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                              <Button
                                onClick={() => removeItem(item.id)}
                                className="text-[#521635] bg-transparent rounded-none hover:bg-[#521635] hover:text-white transition-colors"
                                aria-label={`Remove ${item.name} from cart`}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M3 6h18" />
                                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                  <line x1="10" x2="10" y1="11" y2="17" />
                                  <line x1="14" x2="14" y1="11" y2="17" />
                                </svg>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-blue-50 border-blue-100 text-blue-800 rounded-none p-4">
                <p>Your shopping cart is empty. Add some items to get started!</p>
              </div>
            )}
          </div>
          
          <div className="lg:col-span-1">
            <div className="shadow-md border-0 sticky top-4 rounded-none bg-white">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (8%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 mt-3"></div>
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-[#521635] hover:underline underline-offset-4 text-white py-3 flex items-center justify-center transition-colors rounded-none"
                  aria-label="Proceed to checkout"
                  variant="default"
                >
                  Checkout 
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Button>
                
                <div className="mt-4 text-sm text-gray-500">
                  <p>Free shipping on orders over ₹5000</p>
                  <p className="mt-2">Need help? Contact our support team</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;