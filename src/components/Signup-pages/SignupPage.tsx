"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import Image from "next/image";
import { Loader2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router";
import { useAuth } from "@/Supabase/authcontext"; // Adjust path to your AuthContext file
import supabase from "@/Supabase/supabase";

export function SignupPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const router = useNavigate();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { signup } = useAuth(); // Use the signup function from AuthContext

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignup = async () => {
    if (password !== passwordConfirmation) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Passwords do not match",
      });
      return;
    }

    setLoading(true);

    try {
      // Use signup from AuthContext
      const { user } = await signup(email, password, `${firstName} ${lastName}`, phone);

      const userId = user?.id;

      if (!userId) throw new Error("User ID not found after signup");

      // If an image is provided, upload it to Supabase Storage
      if (image) {
        const fileExt = image.name.split(".").pop();
        const fileName = `${userId}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("profile-images")
          .upload(fileName, image);

        if (uploadError) throw uploadError;

        // Get the public URL of the uploaded image
        const { data: urlData } = supabase.storage
          .from("profile-images")
          .getPublicUrl(fileName);

        // Update user metadata with the image URL
        const { error: updateError } = await supabase.auth.updateUser({
          data: { profile_image: urlData.publicUrl },
        });

        if (updateError) throw updateError;
      }

      toast({
        title: "Success",
        description: "Account created! Please check your email to confirm.",
      });
      router("/");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred during signup";
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Card className="z-50 mx-auto rounded-none max-w-md abeezee-regular text-[#521635]">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Sign Up</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first-name">First name</Label>
                <Input
                  id="first-name"
                  placeholder="first name"
                  required
                  onChange={(e) => setFirstName(e.target.value)}
                  value={firstName}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last-name">Last name</Label>
                <Input
                  id="last-name"
                  placeholder="last name"
                  required
                  onChange={(e) => setLastName(e.target.value)}
                  value={lastName}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+91 9876543210"
                required
                onChange={(e) => setPhone(e.target.value)}
                value={phone}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                placeholder="Password"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Confirm Password</Label>
              <Input
                id="password_confirmation"
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                autoComplete="new-password"
                placeholder="Confirm Password"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image">Profile Image (optional)</Label>
              <div className="flex items-end gap-4">
                {imagePreview && (
                  <div className="relative w-16 h-16 rounded-sm overflow-hidden">
                    <Image
                      src={imagePreview}
                      alt="Profile preview"
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                )}
                <div className="flex items-center gap-2 w-full">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full"
                  />
                  {imagePreview && (
                    <X
                      className="cursor-pointer"
                      onClick={() => {
                        setImage(null);
                        setImagePreview(null);
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full rounded-none bg-[#521635] hover:underline underline-offset-4"
              disabled={loading}
              onClick={handleSignup}
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                "Create an account"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SignupPage;