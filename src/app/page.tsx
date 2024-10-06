'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';


export default function LandingPage() {
 
  const router = useRouter();

  const MovePage = () => {
    router.push('/main');
  };
 
 
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
            onClick={MovePage}
            className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
          >
            시작하기
          </button>
        </div>
        
      </div>
    </div>
  );
}