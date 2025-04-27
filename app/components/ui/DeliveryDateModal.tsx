"use client";

import { useState, useEffect } from "react";
import blockedDatesConfig from "../../../public/config/blocked-dates.json";

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
`;

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
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [showError, setShowError] = useState(false);

  const getMinDeliveryDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const getMaxDeliveryDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    return maxDate.toISOString().split("T")[0];
  };

  const formatDate = (date: string) => {
    return new Date(date).toISOString().split("T")[0];
  };

  const isDateBlocked = (date: string) => {
    const formattedDate = formatDate(date);

    // Check single blocked dates
    if (blockedDatesConfig.blockedSingleDates.includes(formattedDate)) {
      return true;
    }

    // Check date ranges
    return blockedDatesConfig.blockedRanges.some((range) => {
      const dateToCheck = new Date(date);
      const rangeStart = new Date(range.start);
      const rangeEnd = new Date(range.end);
      return dateToCheck >= rangeStart && dateToCheck <= rangeEnd;
    });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    if (isDateBlocked(selectedDate)) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }
    setSelectedDate(selectedDate);
  };

  const handleConfirm = () => {
    if (selectedDate) {
      onConfirm(selectedDate);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <style>{dateInputStyles}</style>
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="bg-white p-6 rounded-lg shadow-xl z-10 w-96 max-w-full mx-4">
        <h2 className="text-xl font-semibold mb-4">Select Delivery Date</h2>

        <div className="relative mb-4">
          <input
            type="date"
            min={getMinDeliveryDate()}
            max={getMaxDeliveryDate()}
            value={selectedDate}
            onChange={handleDateChange}
            className="w-full p-2 text-sm border rounded date-input pr-10"
            required
          />
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

        {showError && (
          <div className="text-red-500 mb-4">
            This date is not available for delivery. Please select another date.
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedDate}
            className={`px-4 py-2 rounded ${
              selectedDate
                ? "bg-bg3 text-white hover:bg-bg4"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
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
