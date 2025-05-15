"use client";

import { useState, useEffect } from "react";
import { getBlockedDates, isDateBlocked, BlockedDatesConfig } from "@/utils/dateService";

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
  const [blockedDates, setBlockedDates] = useState<BlockedDatesConfig>({
    blockedRanges: [],
    blockedSingleDates: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadBlockedDates() {
      setIsLoading(true);
      try {
        const dates = await getBlockedDates();
        setBlockedDates(dates);
      } catch (error) {
        console.error("Failed to load blocked dates:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (isOpen) {
      loadBlockedDates();
    }
  }, [isOpen]);

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

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    if (isDateBlocked(selectedDate, blockedDates)) {
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
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
              <span className="ml-2">Loading available dates...</span>
            </div>
          ) : (
            <input
              type="date"
              min={getMinDeliveryDate()}
              max={getMaxDeliveryDate()}
              value={selectedDate}
              onChange={handleDateChange}
              className="w-full p-2 text-sm border rounded date-input pr-10"
              required
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
            disabled={!selectedDate || isLoading}
            className={`px-4 py-2 rounded ${
              selectedDate && !isLoading
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
