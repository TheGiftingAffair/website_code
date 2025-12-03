"use client";
import React, { useEffect, useState, useMemo } from "react";
import { FaStar } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

type PriceRange = "below100" | "100to150" | "150to200" | "above200";

interface Hamper {
  id: string;
  name: string;
  price: number;
  rating: number;
  description: string;
  components: string[];
  stock: boolean;
  image: string;
  visibility: boolean; // Add visibility field
}

const ShopByPrice = () => {
  const [hampersData, setHampersData] = useState<Hamper[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] =
    useState<PriceRange>("below100");
  const [sortOption, setSortOption] = useState("default");

  const handleCardClick = (productId: string) => {
    window.location.href = `/product/${productId}`;
  };

  const priceRanges = [
    { id: "below100", label: "Below $100" },
    { id: "100to150", label: "$100 - $150" },
    { id: "150to200", label: "$150 - $200" },
    { id: "above200", label: "$200 & Above" },
  ];

  useEffect(() => {
    const handleUrlParamsChanged = (event: CustomEvent) => {
      const { section, params } = event.detail;
      if (section === "shop-by-price") {
        const price = params.get("price");
        if (price) {
          const validRange = priceRanges.find((range) => range.id === price);
          if (validRange) {
            setSelectedPriceRange(validRange.id as PriceRange);
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

  useEffect(() => {
    // Get price from URL params when component mounts
    const params = new URLSearchParams(window.location.search);
    const priceParam = params.get("price");
    if (priceParam) {
      const validRange = priceRanges.find((range) => range.id === priceParam);
      if (validRange) {
        setSelectedPriceRange(validRange.id as PriceRange);
      }
    }
  }, []);

  const handlePriceRangeChange = (range: PriceRange) => {
    setSelectedPriceRange(range);
    const baseUrl = window.location.pathname + "#shop-by-price";
    const newUrl = `${baseUrl}?price=${range}`;
    window.history.pushState({}, "", newUrl);

    // Scroll to section
    const section = document.getElementById("shop-by-price");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      window.scrollBy(0, -80); // Adjust for navbar
    }
  };

  useEffect(() => {
    const fetchHampers = async () => {
      try {
        // First get all visible products
        const q = query(
          collection(db, "Products"),
          where("visibility", "==", true)
        );

        const querySnapshot = await getDocs(q);
        const allHampers: Hamper[] = querySnapshot.docs
          .map(
            (doc) =>
              ({
                id: doc.id,
                ...doc.data(),
              } as Hamper)
          )
          .filter((hamper) => hamper.visibility === true); // Double check visibility

        // Then filter by price range in memory
        let filteredHampers: Hamper[] = [];
        switch (selectedPriceRange) {
          case "below100":
            filteredHampers = allHampers.filter(
              (h) => h.price < 100 && h.visibility === true
            );
            break;
          case "100to150":
            filteredHampers = allHampers.filter(
              (h) => h.price >= 100 && h.price < 150 && h.visibility === true
            );
            break;
          case "150to200":
            filteredHampers = allHampers.filter(
              (h) => h.price >= 150 && h.price < 200 && h.visibility === true
            );
            break;
          case "above200":
            filteredHampers = allHampers.filter(
              (h) => h.price >= 200 && h.visibility === true
            );
            break;
          default:
            filteredHampers = allHampers.filter((h) => h.visibility === true);
        }

        setHampersData(filteredHampers);
      } catch (error) {
        console.error("Error fetching hampers from Firestore:", error);
      }
    };

    fetchHampers();
  }, [selectedPriceRange]);

  const filteredHampers = hampersData.slice(0, 100);

  // Sort products based on selected option
  const sortedProducts = useMemo(() => {
    if (!filteredHampers.length) return filteredHampers;

    const sorted = [...filteredHampers];

    switch (sortOption) {
      case "name-asc":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case "price-asc":
        return sorted.sort(
          (a, b) =>
            parseFloat(a.price.toString()) - parseFloat(b.price.toString())
        );
      case "price-desc":
        return sorted.sort(
          (a, b) =>
            parseFloat(b.price.toString()) - parseFloat(a.price.toString())
        );
      default:
        return sorted;
    }
  }, [filteredHampers, sortOption]);

  return (
    <section
      id="shop-by-price"
      className="relative py-8 px-4 md:px-8 bg-gradient-to-r from-bg3/10 to-bg1/40 overflow-hidden"
      style={{ minHeight: "calc(100vh - 50px)" }}
    >
      <div className="relative z-10 max-w-8xl mx-auto">
        {" "}
        {/* increased max width */}
        <h2 className="text-3xl md:text-5xl 2xl:text-7xl font-alegreya text-headline font-bold text-center mb-2">
          Shop By Price Range
        </h2>
        <p className="text-bg4 text-center font-mont font-semibold text-md 2xl:text-xl mb-4">
          Find the Perfect Gift Within Your Budget
        </p>
        {/* Price Range Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-6 mt-4">
          {priceRanges.map((range) => (
            <button
              key={range.id}
              onClick={() => handlePriceRangeChange(range.id as PriceRange)}
              className={`px-3 md:px-4 py-1 md:py-2 rounded-full text-sm md:text-md 2xl:text-xl transition-all font-alegreya font-semibold ${
                selectedPriceRange === range.id
                  ? "bg-bg4/90 text-white shadow-md hover:scale-105"
                  : "bg-white/90 border hover:scale-105 border-bg4/90 text-bg4/90 hover:bg-white"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
        {/* Filter and Sort Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          {/* Sort Options */}
          <div className="flex items-center gap-2 ml-auto">
            <label
              htmlFor="sort"
              className="text-xs sm:text-sm font-medium text-gray-700"
            >
              Sort:
            </label>
            <select
              id="sort"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border border-gray-300 rounded-md px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[120px] sm:min-w-[140px]"
            >
              <option value="default">Default</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
            </select>
          </div>
        </div>
        {/* Hamper Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-4 gap-4 lg:mt-4 hover:cursor-pointer">
          <AnimatePresence mode="wait">
            {sortedProducts.length > 0 ? (
              sortedProducts.map((hamper) => (
                <motion.div
                  key={hamper.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => handleCardClick(hamper.id)}
                  className="bg-white/90 hover:bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={hamper.image}
                      alt={hamper.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-in-out hover:scale-105"
                    />
                  </div>
                  <div className="p-1.5 px-2 md:p-3 flex flex-row text-headline">
                    <h3 className="text-lg md:text-xl 2xl:text-2xl font-alegreya font-semibold">
                      {hamper.name}
                    </h3>
                    <div className="flex items-center ml-auto">
                      <span className="text-lg md:text-xl 2xl:text-2xl font-semibold text-headline">
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
                    No hampers found in this price range
                  </p>
                  <p className="text-sm text-gray-500">
                    Please try another price range or check back later
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

export default ShopByPrice;
