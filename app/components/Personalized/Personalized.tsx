"use client";
import React, { useState, useEffect } from "react";
import TypewriterText from "./TypewriterText";
import Image from "next/image";

const colorsWarm = [
  "#FFF0E5", // slightly muted bg1
  "#FFCC40", // slightly muted bg2
  "#FF9030", // slightly muted bg3
  "#FF4535", // slightly muted bg4
  "#FF2A20", // slightly muted headline
  "#FFE5D5", // slightly muted warm tone
];

const createGradient = (colors: string[], angle: string = "60deg") => {
  // @ts-ignore
  let gradientStops = [];

  // First half
  colors.forEach((color, i) => {
    const pos = (i / colors.length / 2) * 100;
    gradientStops.push(`${color} ${pos - 10}%`);
    gradientStops.push(`${color} ${pos}%`);
  });

  // Second half
  colors.forEach((color, i) => {
    const pos = (i / colors.length / 2) * 100 + 50;
    gradientStops.push(`${color} ${pos - 10}%`);
    gradientStops.push(`${color} ${pos}%`);
  });

  // @ts-ignore
  return `linear-gradient(${angle}, ${gradientStops.join(", ")})`;
};

const gradientStyle = {
  backgroundImage: `${createGradient(colorsWarm)}, ${createGradient(
    colorsWarm,
    "-60deg"
  )}`,
  backgroundColor: "#FA812F",
  backgroundSize: "6em 10.32em",
  backgroundBlendMode: "multiply, normal",
  minHeight: "100px",
  padding: "1rem 0",
};

const Personalized = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const images = [
    "/images/hampers/hero1.jpg",
    "/images/hampers/hero2.jpg",
    "/images/hampers/hero3.jpg",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleWhatsAppClick = () => {
    window.open(
      `https://wa.me/+6587430520?text=${encodeURIComponent(
        "Hello! I'm interested in your hampers."
      )}`,
      "_blank"
    );
  };

  return (
    <div
      // className="relative w-full overflow-hidden py-4 md:py-8 flex items-center flex-col justify-center"
      className="relative w-full overflow-hidden py-4 md:py-8 flex items-center flex-col justify-center bg-gradient-to-r from-bg1/40 to-bg4/10"
      // style={{
      //   minHeight: "100px",
      //   backgroundColor: "#ffffff",
      //   backgroundImage: `
      //     linear-gradient(45deg, transparent 25%, rgba(255, 240, 230, 0.5) 25%, rgba(255, 240, 230, 0.5) 75%, transparent 75%),
      //     linear-gradient(-45deg, transparent 25%, rgba(255, 240, 230, 0.5) 25%, rgba(255, 240, 230, 0.5) 75%, transparent 75%)
      //   `,
      //   backgroundSize: "60px 60px",
      //   backgroundPosition: "0 0, 30px 30px",
      //   backgroundBlendMode: "multiply",
      // }}
    >
      {/* <div className="absolute inset-0 bg-white" /> */}
      <div className="absolute -left-2 bottom-2 md:bottom-12 md:-left-4 w-24 md:w-60 h-20 md:h-44 z-20 drop-shadow-lg opacity-85 sm:block">
        <Image
          src="/images/hampers/custom1.png"
          alt="Footer decoration 1"
          fill
          className="object-contain"
        />
      </div>
      <div className="absolute -right-2 bottom-2 md:bottom-12 md:-right-4 w-24 md:w-60 h-20 md:h-44 z-20 drop-shadow-lg opacity-85 sm:block">
        <Image
          src="/images/hampers/custom2.png"
          alt="Footer decoration 1"
          fill
          className="object-contain"
        />
      </div>
      {/* Content Overlay */}
      <h2 className="text-3xl md:text-5xl font-alegreya text-headline font-bold mb-4 md:mb-6 relative mt-2 md:mt-4 z-10 drop-shadow-lg text-center px-4">
        Want Personalized Hampers?
      </h2>
      <p className="text-sm md:text-md text-bg4/95 font-domine font-bold h-12 md:h-16 text-center max-w-2xl px-4 relative z-10 drop-shadow">
        <TypewriterText />
      </p>

      <button
        onClick={handleWhatsAppClick}
        className="bg-green-500 hover:bg-green-600 text-white hover:text-white px-6 md:px-8 py-2 md:py-3 mb-2 font-mont text-sm md:text-base font-semibold rounded-full 
          flex items-center gap-2 transition-all shadow-lg relative z-10"
      >
        Chat on WhatsApp
      </button>
    </div>
  );
};

export default Personalized;
