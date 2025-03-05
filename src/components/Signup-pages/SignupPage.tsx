'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useNavigate } from "react-router";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { FirebaseError } from 'firebase/app';
import { auth } from "@/Firebase/firebase";
// Import Toast components from shadcn
import { useToast } from "@/hooks/use-toast";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const router = useNavigate();
  const { toast } = useToast(); // Initialize toast hook

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if passwords match
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Passwords don't match",
      });
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      await updateProfile(userCredential.user, {
        displayName: username
      });

      console.log("User signed up successfully:", userCredential.user);
      
      // Optional: Show success toast
      toast({
        title: "Success",
        description: "Account created successfully!",
      });
      
      router('/');
    } catch (error) {
      const firebaseError = error as FirebaseError;
      console.error("Signup error:", firebaseError);
      console.error("Signup error:", error);
      
      // Handle specific Firebase errors with toast
      switch (firebaseError.code) {
        case 'auth/email-already-in-use':
          toast({
            variant: "destructive",
            title: "Error",
            description: "This email is already in use",
          });
          break;
        case 'auth/invalid-email':
          toast({
            variant: "destructive",
            title: "Error",
            description: "Invalid email format",
          });
          break;
        case 'auth/weak-password':
          toast({
            variant: "destructive",
            title: "Error",
            description: "Password should be at least 6 characters",
          });
          break;
        default:
          toast({
            variant: "destructive",
            title: "Error",
            description: "An error occurred during signup",
          });
      }
    }
  };

  return (
    <div className="min-h-auto flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <span 
              className="font-medium text-[#521635] cursor-pointer hover:underline underline-offset-4"
              onClick={() => router('/login')}
            >
              Sign in
            </span>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <Label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </Label>
              <div className="mt-1">
                <Input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full"
                  placeholder="Choose a username"
                />
              </div>
            </div>

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
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                  placeholder="Create a password"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </Label>
              <div className="mt-1">
                <Input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full"
                  placeholder="Confirm your password"
                />
              </div>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full flex justify-center py-2 px-4 bg-[#521635] rounded-none hover:underline underline-offset-4"
            >
              Sign up
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}