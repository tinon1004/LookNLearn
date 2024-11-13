'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/firebase/firebaseConfig';
import { signOut } from 'firebase/auth';

export default function LearningCompletionPage() {
  const router = useRouter();

  const handleGoToMainPage = () => {
    router.push('/main');
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      alert('로그아웃 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-6">👋</div>
        <p className="text-xl mb-8">
          내일 다시 만나요!
        </p>
        <div className="space-y-4">
          <button
            onClick={handleGoToMainPage}
            className="bg-[#2F8EFF] hover:bg-[#8BAACE] text-white font-bold py-2 px-4 rounded w-full transition duration-300"
          >
            이전으로 돌아가기
          </button>
          <button
            onClick={handleLogout}
            className="bg-[#2F8EFF] hover:bg-[#8BAACE] text-white font-bold py-2 px-4 rounded w-full transition duration-300"
          >
            로그아웃하기
          </button>
        </div>
      </div>
    </div>
  );
}