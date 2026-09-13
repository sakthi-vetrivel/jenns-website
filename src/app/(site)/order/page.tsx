import type { Metadata } from "next";
import OrderForm from "@/components/OrderForm";

export const metadata: Metadata = {
  title: "Make yours · Jenn",
  description: "Choose your leather, size, cord, charm, and stamp. Reserve, then pay by Venmo.",
};

export default function OrderPage() {
  return <OrderForm />;
}
