import type { Metadata } from "next";
import { Young_Serif, Source_Serif_4, Courier_Prime } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const youngSerif = Young_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-young-serif",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  weight: "variable",
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
  axes: ["opsz"],
});

const courierPrime = Courier_Prime({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-courier-prime",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jenn · Handmade leather traveler's notebooks",
  description:
    "Leather traveler's notebooks made by hand, one at a time, for one person. Choose your leather, cord, charm, and stamp. Pay by Venmo.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${youngSerif.variable} ${sourceSerif.variable} ${courierPrime.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
