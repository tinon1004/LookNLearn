import { useState } from 'react';
import LandingPage from './page';
import EmotionLearningPage from './EmotionLearningPage';
import InstructionPage from './InstructionPage'; 

function MainPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-start h-screen p-4">
      <div className="absolute top-4 left-4">
        <button
          onClick={() => onNavigate('landing')}
          className="bg-gray-500 text-white font-semibold py-2 px-4 rounded hover:bg-gray-700 transition duration-300"
        >
          
        </button>
      </div>
      <div className="flex justify-center mb-4">
        <button
          onClick={() => onNavigate('instruction')} 
          className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
        >
          서비스 소개
        </button>
        <button 
          onClick={() => onNavigate('emotionLearning')} 
          className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition duration-300 ml-4"
        >
          학습하기
        </button>
      </div>
      {/* 추가할 내용 */}
    </div>
  );
}

export default function MovePage() {
  const [currentPage, setCurrentPage] = useState<'main' | 'landing' | 'emotionLearning' | 'instruction'>('main');

  const handleNavigate = (page: string) => {
    setCurrentPage(page as 'landing' | 'emotionLearning' | 'instruction'); 
  };

  if (currentPage === 'main') {
    return <MainPage onNavigate={handleNavigate} />;
  } else if (currentPage === 'landing') {
    return <LandingPage />;
  } else if (currentPage === 'emotionLearning') {
    return <EmotionLearningPage />;
  } else {
    return <InstructionPage />; 
  }
}
