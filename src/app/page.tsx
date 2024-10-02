'use client';

import { useState } from 'react';
import Image from 'next/image';
import WebcamPage from './WebcamPage';

function LandingPage({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* 로고 */}
        <div className="mx-auto h-40 w-80 relative">
          <Image
            src="/img/Logo.png" 
            alt="Logo"
            fill
            className="object-contain"
          />
        </div>
        
        <p className="text-gray-600 text-lg">
          나와의 눈맞춤으로 표정을 학습해요!
        </p>
        
        <div className="space-y-4">
          <button
            onClick={onStart}
            className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
            style={{ backgroundColor: '#98A5B3' }}
          >
            시작하기
          </button>
        </div>
        
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto">
              1
            </div>
            <p className="mt-2 text-sm text-gray-500">웹캠 켜기</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto">
              2
            </div>
            <p className="mt-2 text-sm text-gray-500">사진 촬영</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto">
              3
            </div>
            <p className="mt-2 text-sm text-gray-500">결과 확인</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [isStarted, setIsStarted] = useState(false);

  if (!isStarted) {
    return <LandingPage onStart={() => setIsStarted(true)} />;
  }

  return <WebcamPage />;
}