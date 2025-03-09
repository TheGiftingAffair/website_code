"use client";
import React from 'react';

interface AgeVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const AgeVerificationModal = ({ isOpen, onClose, onConfirm }: AgeVerificationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-headline mb-4 font-alegreya">Age Verification Required</h2>
        <p className="text-gray-600 mb-6 font-mont">
          This product contains alcohol. You must be 18 years or older to purchase this item.
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 font-semibold rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-bg4 text-white font-semibold rounded-lg hover:bg-bg4/90"
          >
            Confirm I'm over 18
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgeVerificationModal;
