"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import supabase from "@/Supabase/supabase";
import { useNavigate } from "react-router";

interface UserData {
  id: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phone: string | null;
  orders?: Order[];
  address?: Address | null;
  pendingEmail?: string | null;
}

interface Order {
  id: string;
  order_id: string;
  date: string;
  total: number;
  status: "pending" | "shipped" | "delivered";
  items: OrderItem[];
  shipping_address: string;
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedUser, setEditedUser] = useState<UserData | null>(null);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const router = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router("/login");
        return;
      }

      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select(
          "id, order_id, date, total, status, shipping_address, order_items(id, name, price, quantity)"
        )
        .eq("user_id", user.id);

      const { data: addressData, error: addressError } = await supabase
        .from("addresses")
        .select("id, street, city, state, zip")
        .eq("user_id", user.id)
        .limit(1)
        .single();

      if (ordersError) console.error("Orders fetch error:", ordersError);
      if (addressError && addressError.code !== "PGRST116")
        console.error("Address fetch error:", addressError);

      const userData: UserData = {
        id: user.id,
        email: user.email || null,
        displayName: user.user_metadata?.full_name || null,
        photoURL: user.user_metadata?.profile_image || null,
        phone: user.user_metadata?.phone || null,
        address: addressData || null,
        orders:
          ordersData?.map((order) => ({
            id: order.id,
            order_id: order.order_id,
            date: new Date(order.date).toISOString().split("T")[0],
            total: order.total,
            status: order.status,
            shipping_address: order.shipping_address,
            items: Array.isArray(order.order_items) ? order.order_items : [],
          })) || [],
        pendingEmail: null,
      };

      setUser(userData);
      setEditedUser(userData);
    };

    fetchUserData();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_OUT") {
          router("/login");
        } else if (session?.user) {
          fetchUserData();
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({ title: "Success", description: "Logged out successfully" });
      router("/login");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to log out",
      });
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEditProfileSave = async () => {
    if (!isEditingProfile) {
      setIsEditingProfile(true);
      return;
    }

    if (!editedUser || !user?.email) return;

    try {
      const { user: currentUser } = (await supabase.auth.getUser()).data;
      if (!currentUser) throw new Error("No authenticated user found");

      if (editedUser.displayName !== user.displayName) {
        await supabase.auth.updateUser({
          data: { full_name: editedUser.displayName },
        });
      }

      if (editedUser.email && editedUser.email !== user.email) {
        if (!validateEmail(editedUser.email)) {
          toast({
            variant: "destructive",
            title: "Invalid Email",
            description: "Please enter a valid email address",
          });
          return;
        }

        const { error: updateError } = await supabase.auth.updateUser({
          email: editedUser.email,
        });
        if (updateError) throw updateError;

        setUser((prev) => (prev ? { ...prev, pendingEmail: editedUser.email } : null));
        setEditedUser((prev) => (prev ? { ...prev, pendingEmail: editedUser.email } : null));
        setEmailVerificationSent(true);

        toast({
          title: "Verification Required",
          description: `A verification email has been sent to ${editedUser.email}. Please verify it.`,
        });
      } else {
        setUser(editedUser);
        setIsEditingProfile(false);
        toast({ title: "Success", description: "Profile updated successfully" });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser((prev) =>
      prev
        ? {
            ...prev,
            [name]: value,
            address: prev.address
              ? { ...prev.address, [name]: value }
              : { id: "", street: "", city: "", state: "", zip: "", [name]: value },
          }
        : null
    );
  };

  const handleEditAddressSave = async () => {
    if (!isEditingAddress) {
      setIsEditingAddress(true);
      return;
    }

    if (!editedUser || !user) return;

    try {
      let addressId = user.address?.id;
      if (addressId) {
        const { error } = await supabase
          .from("addresses")
          .update({
            street: editedUser.address?.street,
            city: editedUser.address?.city,
            state: editedUser.address?.state,
            zip: editedUser.address?.zip,
          })
          .eq("id", addressId)
          .eq("user_id", user.id);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("addresses")
          .insert({
            user_id: user.id,
            street: editedUser.address?.street,
            city: editedUser.address?.city,
            state: editedUser.address?.state,
            zip: editedUser.address?.zip,
          })
          .select()
          .single();

        if (error) throw error;
        addressId = data.id;
      }

      setUser((prev) =>
        prev
          ? {
              ...prev,
              address: {
                id: addressId!,
                street: editedUser.address?.street || "",
                city: editedUser.address?.city || "",
                state: editedUser.address?.state || "",
                zip: editedUser.address?.zip || "",
              },
            }
          : null
      );
      setIsEditingAddress(false);
      toast({ title: "Success", description: "Address updated successfully" });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update address",
      });
    }
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleOrderAction = (order: Order) => {
    toast({
      title: "Order Action",
      description: `No PDF generation available for Order #${order.order_id}.`,
    });
  };

  if (!user || !editedUser) return <div className="text-[#521635] h-screen flex justify-center items-center">Loading...</div>;

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-7xl">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:sticky md:top-6 h-fit rounded-none border-[#521635]">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4 mb-6">
              <Avatar className="rounded-none">
                <AvatarFallback className="bg-[#521635] text-white">
                  {user.displayName?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{user.displayName || "User"}</h3>
                <p className="text-sm text-[#521635]">{user.email}</p>
              </div>
            </div>
            <Button
              className="w-full rounded-none text-white bg-[#521635] hover:underline underline-offset-4"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </CardContent>
        </Card>

        <div className="md:col-span-3">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 rounded-none">
              <TabsTrigger
                value="profile"
                className="rounded-none border-[#521635] data-[state=active]:bg-[#521635] data-[state=active]:text-white"
              >
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className="rounded-none border-[#521635] data-[state=active]:bg-[#521635] data-[state=active]:text-white"
              >
                Orders
              </TabsTrigger>
              <TabsTrigger
                value="addresses"
                className="rounded-none border-[#521635] data-[state=active]:bg-[#521635] data-[state=active]:text-white"
              >
                Address
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card className="rounded-none border-[#521635]">
                <CardHeader>
                  <CardTitle className="text-[#521635]">Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm text-[#521635]">Name</p>
                    {isEditingProfile ? (
                      <Input
                        name="displayName"
                        value={editedUser.displayName || ""}
                        onChange={handleInputChange}
                        className="rounded-none border-[#521635] focus:ring-[#521635]"
                      />
                    ) : (
                      <p>{user.displayName || "Not set"}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-[#521635]">Email</p>
                    {isEditingProfile ? (
                      <Input
                        name="email"
                        value={editedUser.email || ""}
                        onChange={handleInputChange}
                        className="rounded-none border-[#521635] focus:ring-[#521635]"
                        type="email"
                      />
                    ) : (
                      <p>{user.email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-[#521635]">Phone</p>
                    {isEditingProfile ? (
                      <Input
                        name="phone"
                        value={editedUser.phone || ""}
                        onChange={handleInputChange}
                        className="rounded-none border-[#521635] focus:ring-[#521635]"
                        type="tel"
                      />
                    ) : (
                      <p>{user.phone || "Not set"}</p>
                    )}
                  </div>
                  {user.pendingEmail && (
                    <p className="text-sm text-[#521635]">
                      Pending email: {user.pendingEmail} (Verification pending)
                    </p>
                  )}
                  {emailVerificationSent && !isEditingProfile && (
                    <p className="text-sm text-[#521635]">
                      Verification email sent to {user.pendingEmail}. Please check your inbox.
                    </p>
                  )}
                  <Button
                    onClick={handleEditProfileSave}
                    className="rounded-none bg-[#521635] hover:underline underline-offset-4 text-white"
                    disabled={isEditingProfile && (!editedUser.displayName || !editedUser.email)}
                  >
                    {isEditingProfile ? "Save" : "Edit Profile"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders">
              <Card className="rounded-none border-[#521635]">
                <CardHeader>
                  <CardTitle className="text-[#521635]">Your Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-[#521635]">
                        <TableHead className="text-[#521635]">Order ID</TableHead>
                        <TableHead className="text-[#521635]">Date</TableHead>
                        <TableHead className="text-[#521635]">Total</TableHead>
                        <TableHead className="text-[#521635]">Status</TableHead>
                        <TableHead className="text-[#521635] text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {user.orders?.map((order) => (
                        <TableRow key={order.id} className="border-[#521635]">
                          <TableCell>{order.order_id}</TableCell>
                          <TableCell>{order.date}</TableCell>
                          <TableCell>₹{order.total.toFixed(2)}</TableCell>
                          <TableCell>
                            <span
                              className={`capitalize px-2 py-1 text-xs ${
                                order.status === "delivered"
                                  ? "bg-[#521635] text-white"
                                  : order.status === "shipped"
                                  ? "bg-[#521635]/70 text-white"
                                  : "bg-[#521635]/50 text-white"
                              }`}
                            >
                              {order.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              className="rounded-none bg-[#521635] hover:underline underline-offset-4 hover:text-white"
                              onClick={() => handleViewDetails(order)}
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {selectedOrder && (
                    <div className="mt-6 p-4 border border-[#521635] rounded-none">
                      <h3 className="text-lg font-semibold text-[#521635]">
                        Order Details
                      </h3>
                      <h5>Order Id: #{selectedOrder.order_id}</h5>
                      <div className="space-y-2 mt-2">
                        <p>
                          <strong>Items:</strong>{" "}
                          {selectedOrder.items.length > 0 ? (
                            selectedOrder.items.map((item) => (
                              <span key={item.id}>
                                {item.name} - ₹{item.price.toFixed(2)} x {item.quantity}
                                <br />
                              </span>
                            ))
                          ) : (
                            "No items in this order."
                          )}
                        </p>
                        <p>
                          <strong>Total:</strong> ₹{selectedOrder.total.toFixed(2)}
                        </p>
                        <p>
                          <strong>Shipping Address:</strong> {selectedOrder.shipping_address}
                        </p>
                        <p>
                          <strong>Date:</strong> {selectedOrder.date}
                        </p>
                        <p>
                          <strong>Status:</strong> {selectedOrder.status}
                        </p>
                      </div>
                      <div className="mt-4 flex space-x-4">
                        <Button
                          onClick={() => handleOrderAction(selectedOrder)}
                          className="rounded-none bg-[#521635] hover:bg-[#3d1127] text-white"
                        >
                          View Order
                        </Button>
                        <Button
                          onClick={() => setSelectedOrder(null)}
                          className="rounded-none bg-gray-500 hover:bg-gray-600 text-white"
                        >
                          Close
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="addresses">
              <Card className="rounded-none border-[#521635]">
                <CardHeader>
                  <CardTitle className="text-[#521635]">Your Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {user.address?.street ||
                  user.address?.city ||
                  user.address?.state ||
                  user.address?.zip ? (
                    <div className="space-y-2">
                      <p>{user.address.street || "Not set"}</p>
                      <p>
                        {user.address.city || "Not set"}, {user.address.state || "Not set"}{" "}
                        {user.address.zip || "Not set"}
                      </p>
                    </div>
                  ) : (
                    <p className="text-[#521635]">No address set</p>
                  )}

                  {isEditingAddress && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-[#521635]">Street</label>
                        <Input
                          name="street"
                          value={editedUser.address?.street || ""}
                          onChange={handleInputChange}
                          className="rounded-none border-[#521635] focus:ring-[#521635]"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-[#521635]">City</label>
                        <Input
                          name="city"
                          value={editedUser.address?.city || ""}
                          onChange={handleInputChange}
                          className="rounded-none border-[#521635] focus:ring-[#521635]"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-[#521635]">State</label>
                        <Input
                          name="state"
                          value={editedUser.address?.state || ""}
                          onChange={handleInputChange}
                          className="rounded-none border-[#521635] focus:ring-[#521635]"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-[#521635]">ZIP</label>
                        <Input
                          name="zip"
                          value={editedUser.address?.zip || ""}
                          onChange={handleInputChange}
                          className="rounded-none border-[#521635] focus:ring-[#521635]"
                        />
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={handleEditAddressSave}
                    className="rounded-none bg-[#521635] hover:bg-[#521635]/90 text-white"
                  >
                    {isEditingAddress ? "Save Address" : "Edit Address"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;