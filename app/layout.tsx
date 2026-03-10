import type { Metadata } from "next";
import "./globals.css";
import { NavBar } from "@/components/ui";

export const metadata: Metadata = {
  title: "Karotte & Erbse — Catering Automation",
  description:
    "Smart catering menu planning, shopping list generation, and inventory management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-50 antialiased">
        <div className="min-h-screen">
          <NavBar />
          <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
