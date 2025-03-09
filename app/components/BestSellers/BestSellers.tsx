"use client";
import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
// import "./bestSellers.css";

type Category = "Occasional" | "Gourmet" | "Corporate" | "Combos";
type StockStatus = "In Stock" | "Limited Stock";

interface Hamper {
  id: string;
  name: string;
  price: number;
  rating: number;
  description: string;
  components: string[];
  stock: StockStatus;
  image: string;
  category: Category;
}

const HAMPERS_DATA: Hamper[] = [
  // Occasional Hampers
  {
    id: "o1",
    name: "Wedding Celebration Hamper",
    price: 2999,
    rating: 4.8,
    description: "Perfect for weddings and special occasions",
    components: [
      "Chocolates",
      "Dry fruits",
      "Scented candles",
      "Decorative vase",
    ],
    stock: "Limited Stock",
    image: "/images/hampers/hero1.jpg",
    category: "Occasional",
  },
  {
    id: "o2",
    name: "Anniversary Special",
    price: 3499,
    rating: 4.9,
    description: "Celebrate your special day with luxury",
    components: [
      "Premium wines",
      "Gourmet chocolates",
      "Photo frame",
      "Rose bouquet",
    ],
    stock: "In Stock",
    image: "/images/hampers/hero2.jpg",
    category: "Occasional",
  },
  {
    id: "o3",
    name: "Birthday Surprise",
    price: 1999,
    rating: 4.7,
    description: "Make birthdays memorable",
    components: [
      "Birthday cake",
      "Party decorations",
      "Gift vouchers",
      "Premium sweets",
    ],
    stock: "In Stock",
    image: "/images/hampers/hero3.jpg",
    category: "Occasional",
  },

  // Gourmet Hampers
  {
    id: "g1",
    name: "Luxury Food Basket",
    price: 4999,
    rating: 4.9,
    description: "Premium international gourmet selection",
    components: ["Truffle oil", "Exotic cheese", "Wine", "Artisan crackers"],
    stock: "Limited Stock",
    image: "/images/hampers/hero1.jpg",
    category: "Gourmet",
  },
  {
    id: "g2",
    name: "Tea Connoisseur",
    price: 2499,
    rating: 4.6,
    description: "World's finest tea collection",
    components: ["Premium teas", "Honey", "Tea infuser", "Cookies"],
    stock: "In Stock",
    image: "/images/hampers/hero2.jpg",
    category: "Gourmet",
  },
  {
    id: "g3",
    name: "Chocolate Paradise",
    price: 1999,
    rating: 4.8,
    description: "Ultimate chocolate lover's dream",
    components: [
      "Belgian chocolates",
      "Truffles",
      "Hot cocoa",
      "Chocolate cookies",
    ],
    stock: "In Stock",
    image: "/images/hampers/hero3.jpg",
    category: "Gourmet",
  },

  // Corporate Hampers
  {
    id: "c1",
    name: "Executive Suite",
    price: 5999,
    rating: 4.7,
    description: "Premium corporate gifting solution",
    components: [
      "Leather organizer",
      "Premium pen set",
      "Wine",
      "Business card holder",
    ],
    stock: "In Stock",
    image: "/images/hampers/hero1.jpg",
    category: "Corporate",
  },
  {
    id: "c2",
    name: "Team Appreciation",
    price: 3999,
    rating: 4.5,
    description: "Perfect for employee recognition",
    components: ["Customized mug", "Planner", "Gourmet snacks", "Coffee set"],
    stock: "Limited Stock",
    image: "/images/hampers/hero2.jpg",
    category: "Corporate",
  },
  {
    id: "c3",
    name: "Business Classic",
    price: 4499,
    rating: 4.6,
    description: "Professional gifting made elegant",
    components: [
      "Premium tea set",
      "Desk accessories",
      "Chocolates",
      "Travel kit",
    ],
    stock: "In Stock",
    image: "/images/hampers/hero3.jpg",
    category: "Corporate",
  },

  // Combo Hampers
  {
    id: "cb1",
    name: "Ultimate Celebration",
    price: 6999,
    rating: 4.9,
    description: "All-in-one luxury gift solution",
    components: ["Champagne", "Chocolates", "Spa kit", "Premium snacks"],
    stock: "Limited Stock",
    image: "/images/hampers/hero1.jpg",
    category: "Combos",
  },
  {
    id: "cb2",
    name: "Family Feast",
    price: 4999,
    rating: 4.7,
    description: "Perfect for family gatherings",
    components: ["Assorted snacks", "Beverages", "Games", "Sweets"],
    stock: "In Stock",
    image: "/images/hampers/hero2.jpg",
    category: "Combos",
  },
  {
    id: "cb3",
    name: "Wellness Package",
    price: 3999,
    rating: 4.8,
    description: "Health and happiness combined",
    components: ["Organic teas", "Dry fruits", "Honey", "Wellness products"],
    stock: "In Stock",
    image: "/images/hampers/hero3.jpg",
    category: "Combos",
  },
];

