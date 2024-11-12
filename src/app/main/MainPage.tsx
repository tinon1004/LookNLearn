'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Calendar from './Calendar';
import StickerStatus from './StickerStatus';
import BadgeStatus from './BadgeStatus';

const MainPage: React.FC = () => {
  const router = useRouter();
  
  const handleNavigation = (path: string): void => {
    router.push(path);
  };

  const handleDayClick = (day: number, year: number, month: number): void => {
    const today = new Date();
    if (year === today.getFullYear() && month === today.getMonth() + 1 && day === today.getDate()) {
      handleNavigation('/main/step1');
    } 
  };

  return (
    <div className="flex flex-col items-center justify-start h-screen p-4">
      <div className="absolute top-4 left-4">
        <button
          onClick={() => router.push('/')}
          className="bg-gray-500 text-white font-semibold py-2 px-4 rounded hover:bg-gray-700 transition duration-300"
        >

        </button>
      </div>
      <div className="flex justify-center mb-4">
        <button
          onClick={() => router.push('/main/introduction')} 
          className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
        >
          서비스 소개
        </button>
        <button 
          onClick={() => router.push('/main/step1')} 
          className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition duration-300 ml-4"
        >
          학습하기
        </button>
      </div>
      <Calendar onDayClick={handleDayClick} />
      <div className="flex gap-4 w-full max-w-5xl mt-4">
        <StickerStatus />
        <BadgeStatus />
      </div>
    </div>
  );
}

export default MainPage;