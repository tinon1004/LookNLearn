'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';


type CalendarProps = {
  onDayClick: (day: number, year: number, month: number) => void;
};

const Calendar: React.FC<CalendarProps> = ({ onDayClick }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const today = new Date();

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

  const handleDayClick = (day: number) => {
    onDayClick(day, currentDate.getFullYear(), currentDate.getMonth() + 1);
  };

  const isToday = (day: number) => 
    currentDate.getFullYear() === today.getFullYear() &&
    currentDate.getMonth() === today.getMonth() &&
    day === today.getDate();

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-2xl">
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col items-start">
          <h2 className="text-l font-bold">
            {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
          </h2>
          <h2 className="text-xl font-bold">
            룩앤런 출석현황
          </h2>
        </div>
        <div className="flex">
          <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                  className="mx-1 px-3 py-1 bg-gray-200 rounded-full text-gray-600 hover:bg-gray-300">
            &lt;
          </button>
          <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                  className="mx-1 px-3 py-1 bg-gray-200 rounded-full text-gray-600 hover:bg-gray-300">
            &gt;
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {weekdays.map(day => (
          <div key={day} className="text-center font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}
        {Array(firstDayOfMonth).fill(null).map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square" />
        ))}
        {days.map(day => (
          <button
            key={day}
            onClick={() => handleDayClick(day)}
            className={`aspect-square flex items-center justify-center p-2 rounded-lg transition-colors border border-gray-200
              ${isToday(day) ? 'bg-blue-400 text-white hover:bg-blue-200' : ''}`}
          >
            {day}
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
    } else {
      handleNavigation(`/main/learn/${year}/${month}/${day}`);
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