const BestSellers = () => {
  const [selectedCategory, setSelectedCategory] =
    useState<Category>("Occasional");
  const categories: Category[] = [
    "Occasional",
    "Gourmet",
    "Corporate",
    "Combos",
  ];

  const filteredHampers = HAMPERS_DATA.filter(
    (hamper) => hamper.category === selectedCategory
  ).slice(0, 3);

  return (
    // <section className="relative py-8 px-4 md:px-8 bg-gradient-to-b from-bg3 to-bg1 overflow-hidden min-h-[calc(100vh - 50px)] md:h-[calc(100vh - 50px)]">
    <section
      // className="relative py-8 px-4 md:px-8 bg-gradient-to-b from-bg3 to-bg1  overflow-hidden min-h-[calc(100vh - 50px)] md:h-[calc(100vh - 50px)]"
      className="relative py-8 px-4 md:px-8 bg-gradient-to-r from-bg3/10 to-bg1/40  overflow-hidden min-h-[calc(100vh - 50px)] md:h-[calc(100vh - 50px)]"
      style={{
        height: "calc(100vh - 50px)",
      }}
    >
      {/* <div className="absolute inset-0 bg-scrolling-pattern animate-bg-scroll opacity-75"></div> */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-alegreya text-headline font-bold text-center mb-2">
          Our Bestsellers - Handpicked for You!
        </h2>
        <p className="text-bg4 text-center font-mont font-semibold text-md mb-4">
          Discover the top hampers that our customers love the most
        </p>

        {/* Category Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-6 lg:mt-">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-8 py-2 mt-4 rounded-full text-md transition-all font-alegreya font-semibold ${
                selectedCategory === category
                  ? "bg-bg3 text-white shadow-md hover:scale-105"
                  : "bg-white/90 border hover:scale-105 border-bg3 text-bg3 hover:bg-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Hamper Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:mt-16">
          <AnimatePresence mode="wait">
            {filteredHampers.map((hamper) => (
              <motion.div
                key={hamper.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white/90 hover:bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="h-52 overflow-hidden">
                  <img
                    src={hamper.image}
                    alt={hamper.name}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-domine font-bold mb-1">
                    {hamper.name}
                  </h3>
                  <div className="flex items-center mb-1">
                    <span className="text-xl font-bold text-bg4">
                      ₹{hamper.price}
                    </span>
                    <div className="ml-auto flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`${
                            i < Math.floor(hamper.rating)
                              ? "text-amber-400"
                              : "text-gray-300"
                          } w-3 h-3`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">
                    {hamper.description}
                  </p>
                  <ul className="mb-2 flex flex-wrap gap-1">
                    {hamper.components.slice(0, 2).map((item, i) => (
                      <li
                        key={i}
                        className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded"
                      >
                        {item}
                      </li>
                    ))}
                    {hamper.components.length > 2 && (
                      <li className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        +{hamper.components.length - 2} more
                      </li>
                    )}
                  </ul>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm font-semibold ${
                        hamper.stock === "Limited Stock"
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      {hamper.stock}
                    </span>
                    <button className="px-4 py-2 text-sm font-mont font-semibold bg-bg3 text-white rounded-full hover:bg-bg4 transition-colors">
                      Buy Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default BestSellers;
