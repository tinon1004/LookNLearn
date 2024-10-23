'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function LearningCompletionPage() {
  const router = useRouter();

  const handleContinueLearning = () => {
    localStorage.setItem('learningCount', '0');
    router.push('/main/step1');
  };

  const handleGoToMainPage = () => {
    router.push('/main');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-4">학습 완료!</h1>
        <div className="text-6xl mb-6">🎉</div>
        <p className="text-xl mb-8">
          축하합니다! 5단계의 학습을 모두 완료하셨습니다.
        </p>
        <div className="space-y-4">
          <button
            onClick={handleContinueLearning}
            className="bg-[#9EBCDF] hover:bg-[#8BAACE] text-white font-bold py-2 px-4 rounded w-full transition duration-300"
          >
            이어서 계속 학습하기
          </button>
          <button
            onClick={handleGoToMainPage}
            className="bg-[#9EBCDF] hover:bg-[#8BAACE] text-white font-bold py-2 px-4 rounded w-full transition duration-300"
          >
            메인 페이지로 이동하기
          </button>
        </div>
      </div>
    </div>
  );
}