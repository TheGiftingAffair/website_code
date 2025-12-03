"use client";
import React, { useEffect, useState, useMemo } from "react";
import { FaStar } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
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
  stock: boolean;
  image: string;
  category: string[];
  visibility: boolean;
}

const ShopByCategories = () => {
  const [hampersData, setHampersData] = useState<Hamper[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<Category>("For Him/Her");
  const [categories, setCategories] = useState<Category[]>([]);
  const [sortOption, setSortOption] = useState("default");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const docRef = doc(db, "variables", "ShopByCategories");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && docSnap.data()?.valuearray) {
          const rawCategories = docSnap.data().valuearray;
          // Convert the format: first letter uppercase, handle special cases
          const formattedCategories = rawCategories.map((cat: string) => {
            const words = cat.split(" ");
            return words
              .map((word) => {
                if (word.includes("/")) {
                  return word
                    .split("/")
                    .map(
                      (w) =>
                        w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
                    )
                    .join("/");
                }
                if (word === "&") return "&";
                return (
                  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                );
              })
              .join(" ") as Category;
          });
          setCategories(formattedCategories);
          // Set the initial selected category
          if (formattedCategories.length > 0) {
            setSelectedCategory(formattedCategories[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

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
  }, [categories]);

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
  }, [categories]);

  // Update URL when category changes
  const handleCategoryChange = (category: Category) => {
    setSelectedCategory(category);
    const encodedCategory = category
      .toLowerCase()
      .replace(/\s*&\s*/g, "-")
      .replace(/\//g, "-")
      .replace(/\s+/g, "-");

    const baseUrl = window.location.pathname + "#shop-by-categories";
    const newUrl = `${baseUrl}?category=${encodedCategory}`;
    window.history.pushState({}, "", newUrl);
    window.dispatchEvent(new Event("urlChanged"));
  };

  useEffect(() => {
    const fetchHampers = async () => {
      if (!selectedCategory) return; // Don't fetch if no category is selected

      try {
        const q = query(
          collection(db, "Products"),
          where("category", "array-contains", selectedCategory),
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
        console.error("Error fetching hampers:", error);
      }
    };

    fetchHampers();
  }, [selectedCategory]);

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
        return sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      case "price-desc":
        return sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      default:
        return sorted;
    }
  }, [filteredHampers, sortOption]);

  const handleCardClick = (productId: string) => {
    window.location.href = `/product/${productId}`;
  };

  return (
    <section
      id="shop-by-categories"
      className="relative py-8 px-4 md:px-8 bg-gradient-to-r from-bg3/10 to-bg1/40 overflow-hidden "
      style={{ minHeight: "calc(100vh - 100px)" }}
    >
      <div className="relative z-10 max-w-8xl mx-auto">
        <h2 className="text-3xl md:text-5xl 2xl:text-7xl font-alegreya text-headline font-bold text-center mb-2">
          Shop By Categories
        </h2>
        <p className="text-bg4 text-center font-mont font-semibold text-md 2xl:text-xl mb-4">
          Our Categories - Handpicked for You!
        </p>

        {/* Category Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-6 lg:mt-">
          {Array.isArray(categories) &&
            categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-3 md:px-4 py-1 md:py-2 mt-2 rounded-full text-sm md:text-md 2xl:text-xl transition-all font-alegreya font-semibold ${
                  selectedCategory === category
                    ? "bg-bg4/90 text-white shadow-md hover:scale-105"
                    : "bg-white/90 border hover:scale-105 border-bg4/90 text-bg4/90 hover:bg-white"
                }`}
              >
                {category}
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
                  onClick={() => handleCardClick(hamper.id)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/90 hover:bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="aspect-[square] overflow-hidden">
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
                  <p className="text-xl 2xl:text-2xl font-alegreya text-gray-600 mb-2">
                    No hampers found in {selectedCategory} Category
                  </p>
                  <p className="text-sm 2xl:text-base text-gray-500">
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
