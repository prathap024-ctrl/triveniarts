'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useNavigate } from "react-router";
import { signInWithEmailAndPassword } from "firebase/auth"; // Import Firebase auth method
import { FirebaseError } from 'firebase/app';
import { auth } from "@/Firebase/firebase"; // Import your Firebase auth instance
import { useToast } from "@/hooks/use-toast"; // Import Shadcn toast hook

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useNavigate();
  const { toast } = useToast(); // Initialize toast hook

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Attempt to sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in successfully:", userCredential.user);

      // Show success toast
      toast({
        title: "Success",
        description: "Logged in successfully!",
      });

      // Redirect to home page (or wherever you want)
      router('/');
    } catch (error) {
      const firebaseError = error as FirebaseError;
      console.error("Login error:", firebaseError);

      // Handle specific Firebase errors with toast
      switch (firebaseError.code) {
        case 'auth/user-not-found':
          toast({
            variant: "destructive",
            title: "Error",
            description: "No user found with this email",
          });
          break;
        case 'auth/wrong-password':
          toast({
            variant: "destructive",
            title: "Error",
            description: "Incorrect password",
          });
          break;
        case 'auth/invalid-email':
          toast({
            variant: "destructive",
            title: "Error",
            description: "Invalid email format",
          });
          break;
        case 'auth/too-many-requests':
          toast({
            variant: "destructive",
            title: "Error",
            description: "Too many attempts, please try again later",
          });
          break;
        default:
          toast({
            variant: "destructive",
            title: "Error",
            description: "An error occurred during login",
          });
      }
    }
  };

  return (
    <div className="min-h-auto flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <span
              className="font-medium text-[#521635] cursor-pointer hover:underline underline-offset-4"
              onClick={() => router('/sign-up')}
            >
              create a new account
            </span>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </Label>
              <div className="mt-1">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </Label>
              <div className="mt-1">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                  placeholder="Enter your password"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a href="#" className="font-medium text-[#521635] hover:underline underline-offset-4">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full flex justify-center py-2 px-4 bg-[#521635] rounded-none hover:underline underline-offset-4"
            >
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}