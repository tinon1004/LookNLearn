'use client';

import { useRouter } from 'next/navigation';

export default function MainPage() {
    
    const router = useRouter();

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
    </div>
  );
}
