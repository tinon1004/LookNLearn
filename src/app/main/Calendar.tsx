'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { auth } from '@/firebase/firebaseConfig';
import { getMonthlyAttendance, AttendanceRecord } from '@/firebase/api/attendance';

type CalendarProps = {
  onDayClick: (day: number, year: number, month: number) => void;
};

const Calendar: React.FC<CalendarProps> = ({ onDayClick }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [monthlyAttendance, setMonthlyAttendance] = useState<{ [key: string]: AttendanceRecord }>({});
  const today = new Date();

  const fetchMonthlyAttendance = async (date: Date) => {
    const userId = auth.currentUser?.uid;
    if (userId) {
      try {
        const attendance = await getMonthlyAttendance(
          userId,
          date.getFullYear(),
          date.getMonth() + 1
        );
        setMonthlyAttendance(attendance);
      } catch (error) {
        console.error('Error fetching attendance:', error);
      }
    }
  };
 
  useEffect(() => {
    fetchMonthlyAttendance(currentDate);
  }, [currentDate]);

  const handleMonthChange = async (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + (direction === 'next' ? 1 : -1), 1);
    setCurrentDate(newDate);
  };

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

  const getStickerPath = (day: number) => {
    const attendance = monthlyAttendance[day];
    const isCurrentDay = isToday(day);

    if (isCurrentDay && !attendance) {
      return '/img/stickers/empty-sticker1.png';
    }

    if (!attendance) return null;
    
    return attendance.isComplete 
      ? `/img/stickers/full-sticker${attendance.stickerType}.png`
      : `/img/stickers/empty-sticker${attendance.stickerType}.png`;
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
          <button 
            onClick={() => handleMonthChange('prev')}
            className="mx-1 px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            &lt; 
          </button>
          <button 
            onClick={() => handleMonthChange('next')}
            className="mx-1 px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
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
        {days.map(day => {
          const stickerPath = getStickerPath(day);
          const isCurrentDay = isToday(day);
          
          return (
            <button
              key={day}
              onClick={() => handleDayClick(day)}
              className={`relative aspect-square border-r-2 border-b-2 border-gray-200`}
            >
              <div className="absolute top-2 left-2 text-sm">
                {day}
              </div>
              {stickerPath && (
                <div className={`absolute inset-0 flex items-center justify-center ${isCurrentDay ? 'pulse-animation' : ''}`}>
                  <Image
                    src={stickerPath}
                    alt="Sticker"
                    width={40}
                    height={40}
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;