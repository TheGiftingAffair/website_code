"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push("/");
      //   alert("Page not found! Redirecting you to the homepage.");
    }, 2000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Image
        // src="/images/logo.jpg"
        src="/images/logo2.png"
        alt="The Gifting Affair Logo"
        width={150}
        height={150}
        className="mb-4 rounded-full"
      />
      {/* <h1 className="font-macondo font-bold text-2xl text-bg4 mb-6">
        The Gifting Affair
      </h1> */}
      <h2 className="text-4xl font-bold mb-4">404 - Page Not Found</h2>
      <p className="text-gray-600 mb-4">
        The page you're looking for doesn't exist.
      </p>
      <p className="text-gray-500">Redirecting to homepage...</p>
    </div>
  );
}
