import type { Metadata } from "next";
import "./globals.css";

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
          <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
              <h1 className="text-2xl font-bold text-gray-900">
                Karotte & Erbse
              </h1>
              <p className="text-sm text-gray-600">
                Catering Automation System
              </p>
            </div>
          </header>
          <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
