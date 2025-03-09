"use client";

import Slider from "react-slick";
import { FaQuoteLeft, FaStar } from "react-icons/fa";
import Image from "next/image";
import "./testimonials.css";
import AnimatedCubesBackground from "./testimonialsBg";

const testimonials = [
  {
    id: 1,
    name: "Emily R.",
    image: "/images/user.png",
    quote:
      "The GiftBox was the perfect surprise for my friend's birthday. Beautiful packaging and amazing quality! The attention to detail was remarkable.",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael S.",
    image: "/images/user.png",
    quote:
      "Exceptional service! The customization options made my corporate gifting so much easier.",
    rating: 5,
  },
  {
    id: 3,
    name: "Sarah L.",
    image: "/images/user.png",
    quote:
      "The eco-friendly packaging really impressed me. Will definitely order again!",
    rating: 5,
  },
  {
    id: 4,
    name: "David P.",
    image: "/images/user.png",
    quote:
      "Perfect for special occasions. The presentation was absolutely stunning!",
    rating: 5,
  },
  {
    id: 5,
    name: "Jennifer K.",
    image: "/images/user.png",
    quote:
      "Outstanding quality and service. My go-to place for all gift hampers now.",
    rating: 5,
  },
  {
    id: 6,
    name: "Robert M.",
    image: "/images/user.png",
    quote:
      "The variety and customization options are amazing. Highly recommended!",
    rating: 5,
  },
];

export default function Testimonials() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <section className="w-full py-12 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-70">
        <AnimatedCubesBackground />
      </div>
      <div className="relative z-10 max-w-[1440px] mx-4 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4">
          <h2 className="text-5xl text-headline font-alegreya font-bold mb-2">
            What Our Customers Say?
          </h2>
          <p className="text-lg font-bold font-mont text-bg4">
            Unwrapping joy, one gift at a time!
          </p>
        </div>

        <div className="relative -mx-4">
          <Slider {...settings} className="testimonials-slider">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="px-4 py-8 h-full">
                <div className="bg-[#f9f9f9] bg-opacity-85 rounded-lg p-6 shadow-xl hover:shadow-xl hover:bg-opacity-100 transition-shadow duration-300 h-full flex flex-col">
                  <div className="flex justify-center mb-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <FaQuoteLeft className="text-bg3 text-xl mb-2 flex-shrink-0" />
                  <p className="text-gray-700 mb-4 flex-grow font-mont text-md">
                    {testimonial.quote}
                  </p>
                  <div className="flex items-center justify-center mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FaStar key={i} className="text-bg2" />
                    ))}
                  </div>
                  <p className="font-semibold font-alegreya text-gray-800 text-center">
                    {testimonial.name}
                  </p>
                </div>
              </div>
            ))}
          </Slider>
        </div>

        <div className="text-center mt-12 z-10">
          <button className="bg-headline/90 hover:scale-105 text-bg1 font-mont text-sm font-semibold py-3 px-8 rounded-full transition-colors duration-300">
            Share Your Experience
          </button>
        </div>
      </div>
    </section>
  );
}
