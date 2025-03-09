"use client";
import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

type Category =
  | "For Him/Her"
  | "Chocolate & Cookies"
  | "Tea & Coffee"
  | "Wine & Whiskey"
  | "Fruits"
  | "Beauty"
  | "Baby"
  | "Halal"
  | "Wellness"
  | "Evergreen";

interface Hamper {
  id: string;
  name: string;
  price: number;
  rating: number;
  description: string;
  components: string[];
  stock: bool;
  image: string;
  category: string[];
}

const ShopByCategories = () => {
  const [hampersData, setHampersData] = useState<Hamper[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<Category>("For Him/Her");
  const categories: Category[] = [
    "For Him/Her",
    "Chocolate & Cookies",
    "Tea & Coffee",
    "Wine & Whiskey",
    "Fruits",
    "Beauty",
    "Baby",
    "Halal",
    "Wellness",
    "Evergreen",
  ];

  useEffect(() => {
    const handleUrlChange = () => {
      const searchParams = new URLSearchParams(
        window.location.hash.split("?")[1]
      );
      const categoryParam = searchParams.get("category");
      if (categoryParam) {
        // Handle special cases for category names with ampersands and slashes
        const decodedCategory = decodeURIComponent(categoryParam)
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
          .replace(" And ", " & ")
          .replace("Him Her", "Him/Her");

        const validCategory = categories.find(
          (cat) =>
            cat.toLowerCase().replace(/[/&]/g, "").replace(/\s+/g, "") ===
            decodedCategory
              .toLowerCase()
              .replace(/[/&]/g, "")
              .replace(/\s+/g, "")
        );

        if (validCategory) {
          setSelectedCategory(validCategory);
        }
      }
    };

    window.addEventListener("urlChanged", handleUrlChange);
    // Initial check
    handleUrlChange();

    return () => {
      window.removeEventListener("urlChanged", handleUrlChange);
    };
  }, []);

  useEffect(() => {
    const handleUrlParamsChanged = (event: CustomEvent) => {
      const { section, params } = event.detail;
      if (section === "shop-by-categories") {
        const category = params.get("category");
        if (category) {
          const decodedCategory = decodeURIComponent(category)
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
            .replace(" And ", " & ")
            .replace("Him Her", "Him/Her");

          const validCategory = categories.find(
            (cat) =>
              cat.toLowerCase().replace(/[/&]/g, "").replace(/\s+/g, "") ===
              decodedCategory
                .toLowerCase()
                .replace(/[/&]/g, "")
                .replace(/\s+/g, "")
          );

          if (validCategory) {
            setSelectedCategory(validCategory);
          }
        }
      }
    };

    window.addEventListener(
      "urlParamsChanged",
      handleUrlParamsChanged as EventListener
    );
    return () => {
      window.removeEventListener(
        "urlParamsChanged",
        handleUrlParamsChanged as EventListener
      );
    };
  }, []);

  // Update URL when category changes
  const handleCategoryChange = (category: Category) => {
    setSelectedCategory(category);
    // Convert category name to URL-friendly format
    const encodedCategory = category
      .toLowerCase()
      .replace(/\s*&\s*/g, "-")
      .replace(/\//g, "-")
      .replace(/\s+/g, "-");

    const baseUrl = window.location.pathname + "#shop-by-categories";
    const newUrl = `${baseUrl}?category=${encodedCategory}`;
    window.history.pushState({}, "", newUrl);
    window.dispatchEvent(new Event("urlChanged")); // Dispatch event to ensure state updates
  };

  useEffect(() => {
    const fetchHampers = async () => {
      try {
        const q = query(
          collection(db, "Products"),
          where("category", "array-contains", selectedCategory)
        );

        const querySnapshot = await getDocs(q);
        const hampers: Hamper[] = querySnapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as Hamper)
        );

        setHampersData(hampers);
      } catch (error) {
        console.error("Error fetching hampers from Firestore:", error);
      }
    };

    fetchHampers();
  }, [selectedCategory]);

  const filteredHampers = hampersData.slice(0, 100);

  const handleCardClick = (productId: string) => {
    window.location.href = `/product/${productId}`;
  };

  return (
    <section
      id="shop-by-categories"
      className="relative py-8 px-4 md:px-8 bg-gradient-to-r from-bg3/10 to-bg1/40 overflow-hidden "
      style={{ minHeight: "calc(100vh - 100px)" }}
    >
      <div className="relative z-10 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-alegreya text-headline font-bold text-center mb-2">
          Shop By Categories
        </h2>
        <p className="text-bg4 text-center font-mont font-semibold text-md mb-4">
          Our Categories - Handpicked for You!
        </p>

        {/* Category Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-6 lg:mt-">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 mt-2 rounded-full text-md transition-all font-alegreya font-semibold ${
                selectedCategory === category
                  ? "bg-bg4/90 text-white shadow-md hover:scale-105"
                  : "bg-white/90 border hover:scale-105 border-bg4/90 text-bg4/90 hover:bg-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Hamper Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:mt-4 hover:cursor-pointer">
          <AnimatePresence mode="wait">
            {filteredHampers.length > 0 ? (
              filteredHampers.map((hamper) => (
                <motion.div
                  key={hamper.id}
                  onClick={() => handleCardClick(hamper.id)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-red-900/90 hover:bg-red-900 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="aspect-[square] overflow-hidden">
                    <img
                      src={hamper.image}
                      alt={hamper.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-in-out hover:scale-105"
                    />
                  </div>
                  <div className="p-1.5 px-2 md:p-3 flex flex-row text-[#f9f9f9]">
                    <h3 className="text-lg md:text-xl font-alegreya font-semibold">
                      {hamper.name}
                    </h3>
                    <div className="flex items-center ml-auto">
                      <span className="text-lg md:text-xl font-semibold text-[#f9f9f9]">
                        ${hamper.price}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-12">
                <div className="text-center flex flex-col items-center justify-center bg-white/80 rounded-xl shadow-md p-8">
                  <p className="text-xl font-alegreya text-gray-600 mb-2">
                    No hampers found in {selectedCategory} Category
                  </p>
                  <p className="text-sm text-gray-500">
                    Please try another category or check back later
                  </p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default ShopByCategories;
