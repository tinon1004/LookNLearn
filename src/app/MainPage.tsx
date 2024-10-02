import { useState } from 'react';
import WebcamPage from './WebcamPage';
import InstructionPage from './InstructionPage'; 

function MainPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-start h-screen p-4">
      <div className="flex justify-center mb-4">
        <button
          onClick={() => onNavigate('instruction')} 
          className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
        >
          서비스 소개
        </button>
        <button 
          onClick={() => onNavigate('webcam')} 
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
  const [currentPage, setCurrentPage] = useState<'main' | 'webcam' | 'instruction'>('main');

  const handleNavigate = (page: string) => {
    setCurrentPage(page as 'webcam' | 'instruction'); 
  };

  if (currentPage === 'main') {
    return <MainPage onNavigate={handleNavigate} />;
  } else if (currentPage === 'webcam') {
    return <WebcamPage />;
  } else {
    return <InstructionPage />; 
  }
}
