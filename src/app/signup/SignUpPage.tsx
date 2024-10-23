'use client';


import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface SignUpData {
  name: string;
  birthDate: string;
  userId: string;
  password: string;
}

export default function SignUpPage() {
    const router = useRouter();

    const MoveToLogin = () => {
        router.push('/');
      };
    
    const MoveToScore = () => {
        router.push('/signup/score');
    };
     
    const [formData, setFormData] = useState<SignUpData>({
      name: '',
      birthDate: '',
      userId: '',
      password: '',
    });

  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };
  
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="w-full max-w-md space-y-8 text-center">
  
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900">
                Look and Learn의 
            </h2>
            <h2 className="text-xl font-bold text-gray-900">
                회원이 되어주세요!😉
            </h2>
          </div>
  
          <form className="flex flex-col items-center space-y-4">
            <input
              type="text"
              name="name"
              placeholder="이름을 입력해 주세요"
              value={formData.name}
              onChange={handleInputChange}
              className="w-60 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <input
              type="date"
              name="birthDate"
              placeholder="생년월일"
              value={formData.birthDate}
              onChange={handleInputChange}
              className="w-60 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <input
              type="text"
              name="userId"
              placeholder="아이디를 입력해 주세요"
              value={formData.userId}
              onChange={handleInputChange}
              className="w-60 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="비밀번호를 입력해 주세요"
              value={formData.password}
              onChange={handleInputChange}
              className="w-60 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
  
            <button
              type="submit"
              onClick={MoveToScore}
              className="w-60 px-3 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              다음으로 이동하기
            </button>
  
            <button
              type="button"
              onClick={MoveToLogin}
              className="text-gray-600 hover:text-gray-800 text-sm font-medium"
            >
              이미 계정이 있으신가요? 로그인하기
            </button>
          </form>
        </div>
      </div>
    );
}