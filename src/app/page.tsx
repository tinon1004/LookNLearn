'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';


export default function LandingPage() {
 
  const router = useRouter();

  const MovePage = () => {
    router.push('/main');
  };

  const MoveToSignup = () => {
    router.push('/signup');
  };
 
 
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="max-w-md w-full space-y-8 text-center">
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
        
        <div className="flex flex-col items-center space-y-4">
          <input
            type="text"
            placeholder="아이디를 입력해 주세요"
            className="w-60 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="password"
            placeholder="비밀번호를 입력해 주세요"
            className="w-60 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          

          <button
            onClick={MovePage}
            className="w-60 px-3 py-2 border border-transparent text-base font-medium rounded-md text-white bg-[#2F8EFF] hover:bg-[#8BAACE] transition duration-300"
          >
            로그인
          </button>

          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <button
              onClick={MoveToSignup}
              className="hover:text-gray-800"
            >
              회원가입
            </button>
            <span className="text-gray-300">|</span>
            <button
              // onClick={MoveToFindId}
              className="hover:text-gray-800"
            >
              아이디 찾기
            </button>
            <span className="text-gray-300">|</span>
            <button
              // onClick={MoveToFindPassword}
              className="hover:text-gray-800"
            >
              비밀번호 찾기
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}