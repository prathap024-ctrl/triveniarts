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
import { useState, useEffect } from "react";
import { Loader2, X, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router";
import { useAuth } from "@/Supabase/authcontext";
import supabase from "@/Supabase/supabase";
import { Progress } from "@/components/ui/progress";

export function SignupPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();
  const router = useNavigate();
  const { user, signup, loading: authLoading } = useAuth();

  useEffect(() => {
    if (user) {
      router("/");
    }
  }, [user, router]);

  useEffect(() => {
    const calculateStrength = (pwd: string) => {
      let score = 0;
      if (pwd.length >= 8) score += 25;
      if (/[A-Za-z]/.test(pwd)) score += 25;
      if (/\d/.test(pwd)) score += 25;
      if (/[!@#$%^&*+=-_]/.test(pwd)) score += 25;
      return score;
    };
    setPasswordStrength(calculateStrength(password));
  }, [password]);

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 size={32} className="animate-spin" />
      </div>
    );
  }

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

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setPasswordConfirmation("");
    setImage(null);
    setImagePreview(null);
    setPasswordStrength(0);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+\d{1,3}\s\d{6,14}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*+=-_])[A-Za-z\d!@#$%^&*+=-_]{8,}$/;

    if (!firstName) newErrors.firstName = "First name is required";
    if (!lastName) newErrors.lastName = "Last name is required";
    if (!emailRegex.test(email)) newErrors.email = "Invalid email format";
    if (!phoneRegex.test(phone)) newErrors.phone = "Invalid phone number (e.g., +91 9876543210)";
    if (!passwordRegex.test(password)) {
      newErrors.password = "Password must be at least 8 characters with a letter, a number, and a special character";
    }
    if (password !== passwordConfirmation) {
      newErrors.passwordConfirmation = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const signupData = await signup(email, password, `${firstName} ${lastName}`, phone);
      console.log("Signup data:", signupData);

      const userId = signupData.user?.id;
      if (!userId) throw new Error("User ID not found after signup");

      if (image) {
        const fileExt = image.name.split(".").pop();
        const fileName = `${userId}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("profile-images")
          .upload(fileName, image);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("profile-images")
          .getPublicUrl(fileName);

        const { error: updateError } = await supabase.auth.updateUser({
          data: { profile_image: urlData.publicUrl },
        });

        if (updateError) throw updateError;
      }

      toast({
        title: "Success",
        description: "Account created successfully!",
      });
      resetForm();
      router("/");
    } catch (error) {
      let errorMessage = "An error occurred during signup";
      if (error instanceof Error) {
        errorMessage = error.message.includes("User already registered")
          ? "An account with this email already exists."
          : error.message;
      }
      console.error("Signup error:", error);
      toast({ variant: "destructive", title: "Error", description: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg:p-20">
      <Card className="z-50 mx-auto rounded-none max-w-md abeezee-regular text-[#521635] shadow-lg">
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
                {errors.firstName && <span className="text-xs text-red-500">{errors.firstName}</span>}
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
                {errors.lastName && <span className="text-xs text-red-500">{errors.lastName}</span>}
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
              {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
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
              {errors.phone && <span className="text-xs text-red-500">{errors.phone}</span>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  placeholder="Password (e.g., Pass123!)"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#521635]"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {password && (
                <div className="flex items-center gap-2">
                  <Progress value={passwordStrength} className="w-full" />
                  <span className="text-xs">
                    {passwordStrength <= 25 ? "Weak" : passwordStrength <= 50 ? "Fair" : passwordStrength <= 75 ? "Good" : "Strong"}
                  </span>
                </div>
              )}
              {errors.password && <span className="text-xs text-red-500">{errors.password}</span>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password_confirmation">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="password_confirmation"
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  autoComplete="new-password"
                  placeholder="Confirm Password"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#521635]"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.passwordConfirmation && (
                <span className="text-xs text-red-500">{errors.passwordConfirmation}</span>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image">Profile Image (optional)</Label>
              <div className="flex items-end gap-4">
                {imagePreview && (
                  <div className="relative w-16 h-16 rounded-sm overflow-hidden">
                    <img src={imagePreview} alt="Profile preview" className="fill object-cover" />
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
              {loading ? <Loader2 size={16} className="animate-spin" /> : "Create an account"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SignupPage;