'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Camera } from 'lucide-react';

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
      '행복한, 좋은 표정': '/img/practice/angry.jpg',
      '짜증난, 싫은 표정': '/img/practice/angry.jpg',
      '두려운, 무서운 표정': '/img/practice/angry.jpg',
      '화난, 분노의 표정': '/img/practice/angry.jpg',
      '슬픈, 우울한 표정': '/img/practice/angry.jpg',
      '놀란, 놀라는 표정': '/img/practice/angry.jpg',
      '덤덤한, 무표정': '/img/practice/angry.jpg'
    };
    return imageMap[emotion];
  };

  const handleNext = () => {
    router.push(`/main/step2?emotion=${encodeURIComponent(emotion || '')}&count=${count}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-10 mb-6">
          <h2 className="text-3xl font-bold text-center mb-8">표정 연습하기</h2>
          
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-8">
            <div className="space-y-5">
              <h3 className="text-2xl font-semibold">따라 해볼 표정</h3>
              <img 
                src={getEmotionImage(emotion || '')}
                alt="감정 표현 예시"
                className="w-full h-[360px] object-cover rounded-xl shadow-md"
              />
              <p className="text-center text-xl text-gray-700">{emotion}</p>
            </div>

            <div className="space-y-5">
              <h3 className="text-2xl font-semibold">내 표정</h3>
              <div className="relative w-full h-[360px] bg-gray-200 rounded-xl overflow-hidden shadow-md">
                {stream ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform scale-x-[-1]"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Camera size={64} className="text-gray-400" />
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500 text-center">
                본인 얼굴이 보이지 않는다면 카메라 권한을 설정해주세요.
              </p>
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={handleNext}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-lg rounded-xl transition-colors"
            >
              다음 단계로
            </button>
          </div>
        </div>

        <div className="text-center text-gray-500 text-lg">
          {count} / 5
        </div>
      </div>
    </div>
  );
}