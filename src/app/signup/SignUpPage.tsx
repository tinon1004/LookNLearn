'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';

interface SignUpData {
  name: string;
  email: string;
  birthDate: string;
  password: string;
  passwordConfirm: string;
  termsAccepted: boolean;
}

export default function SignUpPage() {
    const router = useRouter();
    
    const MoveToScore = () => {
        router.push('/signup/score');
    };
     
    const [formData, setFormData] = useState<SignUpData>({
      name: '',
      email: '',
      birthDate: '',
      password: '',
      passwordConfirm: '',
      termsAccepted: false
    });

    const isFormComplete = () => {
      return formData.name !== '' && 
             formData.email !== '' && 
             formData.birthDate !== '' && 
             formData.password !== '' && 
             formData.passwordConfirm !== '' && 
             formData.termsAccepted;
    };

  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      MoveToScore();
    };
  
  
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="w-full max-w-md space-y-6">

        <div className="mx-auto h-40 w-60 relative">
          <Image
            src="/img/Logo.png" 
            alt="Logo"
            fill
            className="object-contain"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm text-gray-600 mb-1">이름</label>
            <input
              type="text"
              name="name"
              placeholder="이름 (예시) 신이름"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#7BA4D9]"
            />
          </div>


          <div>
            <label className="block text-sm text-gray-600 mb-1">아이디</label>
            <input
              type="email"
              name="email"
              placeholder="이메일 입력 (예시) ajou@gmail.com"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#7BA4D9]"
            />
          </div>


          <div>
            <label className="block text-sm text-gray-600 mb-1">생년월일</label>
            <input
              type="text"
              name="birthDate"
              placeholder="8자 입력 (예시) 20240101"
              value={formData.birthDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#7BA4D9]"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">비밀번호</label>
            <input
              type="password"
              name="password"
              placeholder="비밀번호를 입력해 주세요."
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#7BA4D9]"
            />
          </div>

        
          <div>
            <label className="block text-sm text-gray-600 mb-1">비밀번호 확인</label>
            <input
              type="password"
              name="passwordConfirm"
              placeholder="비밀번호를 한 번 더 입력해 주세요."
              value={formData.passwordConfirm}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#7BA4D9]"
            />
          </div>

         
          <div className="flex items-center">
            <input
              type="checkbox"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleInputChange}
              className="h-4 w-4 text-[#7BA4D9] focus:ring-[#7BA4D9] border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-600">
              개인정보 수집 및 이용 동의
            </label>
          </div>

          <button
            type="submit"
            disabled={!isFormComplete()}
            className={`w-full py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ${
              isFormComplete()
                ? 'bg-[#2F8EFF] hover:bg-[#2F8EFF]/90 text-white focus:ring-[#2F8EFF]'
                : 'bg-[#DAE0E6] text-gray-600'
            }`}
          >
            다음
          </button>
        </form>
        </div>
      </div>
    );
}