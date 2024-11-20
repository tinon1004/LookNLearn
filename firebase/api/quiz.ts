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
  const now = new Date();
  return new Date(now.getTime() + (9 * 60 * 60 * 1000));
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
    
    for (let i = 6; i >= 0; i--) {
      const koreaDate = getKoreaDate();
      koreaDate.setDate(koreaDate.getDate() - i);
      const dateString = koreaDate.toISOString().split('T')[0].replace(/-/g, '');
      const formattedDate = `${koreaDate.getMonth() + 1}/${koreaDate.getDate()}`;
      
      const quizRef = doc(db, `quiz/${userId}/daily/${dateString}`);
      const quizDoc = await getDoc(quizRef);
      
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
  
