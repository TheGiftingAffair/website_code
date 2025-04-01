import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  metadataBase: new URL("https://thegiftingaffair.com"),
  title: {
    default: "The Gifting Affair",
    template: "%s | The Gifting Affair",
  },
  description:
    "Discover exclusive and luxurious gift hampers for every occasion. Singapore's premier gifting destination for corporate and personal celebrations.",
  keywords: [
    "The Gifting Affair",
    "Singapore Gifts",
    "Luxury Hampers",
    "Corporate Gifts",
    "Gift Baskets Singapore",
    "Premium Hampers",
    "Occasion Gifts",
    "Custom Gift Hampers",
    "Singapore Gift Delivery",
    "Luxury Gift Service",
    "Corporate Gifting Solutions",
    "Premium Gift Shop",
  ],
  authors: [{ name: "The Gifting Affair" }],
  creator: "The Gifting Affair",
  publisher: "The Gifting Affair Singapore",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "The Gifting Affair | Singapore's Premium Gift Hamper Service",
    description:
      "Discover exclusive and luxurious gift hampers for every occasion. Singapore's premier gifting destination.",
    url: "https://thegiftingaffair.com",
    siteName: "The Gifting Affair",
    images: [
      {
        url: "/images/logo2.png",
        width: 1200,
        height: 630,
        alt: "The Gifting Affair Logo",
      },
    ],
    locale: "en_SG",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://thegiftingaffair.com",
  },
  category: "E-commerce",
  other: {
    "geo.region": "SG",
    "geo.placename": "Singapore",
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
        <Analytics />
      </body>
    </html>
  );
}
