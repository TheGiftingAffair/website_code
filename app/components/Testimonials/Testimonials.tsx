"use client";

import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import Image from "next/image";
import "./testimonials.css";
import AnimatedCubesBackground from "./testimonialsBg";

const testimonials = [
  {
    id: 1,
    name: "Sarita",
    role: "",
    location: "",
    image: "/images/user1.png",
    quote:
      "I ordered Diwali gifts from Gifting Affair for my office colleagues and friends. They were beautifully packed and thoughtfully curated. Perfect for spreading festive joy with elegance and charm. Price was also reasonable. Will surely buy again.",
    rating: 5,
  },
  {
    id: 2,
    name: "Prerna Soni Thakkar",
    role: "",
    location: "",
    image: "/images/user2.png",
    quote:
      "Customised on request at short notice and delivered in time. Also it came out beautiful hamper, even better than expected. Quite happy!! Recommend",
    rating: 5,
  },

  {
    id: 3,
    name: "Catryne ee",
    role: "",
    location: "",
    image: "/images/user3.png",
    quote:
      "I recently purchased a CNY gift hamper from The Gifting Affair and was really impressed! The selection was great, and everything was packaged beautifully. Perfect for gifting during festive season. Highly recommend if you're looking for a thoughtful and quality gift.",
    rating: 5,
  },
  {
    id: 4,
    name: "Savita Aggarwal",
    role: "",
    location: "",
    image: "/images/user4.png",
    quote:
      "I had the opportunity to buy my first hamper for our distant relative from The Gifting Affair. She went all the way to customise my hamper as per my requirement. Am sure our relatives will surely like it too. Thanks for arranging all the things at the last minute. I would surely recommend her for all your gifting needs.",
    rating: 5,
  },
];

const communityPhotos = [
  { id: 1, src: "/images/customers/family.jpg", alt: "customer review" },
  { id: 2, src: "/images/customers/family2.jpg", alt: "customer review" },
  { id: 3, src: "/images/customers/family3.jpg", alt: "customer review" },
  { id: 4, src: "/images/customers/family4.jpg", alt: "customer review" },
  { id: 5, src: "/images/customers/family5.jpg", alt: "customer review" },
];

export default function Testimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        setIsVisible(true);
      }, 500);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full py-8 sm:py-12 relative bg-gradient-to-r to-bg3/10 from-bg1/40 overflow-hidden">
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-5xl 2xl:text-6xl text-headline font-alegreya font-bold mb-2">
            What Our Community Says
          </h2>
          <p className="text-base sm:text-lg 2xl:text-xl font-bold font-mont text-bg4">
            Real stories from real customers
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mx-auto lg:mr-6">
          {/* Testimonials Section */}
          <div className="relative min-h-[300px] flex items-center justify-center px-2 sm:px-0">
            <div
              className={`transition-opacity duration-500 w-full ${
                isVisible ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="bg-[#f9f9f9] bg-opacity-90 rounded-lg p-6 sm:p-10 shadow-xl">
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[currentTestimonial].rating)].map(
                    (_, i) => (
                      <FaStar key={i} className="text-bg2 text-xl mb-2" />
                    )
                  )}
                </div>
                <p className="text-headline font-alegreya font-semibold text-lg sm:text-xl 2xl:text-2xl mb-6 leading-relaxed">
                  "{testimonials[currentTestimonial].quote}"
                </p>
                <div className="text-center">
                  <p className="font-mont font-bold text-bg4 text-base sm:text-lg 2xl:text-xl">
                    {testimonials[currentTestimonial].name}
                  </p>
                  <p className="font-mont text-bg3 italic font-semibold text-xs sm:text-sm 2xl:text-base">
                    {testimonials[currentTestimonial].role &&
                      testimonials[currentTestimonial].role}
                    {testimonials[currentTestimonial].role &&
                      testimonials[currentTestimonial].location &&
                      " • "}
                    {testimonials[currentTestimonial].location &&
                      testimonials[currentTestimonial].location}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-4 gap-2 absolute bottom-4">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setIsVisible(false);
                    setTimeout(() => {
                      setCurrentTestimonial(idx);
                      setIsVisible(true);
                    }, 500);
                  }}
                  className={`w-2 h-2 rounded-full ${
                    currentTestimonial === idx ? "bg-bg2" : "bg-bg1"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Updated Photo Collage Section */}
          <div className="grid mt-8 mb-14 grid-cols-[minmax(90px,120px)_minmax(90px,120px)_minmax(90px,120px)] md:grid-cols-[minmax(120px,180px)_minmax(120px,180px)_minmax(120px,180px)] grid-rows-[110px_60px] gap-2 sm:gap-4 relative mx-auto lg:ml-6">
            {/* Large yellow section - top left */}
            <div className="relative row-start-1 col-start-1 col-span-2 row-span-2 h-48 overflow-hidden rounded-lg shadow-lg">
              <Image
                src={communityPhotos[0].src}
                alt={communityPhotos[0].alt}
                fill
                className="object-cover rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
              />
            </div>

            {/* Pink section - top right */}
            <div className="relative col-span-1 row-span-1 row-start-1 col-start-3 h-48 overflow-hidden rounded-lg shadow-lg">
              <Image
                src={communityPhotos[1].src}
                alt={communityPhotos[1].alt}
                fill
                className="object-cover rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
              />
            </div>

            {/* Light blue section - bottom left */}
            <div className="relative col-span-1 row-span-1 row-start-3 col-start-1 h-36 overflow-hidden rounded-lg shadow-lg">
              <Image
                src={communityPhotos[2].src}
                alt={communityPhotos[2].alt}
                fill
                className="object-cover my-3 md:my-0 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
              />
            </div>

            {/* Green section - bottom right */}
            <div className="relative col-span-1 row-span-1 col-start-2 row-start-3 h-36 overflow-hidden rounded-lg shadow-lg">
              <Image
                src={communityPhotos[3].src}
                alt={communityPhotos[3].alt}
                fill
                className="object-cover my-3 md:my-0 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="relative col-span-1 row-span-1 col-start-3 row-start-3 h-36 overflow-hidden rounded-lg shadow-lg">
              <Image
                src={communityPhotos[4].src}
                alt={communityPhotos[4].alt}
                fill
                className="object-cover my-3 md:my-0 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
