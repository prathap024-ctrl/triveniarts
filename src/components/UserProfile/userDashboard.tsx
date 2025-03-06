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
import { useNavigate } from "react-router"; // Use Next.js router

interface UserData {
  id: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  orders?: Order[];
  addresses?: Address[];
  pendingEmail?: string | null;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: "pending" | "shipped" | "delivered";
  items: OrderItem[];
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Address {
  id: string;
  type: "shipping" | "billing";
  street: string;
  city: string;
  state: string;
  zip: string;
}

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<UserData | null>(null);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const [password, setPassword] = useState("");
  const router = useNavigate(); // Updated to useRouter
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Fetch additional user data (e.g., from profiles table)
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("display_name, photo_url")
          .eq("id", user.id)
          .single();

        // Fetch orders
        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select("id, date, total, status, order_items(id, name, price, quantity)")
          .eq("user_id", user.id);

        // Fetch addresses
        const { data: addressesData, error: addressesError } = await supabase
          .from("addresses")
          .select("*")
          .eq("user_id", user.id);

        if (profileError) console.error("Profile fetch error:", profileError);
        if (ordersError) console.error("Orders fetch error:", ordersError);
        if (addressesError)
          console.error("Addresses fetch error:", addressesError);

        const userData: UserData = {
          id: user.id,
          email: user.email || null,
          displayName: profileData?.display_name || user.user_metadata?.full_name || null,
          photoURL: profileData?.photo_url || user.user_metadata?.profile_image || null,
          orders: ordersData?.map((order) => ({
            id: order.id,
            date: new Date(order.date).toISOString().split("T")[0],
            total: order.total,
            status: order.status,
            items: order.order_items,
          })) || [],
          addresses: addressesData || [],
          pendingEmail: null,
        };

        setUser(userData);
        setEditedUser(userData);
      } else {
        router("/login");
      }
    };

    fetchUserData();

    // Listen for auth state changes
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
      toast({
        title: "Success",
        description: "Logged out successfully",
      });
      router("/login");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to log out",
      });
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEditSave = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    if (!editedUser || !user?.email) return;

    try {
      const { user: currentUser } = (await supabase.auth.getUser()).data;

      if (!currentUser) throw new Error("No authenticated user found");

      // Update display name in profiles table or user metadata
      if (editedUser.displayName !== user.displayName) {
        const { error: profileError } = await supabase
          .from("profiles")
          .upsert(
            { id: currentUser.id, display_name: editedUser.displayName },
            { onConflict: "id" }
          );

        if (profileError) throw profileError;

        // Optionally update user metadata
        await supabase.auth.updateUser({
          data: { full_name: editedUser.displayName },
        });
      }

      // Handle email update
      if (editedUser.email && editedUser.email !== user.email) {
        if (!validateEmail(editedUser.email)) {
          toast({
            variant: "destructive",
            title: "Invalid Email",
            description: "Please enter a valid email address",
          });
          return;
        }

        if (!password) {
          toast({
            variant: "destructive",
            title: "Password Required",
            description: "Please enter your current password to update email",
          });
          return;
        }

        // Reauthenticate (Supabase doesn't require this for email updates, but we'll mimic Firebase behavior)
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: user.email,
          password,
        });

        if (signInError) {
          toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "Invalid password. Please try again.",
          });
          return;
        }

        // Update email (Supabase sends a verification email automatically)
        const { error: updateError } = await supabase.auth.updateUser({
          email: editedUser.email,
        });

        if (updateError) throw updateError;

        setUser((prev) =>
          prev ? { ...prev, pendingEmail: editedUser.email } : null
        );
        setEditedUser((prev) =>
          prev ? { ...prev, pendingEmail: editedUser.email } : null
        );
        setEmailVerificationSent(true);
        setPassword("");

        toast({
          title: "Verification Required",
          description: `A verification email has been sent to ${editedUser.email}. Please verify it to complete the email change.`,
        });
      } else {
        setUser(editedUser);
        setIsEditing(false);
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
      }
    } catch (error) {
      console.error("Update error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update profile",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  if (!user || !editedUser) return null;

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-7xl">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
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
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full rounded-none border-[#521635] text-[#521635] hover:bg-[#521635] hover:text-white"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
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
                Addresses
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card className="rounded-none border-[#521635]">
                <CardHeader>
                  <CardTitle className="text-[#521635]">
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm text-[#521635]">Name</p>
                    {isEditing ? (
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
                    {isEditing ? (
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
                    {isEditing && (
                      <div className="space-y-2">
                        <p className="text-sm text-[#521635]">
                          Current Password (required for email changes)
                        </p>
                        <Input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="rounded-none border-[#521635] focus:ring-[#521635]"
                        />
                      </div>
                    )}
                    {user.pendingEmail && (
                      <p className="text-sm text-[#521635]">
                        Pending email: {user.pendingEmail} (Verification
                        pending)
                      </p>
                    )}
                    {emailVerificationSent && !isEditing && (
                      <p className="text-sm text-[#521635]">
                        Verification email sent to {user.pendingEmail}. Please
                        check your inbox and verify to complete the email
                        change.
                      </p>
                    )}
                  </div>
                  <Button
                    onClick={handleEditSave}
                    className="rounded-none bg-[#521635] hover:bg-[#521635]/90 text-white"
                    disabled={
                      isEditing &&
                      (!editedUser.displayName || !editedUser.email)
                    }
                  >
                    {isEditing ? "Save" : "Edit Profile"}
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
                        <TableHead className="text-[#521635]">
                          Order ID
                        </TableHead>
                        <TableHead className="text-[#521635]">Date</TableHead>
                        <TableHead className="text-[#521635]">Total</TableHead>
                        <TableHead className="text-[#521635]">Status</TableHead>
                        <TableHead className="text-[#521635] text-right">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {user.orders?.map((order) => (
                        <TableRow key={order.id} className="border-[#521635]">
                          <TableCell>{order.id}</TableCell>
                          <TableCell>{order.date}</TableCell>
                          <TableCell>${order.total.toFixed(2)}</TableCell>
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
                              variant="ghost"
                              size="sm"
                              className="rounded-none text-[#521635] hover:bg-[#521635] hover:text-white"
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="addresses">
              <Card className="rounded-none border-[#521635]">
                <CardHeader>
                  <CardTitle className="text-[#521635]">
                    Saved Addresses
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {user.addresses?.map((address) => (
                    <div
                      key={address.id}
                      className="border border-[#521635] p-4 space-y-2 rounded-none"
                    >
                      <p className="font-semibold capitalize text-[#521635]">
                        {address.type} Address
                      </p>
                      <p>{address.street}</p>
                      <p>
                        {address.city}, {address.state} {address.zip}
                      </p>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-none border-[#521635] text-[#521635] hover:bg-[#521635] hover:text-white"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-none border-[#521635] text-[#521635] hover:bg-[#521635] hover:text-white"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button className="mt-4 rounded-none bg-[#521635] hover:bg-[#521635]/90 text-white">
                    Add New Address
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