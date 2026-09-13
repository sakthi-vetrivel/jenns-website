import type { Metadata } from "next";
import OrderForm from "@/components/OrderForm";

export const metadata: Metadata = {
  title: "Make yours · Jenn",
  description: "Choose your leather, size, cord, charm, and stamp. Reserve, then pay by Venmo.",
};

export default function OrderPage() {
  return (
    <>
      <OrderForm />
      {/* Clears the fixed total bar so the footer's last line stays readable. */}
      <div className="h-24" aria-hidden />
    </>
  );
}
