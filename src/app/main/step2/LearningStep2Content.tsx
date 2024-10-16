'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams  } from 'next/navigation';
import { Emotion } from '../step1/EmotionData';

interface AnalysisResult {
  label: string;
  probability: number;
}

export default function LearningStep2Content() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emotion = searchParams.get('emotion') as Emotion;
  const count = parseInt(searchParams.get('count') || '0');
  const [isFirstCompletion, setIsFirstCompletion] = useState(true);
  
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [attemptCount, setAttemptCount] = useState<number>(0);
  const [isPhotoCaptured, setIsPhotoCaptured] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startWebcam = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 360 }
        }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCapturing(true);
      setError(null);
    } catch (err) {
      console.error("웹캠을 시작하는 데 실패했습니다:", err);
      setError("카메라 접근에 실패했습니다. 권한을 확인해주세요.");
    }
  }, []);

  const stopWebcam = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCapturing(false);
  }, []);

  useEffect(() => {
    startWebcam();
    return () => {
      stopWebcam();
    };
  }, [startWebcam, stopWebcam]);

  const captureAndUpload = useCallback(async () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const capturedImage = canvas.toDataURL('image/jpeg');
        setImageSrc(capturedImage);

        setIsLoading(true);
        try {
          const response = await fetch(capturedImage);
          const blob = await response.blob();
          const formData = new FormData();
          formData.append('image', blob, 'captured_image.jpg');

          const uploadResponse = await fetch('http://127.0.0.1:5000/upload', {
            method: 'POST',
            body: formData,
          });

          if (!uploadResponse.ok) {
            throw new Error('업로드 실패');
          }

          const analysisResults: AnalysisResult[] = await uploadResponse.json();
          const sortedResults = analysisResults.sort((a, b) => b.probability - a.probability);
          setResults(sortedResults.slice(0, 3));
          setIsPhotoCaptured(true);
        } catch (err) {
          console.error('업로드 오류:', err);
          setError('이미지 업로드 중 오류가 발생했습니다.');
        } finally {
          setIsLoading(false);
          setAttemptCount(prevCount => prevCount + 1);
        }
      }
    }
  }, []);

  const handleCaptureClick = () => {
    if (attemptCount < 2) {
      if (imageSrc) {
        setImageSrc(null);
        setResults([]);
        setIsPhotoCaptured(false);
        startWebcam();
      } else {
        captureAndUpload();
      }
    }
  };

  useEffect(() => {
    const firstCompletion = localStorage.getItem('isFirstCompletion');
    setIsFirstCompletion(firstCompletion !== 'false');
  }, []);

  const MovePage = () => {
    if (count === 5 && isFirstCompletion) {
      localStorage.setItem('isFirstCompletion', 'false');
      router.push('/main/completion');
    } else {
      router.push('/main/step1');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-xl mb-2">방금 선택한</p>
        <p className="text-xl mb-2">{getEmoticonForEmotion(emotion)} {emotion}을 찍어 보세요!</p>
        <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden mb-4">
          {isCapturing && !imageSrc ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover transform scale-x-[-1]"
            />
          ) : imageSrc ? (
            <img
              src={imageSrc}
              alt="Captured"
              className="w-full h-full object-cover transform scale-x-[-1]"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              웹캠이 비활성화되었습니다
            </div>
          )}
        </div>
        <div className="flex justify-center">
          <button
            onClick={handleCaptureClick}
            disabled={isLoading || attemptCount >= 2}
            className="bg-blue-500 text-white px-6 py-2 rounded-md disabled:opacity-50"
          >
            {isLoading ? '처리 중...' : imageSrc ? '한 번 더 찍기' : '사진 찍기'}
          </button>
        </div>
      </div>
      
      {error && <p className="text-red-500 text-center my-4">{error}</p>}
      {results.length > 0 && (
        <div className="bg-gray-100 p-4 rounded-lg my-4">
          <h2 className="text-lg font-semibold mb-2">표정 분석 결과 (Top 3):</h2>
          {results.map((result, index) => (
            <div key={index} className="flex justify-between items-center mb-2">
              <p><strong>감정:</strong> {result.label}</p>
              <p><strong>정확도:</strong> {(result.probability * 100).toFixed(2)}%</p>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-4 flex justify-center">
        <button 
          onClick={MovePage}
          disabled={!isPhotoCaptured}
          className="bg-blue-500 text-white px-6 py-2 rounded-md w-1/2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {count === 5 && isFirstCompletion ? '학습 완료' : '다음 감정으로 이동하기'}
        </button>
      </div>

      <div className="text-center text-gray-500 text-sm mt-4">
        {count}/ 5
      </div>
    </div>
  );

  function getEmoticonForEmotion(emotion: Emotion): string {
    switch (emotion) {
      case '행복한, 좋은 표정': return '😄';
      case '짜증난, 싫은 표정': return '😣';
      case '두려운, 무서운 표정': return '😨';
      case '화난, 분노의 표정': return '😠';
      case '슬픈, 우울한 표정': return '😢';
      case '놀란, 놀라는 표정': return '😲';
      case '덤덤한, 무표정': return '😐';
      default: return '❓';
    }
  }
}

