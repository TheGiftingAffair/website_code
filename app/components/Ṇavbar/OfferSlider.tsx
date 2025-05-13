"use client";
import couponsData from "../../../public/data/coupons.json";

const offers = [
  "🎉 Free Delivery on all Orders!",
  "🎁 Exclusive Festive Hampers available",
  "⚡ Limited Time: Bulk Orders at Special Prices",
];

const activeCoupons = couponsData
  .filter((coupon) => coupon.Active && coupon.public)
  .map((coupon) => `🏷️ ${coupon.name}: ${coupon.description}`);

// Logic for different display scenarios
const displayMessages =
  activeCoupons.length === 0
    ? offers
    : activeCoupons.length === 1
    ? [...offers, ...activeCoupons]
    : activeCoupons;

const OfferSlider = () => {
  return (
    <>
      <style jsx>{`
        .carousel-track {
          animation: slide 30s linear infinite;
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
      <div className="bg-bg4 text-white py-3 2xl:py-4 overflow-hidden font-mont text-sm">
        <div className="carousel-container">
          <div className="carousel-track">
            {/* First set of messages */}
            {displayMessages.map((message, index) => (
              <div key={`first-${index}`} className="carousel-item">
                <p className="text-center font-medium 2xl:text-xl whitespace-nowrap px-8">
                  {message}
                </p>
              </div>
            ))}
            {/* Duplicated sets for seamless loop */}
            {[1, 2, 3].map((setNum) =>
              displayMessages.map((message, index) => (
                <div key={`set${setNum}-${index}`} className="carousel-item">
                  <p
                    className={`text-center font-medium 2xl:text-xl whitespace-nowrap px-8 ${
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
