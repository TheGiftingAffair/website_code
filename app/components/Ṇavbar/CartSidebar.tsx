"use client";

import { useRouter } from "next/navigation";
import { useCart } from "../../../contexts/CartContext";
import { useState, useEffect } from "react";
import Image from "next/image";
import { getBlockedDates, isDateBlocked, BlockedDatesConfig } from "@/utils/dateService";

// Update date input styles with better blocked date visualization
const dateInputStyles = `
  .date-input::-webkit-calendar-picker-indicator {
    background-color: transparent;
    cursor: pointer;
  }
  
  .date-input[type="date"]::-webkit-inner-spin-button,
  .date-input[type="date"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  
  .date-input[type="date"]::-webkit-calendar-picker-indicator {
    position: absolute;
    right: 0;
    height: 100%;
    width: 100%;
    opacity: 0;
    cursor: pointer;
  }

  .blocked-date {
    color: #ff0000 !important;
    background-color: #ffebee !important;
    text-decoration: line-through;
    cursor: not-allowed;
  }

  .error-popup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    padding: 1.5rem;
    border-radius: 0.75rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    width: 90%;
    max-width: 400px;
    margin: 0 auto;
    text-align: center;
    animation: slideIn 0.2s ease-out;
  }

  @media (max-width: 640px) {
    .error-popup {
      width: 95%;
      padding: 1.25rem;
    }
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translate(-50%, -48%);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%);
    }
  }

  .error-popup-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
    animation: fadeIn 0.2s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartSidebar = ({ isOpen, onClose }: CartSidebarProps) => {
  const [showError, setShowError] = useState(false);
  const {
    items,
    removeFromCart,
    updateQuantity,
    getSubtotal,
    deliveryDate,
    setDeliveryDate,
  } = useCart();
  const router = useRouter();
  const [blockedDates, setBlockedDates] = useState<BlockedDatesConfig>({
    blockedRanges: [],
    blockedSingleDates: []
  });
  const [isLoadingDates, setIsLoadingDates] = useState(false);

  useEffect(() => {
    async function loadBlockedDates() {
      if (!isOpen) return;
      
      setIsLoadingDates(true);
      try {
        const dates = await getBlockedDates();
        setBlockedDates(dates);
      } catch (error) {
        console.error("Failed to load blocked dates:", error);
      } finally {
        setIsLoadingDates(false);
      }
    }

    loadBlockedDates();
  }, [isOpen]);

  const getMinDeliveryDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  // Add max date calculation (3 months from now)
  const getMaxDeliveryDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    return maxDate.toISOString().split("T")[0];
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    if (isDateBlocked(selectedDate, blockedDates)) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000); // Hide after 3 seconds
      return;
    }
    setDeliveryDate(selectedDate);
  };

  const handleDateFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const input = e.target;
    const dates = input.querySelectorAll("option");
    dates.forEach((date) => {
      if (isDateBlocked(date.value, blockedDates)) {
        date.classList.add("blocked-date");
      }
    });
  };

  const handleCheckout = () => {
    if (!deliveryDate) {
      alert("Please select a delivery date");
      return;
    }
    onClose();
    router.push("/checkout");
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 0) return; // Prevent negative quantities
    if (newQuantity === 0) {
      handleRemoveItem(productId);
    } else {
      try {
        updateQuantity(productId, newQuantity);
      } catch (error) {
        console.error("Error updating quantity:", error);
      }
    }
  };

  const handleRemoveItem = (productId: string) => {
    try {
      removeFromCart(productId);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const getTotalQuantity = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const canIncreaseQuantity = (currentQuantity: number, itemId: string) => {
    const otherItemsTotal = items.reduce(
      (sum, item) => (item.productId !== itemId ? sum + item.quantity : sum),
      0
    );
    return otherItemsTotal + currentQuantity + 1 <= 25;
  };

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? "block" : "hidden"}`}>
      <style>{dateInputStyles}</style>
      {showError && (
        <>
          <div
            className="error-popup-backdrop"
            onClick={() => setShowError(false)}
          />
          <div className="error-popup">
            <div className="flex justify-between items-center mb-4">
              <div className="w-8 md:w-10" /> {/* Responsive spacing */}
              <Image
                src="/images/logo4.png"
                alt="Logo"
                width={60}
                height={60}
                className="object-cover brightness-110 w-[50px] h-[50px] md:w-[60px] md:h-[60px]"
              />
              <button
                onClick={() => setShowError(false)}
                className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg
                  className="w-5 h-5 md:w-6 md:h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <p className="text-gray-800 font-medium mb-1 text-base md:text-lg">
              Date Not Available
            </p>
            <p className="text-gray-600 text-xs md:text-sm px-2">
              This date is not available for delivery. Please select another
              date.
            </p>
          </div>
        </>
      )}
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-lg flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium">Your Cart</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pb-4">
          <div className="p-4 border-b">
            {/* Same Day Delivery Disclaimer */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
              <p className="text-sm text-gray-700">
                Need same-day delivery? Kindly{" "}
                <a
                  href="https://wa.me/6587430520"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-medium"
                >
                  contact us on WhatsApp
                </a>
              </p>
            </div>

            <label className="text-sm text-gray-600 block mb-1">
              Select Delivery Date:
            </label>
            <div className="relative">
              {isLoadingDates ? (
                <div className="w-full p-2 text-sm border rounded flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                  <span>Loading dates...</span>
                </div>
              ) : (
                <input
                  type="date"
                  min={getMinDeliveryDate()}
                  max={getMaxDeliveryDate()}
                  value={deliveryDate || ""}
                  onChange={handleDateChange}
                  onFocus={handleDateFocus}
                  className="w-full p-2 text-sm border rounded date-input pr-10"
                  required
                  onKeyDown={(e) => e.preventDefault()}
                  style={{
                    position: "relative",
                    color:
                      deliveryDate && isDateBlocked(deliveryDate, blockedDates)
                        ? "red"
                        : "inherit",
                  }}
                />
              )}
              <svg
                className="w-5 h-5 text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4 border-b">
              <div
                className="flex-1 cursor-pointer"
                onClick={() => {
                  onClose();
                  router.push(`/product/${item.productId}`);
                }}
              >
                {item.image && (
                  <div className="w-16 h-16 mb-2 rounded overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <h3 className="text-sm font-medium">{item.name}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  ${item.price.toFixed(2)} × {item.quantity} = $
                  {(item.price * item.quantity).toFixed(2)}
                </p>
                {item.giftMessage && (
                  <p className="text-sm text-gray-600">
                    Gift Message: {item.giftMessage}
                  </p>
                )}
                {item.specialRequest && (
                  <p className="text-sm text-gray-600">
                    Special Request: {item.specialRequest}
                  </p>
                )}
                <div
                  className="flex items-center rounded-md mt-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuantityChange(
                        item.productId,
                        Math.max(0, item.quantity - 1)
                      );
                    }}
                    className="px-3 py-1 border rounded-sm hover:bg-gray-100"
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-1 border">{item.quantity}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuantityChange(item.productId, item.quantity + 1);
                    }}
                    className="px-3 py-1 border rounded-sm hover:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-400"
                    disabled={
                      !canIncreaseQuantity(item.quantity, item.productId)
                    }
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={() => handleRemoveItem(item.productId)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="p-4 border-t">
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span>${getSubtotal().toFixed(2)}</span>
            </div>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            disabled={items.length === 0}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;
