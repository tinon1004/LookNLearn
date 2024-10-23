'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function IntroductionPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('overview');

  const sections = {
    overview: {
      icon: '🎯',
      title: '서비스 개요',
      content: 'Look & Learn은 자폐 아동들을 위한 감정 인식 학습 플랫폼입니다. 얼굴 표정을 인식하고, 표현하며, 감정을 추론하는 과정을 통해 감정 소통 능력을 향상시키는 체계적인 학습 환경을 제공합니다.'
    },
    purpose: {
      icon: '💡',
      title: '제작 의도',
      content: '자폐 아동들은 타인의 감정을 인식하고 자신의 감정을 표현하는 데 어려움을 겪습니다. Look & Learn은 반복적인 표정 학습을 통해 자폐 아동들이 감정 인식 능력을 향상시키고, 실생활에서 타인과의 소통에서 자신감을 키울 수 있도록 돕기 위해 기획되었습니다.'
    },
    features: {
      icon: '🧩',
      title: '서비스 특징',
      content: (
        <div className="space-y-4">
          <p className="font-semibold mb-2">Look & Learn의 학습 과정은 다음 세 단계로 구성됩니다:</p>
          <div className="pl-4 space-y-3">
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-bold text-blue-600">1. 표정 관찰 및 감정 추측</h4>
              <p className="text-gray-600 mt-1">다양한 인물의 얼굴 표정을 보고 해당 표정이 어떤 감정을 나타내는지 추측합니다.</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-bold text-blue-600">2. 표정 연습</h4>
              <p className="text-gray-600 mt-1">웹캠을 통해 자신의 얼굴을 촬영하고, 주어진 감정에 맞는 표정을 연습합니다.</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-bold text-blue-600">3. 상황별 감정 추론</h4>
              <p className="text-gray-600 mt-1">특정 상황에서 타인이 느낄 감정을 추론하는 연습을 진행합니다.</p>
            </div>
          </div>
        </div>
      )
    },
    effects: {
      icon: '✨',
      title: '기대 효과',
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li>자폐 아동들의 감정 인식과 표현 능력 향상</li>
          <li>대인 관계에서의 자신감 증진</li>
          <li>보호자와 전문가의 효과적인 발달 지원</li>
          <li>사회적 관계 형성 능력 향상</li>
          <li>실시간 학습 진행 상황 모니터링</li>
        </ul>
      )
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto relative">
        <div className="text-center pt-16 pb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-4">Look & Learn</h1>
          <p className="text-xl text-gray-600">감정 인식 학습 플랫폼</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {Object.entries(sections).map(([key, section]) => (
            <div
              key={key}
              className={`bg-white rounded-xl shadow-md p-6 border-2 border-gray-200 transform transition duration-300 hover:scale-102 hover:shadow-lg cursor-pointer ${
                activeSection === key ? 'ring-2 ring-blue-400' : ''
              }`}
              onClick={() => setActiveSection(key)}
            >
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-2">{section.icon}</span>
                <h2 className="text-xl font-bold text-gray-800">{section.title}</h2>
              </div>
              <div className="text-gray-600">
                {section.content}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pb-12">
          <button
            onClick={() => router.push('/main/step1')}
            className="bg-blue-500 text-white text-lg font-semibold py-3 px-8 rounded-xl shadow-lg hover:bg-blue-600 transform transition duration-300 hover:scale-105"
          >
            지금 바로 학습 시작하기
          </button>
        </div>
      </div>
    </div>
  );
}