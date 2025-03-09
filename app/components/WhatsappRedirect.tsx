"use client";

import { BsWhatsapp } from "react-icons/bs";

const WhatsappRedirect = () => {
  const phoneNumber = "+6587430520";
  const message = "Hello! I'm interested in your hampers.";

  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, "_blank");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50"
    >
      <BsWhatsapp className="text-2xl" />
    </button>
  );
};

export default WhatsappRedirect;
