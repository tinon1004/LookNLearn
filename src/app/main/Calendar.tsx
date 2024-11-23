'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { auth } from '@/firebase/firebaseConfig';
import { getMonthlyAttendance, AttendanceRecord } from '@/firebase/api/attendance';
import { Info } from 'lucide-react';

type CalendarProps = {
  onDayClick: (day: number, year: number, month: number) => void;
};

const Calendar: React.FC<CalendarProps> = ({ onDayClick }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [monthlyAttendance, setMonthlyAttendance] = useState<{ [key: string]: AttendanceRecord }>({});
  const [showHelp, setShowHelp] = useState(false);
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
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">
              룩앤런 출석현황
            </h2>
            <button
              onClick={() => setShowHelp(true)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Info size={20} className="text-blue-500" />
            </button>
          </div>
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

        {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">출석현황 도움말</h3>
              <button 
                onClick={() => setShowHelp(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600">
                매일 학습을 완료하면 <br/> 귀여운 캐릭터 스티커를 모을 수 있어요! 🎉
              </p>
              
              <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                <Image
                  src="/img/stickers/empty-sticker1.png"
                  alt="Empty Sticker"
                  width={30}
                  height={30}
                />
                <span className="text-gray-600 text-sm">
                  빈 스티커: 아직 오늘의 학습을 완료하지 않았어요.
                </span>
              </div>
              
              <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                <Image
                  src="/img/stickers/full-sticker1.png"
                  alt="Full Sticker"
                  width={30}
                  height={30}
                />
                <span className="text-gray-600 text-sm">
                  컬러 스티커: 오늘의 학습을 완료했어요!
                </span>
              </div>
              
              <p className="text-gray-600">
                매일 학습을 완료하고 다양한 캐릭터 스티커를 수집해보세요.
              </p>
            </div>
            

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowHelp(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;