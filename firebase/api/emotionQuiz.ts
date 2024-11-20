import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { getDailyLearning } from './dailyLearning';

export interface QuizAttempt {
  correctCount: number;
  totalAttempts: number;
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