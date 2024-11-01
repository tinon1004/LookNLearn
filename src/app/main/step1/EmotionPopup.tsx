'use client';

import React, { useState } from 'react';

interface EmotionPopupProps {
  onClose: () => void;
}

export default function EmotionPopup({ onClose }: EmotionPopupProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const emotions = [
    { id: 1, text: "기분이 좋아요", emoji: "😊" },
    { id: 2, text: "평범해요", emoji: "😐" },
    { id: 3, text: "기분 나빠요", emoji: "😞" }
  ];

  const handleEmotionSelect = (id: number) => {
    setSelectedId(id);
    setTimeout(() => {
      onClose();
      }, 300);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-80 max-w-md">
        <h2 className="text-lg font-semibold text-center mb-4">오늘 하루 기분은 어때요?</h2>
        <div className="space-y-2">
          {emotions.map((emotion) => (
            <button
              key={emotion.id}
              onClick={() => handleEmotionSelect(emotion.id)}
              className={`
                w-full 
                p-3 
                flex 
                items-center 
                justify-center 
                space-x-2 
                border-2 
                rounded-lg 
                transition-all
                duration-200
                ${selectedId === emotion.id
                  ? 'bg-[#9EBCDF] border-[#9EBCDF] text-white'
                  : 'bg-white border-[#9EBCDF] hover:bg-gray-50'
                }
              `}
            >
              <span className="text-xl">{emotion.emoji}</span>
              <span className={selectedId === emotion.id ? 'text-white' : 'text-gray-700'}>
                {emotion.text}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}