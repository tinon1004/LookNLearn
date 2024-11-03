'use client';

import React from 'react';
import Image from 'next/image';

// type StickerCounts = {
//   green: number;
//   blue: number;
//   orange: number;
//   pink: number;
// };

const StickerStatus: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 w-full flex-1">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">전체 스티커 현황</h3>
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <Image src="/img/stickers/full-sticker1.png" alt="Green sticker" width={40} height={40} />
              <span>x 1</span>
            </div>
            <div className="flex items-center gap-2">
              <Image src="/img/stickers/full-sticker2.png" alt="Blue sticker" width={40} height={40} />
              <span>x 1</span>
            </div>
            <div className="flex items-center gap-2">
              <Image src="/img/stickers/full-sticker3.png" alt="Orange sticker" width={40} height={40} />
              <span>x 0</span>
            </div>
            <div className="flex items-center gap-2">
              <Image src="/img/stickers/full-sticker4.png" alt="Pink sticker" width={40} height={40} />
              <span>x 1</span>
            </div>
            <div className="text-sm text-gray-600">
              전체 총 출석 횟수: 3회
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">10월의 스티커 현황</h3>
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <Image src="/img/stickers/full-sticker1.png" alt="Green sticker" width={40} height={40} />
              <span>x 1</span>
            </div>
            <div className="flex items-center gap-2">
              <Image src="/img/stickers/full-sticker2.png" alt="Blue sticker" width={40} height={40} />
              <span>x 1</span>
            </div>
            <div className="flex items-center gap-2">
              <Image src="/img/stickers/full-sticker3.png" alt="Orange sticker" width={40} height={40} />
              <span>x 0</span>
            </div>
            <div className="flex items-center gap-2">
              <Image src="/img/stickers/full-sticker4.png" alt="Pink sticker" width={40} height={40} />
              <span>x 1</span>
            </div>
            <div className="text-sm text-gray-600">
              이번달 총 출석 횟수: 3회
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickerStatus;