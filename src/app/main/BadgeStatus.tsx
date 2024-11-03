'use client';

import React from 'react';

const BadgeStatus: React.FC = () => {
  const badges = [
    "행복 뱃지",
    "짜증 뱃지",
    "두려움 뱃지",
    "화남 뱃지",
    "슬픔 뱃지",
    "놀람 뱃지",
    "덤덤 뱃지",
    "종합 뱃지"
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 w-full flex-1">
      <div>
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-semibold">이번달 뱃지 현황</div>
          <button className="text-sm underline text-gray-600">뱃지 전체보기</button>
        </div>
        <div className="grid grid-cols-4 gap-x-4 gap-y-6">
          {badges.map((badge, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              </div>
              <span className="text-xs text-gray-600">{badge}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BadgeStatus;