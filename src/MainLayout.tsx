"use strict"

import { ClerkProvider } from "@clerk/clerk-react";
import { FooterSec } from "./components/Footer/FooterSec";
import NavbarSec from "./components/Navbar/Navbar";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <div className="min-h-screen bg-background flex flex-col">
        <NavbarSec />
        <main className="flex-1">{children}</main>
        <FooterSec />
      </div>
    </ClerkProvider>
  );
};
