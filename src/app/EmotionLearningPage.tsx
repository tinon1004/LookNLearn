import React, { useState } from 'react';
import LearningStep2Page from './LearningStep2Page';
import { 
  Emotion, 
  emotions, 
  getRandomImage, 
  emotionColors 
} from './EmotionData';

function EmotionLearningPage({ onStart }: { onStart: () => void }) {
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [showNextButton, setShowNextButton] = useState(false);
  const currentImage = getRandomImage();

  const handleEmotionSelect = (emotion: Emotion) => {
    const correct = emotion === currentImage.correctEmotion;
    setIsCorrect(correct);
    
    if (!correct) {
      setAttempts(prev => prev + 1);
      if (attempts >= 2) {
        setShowNextButton(true);
      }
    } else {
      setShowNextButton(true);
    }
  };

  const getButtonColor = (emotion: Emotion) => {
    return emotionColors[emotion] || 'bg-gray-400 hover:bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-blue-100 p-6">
     
      <div className="relative max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-8" style={{ minHeight: '550px' }}>
        <div className="absolute top-4 left-4">
          <button
            className="bg-gray-500 text-white font-semibold py-2 px-4 rounded hover:bg-gray-700 transition duration-300"
          >
            ⬅️
          </button>
        </div>
        <h1 className="text-4xl font-bold mb-8 text-center text-black">
          STEP1. 감정 학습하기
        </h1>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img 
                src={currentImage.src} 
                alt="감정 표현" 
                className="w-2/3 h-auto object-cover mx-auto"
              />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="grid grid-cols-2 gap-4">
              {emotions.map((emotion) => (
                <button
                  key={emotion}
                  onClick={() => handleEmotionSelect(emotion)}
                  className={`
                    py-4 px-6 text-lg font-semibold rounded-xl transition-all duration-200
                    text-white shadow-md transform hover:scale-105
                    ${getButtonColor(emotion)}
                  `}
                >
                  {emotion}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-4 text-sm font-medium text-black-600">
          시도 횟수: {attempts}
        </p>

        {isCorrect !== null && (
          <div className={`
            mt-6 p-4 rounded-xl 
            ${isCorrect 
              ? 'bg-green-100 border-2 border-green-300' 
              : 'bg-pink-100 border-2 border-pink-300'}
          `}>
            <p className={`text-lg font-medium ${isCorrect ? 'text-green-600' : 'text-pink-600'}`}>
              {isCorrect ? '정답입니다! 👏' : '틀렸습니다. 다시 시도해보세요! 💪'}
            </p>
          </div>
        )}

       

        {showNextButton && (
          <div className="absolute top-4 right-4">
            <button 
              onClick={onStart}
              className="bg-purple-500 text-white py-3 px-8 
                rounded-xl font-semibold hover:opacity-90 transition-opacity duration-200
                shadow-md transform hover:scale-105"
            >
              다음 단계로 넘어가기 ▶
            </button>
          </div>
        )}

       
      </div>
    </div>
  );
}

export default function MovePage() {
  const [isStarted, setIsStarted] = useState(false);

  if (!isStarted) {
    return <EmotionLearningPage onStart={() => setIsStarted(true)} />;
  }

  return <LearningStep2Page />;
}
