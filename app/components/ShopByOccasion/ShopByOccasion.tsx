"use client";
import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

type Occasion =
  | "Birthday"
  | "Anniversary"
  | "Farewell"
  | "Congratulations"
  | "Housewarming"
  | "Graduation"
  | "Special Day"
  | "Get Well Soon";

interface Hamper {
  id: string;
  name: string;
  price: number;
  rating: number;
  description: string;
  components: string[];
  stock: boolean;
  image: string;
  occasion: string[];
  visibility: boolean;
}

const ShopByOccasion = () => {
  const [hampersData, setHampersData] = useState<Hamper[]>([]);
  const [selectedOccasion, setSelectedOccasion] =
    useState<Occasion>("Birthday");
  const occasions: Occasion[] = [
    "Birthday",
    "Anniversary",
    "Farewell",
    "Congratulations",
    "Housewarming",
    "Graduation",
    "Special Day",
    "Get Well Soon",
  ];

  useEffect(() => {
    const handleUrlParamsChanged = (event: CustomEvent) => {
      const { section, params } = event.detail;
      if (section === "shop-by-occasion") {
        const occasion = params.get("occasion");
        if (occasion) {
          const decodedOccasion = decodeURIComponent(occasion)
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

          const validOccasion = occasions.find(
            (occ) => occ.toLowerCase() === decodedOccasion.toLowerCase()
          );

          if (validOccasion) {
            setSelectedOccasion(validOccasion);
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

  const handleOccasionChange = (occasion: Occasion) => {
    setSelectedOccasion(occasion);
    const encodedOccasion = occasion.toLowerCase().replace(/\s+/g, "-");
    const baseUrl = window.location.pathname + "#shop-by-occasion";
    const newUrl = `${baseUrl}?occasion=${encodedOccasion}`;
    window.history.pushState({}, "", newUrl);

    // Scroll to section
    const section = document.getElementById("shop-by-occasion");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      window.scrollBy(0, -80); // Adjust for navbar
    }
  };

  useEffect(() => {
    const fetchHampers = async () => {
      try {
        const q = query(
          collection(db, "Products"),
          where("occasion", "array-contains", selectedOccasion),
          where("visibility", "==", true)
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
  }, [selectedOccasion]);

  const filteredHampers = hampersData.slice(0, 100);

  const handleCardClick = (productId: string) => {
    window.location.href = `/product/${productId}`;
  };

  return (
    <section
      id="shop-by-occasion"
      className="relative py-8 px-4 md:px-8 bg-gradient-to-l from-bg3/10 to-bg1/40 overflow-hidden"
      style={{ minHeight: "calc(100vh - 50px)" }}
    >
      <div className="relative z-10 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-alegreya text-headline font-bold text-center mb-2">
          Shop By Occasion
        </h2>
        <p className="text-bg4 text-center font-mont font-semibold text-md mb-4">
          Perfect Gifts for Every Occasion
        </p>

        {/* Occasion Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-6 lg:mt-">
          {occasions.map((occasion) => (
            <button
              key={occasion}
              onClick={() => handleOccasionChange(occasion)}
              className={`px-4 py-2 mt-2 rounded-full text-md transition-all font-alegreya font-semibold ${
                selectedOccasion === occasion
                  ? "bg-bg4/90 text-white shadow-md hover:scale-105"
                  : "bg-white/90 border hover:scale-105 border-bg4/90 text-bg4/90 hover:bg-white"
              }`}
            >
              {occasion}
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
                  <div className="aspect-square overflow-hidden">
                    {/* <div className="h-52 overflow-hidden"> */}
                    <img
                      src={hamper.image}
                      alt={hamper.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-in-out hover:scale-105"
                    />
                  </div>
                  <div className="p-1.5 px-2 md:p-3 flex flex-row text-[#f9f9f9]">
                    {/* <div className="p-3 flex flex-row text-[#f9f9f9]"> */}
                    <h3 className="text-lg md:text-xl font-alegreya font-semibold">
                      {/* <h3 className="text-xl font-alegreya font-semibold"> */}
                      {hamper.name}
                    </h3>
                    <div className="flex items-center ml-auto">
                      <span className="text-lg md:text-lg font-semibold text-[#f9f9f9]">
                        {/* <span className="text-xl font-semibold text-[#f9f9f9]"> */}
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
                    No hampers found for {selectedOccasion}
                  </p>
                  <p className="text-sm text-gray-500">
                    Please try another occasion or check back later
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

export default ShopByOccasion;
