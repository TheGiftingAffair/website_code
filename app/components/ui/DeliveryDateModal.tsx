import React, { useState } from "react";

interface DeliveryDateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (date: string) => void;
}

const DeliveryDateModal = ({
  isOpen,
  onClose,
  onConfirm,
}: DeliveryDateModalProps) => {
  const [selectedDate, setSelectedDate] = useState("");

  // Calculate min date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  // Calculate max date (3 months from now)
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateString = maxDate.toISOString().split("T")[0];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Select Delivery Date</h2>

        {/* Same Day Delivery Disclaimer */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
          <p className="text-sm text-gray-700">
            Need same-day delivery? Kindly{" "}
            <a
              href="https://wa.me/6587430520"
              target="_blank"
              rel="noopener noreferrer"
              className="text-bg3 hover:underline font-medium"
            >
              contact us on WhatsApp
            </a>
          </p>
        </div>

        <input
          type="date"
          min={minDate}
          max={maxDateString}
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (selectedDate) {
                onConfirm(selectedDate);
              }
            }}
            disabled={!selectedDate}
            className={`px-4 py-2 rounded text-white ${
              selectedDate ? "bg-green-600 hover:bg-green-700" : "bg-gray-400"
            }`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDateModal;
