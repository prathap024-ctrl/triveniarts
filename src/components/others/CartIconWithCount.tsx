import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button"; // Adjust path based on your shadcn/ui setup
import { ShoppingCart } from "lucide-react"; // Assuming Lucide icons; adjust if using a different library
import { useCart } from "../cartutils/CartContext"; // Import useCart from your CartContext

const CartIconWithCount = () => {
  const { cartItems } = useCart(); // Access cartItems from CartContext

  // Calculate total number of items (sum of quantities)
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Link to="/cart" className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="text-white rounded-none relative"
      >
        <ShoppingCart className="w-6 h-6" />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-white text-[#521635] text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </Button>
    </Link>
  );
};

export default CartIconWithCount;