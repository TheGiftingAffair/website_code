import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      "firebasestorage.googleapis.com",
      // Add any other domains you need
    ],
  },
  // async headers() {
  //   return [
  //     {
  //       source: "/(.*)", // Apply to all routes
  //       headers: [
  //         {
  //           key: "Cache-Control",
  //           value: "public, max-age=3600, must-revalidate",
  //         },
  //       ],
  //     },
  //   ];
  // },
};

export default nextConfig;
