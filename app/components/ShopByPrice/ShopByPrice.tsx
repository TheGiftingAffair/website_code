"use client";
import React, { useEffect, useState } from "react";
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
}

const ShopByPrice = () => {
  const [hampersData, setHampersData] = useState<Hamper[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] =
    useState<PriceRange>("below100");

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
        let q;
        switch (selectedPriceRange) {
          case "below100":
            q = query(collection(db, "Products"), where("price", "<", 100));
            break;
          case "100to150":
            q = query(
              collection(db, "Products"),

              where("price", ">=", 100),
              where("price", "<", 150)
            );
            break;
          case "150to200":
            q = query(
              collection(db, "Products"),

              where("price", ">=", 150),
              where("price", "<", 200)
            );
            break;
          case "above200":
            q = query(collection(db, "Products"), where("price", ">=", 200));
            break;
          default:
            q = query(collection(db, "Products"));
        }

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
  }, [selectedPriceRange]);

  const filteredHampers = hampersData.slice(0, 100);

  return (
    <section
      id="shop-by-price"
      className="relative py-8 px-4 md:px-8 bg-gradient-to-r from-bg3/10 to-bg1/40 overflow-hidden"
      style={{ minHeight: "calc(100vh - 50px)" }}
    >
      <div className="relative z-10 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-alegreya text-headline font-bold text-center mb-2">
          Shop By Price Range
        </h2>
        <p className="text-bg4 text-center font-mont font-semibold text-md mb-4">
          Find the Perfect Gift Within Your Budget
        </p>

        {/* Price Range Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-6 mt-4">
          {priceRanges.map((range) => (
            <button
              key={range.id}
              onClick={() => handlePriceRangeChange(range.id as PriceRange)}
              className={`px-4 py-2 rounded-full text-md transition-all font-alegreya font-semibold ${
                selectedPriceRange === range.id
                  ? "bg-bg4/90 text-white shadow-md hover:scale-105"
                  : "bg-white/90 border hover:scale-105 border-bg4/90 text-bg4/90 hover:bg-white"
              }`}
            >
              {range.label}
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => handleCardClick(hamper.id)}
                  className="bg-red-900/90 hover:bg-red-900 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="aspect-square overflow-hidden">
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
