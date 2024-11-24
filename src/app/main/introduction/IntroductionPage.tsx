'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function IntroductionPage() {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeSection, setActiveSection] = useState('overview');

  const teamMembers = [
    {
      name: '엄채윤',
      role: 'AI 엔진 담당',
      emoji: '🤖',
      description: 'AI로 더 정확한 감정 분석을 만들어요',
      experience: [
        'Fingram(Quram) 엔진 개발, 러닝 학습 및 ORC 과제 수행',
        'UNIST(울산과학기술원) Image Enhancement 연구'
      ]
    },
    {
      name: '조나애',
      role: '풀스택(프론트 + 백) 담당',
      emoji: '💻',
      description: '편리한 서비스를 만들기 위해 노력해요',
      experience: [
        '아주대 창업동아리 크루베이션 학습관리플랫폼 웹 프론트엔드 개발',
        '엘에스웨어 품질관리/QA 인턴'
      ]
    },
    {
      name: '호영준',
      role: '기획, 디자인 담당',
      emoji: '🎨',
      description: '아이들이 재미있게 배울 수 있게 디자인해요',
      experience: [
        '지니컵 자사 쇼핑몰 UI/UX 개선',
        '포커스비전 대형 출력 대행 서비스 프로세스 구축',
        '아주대 증권투자연구회 프라이빗 투자수업 도서 디자인',
        '아주대 미디어학과 2023년 구글 오심인 PM 특별강연 포스터 제작'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-white">
        <div className="text-center max-w-4xl mx-auto px-4">
          <div className="mx-auto h-40 w-80 relative">
            <Image
              src="/img/Logo.png" 
              alt="Logo"
              fill
              className="object-contain"
            />
          </div>
          <p className="text-2xl text-gray-700 mb-8">ASD아동을 위한 표정 학습 서비스</p>
          <p className="text-xl text-gray-600 mb-12">
            우리는 ASD아동들의 비언어적 의사소통 능력을 향상시켜 더 많은 아이들이 공감을 통해
            우리 사회 속에 이질감 없는 모습으로 하나 되는 것을 목표로 합니다.
          </p>
          <button
            onClick={() => router.push('/main/step1')}
            className="bg-blue-500 text-white text-xl font-semibold py-4 px-8 rounded-xl shadow-lg hover:bg-blue-600 transform transition duration-300 hover:scale-105"
          >
            지금 학습 시작하기
          </button>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">학습 프로세스</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-blue-50 rounded-xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-blue-600 mb-4">1. 상황별 표정 퀴즈</h3>
              <p className="text-gray-700">
                각 상황에 따른 이미지와 텍스트가 제공되며, 7가지 감정 중 적절한 표정을 선택하는
                객관식 퀴즈를 진행합니다.
              </p>
            </div>
            <div className="bg-blue-50 rounded-xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-blue-600 mb-4">2. 표정 촬영 및 분석</h3>
              <p className="text-gray-700">
                선택한 감정의 표정을 태블릿, 모바일, 웹 등의 전면 카메라로 촬영하고, AI가 표정을 분석하여
                피드백을 제공합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">주요 특징</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="text-3xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">딥러닝 기반 AI 분석</h3>
              <p className="text-gray-600">
                7가지 감정을 정확하고 빠르게 분석하여 소통의 오해를 최소화하고 감정과 집중력을
                파악합니다.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="text-3xl mb-4">📈</div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">데이터 기반 학습 분석</h3>
              <p className="text-gray-600">
                과거부터 현재까지의 소통 능력 향상도와 감정별 강점/약점을 데이터로 확인할 수
                있습니다.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="text-3xl mb-4">🎖️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">보상 시스템</h3>
              <p className="text-gray-600">
                공룡 스티커와 성취 뱃지를 통해 학습 동기를 부여하고 지속적인 참여를 유도합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-blue-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">앞으로의 발전 방향</h2>
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-blue-600 mb-4">🧠 AI 기능 강화</h3>
            <p className="text-gray-700">
              퀴즈 정확도 추적과 단어/상황 분석을 통해 개인화된 학습 가이드를 제공하고,
              다양한 ASD아이들의 데이터를 기반으로 더 효과적인 사회화 방안을 제시할 예정입니다.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">우리 팀을 소개합니다!</h2>
          <p className="text-center text-gray-600 mb-16">Look & Learn을 만드는 사람들이에요 👋</p>
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-4">{member.emoji}</div>
                  <h3 className="text-xl font-bold text-blue-600 mb-1">{member.name}</h3>
                  <p className="font-medium text-gray-500 mb-2">{member.role}</p>
                  <p className="text-sm text-gray-600">{member.description}</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">이런 일을 했어요 ✨</p>
                  <ul className="text-gray-600 space-y-2">
                    {member.experience.map((exp, i) => (
                      <li key={i} className="text-sm flex items-start">
                        <span className="mr-2">•</span>
                        <span>{exp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-t from-blue-100 to-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-blue-600 mb-8">
            Look & Learn과 함께 시작하세요
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            매일 5가지 상황에서 감정을 학습하고, AI 기반의 정확한 피드백을 받아보세요.
          </p>
          <button
            onClick={() => router.push('/main/step1')}
            className="bg-blue-500 text-white text-xl font-semibold py-4 px-8 rounded-xl shadow-lg hover:bg-blue-600 transform transition duration-300 hover:scale-105"
          >
            바로 학습 시작하기
          </button>
        </div>
      </section>
    </div>
  );
}