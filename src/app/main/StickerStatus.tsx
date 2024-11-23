'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { auth } from '@/firebase/firebaseConfig';
import { getMonthlyStats, MonthlyStats } from '@/firebase/api/attendance';

const StickerStatus: React.FC = () => {
  const [currentMonthStats, setCurrentMonthStats] = useState<MonthlyStats | null>(null);
  const [totalStats, setTotalStats] = useState<MonthlyStats | null>(null);
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  useEffect(() => {
    const fetchStats = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const monthStats = await getMonthlyStats(userId, currentYear, currentMonth);
      setCurrentMonthStats(monthStats);

      const allMonthsStats = await getMonthlyStats(userId, currentYear, 0);
      setTotalStats(allMonthsStats);
    };

    fetchStats();
  }, [currentYear, currentMonth]);

  const getMonthName = (month: number) => {
    return new Date(2024, month - 1).toLocaleDateString('ko-KR', { month: 'long' });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 w-full h-full">
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">전체 스티커 현황</h3>
            <span className="text-sm text-gray-600">
              전체 총 출석 횟수: {totalStats?.totalComplete || 0}회
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <div className="flex items-center gap-2">
              <Image src="/img/stickers/full-sticker1.png" alt="Green sticker" width={40} height={40} />
              <span>x {totalStats?.sticker1 || 0}</span>
            </div>
            <div className="flex items-center gap-2">
              <Image src="/img/stickers/full-sticker2.png" alt="Blue sticker" width={40} height={40} />
              <span>x {totalStats?.sticker2 || 0}</span>
            </div>
            <div className="flex items-center gap-2">
              <Image src="/img/stickers/full-sticker3.png" alt="Orange sticker" width={40} height={40} />
              <span>x {totalStats?.sticker3 || 0}</span>
            </div>
            <div className="flex items-center gap-2">
              <Image src="/img/stickers/full-sticker4.png" alt="Pink sticker" width={40} height={40} />
              <span>x {totalStats?.sticker4 || 0}</span>
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mt-8 mb-4">
            <h3 className="text-lg font-semibold">{getMonthName(currentMonth)} 스티커 현황</h3>
            <span className="text-sm text-gray-600">
              이번 달 총 출석 횟수: {currentMonthStats?.totalComplete || 0}회
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <div className="flex items-center gap-2">
              <Image src="/img/stickers/full-sticker1.png" alt="Green sticker" width={40} height={40} />
              <span>x {currentMonthStats?.sticker1 || 0}</span>
            </div>
            <div className="flex items-center gap-2">
              <Image src="/img/stickers/full-sticker2.png" alt="Blue sticker" width={40} height={40} />
              <span>x {currentMonthStats?.sticker2 || 0}</span>
            </div>
            <div className="flex items-center gap-2">
              <Image src="/img/stickers/full-sticker3.png" alt="Orange sticker" width={40} height={40} />
              <span>x {currentMonthStats?.sticker3 || 0}</span>
            </div>
            <div className="flex items-center gap-2">
              <Image src="/img/stickers/full-sticker4.png" alt="Pink sticker" width={40} height={40} />
              <span>x {currentMonthStats?.sticker4 || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickerStatus;