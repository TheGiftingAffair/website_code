"use client";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebaseConfig";

interface Coupon {
  Active: boolean;
  public: boolean;
  description: string;
}

const offers = [
  "🎉 Free Delivery on all Orders!",
  "🎁 Exclusive Festive Hampers available",
  "⚡ Limited Time: Bulk Orders at Special Prices",
];

const OfferSlider = () => {
  const [displayMessages, setDisplayMessages] = useState<string[]>(offers);

  useEffect(() => {
    // Fetch and filter coupons from Firestore
    const fetchCoupons = async () => {
      try {
        const couponsCollection = collection(db, "coupons");
        const querySnapshot = await getDocs(couponsCollection);
        const activeCoupons = querySnapshot.docs
          .filter((doc) => {
            const data = doc.data() as Coupon;
            return data.Active && data.public;
          })
          .map(
            (doc) =>
              `🏷️ ${doc.id} ${doc.data().description && ":"} ${
                doc.data().description
              }`
          );

        console.log("Filtered coupons for slider:", activeCoupons);

        // Apply the same logic for different display scenarios
        if (activeCoupons.length === 0) {
          setDisplayMessages(offers);
        } else if (activeCoupons.length === 1) {
          setDisplayMessages([...offers, ...activeCoupons]);
        } else {
          setDisplayMessages(activeCoupons);
        }
      } catch (error) {
        console.error("Error fetching coupons from Firestore:", error);
        setDisplayMessages(offers); // Fallback to default offers on error
      }
    };

    fetchCoupons();
  }, []);

  return (
    <>
      <style jsx>{`
        .carousel-track {
          animation: slide 60s linear infinite;
          display: flex;
        }

        @keyframes slide {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .carousel-track:hover {
          animation-play-state: paused;
        }
      `}</style>
      <div className="bg-bg2/90 text-white py-3 text-sm 2xl:py-4 overflow-hidden font-mont">
        <div className="carousel-container">
          <div className="carousel-track">
            {/* First set of messages */}
            {displayMessages.map((message, index) => (
              <div key={`first-${index}`} className="carousel-item">
                <p className="text-center font-semibold 2xl:text-lg text-black whitespace-nowrap px-8">
                  {message}
                </p>
              </div>
            ))}
            {/* Duplicated sets for seamless loop */}
            {[1, 2, 3].map((setNum) =>
              displayMessages.map((message, index) => (
                <div key={`set${setNum}-${index}`} className="carousel-item">
                  <p
                    className={`text-center font-semibold 2xl:text-lg text-black whitespace-nowrap px-8 ${
                      setNum === 3 ? "hidden 2xl:visible" : ""
                    }`}
                  >
                    {message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default OfferSlider;
