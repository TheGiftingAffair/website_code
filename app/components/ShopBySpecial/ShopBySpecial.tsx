"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  collection,
  getDocs,
  query,
  where,
  getDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";

interface Hamper {
  id: string;
  name: string;
  price: number;
  description: string;
  components: string[];
  stock: boolean;
  image: string;
  festive: boolean;
  visibility: boolean;
}

const ShopBySpecial = () => {
  const [hampersData, setHampersData] = useState<Hamper[]>([]);
  const [specialNav, setSpecialNav] = useState("Special");
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch special nav text
        const specialNavDoc = await getDoc(doc(db, "variables", "specialNav"));
        if (specialNavDoc.exists()) {
          setSpecialNav(specialNavDoc.data().value);
        }

        // Fetch hampers
        const q = query(
          collection(db, "Products"),
          where("festive", "==", true),
          where("visibility", "==", true)
        );

        const querySnapshot = await getDocs(q);
        const hampers = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Hamper[];

        setHampersData(hampers);
        setShouldRender(hampers.length > 0);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Add event listener for URL changes
  useEffect(() => {
    const handleUrlParamsChanged = (event: CustomEvent) => {
      const { section } = event.detail;
      if (section === "shop-by-special") {
        // Wait for a short moment to ensure the section is rendered
        setTimeout(() => {
          const element = document.getElementById("shop-by-special");
          if (element) {
            const navbarHeight = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition =
              elementPosition + window.pageYOffset - navbarHeight;

            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth",
            });
          }
        }, 100);
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
  }, [hampersData]); // Add hampersData as dependency to ensure section exists when scrolling

  if (!shouldRender) return null;

  return (
    <section
      id="shop-by-special"
      className="relative py-8 px-4 md:px-8 bg-gradient-to-l from-bg3/10 to-bg1/40 md:min-h-[calc(100vh-100px)]"
      // style={{ minHeight: "calc(100vh - 50px)" }}
    >
      <div className="relative z-10 max-w-8xl mx-auto">
        <h2 className="text-3xl md:text-5xl 2xl:text-7xl font-alegreya text-headline font-bold text-center mb-2">
          {specialNav}
        </h2>
        <p className="text-bg4 text-center font-mont font-semibold text-md 2xl:text-xl mb-8">
          Explore Our Special Collection
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-4 gap-4 hover:cursor-pointer">
          <AnimatePresence mode="wait">
            {hampersData.map((hamper) => (
              <motion.div
                key={hamper.id}
                onClick={() => (window.location.href = `/product/${hamper.id}`)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white/90 hover:bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={hamper.image}
                    alt={hamper.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-in-out hover:scale-105"
                    data-product-image="true"
                  />
                </div>
                <div className="p-1.5 px-2 md:p-3 flex flex-row text-headline">
                  <h3 className="text-lg md:text-xl font-alegreya font-semibold">
                    {hamper.name}
                  </h3>
                  <div className="flex items-center ml-auto">
                    <span className="text-lg md:text-lg font-semibold text-headline">
                      ${hamper.price}
                    </span>
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

export default ShopBySpecial;
