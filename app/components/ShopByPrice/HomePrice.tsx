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
  const [loadingStatus, setLoadingStatus] = useState<Record<string, string>>(
    {}
  );

  const priceRanges: {
    id: PriceRange;
    label: string;
    range: [number, number];
  }[] = [
    { id: "below100", label: "Below $100", range: [0, 100] }, // Changed upper limit from 99 to 100
    { id: "100to150", label: "$100 - $150", range: [100, 150] },
    { id: "150to200", label: "$150 - $200", range: [150, 200] },
    { id: "above200", label: "$200 & Above", range: [200, Infinity] },
  ];

  useEffect(() => {
    const fetchPriceRangeImages = async () => {
      const images: Record<string, string> = {};
      const status: Record<string, string> = {};
      const usedImages = new Set<string>();

      for (const { id, range } of priceRanges) {
        try {
          let q;

          // Special handling for below100 range
          if (id === "below100") {
            q = query(
              collection(db, "Products"),
              where("price", "<", 100) // Directly use < 100 instead of range
            );
            status[id] = "Querying price < 100";
          } else {
            q = query(
              collection(db, "Products"),
              where("price", ">=", range[0]),
              ...(range[1] !== Infinity ? [where("price", "<", range[1])] : [])
            );
            status[id] = `Querying price ${range[0]}-${
              range[1] !== Infinity ? range[1] : "∞"
            }`;
          }

          const querySnapshot = await getDocs(q);
          status[id] += ` | Found ${querySnapshot.size} products`;

          if (!querySnapshot.empty) {
            const rangeHampers = querySnapshot.docs.map(
              (doc) => doc.data() as Hamper
            );
            status[id] += ` | Products: ${rangeHampers
              .map((h) => h.name)
              .join(", ")
              .substring(0, 30)}...`;

            let selectedImage = "/images/temp.jpg";
            for (const hamper of rangeHampers) {
              if (hamper.image && !usedImages.has(hamper.image)) {
                selectedImage = hamper.image;
                usedImages.add(hamper.image);
                status[id] += ` | Selected image from: ${hamper.name}`;
                break;
              }
            }

            images[id] = selectedImage;
          } else {
            images[id] = "/images/temp.jpg";
            status[id] += " | No products found, using default image";
          }
        } catch (error) {
          console.error(`Error fetching image for price range ${id}:`, error);
          images[id] = "/images/temp.jpg";
          status[id] = `Error: ${
            error instanceof Error ? error.message : String(error)
          }`;
        }
      }

      setRangeImages(images);
      setLoadingStatus(status);
      console.log("Price range images loaded:", images);
      console.log("Loading status:", status);
    };

    fetchPriceRangeImages();
  }, []);

  const handlePriceClick = (priceId: string) => {
    // Store target section and navigate
    sessionStorage.setItem("scrollTarget", `#shop-by-price?price=${priceId}`);
    window.location.href = `/shop-by-price#shop-by-price?price=${priceId}`;
  };

  return (
    <section
      id="shop-by-price"
      className="relative py-8 2xl:py-12 px-4 md:px-8 2xl:px-12 bg-gradient-to-r from-bg3/10 to-bg1/40 overflow-hidden"
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
              <div className="aspect-square md:aspect-[10/9] rounded-md overflow-hidden mb-1 2xl:mb-2">
                <img
                  src={rangeImages[range.id] || "/images/temp.jpg"}
                  alt={range.label}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    console.log(`Image error for ${range.id}:`, e);
                    e.currentTarget.src = "/images/temp.jpg";
                  }}
                />
              </div>
              <h3 className="text-center text-xl 2xl:text-2xl font-alegreya text-headline font-semibold">
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
