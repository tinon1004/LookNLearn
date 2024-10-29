'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';


type CalendarProps = {
  onDayClick: (day: number, year: number, month: number) => void;
};

const Calendar: React.FC<CalendarProps> = ({ onDayClick }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isFirstCompletion, setIsFirstCompletion] = useState<boolean>(false);
  const [randomStickerNumber, setRandomStickerNumber] = useState<number>(1);
  const today = new Date();

  useEffect(() => {
    const randomNumber = Math.floor(Math.random() * 4) + 1; 
    setRandomStickerNumber(randomNumber);
  }, []); 

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

  const handleDayClick = (day: number) => {
    onDayClick(day, currentDate.getFullYear(), currentDate.getMonth() + 1);
  };

  const isToday = (day: number) => 
    currentDate.getFullYear() === today.getFullYear() &&
    currentDate.getMonth() === today.getMonth() &&
    day === today.getDate();

    const getStickerPath = (stickerNumber: number, isCompleted: boolean) => {
      return isCompleted 
        ? `/img/stickers/full-sticker${stickerNumber}.png`
        : `/img/stickers/empty-sticker${stickerNumber}.png`;
    };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 w-full max-w-2xl">
      <style jsx>{`
         @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        .pulse-animation {
          animation: pulse 2s infinite;
        }
      `}</style>
      <div className="flex justify-between items-start mb-2">
        <div className="flex flex-col items-start">
          <h2 className="text-sm text-black-600">
            {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
          </h2>
          <h2 className="text-xl font-bold">
            룩앤런 출석현황
          </h2>
        </div>
        <div className="flex">
          <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                  className="mx-1 px-3 py-1 text-gray-600 ">
            &lt;
          </button>
          <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                  className="mx-1 px-3 py-1 text-gray-600 ">
            &gt;
          </button>
        </div>
      </div> 

      <div className="grid grid-cols-7">
        {weekdays.map(day => (
            <div key={day} className="text-gray-600 py-1 border-b-2 text-sm pl-2">
              {day}
            </div>
          ))}
      </div>
      

      <div className="grid grid-cols-7 border-l-2 border-gray-200">
       
        {Array(firstDayOfMonth).fill(null).map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square border-r-2 border-b-2 border-gray-200" />
        ))}
        {days.map(day => (
          <button
            key={day}
            onClick={() => handleDayClick(day)}
            className={`relative aspect-square border-r-2 border-b-2 border-gray-200`}
          >
            <div className="absolute top-2 left-2 text-sm">
              {day}
            </div>
            {isToday(day) && (
              <div className={`absolute inset-0 flex items-center justify-center ${!isFirstCompletion ? 'pulse-animation' : ''}`}>
                <Image
                  src={getStickerPath(randomStickerNumber, isFirstCompletion)}
                  alt={isFirstCompletion ? "Full sticker" : "Empty sticker"}
                  width={40}
                  height={40}
                />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};


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
    </div>
  );
}

export default MainPage;