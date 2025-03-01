"use client";
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
import React, { useState, useEffect } from "react";
import { toast, ToastContainer, ToastPosition } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

const DisplayProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [newName, setNewName] = useState<string>("");
  const [newPrice, setNewPrice] = useState<string>("");
  const [newDescription, setNewDescription] = useState<string>("");
  const [newCategory, setNewCategory] = useState<string>("");
  const [newCode, setNewCode] = useState<string>("");
  const [newStock, setNewStock] = useState<string>("");
  const [newImage, setNewImage] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const productData = await response.json();
        setProducts(productData);
      } catch (error) {
        setError(
          `Error fetching products: ${
            error instanceof Error ? error.message : "Unknown error occurred"
          }`
        );
      }
    };

    loadProducts();
  }, []);

  // Filter products based on search query
  const filteredProducts = products.filter((product) =>
    product.product_code.toString().includes(searchQuery.toString())
  );

  const handleDelete = async (productId: number) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/products/${productId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete the product");
      }
      setProducts(products.filter((product) => product.id !== productId));
      toast.success("Product deleted successfully!", {
        position: "top-right" as ToastPosition,
        autoClose: 3000,
      });
    } catch (error) {
      toast.error(
        `Error deleting product: ${
          error instanceof Error ? error.message : "Unknown error occurred"
        }`,
        {
          position: "top-right" as ToastPosition,
          autoClose: 3000,
        }
      );
    }
  };

  const handleEdit = (product: Product) => {
    setEditProduct(product);
    setNewCode(product.product_code ? product.product_code.toString() : "");
    setNewName(product.product_name || "");
    setNewPrice(product.price ? product.price.toString() : "");
    setNewDescription(product.description || "");
    setNewCategory(product.category || "");
    setNewStock(product.stock ? product.stock.toString() : "");
  };

  const handleUpdate = async () => {
    if (
      !newCode ||
      !newName ||
      !newPrice ||
      !newDescription ||
      !newCategory ||
      !newStock
    ) {
      toast.error("All fields must be filled out.", {
        position: "top-right" as ToastPosition,
        autoClose: 3000,
      });
      return;
    }

    if (editProduct) {
      const updatedProduct = new FormData();
      updatedProduct.append("productCode", newCode);
      updatedProduct.append("productName", newName);
      updatedProduct.append("price", newPrice);
      updatedProduct.append("description", newDescription);
      updatedProduct.append("category", newCategory);
      updatedProduct.append("stock", newStock);
      if (newImage) {
        updatedProduct.append("productImage", newImage);
      }

      try {
        const response = await fetch(
          `http://localhost:3000/api/products/${editProduct.id}`,
          {
            method: "PUT",
            body: updatedProduct,
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Update failed:", errorData);
          throw new Error(errorData.message || "Failed to update the product");
        }

        const updatedProductData = await response.json();
        setProducts(
          products.map((product) =>
            product.id === editProduct.id ? updatedProductData.product : product
          )
        );

        toast.success("Product updated successfully!", {
          position: "top-right" as ToastPosition,
          autoClose: 3000,
        });

        setEditProduct(null);
        setNewCode("");
        setNewName("");
        setNewPrice("");
        setNewDescription("");
        setNewCategory("");
        setNewStock("");
        setNewImage(null);
      } catch (error) {
        toast.error(
          `Failed to update product: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
          {
            position: "top-right" as ToastPosition,
            autoClose: 3000,
          }
        );
      }
    }
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-screen mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Product List
      </h2>

      {/* Search Bar */}
      <div className="mb-6">
        <Input
          type="number"
          placeholder="Search products by Product Code..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border border-[#521635] rounded-none"
        />
      </div>

      {/* Product List Table */}
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-gray-200 rounded-none shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              {/* Product Image */}
              <div className="p-4 flex justify-center">
                {product.image_url ? (
                  <img
                    src={`http://localhost:3000${product.image_url}`}
                    alt={product.product_name || "Product image"}
                    className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-none"
                  />
                ) : (
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-200 flex items-center justify-center rounded-none">
                    <span className="text-gray-500 text-sm">No Image</span>
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="p-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  Product Code:{" "}
                  {product.product_code || "No Product Code Exist"}
                </p>
                <h3 className="text-lg font-semibold text-gray-800 truncate">
                  {product.product_name || "Unnamed Product"}
                </h3>
                <p className="text-md font-medium text-gray-900 mt-2">
                  {new Intl.NumberFormat("en-us", {
                    style: "currency",
                    currency: "INR",
                  }).format(product.price) || "Not available"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Category: {product.category || "Unknown"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Stock: {product.stock}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="p-4 border-t border-gray-200 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <Button
                  onClick={() => handleEdit(product)}
                  className="text-blue-500 hover:underline underline-offset-4 hover:text-white hover:bg-[#521635] rounded-none text-sm w-full sm:w-auto"
                  variant="ghost"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(product.id)}
                  className="text-red-500 hover:underline underline-offset-4 hover:text-white hover:bg-[#521635] rounded-none text-sm w-full sm:w-auto"
                  variant="ghost"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Product Modal */}
      {editProduct && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 shadow-lg w-screen md:w-2/4 lg:ml-0 lg:w-2/4 rounded-none">
            <h3 className="text-2xl font-semibold text-[#521635] mb-4">
              Edit Product
            </h3>
            <div className="mb-4">
              <Label className="block text-sm font-medium text-gray-700">
                PRODUCT CODE
              </Label>
              <Input
                type="number"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                className="border border-[#521635] p-2 rounded-none"
              />
            </div>
            <div className="mb-4">
              <Label className="block text-sm font-medium text-gray-700">
                Name
              </Label>
              <Input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="border border-[#521635] p-2 rounded-none"
              />
            </div>
            <div className="mb-4">
              <Label className="block text-sm font-medium text-gray-700">
                Price
              </Label>
              <Input
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="border border-[#521635] p-2 rounded-none"
                min="0"
              />
            </div>
            <div className="mb-4">
              <Label className="block text-sm font-medium text-gray-700">
                Description
              </Label>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full border border-[#521635] p-2 rounded-none"
                rows={4}
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="category" className="text-[#521635] pb-1">
                Category
              </Label>
              <Select
                onValueChange={(value) => setNewCategory(value)}
                value={newCategory}
              >
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
            <div className="mb-4">
              <Label className="block text-sm font-medium text-gray-700">
                Stock
              </Label>
              <Input
                type="number"
                value={newStock}
                onChange={(e) => setNewStock(e.target.value)}
                className="border border-[#521635] p-2 rounded-none"
                min="0"
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="productImage" className="text-[#521635] pb-1">
                Product Image
              </Label>
              <Input
                type="file"
                id="productImage"
                onChange={(e) =>
                  setNewImage(e.target.files ? e.target.files[0] : null)
                }
                className="border border-[#521635] p-2 rounded-none"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setEditProduct(null)}
                className="px-4 py-2 bg-gray-300 text-black rounded-none hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-[#521635] text-white rounded-none hover:bg-[#6a2542]"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default DisplayProducts;
