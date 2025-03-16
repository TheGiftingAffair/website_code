"use client";
import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
// import ConfettiBackground from "./ConfettiBackground";
import useIntersectionObserver from "./useIntersectionObserver";
// import "./bestSellers.css";

const categories = [
  {
    title: "Shop by Categories",
    description: "Perfect for birthdays, anniversaries, and celebrations.",
    image: "/images/hampers/occasional.jpg",
    span: "col-span-2",
    section: "shop-by-categories",
  },
  {
    title: "Special Hampers",
    description: "Collection of limited time Hampers.",
    image: "/images/hampers/gourmet.jpg",
    span: "col-span-1",
    section: "special-hampers",
  },
  {
    title: "Shop by Occasion",
    description: "A versatile collection for any occasion.",
    image: "/images/hampers/corporate.jpg",
    span: "col-span-1",
    section: "shop-by-occasion",
  },
  {
    title: "Shop by Price",
    description: "Affordable hampers for every budget.",
    image: "/images/hampers/combo.jpg",
    span: "col-span-2",
    section: "shop-by-price",
  },
];

//@ts-ignore
const CategoryCard = ({ category, index }) => {
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.2,
    rootMargin: "50px",
  });

  const handleClick = () => {
    const element = document.getElementById(category.section);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      ref={ref as any}
      onClick={handleClick}
      className={`relative overflow-hidden rounded-lg hover:cursor-pointer shadow-lg group ${
        category.span
      } lg:${category.span} transition-all duration-500  overflow-clip ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      }`}
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      <div className="relative h-full w-full hover:scale-[1.02]">
        <Image
          src={category.image}
          alt={category.title}
          fill
          className="object-cover transition-all duration-700 ease-out group-hover:scale-105 "
        />
        <div className="absolute inset-0 bg-black bg-opacity-60 transition-opacity group-hover:bg-opacity-45" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <h3 className="text-xl lg:text-2xl 2xl:text-3xl font-bold font-mont mb-1">
          {category.title}
        </h3>
        <p className="text-xs 2xl:text-sm mb-2 opacity-90 font-semibold italic">
          {category.description}
        </p>
      </div>
    </div>
  );
};

export default function Categories() {
  return (
    <section
      className="relative overflow-hidden bg-gradient-to-r from-bg3/10 to-bg1/40 min-h-[calc(100vh - 50px)] md:h-[calc(100vh - 50px)]"
      style={{
        height: "calc(100vh - 50px)",
      }}
    >
      {/* <section className="relative overflow-hidden bg-gradient-to-b from-bg3 to-bg1 min-h-[calc(100vh - 50px)] md:h-[calc(100vh - 50px)]"> */}
      {/* <div className="absolute inset-0 bg-scrolling-pattern animate-bg-scroll opacity-75"></div> */}

      {/* <ConfettiBackground /> */}
      <div className="container mx-auto max-w-7xl h-full px-4 py-4 relative z-10">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-5xl 2xl:text-6xl font-bold mb-1 mt-5 md:mt-3 font-alegreya text-headline">
            Discover Our Hampers
          </h2>
          <p className="text-black font-semibold font-mont text-sm md:text-md 2xl:text-lg">
            Explore the perfect hampers for all occasions, tastes, and purposes!
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 md:gap-4 space-y-2 gap-2 md:space-y-0 md:mx-24 h-[calc(100%-260px)] md:h-[calc(100%-220px)] 2xl:h-[calc(100%-280px)]">
          {categories.map((category, index) => (
            <CategoryCard
              key={category.title}
              category={category}
              index={index}
            />
          ))}
        </div>

        <div className="text-center mt-4 z-10">
          <p className="text-black font-mont font-semibold text-sm 2xl:text-lg mb-2 mt-6">
            Not sure which hamper to pick? Explore our entire collection now!
          </p>
          <Link
            href="/products"
            className="inline-block bg-headline/90 hover:scale-105 duration-300 hover:bg-headline text-white px-8 py-3 rounded-full font-medium 
              transform transition-all hover:shadow-lg text-base 2xl:text-2xl"
          >
            View All Hampers
          </Link>
        </div>
      </div>
    </section>
  );
}
