// import type { Metadata } from "next";
// import Script from "next/script";
// import "./globals.css";
// import { CartProvider } from "@/contexts/CartContext";
// import { AuthProvider } from "@/contexts/AuthContext";
// import { Toaster } from "react-hot-toast";
// import { Analytics } from "@vercel/analytics/react";

// export const metadata: Metadata = {
//   metadataBase: new URL("https://thegiftingaffair.com"),
//   title: {
//     default: "The Gifting Affair",
//     template: "%s | The Gifting Affair",
//   },
//   description:
//     "Discover exclusive and luxurious gift hampers for every occasion. Singapore's premier gifting destination for corporate and personal celebrations.",
//   keywords: [
//     "The Gifting Affair",
//     "Singapore Gifts",
//     "Luxury Hampers",
//     "Corporate Gifts",
//     "Gift Baskets Singapore",
//     "Premium Hampers",
//     "Occasion Gifts",
//     "Custom Gift Hampers",
//     "Singapore Gift Delivery",
//     "Luxury Gift Service",
//     "Corporate Gifting Solutions",
//     "Premium Gift Shop",
//   ],
//   authors: [{ name: "The Gifting Affair" }],
//   creator: "The Gifting Affair",
//   publisher: "The Gifting Affair Singapore",
//   formatDetection: {
//     email: false,
//     address: false,
//     telephone: false,
//   },
//   openGraph: {
//     title: "The Gifting Affair | Singapore's Premium Gift Hamper Service",
//     description:
//       "Discover exclusive and luxurious gift hampers for every occasion. Singapore's premier gifting destination.",
//     url: "https://thegiftingaffair.com",
//     siteName: "The Gifting Affair",
//     images: [
//       {
//         url: "/images/logo6.png",
//         width: 1200,
//         height: 630,
//         alt: "The Gifting Affair Logo",
//       },
//     ],
//     locale: "en_SG",
//     type: "website",
//   },
//   robots: {
//     index: true,
//     follow: true,
//     googleBot: {
//       index: true,
//       follow: true,
//       "max-video-preview": -1,
//       "max-image-preview": "large",
//       "max-snippet": -1,
//     },
//   },
//   alternates: {
//     canonical: "https://thegiftingaffair.com",
//   },
//   category: "E-commerce",
//   other: {
//     "geo.region": "SG",
//     "geo.placename": "Singapore",
//   },
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <head>
//         <link rel="icon" href="/favicon.ico" type="image/x-icon" />
//         <Script
//           src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
//           strategy="afterInteractive"
//         />
//         <Script id="google-analytics" strategy="afterInteractive">
//           {`
//             window.dataLayer = window.dataLayer || [];
//             function gtag(){dataLayer.push(arguments);}
//             gtag('js', new Date());
//             gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
//           `}
//         </Script>
//       </head>
//       <body>
//         <AuthProvider>
//           <CartProvider>{children}</CartProvider>
//         </AuthProvider>
//         <Toaster position="top-center" />
//         <Analytics />
//       </body>
//     </html>
//   );
// }

import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";
import MetaPixelTracker from "@/components/MetaPixelTracker";

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
    "gift hampers Singapore",
    "luxury gift hampers Singapore",
    "corporate gifts Singapore",
    "premium gift baskets Singapore",
    "custom gift hampers Singapore",
    "gift delivery Singapore",
    "corporate gifting Singapore",
    "premium gift shop Singapore",
    "birthday gift hampers Singapore",
    "anniversary gifts Singapore",
    "festive gift hampers Singapore",
    "Christmas gifts Singapore",
    "wedding gifts Singapore",
    "personalised gifts Singapore",
    "same day gift delivery Singapore",
    "curated gift boxes Singapore",
    "luxury hampers online Singapore",
    "CNY gifts Singapore",
    "Deepavali gifts Singapore",
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
      "Discover exclusive and luxurious gift hampers for every occasion. Singapore's premier gifting destination for corporate and personal celebrations.",
    url: "https://thegiftingaffair.com",
    siteName: "The Gifting Affair",
    images: [
      {
        url: "/images/logo6.png",
        width: 1200,
        height: 630,
        alt: "The Gifting Affair - Premium Gift Hampers Singapore",
      },
    ],
    locale: "en_SG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Gifting Affair | Singapore's Premium Gift Hamper Service",
    description:
      "Discover exclusive and luxurious gift hampers for every occasion. Singapore's premier gifting destination.",
    images: ["/images/logo6.png"],
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
    // Add once you verify domain in Meta Business Suite:
    // "facebook-domain-verification": "your_verification_code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    name: "The Gifting Affair",
    url: "https://thegiftingaffair.com",
    logo: "https://thegiftingaffair.com/images/logo6.png",
    description:
      "Singapore's premier gifting destination for luxury gift hampers for corporate and personal celebrations.",
    sameAs: [
      // Replace with your actual social handles:
      "https://www.instagram.com/thegiftingaffair",
      "https://www.facebook.com/thegiftingaffair",
    ],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate:
          "https://thegiftingaffair.com/products?search={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />

        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
          `}
        </Script>

        {/* Meta Pixel */}
        <Script id="fb-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${process.env.NEXT_PUBLIC_FB_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
        <MetaPixelTracker />
        <Toaster position="top-center" />
        <Analytics />
      </body>
    </html>
  );
}
