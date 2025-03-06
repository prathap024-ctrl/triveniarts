'use client';

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "@/Firebase/firebase";
import { applyActionCode, updateEmail } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { FirebaseError } from "firebase/app";

const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleVerification = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const oobCode = urlParams.get('oobCode');
        
        if (oobCode && auth.currentUser) {
          // Apply the verification code
          await applyActionCode(auth, oobCode);
          
          // Get the new email from the URL parameters (Firebase includes it)
          const newEmail = urlParams.get('continueUrl')?.match(/email=([^&]+)/)?.[1];
          
          if (newEmail && auth.currentUser.email !== newEmail) {
            await updateEmail(auth.currentUser, newEmail);
          }

          toast({
            title: "Success",
            description: "Email verified and updated successfully",
          });
          navigate('/dashboard');
        } else {
          throw new Error("Invalid verification link");
        }
      } catch (error: unknown) {
        console.error("Verification error:", error);
        const firebaseError = error as FirebaseError;
        toast({
          variant: "destructive",
          title: "Error",
          description: firebaseError.message || "Failed to verify email",
        });
        navigate('/dashboard');
      }
    };

    handleVerification();
  }, [navigate, toast]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin h-8 w-8 border-b-2 border-[#521635]" />
      <p className="ml-2 text-[#521635]">Verifying your email...</p>
    </div>
  );
};

export default VerifyEmail;