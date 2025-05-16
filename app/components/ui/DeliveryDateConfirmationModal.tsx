import React from "react";
import { format } from "date-fns";

interface DeliveryDateConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  deliveryDate: string;
}

const DeliveryDateConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  deliveryDate,
}: DeliveryDateConfirmationModalProps) => {
  // Format the date in a more readable format
  const formatDeliveryDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return format(date, "EEEE, MMMM d, yyyy");
    } catch (error) {
      return dateStr;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="bg-white p-6 rounded-lg shadow-xl z-10 w-96 max-w-full mx-4 relative">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-green-100 rounded-full">
            <svg
              className="w-8 h-8 text-green-600"
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
          <h2 className="text-xl font-semibold mb-2">Confirm Delivery Date</h2>
          <p className="mb-6 text-gray-600">
            Your order will be delivered on:
            <span className="block mt-2 font-semibold text-lg text-gray-800">
              {formatDeliveryDate(deliveryDate)}
            </span>
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Note: Once confirmed, the delivery date cannot be changed after payment.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3 mt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
          >
            Change Date
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Confirm & Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDateConfirmationModal;
