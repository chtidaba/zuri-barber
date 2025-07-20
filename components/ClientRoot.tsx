"use client";
import { CartProvider } from "@/components/CartContext";
import { EmployeeAuthProvider } from "@/contexts/EmployeeAuthContext";

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <EmployeeAuthProvider>
        {children}
      </EmployeeAuthProvider>
    </CartProvider>
  );
} 