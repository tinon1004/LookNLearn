'use client';

import React from 'react';

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const StopLearningPopup: React.FC<PopupProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-6">🤔</div>
        <p className="text-xl mb-8">
            정말로 학습을 그만할 건가요?
        </p>
        <div className="space-y-4">
          <button
            onClick={onClose}
            className="bg-[#2F8EFF] hover:bg-[#8BAACE] text-white font-bold py-2 px-4 rounded w-full transition duration-300"
          >
            계속 할게요
          </button>
          <button
            onClick={onConfirm}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded w-full transition duration-300"
          >
            그만 둘게요
          </button>
        </div>
      </div>
    </div>
  );
};

export default StopLearningPopup;