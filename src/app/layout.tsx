import type { Metadata } from "next";
import { Libre_Caslon_Display, Source_Serif_4, Courier_Prime } from "next/font/google";
import "./globals.css";

const libreCaslon = Libre_Caslon_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-libre-caslon",
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
      className={`${libreCaslon.variable} ${sourceSerif.variable} ${courierPrime.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
