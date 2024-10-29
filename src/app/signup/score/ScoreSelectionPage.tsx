'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';

type ScoreData = {
  iq: string;
  gas: string;
  file: File | null;
  isChecked: boolean;
};

export default function ScoreSelectionPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ScoreData>({
    iq: '',
    gas: '',
    file: null,
    isChecked: false
  });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      file: file
    }));
  };


  const handleSubmit = () => {
    console.log('Form Data:', formData);
    router.push('/signup/symptoms');
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8">
      <div className="text-center space-y-2">
          
        <div className="mx-auto h-40 w-60 relative">
          <Image
            src="/img/Logo.png" 
            alt="Logo"
            fill
            className="object-contain"
          />
        </div>

          <p className="mt-4 text-gray-600 text-sm">
            Look and Learn은 사용자 활동을 기반으로 맞춤 데이터를<br />
            심리 상담 또는 치료에 활용할 수 있도록 합니다.
          </p>
          <p className="mt-4 text-gray-600 text-sm">
            보호자 자녀의 원활한 의사소통을 위해<br />
            전문 의학기관에서 인증받은 IQ 또는 GAS점수를<br />
            입력해 주시면 감사하겠습니다.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">IQ</label>
            <input
              type="text"
              placeholder="IQ 점수를 입력해 주세요"
              value={formData.iq}
              onChange={(e) => setFormData(prev => ({ ...prev, iq: e.target.value }))}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4A90E2] focus:border-[#4A90E2]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">GAS 점수</label>
            <input
              type="text"
              placeholder="GAS 점수를 입력해 주세요, 예시) 87"
              value={formData.gas}
              onChange={(e) => setFormData(prev => ({ ...prev, gas: e.target.value }))}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4A90E2] focus:border-[#4A90E2]"
            />
          </div>

          <div>
            <label
                htmlFor="file-upload"
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  {/* <Upload size={16} className="text-gray-500" /> */}
                  <span>인증 자료 업로드</span>
                </div>
              </label>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <p className="mt-1 text-xs text-gray-500">*PDF, JPG, JPEG, PNG (최대 50MB)</p>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="terms"
              checked={formData.isChecked}
              onChange={(e) => setFormData(prev => ({ ...prev, isChecked: e.target.checked }))}
              className="h-4 w-4 text-[#4A90E2] focus:ring-[#4A90E2] border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
              IQ, GAS 정보 수집 및 이용 동의
            </label>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#4A90E2] hover:bg-[#357ABD] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4A90E2]"
          >
            건너 뛰기
          </button>

        <button
          onClick={handleSubmit}
          className="w-full px-4 py-3 bg-[#9EBCDF] hover:bg-[#8BAACE] text-white font-medium rounded-md transition duration-300"
        >
          다음으로 이동하기
        </button>
        </div>
      </div>
    </div>
  );
}