"use client";

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebaseConfig"; // Ensure this path matches your Firebase config file location
import Image from "next/image";
import Link from "next/link";
import ConfettiBackground from "./heroBg";
import TypeWriter from "./TypeWriter";

export default function Hero() {
  const [images, setImages] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);
  const [showFirstLine, setShowFirstLine] = useState(true);
  const [showSecondLine, setShowSecondLine] = useState(false);

  // Add new useEffect for fetching images
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "PlaceHolderImages")
        );
        const imageUrls = querySnapshot.docs
          .filter((doc) => doc.id !== "qrcode")
          .map((doc) => doc.data().link);
        setImages(imageUrls);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    // Image slider timer
    const imageTimer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);

    // Typewriter reset timer
    const typewriterTimer = setInterval(() => {
      setShowFirstLine(false);
      setShowSecondLine(false);
      // Small delay before starting the animation again
      setTimeout(() => {
        setShowFirstLine(true);
      }, 100);
    }, 15000);

    return () => {
      clearInterval(imageTimer);
      clearInterval(typewriterTimer);
    };
  }, [images]);

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: "calc(100vh - 100px)" }}
    >
      <div className="absolute inset-0">
        <ConfettiBackground />
      </div>

      {/* Background Image Slider */}
      <div className="absolute inset-0">
        {images.map((src, index) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-1000 bg-black ${
              index === currentImage ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={src}
              alt={`Luxury hamper ${index + 1}`}
              fill
              className="object-cover opacity-75"
              priority={index === 0}
              sizes="100vw"
              unoptimized // Added for external images
            />
          </div>
        ))}
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60" />
      </div>

      {/* Content */}

      <div className="relative flex h-full flex-col items-center justify-center px-4 text-center z-20 text-white">
        <h1 className="mb-4 font-lora text-4xl font-bold md:text-6xl font-alegreya">
          Welcome to The Gifting Affair
          <br />
          <span className="text-bg2 text-3xl md:text-5xl">
            Unwrap Happiness!
          </span>
        </h1>

        <p className="mb-8 mt-4 font-poppins text-md font-mont font-semibold text-bg1 min-h-[3rem]">
          {showFirstLine && (
            <TypeWriter
              text="Discover thoughtfully curated hampers for every occasion,"
              onComplete={() => setShowSecondLine(true)}
            />
          )}
          <br />
          {showSecondLine && (
            <TypeWriter text="handcrafted with love and delivered with care." />
          )}
        </p>

        <div className="flex flex-col gap-4 md:flex-row font-mont">
          <Link
            href="/products"
            className="rounded-full bg-bg1 text-bg4 px-8 py-3 font-bold transition-all hover:scale-105"
          >
            Shop Now
          </Link>

          <a
            href={`https://wa.me/+6587430520?text=${encodeURIComponent(
              "Hello! I'm interested in your hampers."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-bg1 px-8 py-3 font-bold transition-all hover:scale-105"
          >
            Personalized Hampers
          </a>
        </div>

        {/* Slider Navigation Dots */}
        <div className="absolute bottom-8 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`h-2 w-2 rounded-full transition-all ${
                index === currentImage ? "bg-white w-4" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
