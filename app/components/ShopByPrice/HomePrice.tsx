"use client";
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { useRouter } from "next/navigation";

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

const HomePrice = () => {
  const router = useRouter();
  const [rangeImages, setRangeImages] = useState<Record<string, string>>({});

  const priceRanges: {
    id: PriceRange;
    label: string;
    range: [number, number];
  }[] = [
    { id: "below100", label: "Below $100", range: [0, 99] },
    { id: "100to150", label: "$100 - $150", range: [100, 150] },
    { id: "150to200", label: "$150 - $200", range: [150, 200] },
    { id: "above200", label: "$200 & Above", range: [200, Infinity] },
  ];

  useEffect(() => {
    const fetchPriceRangeImages = async () => {
      const images: Record<string, string> = {};
      const usedImages = new Set<string>();

      for (const { id, range } of priceRanges) {
        try {
          const q = query(
            collection(db, "Products"),
            where("price", ">=", range[0]),
            ...(range[1] !== Infinity ? [where("price", "<", range[1])] : [])
          );
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const rangeHampers = querySnapshot.docs.map(
              (doc) => doc.data() as Hamper
            );

            let selectedImage = "/images/temp.jpg";
            for (const hamper of rangeHampers) {
              if (!usedImages.has(hamper.image)) {
                selectedImage = hamper.image;
                usedImages.add(hamper.image);
                break;
              }
            }

            images[id] = selectedImage;
          } else {
            images[id] = "/images/temp.jpg";
          }
        } catch (error) {
          console.error(`Error fetching image for price range ${id}:`, error);
          images[id] = "/images/temp.jpg";
        }
      }

      setRangeImages(images);
    };

    fetchPriceRangeImages();
  }, []);

  const handlePriceClick = (priceId: string) => {
    // Store target section and navigate
    sessionStorage.setItem("scrollTarget", `#shop-by-price?price=${priceId}`);
    window.location.href = `/products#shop-by-price?price=${priceId}`;
  };

  return (
    <section
      id="shop-by-price"
      className="relative py-8 2xl:py-12 px-4 md:px-8 2xl:px-12 bg-gradient-to-r from-bg3/10 to-bg1/40 overflow-hidden"
      style={{ minHeight: "calc(100vh - 300px)" }}
    >
      <div className="relative z-10 max-w-7xl 2xl:max-w-[1536px] mx-auto">
        <h2 className="text-3xl md:text-5xl 2xl:text-6xl font-alegreya text-headline font-bold text-center mb-2">
          Shop By Price
        </h2>
        <p className="text-bg4 text-center font-mont font-semibold text-md 2xl:text-lg mb-8 2xl:mb-12">
          Find the Perfect Gift Within Your Budget
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 2xl:gap-6 px-4">
          {priceRanges.map((range) => (
            <div
              key={range.id}
              onClick={() => handlePriceClick(range.id)}
              className="bg-white border-headline border border-opacity-30 rounded-md shadow-md p-1.5 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <div className="aspect-square md:aspect-[7/11.5] rounded-md overflow-hidden mb-1 2xl:mb-2">
                <img
                  src={rangeImages[range.id] || "/images/temp.jpg"}
                  alt={range.label}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <h3 className="text-center text-2xl 2xl:text-3xl font-alegreya text-headline font-semibold">
                {range.label}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomePrice;
