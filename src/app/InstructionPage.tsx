import { useState } from 'react';
import MainPage from './MainPage'; 
import LearningStep2Page from './LearningStep2Page';


function InstructionPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 bg-gray-100">
      <div className="absolute top-4 left-4">
      <button
        onClick={() => onNavigate('main')}
        className="bg-gray-500 text-white font-semibold py-2 px-4 rounded hover:bg-gray-700 transition duration-300"
        >
        ⬅️
       </button>
      </div>
      <h1 className="text-3xl font-bold mb-4">서비스 소개</h1>
      <p className="text-lg text-center mb-6">
        이 서비스는 사용자가 쉽게 웹캠을 활용하여 다양한 기능을 경험할 수 있도록 돕습니다.
        <br />
        간단한 단계로 시작하여 유용한 도구를 제공받으세요.
      </p>
      <button
        onClick={() => onNavigate('LearningStep2')} 
        className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
      >
        학습하기
      </button>
    </div>
  );
}

export default function MovePage() {
    const [currentPage, setCurrentPage] = useState<'instruction' | 'LearningStep2' | 'main'>('instruction');
  
    const handleNavigate = (page: string) => {
      setCurrentPage(page as 'LearningStep2' | 'main'); 
    };
  
    if (currentPage === 'instruction') {
      return <InstructionPage onNavigate={handleNavigate} />;
    } else if (currentPage === 'LearningStep2') {
      return <LearningStep2Page />;
    } else {
      return <MainPage />; 
    }
  }
