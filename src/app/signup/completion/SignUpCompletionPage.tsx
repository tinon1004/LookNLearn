'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function SignUpCompletionPage() {
  const router = useRouter();

  const handleGoToMainPage = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">가입 완료!</h1>
        <div className="text-6xl mb-6">🎉</div>
        <h2 className="text-xl font-bold">
          Look and Learn의
        </h2>
        <h2 className="text-xl font-bold mb-8">
          가족이 되신 것을 축하합니다!
        </h2>
        <div className="space-y-4">
          <button
            onClick={handleGoToMainPage}
            className="bg-[#2F8EFF] hover:bg-[#8BAACE] text-white font-bold py-2 px-4 rounded w-full transition duration-300"
          >
            로그인 페이지로 이동하기
          </button>
        </div>
      </div>
    </div>
  );
}