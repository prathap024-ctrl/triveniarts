import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";
import { toast, ToastContainer, ToastPosition } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles

const AddProduct: React.FC = () => {
  const [productCode, setproductCode] = useState("");
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [productImage, setProductImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Enhanced validation for product code
    if (!productCode || !validateProductCode(productCode)) {
      toast.error("Please enter a valid product code (positive number)", {
        position: "top-right" as ToastPosition,
        autoClose: 3000,
      });
      return;
    }

    // Create FormData with explicit type conversion
    const formData = new FormData();
    // Ensure product_code is always sent as a number
    formData.append("productCode", parseInt(productCode).toString());
    formData.append("productName", productName);
    formData.append("price", parseFloat(price).toString());
    formData.append("description", description || ""); // Handle empty description
    formData.append("category", category);
    formData.append("stock", parseInt(stock).toString());

    if (productImage) {
      formData.append("productImage", productImage);
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/add-product`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add product");
      }

      toast.success("Product added successfully!", {
        position: "top-right" as ToastPosition,
        autoClose: 3000,
      });

      // Clear form
      setproductCode("");
      setProductName("");
      setPrice("");
      setDescription("");
      setCategory("");
      setStock("");
      setProductImage(null);
    } catch (error) {
      console.error("Error details:", error);
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred",
        {
          position: "top-right" as ToastPosition,
          autoClose: 5000,
        }
      );
    }
  };

  const validateProductCode = (code: string) => {
    const numCode = parseInt(code);
    return !isNaN(numCode) && numCode > 0;
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow-lg rounded-none">
      <h1 className="text-center text-2xl mb-4 text-[#521635]">Add Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <Label htmlFor="productCode" className="text-[#521635] pb-1">
            PRODUCT CODE
          </Label>
          <Input
            type="number"
            id="productCode"
            value={productCode}
            onChange={(e) => setproductCode(e.target.value)}
            className="border border-[#521635] p-2 rounded-none"
            required
          />
        </div>
        <div className="flex flex-col">
          <Label htmlFor="productName" className="text-[#521635] pb-1">
            Product Name
          </Label>
          <Input
            type="text"
            id="productName"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="border border-[#521635] p-2 rounded-none"
            required
          />
        </div>

        <div className="flex flex-col">
          <Label htmlFor="price" className="text-[#521635] pb-1">
            Price (INR)
          </Label>
          <Input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border border-[#521635] p-2 rounded-none"
            required
          />
        </div>

        <div className="flex flex-col">
          <Label htmlFor="description" className="text-[#521635] pb-1">
            Description
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-[#521635] p-2 rounded-none"
            required
          />
        </div>

        <div className="flex flex-col">
          <Label htmlFor="category" className="text-[#521635] pb-1">
            Category
          </Label>
          <Select onValueChange={setCategory} value={category}>
            <SelectTrigger className="border border-[#521635] p-2 rounded-none">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bronze">Bronze Idols</SelectItem>
              <SelectItem value="brass">Brass Idols</SelectItem>
              <SelectItem value="collection">Collection</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col">
          <Label htmlFor="stock" className="text-[#521635] pb-1">
            Stock
          </Label>
          <Input
            type="number"
            id="stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="border border-[#521635] p-2 rounded-none"
            required
          />
        </div>

        <div className="flex flex-col">
          <Label htmlFor="productImage" className="text-[#521635] pb-1">
            Product Image
          </Label>
          <Input
            type="file"
            id="productImage"
            onChange={(e) =>
              setProductImage(e.target.files ? e.target.files[0] : null)
            }
            className="border border-[#521635] p-2 rounded-none"
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-[#521635] text-white py-2 mt-4 rounded-none"
        >
          Add Product
        </Button>
      </form>

      {/* Toast container for displaying the toasts */}
      <div className="z-50">
        <ToastContainer />
      </div>
    </div>
  );
};

export default AddProduct;
