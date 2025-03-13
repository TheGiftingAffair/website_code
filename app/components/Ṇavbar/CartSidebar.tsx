"use client";

import { useRouter } from "next/navigation";
import { useCart } from "../../../contexts/CartContext";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartSidebar = ({ isOpen, onClose }: CartSidebarProps) => {
  const {
    items,
    removeFromCart,
    updateQuantity,
    getSubtotal,
    deliveryDate,
    setDeliveryDate,
  } = useCart();
  const router = useRouter();

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
            <input
              type="date"
              min={getMinDeliveryDate()}
              max={getMaxDeliveryDate()}
              value={deliveryDate || ""}
              onChange={(e) => setDeliveryDate(e.target.value)}
              className="w-full p-2 text-sm border rounded"
              required
            />
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
                  onClick={(e) => e.stopPropagation()} // Add this line
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
