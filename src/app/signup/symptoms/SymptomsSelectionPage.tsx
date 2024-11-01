'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';

interface SymptomType {
  id: number;
  text: string;
}

export default function SymptomsSelectionPage() {
  const router = useRouter();
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  const symptoms: SymptomType[] = [
    { id: 1, text: "친구 사귀기를 어려워 한다." },
    { id: 2, text: "다른 사람과 소통을 어려워 한다." },
    { id: 3, text: "대화를 지속하는 것에 힘들어 한다." },
    { id: 4, text: "다른 사람과 깊은 공감에 힘들어 한다." },
    { id: 5, text: "특정 관심사에만 관심을 둔다." },
    { id: 6, text: "특이한/특정 행동을 반복한다." },
    { id: 7, text: "아이컨택을 어려워 한다." }
  ];

  const handleSymptomToggle = (symptomText: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptomText)
        ? prev.filter(s => s !== symptomText)
        : [...prev, symptomText]
    );
  };

  const handleSubmit = () => {
    console.log('선택된 증상들:', selectedSymptoms);
    router.push('/signup/completion'); 
  };

  const isAnySymptomSelected = selectedSymptoms.length > 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8 pb-20">
        <div className="text-center">
          <div className="mx-auto h-40 w-60 relative">
            <Image
              src="/img/Logo.png" 
              alt="Logo"
              fill
              className="object-contain"
            />
          </div>
          <p className="text-gray-600">증상 선택에 따른 특화된 학습을</p>
          <p className="text-gray-600">진행할 수 있습니다.</p>
        </div>

        <div className="w-full space-y-4">
          {symptoms.map((symptom) => (
            <div
              key={symptom.id}
              onClick={() => handleSymptomToggle(symptom.text)}
              className={`
                p-3 
                rounded-md 
                cursor-pointer 
                border-2 
                border-[#9EBCDF]
                transition-all
                ${selectedSymptoms.includes(symptom.text) 
                  ? 'bg-transparent' 
                  : 'bg-white'}
              `}
            >
              <div className="flex items-center">
                <div className={`
                    w-5 
                    h-5 
                    mr-3 
                    border-2
                    rounded-sm
                    flex 
                    items-center 
                    justify-center
                    transition-colors
                    border-[#525c66]
                    bg-white
                  `}>
                   {selectedSymptoms.includes(symptom.text) && (
                    <span className="text-[#525c66] text-sm">✓</span>
                  )}
                </div>
                <span className="text-sm">{symptom.text}</span>
              </div>
            </div>
          ))}

          <div className="flex flex-col space-y-2">
            <button
              onClick={handleSubmit}
              className="w-full px-4 py-3 border-2 border-[#525c66] text-gray-700 font-medium rounded-md hover:bg-gray-100 transition duration-300"
            >
              건너뛰기
            </button>

            <button
              onClick={handleSubmit}
              disabled={!isAnySymptomSelected}
              className={`
                w-full 
                px-4 
                py-3 
                mt-4 
                font-medium 
                rounded-md 
                transition 
                duration-300
                ${isAnySymptomSelected 
                  ? 'bg-[#9EBCDF] hover:bg-[#8BAACE] text-white cursor-pointer' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
              `}
            >
            가입하기
          </button>
          </div>
        </div>
      </div>
    </div>
  );
}