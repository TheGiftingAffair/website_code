import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: "The Gifting Affair",
  description: "Discover exclusive hampers for every occasion.",
  keywords: "hampers, gifts, shopping, online store",
  // authors: [{ name: "Your Name", url: "https://yourwebsite.com" }],
  icons: {
    icon: "/images/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </head>
      <body>
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
