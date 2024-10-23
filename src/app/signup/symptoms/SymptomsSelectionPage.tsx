'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface SymptomType {
  id: number;
  text: string;
}

export default function SymptomsSelectionPage() {
  const router = useRouter();
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const symptoms: SymptomType[] = [
    { id: 1, text: "눈 맞추기, 얼굴 표정, 제스처 사용이 적절하지 않거나 반드가 적다" },
    { id: 2, text: "발달 수준에 적합한 또래 관계를 형성하지 못한다" },
    { id: 3, text: "자발적으로 다른 사람과 즐거움이나 관심을 함께 나누고 싶어 하지 않는다" },
    { id: 4, text: "정서적 상호작용이 부족하다" },
    { id: 5, text: "구어 발달이 지연된다" },
    { id: 6, text: "대화를 시작하거나 지속하는 데 어려움이 있다" },
    { id: 7, text: "한정된 관심사에 몰두하며, 그 몰두하는 정도가 비정상적이다" },
    { id: 8, text: "외관상 특특하다" },
    { id: 9, text: "비기능적인 일이나 관습에 변함없이 집착한다" },
    { id: 10, text: "상동적이고 반복적인 운동 양식(손이나 손가락을 꼬는 등)을 보인다" },
    { id: 11, text: "물건의 어떤 부분에 대해 지속적으로 집착한다" }
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">증상 체크리스트</h1>
          <p className="mt-2 text-gray-600">해당되는 증상을 모두 선택해주세요</p>
        </div>

        <div className="w-full space-y-4">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9EBCDF]"
            >
              증상을 선택해주세요
            </button>
            
            {isOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {symptoms.map((symptom) => (
                  <div
                    key={symptom.id}
                    className={`px-4 py-3 cursor-pointer hover:bg-gray-100 ${
                      selectedSymptoms.includes(symptom.text) ? 'bg-gray-50' : ''
                    }`}
                    onClick={() => {
                      handleSymptomToggle(symptom.text);
                    }}
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedSymptoms.includes(symptom.text)}
                        onChange={() => {}}
                        className="mr-3"
                      />
                      <span className="text-sm">{symptom.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            {selectedSymptoms.map((symptom, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-md"
              >
                <span className="text-sm text-gray-700">{symptom}</span>
                <button
                  type="button"
                  onClick={() => handleSymptomToggle(symptom)}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            className="w-full px-4 py-3 mt-4 bg-[#9EBCDF] hover:bg-[#8BAACE] text-white font-medium rounded-md transition duration-300"
          >
            가입하기
          </button>
        </div>
      </div>
    </div>
  );
}