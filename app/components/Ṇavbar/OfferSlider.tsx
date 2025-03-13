"use client";

const offers = [
  "🎉 Free Delivery on all Orders!",
  "🎁 Exclusive Festive Hampers available",
  "⚡ Limited Time: Bulk Orders at Special Prices",
  // "🎉 Free Delivery on all Orders!",
  // "🎁 Exclusive Festive Hampers available",
  // "⚡ Limited Time: Bulk Orders at Special Prices",
];

const OfferSlider = () => {
  return (
    <div className="bg-bg4 text-white py-3 overflow-hidden font-mont text-sm">
      <div className="carousel-container">
        <div className="carousel-track">
          {/* First set of offers */}
          {offers.map((offer, index) => (
            <div key={`first-${index}`} className="carousel-item">
              <p className="text-center font-medium whitespace-nowrap px-8">
                {offer}
              </p>
            </div>
          ))}
          {/* Duplicated set for seamless loop */}
          {offers.map((offer, index) => (
            <div key={`second-${index}`} className="carousel-item">
              <p className="text-center font-medium whitespace-nowrap px-8">
                {offer}
              </p>
            </div>
          ))}
          {offers.map((offer, index) => (
            <div key={`third-${index}`} className="carousel-item">
              <p className="text-center font-medium whitespace-nowrap px-8">
                {offer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OfferSlider;
