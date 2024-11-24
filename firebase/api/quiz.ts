import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";
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

  function getKoreaDate(): Date {
    // 현재 UTC 시간을 가져옵니다
    const now = new Date();
    
    // UTC 시간을 한국 시간으로 변환합니다 (UTC+9)
    const utc = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
    const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
    
    // 한국 시간으로 설정된 Date 객체를 반환합니다
    const kr_curr = new Date(utc + KR_TIME_DIFF);
    
    // 날짜만 필요한 경우를 위해 시간을 00:00:00으로 설정합니다
    return new Date(kr_curr.getFullYear(), kr_curr.getMonth(), kr_curr.getDate());
  }

export async function trackQuizAttempt(
  userId: string, 
  isCorrect: boolean
): Promise<void> {
  const dailyLearning = await getDailyLearning(userId);

  if (!dailyLearning.isFirstCompletion || dailyLearning.totalSessions >= 5) {
    return;
  }
  
  const today = getKoreaDate().toISOString().split('T')[0].replace(/-/g, '');
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

export async function getLastSevenDaysQuizData(userId: string): Promise<AccuracyData[]> {
  const result: AccuracyData[] = [];
  
  // 항상 오늘부터 6일 전까지의 데이터를 가져옵니다
  for (let i = 6; i >= 0; i--) {
    const koreaDate = getKoreaDate();
    koreaDate.setDate(koreaDate.getDate() - i);
    const dateString = koreaDate.toISOString().split('T')[0].replace(/-/g, '');
    const formattedDate = `${koreaDate.getMonth() + 1}/${koreaDate.getDate()}`;
    
    const quizRef = doc(db, `quiz/${userId}/daily/${dateString}`);
    const quizDoc = await getDoc(quizRef);
    
    // 데이터가 있으면 실제 값을, 없으면 0을 표시
    if (quizDoc.exists()) {
      const data = quizDoc.data() as QuizAttempt;
      const accuracy = data.totalAttempts > 0 
        ? (data.correctCount / data.totalAttempts) * 100 
        : 0;
      
      result.push({
        date: formattedDate,
        quizAccuracy: Math.round(accuracy * 10) / 10, 
        expressionAccuracy: 0 
      });
    } else {
      result.push({
        date: formattedDate,
        quizAccuracy: 0,
        expressionAccuracy: 0
      });
    }
  }
  
  return result;
}
  
