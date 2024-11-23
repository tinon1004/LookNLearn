'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function EmotionWarmup() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emotion = searchParams?.get('emotion');
  const count = parseInt(searchParams?.get('count') || '0');

  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        console.error('카메라 접근 오류:', error);
      }
    };
    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const getEmotionImage = (emotion: string): string => {
    const imageMap: Record<string, string> = {
      '행복한, 좋은 표정': '/img/practice/happy.png',
      '짜증난, 싫은 표정': '/img/practice/annoyed.png',
      '두려운, 무서운 표정': '/img/practice/scared.png',
      '화난, 분노의 표정': '/img/practice/angry.png',
      '슬픈, 우울한 표정': '/img/practice/sad.png',
      '놀란, 놀라는 표정': '/img/practice/surprised.png',
      '덤덤한, 무표정': '/img/practice/neutral.png'
    };
    return imageMap[emotion];
  };

  const handleNext = () => {
    router.push(`/main/step2?emotion=${encodeURIComponent(emotion || '')}&count=${count}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-3">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-5">
          <h2 className="text-3xl font-bold text-center mb-5">표정 연습해보기</h2>
            <p className="text-xl font-semibold mb-4 text-center">사진을 보고 직접 표정을 짓는 연습을 해보세요!</p>
            <div className="space-y-5">
              <img 
                src={getEmotionImage(emotion || '')}
                alt="감정 표현 예시"
                className="w-full max-h-[400px] object-contain rounded-xl"
              />
              <p className="text-center text-xl text-gray-700">{emotion}</p>
            </div>

        </div>
        
        <div className="flex justify-center gap-4">
            <button
              onClick={handleNext}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-lg rounded-xl transition-colors"
            >
              다음 단계로
            </button>
          </div>

        <div className="text-center text-gray-500 text-lg mt-5">
          {count} / 5
        </div>
      </div>
    </div>
  );
}