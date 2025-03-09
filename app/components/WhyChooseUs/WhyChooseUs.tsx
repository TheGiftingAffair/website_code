import { FaGift, FaRecycle, FaTruck, FaPencilAlt } from "react-icons/fa";
import "./whyChooseUs.css";
import AnimatedCubesBackground from "../Testimonials/testimonialsBg";

const benefits = [
  {
    icon: <FaGift className="w-8 h-8" />,
    title: "Premium Quality",
    description:
      "Our gift boxes are crafted with the finest materials for a luxurious experience.",
  },
  {
    icon: <FaRecycle className="w-8 h-8" />,
    title: "Eco-Friendly Packaging",
    description:
      "Sustainably sourced materials for an earth-friendly gifting solution.",
  },
  {
    icon: <FaTruck className="w-8 h-8" />,
    title: "Fast Delivery",
    description:
      "Reliable, on-time delivery to ensure your gift arrives perfectly.",
  },
  {
    icon: <FaPencilAlt className="w-8 h-8" />,
    title: "Customizable Options",
    description: "Add a personal touch to every box with easy customization.",
  },
];

export default function WhyChooseUs() {
  return (
    // <section className="py-8 md:py-12 relative decorative-bg min-h-[calc(100vh - 50px)] md:h-[calc(100vh - 50px)]">
    // <section className="py-8 md:py-12 relative min-h-[calc(100vh - 50px)] md:h-[calc(100vh - 50px)]">
    <section className="py-8 md:py-12 relative min-h-[calc(100vh - 50px)] md:h-[calc(100vh - 50px)] bg-gradient-to-r from-bg3/10 to-bg1/40">
      {/* <div className="absolute inset-0 z-0 opacity-30">
          <AnimatedCubesBackground />
        </div> */}
      <div className="container mx-auto px-4 max-w-7xl relative z-20">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-headline mb-2 font-alegreya">
            Why Choose The Gifting Affair?
          </h2>
          <p className="text-base md:text-lg text-bg4 font-mont font-bold px-4">
            Delivering joy, one beautifully curated box at a time
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="p-6 md:p-7 rounded-lg bg-[#f9f9f9] bg-opacity-85 hover:bg-opacity-100 transition-all duration-300 
                         transform hover:-translate-y-1 shadow-md hover:shadow-lg"
            >
              <div className="text-[#FA812F] mb-3 md:mb-4 flex justify-center">
                {benefit.icon}
              </div>
              <h3 className="text-lg md:text-xl font-bold font-alegreya text-[#A82A21] mb-2 text-center">
                {benefit.title}
              </h3>
              <p className="text-xs md:text-sm text-[#FA4032]/80 font-mont font-semibold text-center">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
