'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Emotion, 
  emotions, 
  getRandomImage,
  ImageData
} from './EmotionData';
import EmotionPopup from './EmotionPopup';
import { useAuth } from '@/src/app/context/AuthProvider';
import { getDailyLearning, incrementDailyCount } from '@/firebase/api/dailyLearning';
import StopLearningPopup from '../StopLearningPopup';
import { trackQuizAttempt } from '@/firebase/api/EmotionQuiz'; 

export default function LearningStep1Page() {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);
  const [showStopPopup, setShowStopPopup] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showNextButton, setShowNextButton] = useState(false);
  const [currentImage, setCurrentImage] = useState<ImageData>(getRandomImage());
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [learningCount, setLearningCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (!currentImage) {
      setCurrentImage(getRandomImage());
    }
    initializeLearningCount();
    checkPopupDisplay();
  }, [currentImage]);

  const checkPopupDisplay = () => {
    const today = new Date().toDateString();
    const lastPopupDate = localStorage.getItem('lastPopupDate');

    if (lastPopupDate !== today) {
      setShowPopup(true);
      localStorage.setItem('lastPopupDate', today);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };
  
  const handleEmotionSelect = async (emotion: Emotion) => {
    const correct = emotion === currentImage.correctEmotion;
    setIsCorrect(correct);
    setShowNextButton(correct);

    if (user) {
      if (wrongAttempts === 0) {
        try {
          await trackQuizAttempt(user.uid, correct);
        } catch (error) {
          console.error("퀴즈 시도 기록 중 오류:", error);
        }
      }
    }

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
  
  useEffect(() => {
    if (!currentImage) {
      setCurrentImage(getRandomImage());
    }
    if (user) {
      initializeLearningCount();
    }
    checkPopupDisplay();
  }, [currentImage, user]);

  const initializeLearningCount = async () => {
    if (!user) return;
    const learning = await getDailyLearning(user.uid);
    setLearningCount(learning.totalSessions);
  };

  const MovePage = async () => {
    if (!user || !selectedEmotion) return;
    
    const newCount = await incrementDailyCount(user.uid);
    router.push(`/main/step2?emotion=${encodeURIComponent(selectedEmotion)}&count=${newCount}`);
  };

  return (
    <>
      {showPopup && <EmotionPopup onClose={handleClosePopup} />}
      <StopLearningPopup 
        isOpen={showStopPopup}
        onClose={() => setShowStopPopup(false)}
        onConfirm={() => {
          setShowStopPopup(false);
          router.push('/main');
        }}
      />

      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 mb-10">
            <img 
              src={currentImage.src} 
              alt="감정 표현" 
              className="w-full h-full object-cover rounded-lg mb-4"
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


        
          <div className="text-center mt-6 flex justify-center gap-4">
              <button
                onClick={() => setShowStopPopup(true)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded-lg transition duration-300"
              >
                학습 그만두기
              </button>
              <button 
                onClick={MovePage}
                disabled={!showNextButton}
                className={`bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold transition-colors ${showNextButton ? 'hover:bg-blue-600' : 'opacity-50 cursor-not-allowed'}`}
              >
                다음으로 이동하기
              </button>
          </div>
          
          <div className="text-center text-gray-500 text-sm mt-4">
            {learningCount + 1}/ 5
          </div>
          </div>
      </div>
    </>
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