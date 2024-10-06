import React, { useState } from 'react';
import LearningStep2Page from './LearningStep2Page';
import { 
  Emotion, 
  emotions, 
  getRandomImage,
  ImageData
} from './EmotionData';

function LearningStep1Page({ onStart }: { onStart: () => void }) {
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showNextButton, setShowNextButton] = useState(false);
  const [currentImage, setCurrentImage] = useState<ImageData>(getRandomImage());

  const handleEmotionSelect = (emotion: Emotion) => {
    const correct = emotion === currentImage.correctEmotion;
    setIsCorrect(correct);
    setShowNextButton(correct);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <img 
          src={currentImage.src} 
          alt="감정 표현" 
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
        <p className="text-center text-gray-700 mb-6">
            {currentImage.description}
        </p>
        <div className="grid grid-cols-4 gap-4 mb-6">
          {emotions.map((emotion) => (
            <button
              key={emotion}
              onClick={() => handleEmotionSelect(emotion)}
              className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
            >
              <span className="text-3xl mb-2">{getEmoticonForEmotion(emotion)}</span>
              <span className="text-sm text-gray-700">{emotion}</span>
            </button>
          ))}

            {isCorrect !== null && (
                <div className={`flex flex-col items-center justify-center p-4 rounded-lg ${
                    isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                    <span className="text-3xl mb-2">{isCorrect ? '👏' : '💪'}</span>
                    <span className="text-sm">{isCorrect ? '정답입니다!' : '다시 시도해보세요!'}</span>
                </div>
            )}
        </div>
       
      </div>

      
        <div className="text-center mt-6">
            <button 
              onClick={onStart}
              disabled={!showNextButton}
              className={`bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold transition-colors ${showNextButton ? 'hover:bg-blue-600' : 'opacity-50 cursor-not-allowed'}`}
            >
              다음으로 이동하기
            </button>
        </div>
        
        <div className="text-center text-gray-500 text-sm mt-4">
          1 / 4
        </div>
    </div>
  );
}

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

export default function MovePage() {
  const [isStarted, setIsStarted] = useState(false);

  if (!isStarted) {
    return <LearningStep1Page onStart={() => setIsStarted(true)} />;
  }

  return <LearningStep2Page />;
}