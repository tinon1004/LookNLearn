'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Emotion, 
  emotions, 
  getRandomImage,
  ImageData
} from './EmotionData';


export default function LearningStep1Page() {
  const router = useRouter();
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showNextButton, setShowNextButton] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentImage, setCurrentImage] = useState<ImageData>(getRandomImage());
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [learningCount, setLearningCount] = useState(0);
  
  useEffect(() => {
    resetState();
    const count = localStorage.getItem('learningCount');
    setLearningCount(count ? parseInt(count) : 0);
  }, []);

  const resetState = () => {
    setIsCorrect(null);
    setShowNextButton(false);
    setCurrentImage(getRandomImage());
    setSelectedEmotion(null);
    setWrongAttempts(0);
  };

  const handleEmotionSelect = (emotion: Emotion) => {
    const correct = emotion === currentImage.correctEmotion;
    setIsCorrect(correct);
    setShowNextButton(correct);
    if (correct) {
        setSelectedEmotion(emotion);
        setWrongAttempts(0);
      } else {
        setWrongAttempts(prev => prev + 1);
      }
  };

  const getFeedbackMessage = () => {
    if (isCorrect) return ['정답입니다!'];
    const feedbackMessages = [
      ['다시 한번', '생각해보세요!'],
      ['표정을', '자세히 살펴보세요.'],
      ['괜찮아요,', '천천히 다시 시도해봐요!'],
      ['표정과 상황을', '함께 고려해보세요.'],
      ['감정을 이해하는 건', '쉽지 않아요.', '계속 노력해봐요!']
    ];
    return feedbackMessages[wrongAttempts % feedbackMessages.length];
  };

  const MovePage = () => {
    if (selectedEmotion) {
      const newCount = learningCount + 1;
      localStorage.setItem('learningCount', newCount.toString());
      router.push(`/main/step2?emotion=${encodeURIComponent(selectedEmotion)}&count=${newCount}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 mb-10">
                <img 
                    src={currentImage.src} 
                    alt="감정 표현" 
                    className="w-full h-64 object-cover rounded-lg mb-4"
                />
                <p className="text-center text-gray-700">
                    {currentImage.description}
                </p>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {emotions.map((emotion) => (
            <button
              key={emotion}
              onClick={() => handleEmotionSelect(emotion)}
              className="
                flex flex-col items-center justify-center p-4 rounded-lg 
                bg-white drop-shadow-md 
                hover:drop-shadow-lg transition-shadow
                "
            >
              <span className="text-3xl mb-2">{getEmoticonForEmotion(emotion)}</span>
              <span className="text-sm text-gray-700">{emotion}</span>
            </button>
          ))}
        

            {isCorrect !== null && (
                <div className={`flex flex-col items-center justify-center p-4 rounded-lg ${
                    isCorrect ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                }`}>
                    {isCorrect && <span className="text-3xl mb-2">👏</span>}
                    <div className="text-sm text-center">
                        {getFeedbackMessage().map((line, index) => (
                            <React.Fragment key={index}>
                            {line}
                            {index < getFeedbackMessage().length - 1 && <br />}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            )}
        </div>


      
        <div className="text-center mt-6">
            <button 
              onClick={MovePage}
              disabled={!showNextButton}
              className={`bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold transition-colors ${showNextButton ? 'hover:bg-blue-600' : 'opacity-50 cursor-not-allowed'}`}
            >
              다음으로 이동하기
            </button>
        </div>
        
        <div className="text-center text-gray-500 text-sm mt-4">
          {learningCount + 1}/ 4
        </div>
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