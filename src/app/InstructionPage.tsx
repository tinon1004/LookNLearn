const InstructionPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">서비스 소개</h1>
      <p className="text-lg text-center mb-6">
        이 서비스는 사용자가 쉽게 웹캠을 활용하여 다양한 기능을 경험할 수 있도록 돕습니다.
        <br />
        간단한 단계로 시작하여 유용한 도구를 제공받으세요.
      </p>
      <button
        className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
      >
        다시 시작하기
      </button>
    </div>
  );
};

export default InstructionPage;
