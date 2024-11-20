import { doc, getDoc, setDoc, updateDoc, increment, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { getDailyLearning } from './dailyLearning';

export interface QuizAttempt {
  correctCount: number;
  totalAttempts: number;
}

export interface AccuracyData {
    date: string;
    quizAccuracy: number;
    expressionAccuracy: number;
  }

export async function trackQuizAttempt(
  userId: string, 
  isCorrect: boolean
): Promise<void> {
  const dailyLearning = await getDailyLearning(userId);

  if (!dailyLearning.isFirstCompletion || dailyLearning.totalSessions >= 5) {
    return;
  }
  
  const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const quizRef = doc(db, `quiz/${userId}/daily/${today}`);
  
  try {
    const quizDoc = await getDoc(quizRef);
    
    if (!quizDoc.exists()) {
      await setDoc(quizRef, {
        correctCount: isCorrect ? 1 : 0,
        totalAttempts: 1
      });
    } else {
      await updateDoc(quizRef, {
        correctCount: isCorrect ? increment(1) : increment(0),
        totalAttempts: increment(1)
      });
    }
  } catch (error) {
    console.error("퀴즈 시도 기록 중 오류 발생:", error);
    throw error;
  }
}

// 최근 7일간의 퀴즈 데이터를 가져오는 함수
export async function getLastSevenDaysQuizData(userId: string): Promise<AccuracyData[]> {
    const result: AccuracyData[] = [];
    
    // 최근 7일 날짜 생성
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0].replace(/-/g, '');
      const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;
      
      // 해당 날짜의 퀴즈 데이터 가져오기
      const quizRef = doc(db, `quiz/${userId}/daily/${dateString}`);
      const quizDoc = await getDoc(quizRef);
      
      if (quizDoc.exists()) {
        const data = quizDoc.data() as QuizAttempt;
        const accuracy = data.totalAttempts > 0 
          ? (data.correctCount / data.totalAttempts) * 100 
          : 0;
        
        result.push({
          date: formattedDate,
          quizAccuracy: Math.round(accuracy * 10) / 10, // 소수점 첫째자리까지
          expressionAccuracy: 0 // 표정 분석 데이터는 별도로 처리 필요
        });
      } else {
        // 데이터가 없는 날은 0으로 처리
        result.push({
          date: formattedDate,
          quizAccuracy: 0,
          expressionAccuracy: 0
        });
      }
    }
    
    return result;
  }
  
