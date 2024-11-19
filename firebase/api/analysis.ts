import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { getDailyLearning } from "./dailyLearning";

export interface EmotionAnalysis {
  emotion: string;
  accuracy: number;
  timestamp: string;
}

export async function saveEmotionAnalysis(
  userId: string,
  emotion: string,
  accuracy: number
): Promise<void> {
  const dailyLearning = await getDailyLearning(userId);
  
  if (dailyLearning.isFirstCompletion) {
    const date = new Date().toISOString().split('T')[0];
    const docRef = doc(db, "analysis", userId, date, emotion);
    
    const adjustedAccuracy = Math.min(accuracy * 2, 100);
    
    const analysisData: EmotionAnalysis = {
      emotion,
      accuracy: adjustedAccuracy,
      timestamp: new Date().toISOString(),
    };
    
    await setDoc(docRef, analysisData);
  }
}