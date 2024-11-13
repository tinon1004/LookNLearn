'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Calendar from './Calendar';
import StickerStatus from './StickerStatus';
import BadgeStatus from './BadgeStatus';
import Image from 'next/image';

const MainPage: React.FC = () => {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
    <div className="flex flex-col min-h-screen items-center">
      <header className="w-full px-4 py-2">
        <div className="w-[640px] mx-auto flex justify-between items-center mt-3">
          <div className="h-10 w-20 relative">
            <Image
              src="/img/Left_Logo.png"
              alt="Logo"
              fill
              className="object-contain"
            />
          </div>
         
          <div className="relative">
            <div 
              className="w-8 h-8 relative cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <Image
                src="/icons/list.png"
                alt="list"
                fill
                className="object-contain"
              />
            </div>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10">
                <button
                  onClick={() => {
                    handleNavigation('/main/report');
                    setIsDropdownOpen(false);
                  }}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  보고서 보기
                </button>
                <button
                  onClick={() => {
                    handleNavigation('/main/signout');
                    setIsDropdownOpen(false);
                  }}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  로그아웃 하기
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
     
        <div className="max-w-5xl mx-auto mt-3">
        <Calendar onDayClick={handleDayClick} />
        <div className="flex gap-4 w-full max-w-5xl mt-4">
          <StickerStatus />
          <BadgeStatus />
        </div>
        <div className="flex justify-center mt-8 mb-4">
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
        </div>
    </div>
  );
}

export default MainPage;