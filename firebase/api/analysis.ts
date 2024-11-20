import { doc, setDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { getDailyLearning } from "./dailyLearning";

export interface EmotionAnalysis {
  emotion: string;
  accuracy: number;
  timestamp: string;
}

export interface DailyAnalysis {
  date: string;
  expressionAccuracy: number;
}

function getKoreaDate(): Date {
  const now = new Date();
  return new Date(now.getTime() + (9 * 60 * 60 * 1000));
}

export async function saveEmotionAnalysis(
  userId: string,
  emotion: string,
  accuracy: number
): Promise<void> {
  const dailyLearning = await getDailyLearning(userId);
  
  if (dailyLearning.isFirstCompletion) {
    const koreaTime = getKoreaDate();
    const date = koreaTime.toISOString().split('T')[0];
    const docRef = doc(db, "analysis", userId, date, emotion);
    
    const adjustedAccuracy = Math.min(accuracy, 100);
    
    const analysisData: EmotionAnalysis = {
      emotion,
      accuracy: adjustedAccuracy,
      timestamp: koreaTime.toISOString(),
    };
    
    await setDoc(docRef, analysisData);
  }
}

export async function getLastSevenDaysAnalysisData(userId: string): Promise<DailyAnalysis[]> {
    const result: DailyAnalysis[] = [];
    
    for (let i = 6; i >= 0; i--) {
      const koreaDate = getKoreaDate();
      koreaDate.setDate(koreaDate.getDate() - i);
      const dateString = koreaDate.toISOString().split('T')[0];
      const formattedDate = `${koreaDate.getMonth() + 1}/${koreaDate.getDate()}`;
      
      const analysisRef = collection(db, "analysis", userId, dateString);
      const analysisSnapshot = await getDocs(analysisRef);
  
      if (!analysisSnapshot.empty) {
        let totalAccuracy = 0;
        analysisSnapshot.forEach((doc) => {
          const data = doc.data() as EmotionAnalysis;
          totalAccuracy += data.accuracy;
        });
  
        result.push({
          date: formattedDate,
          expressionAccuracy: Math.round(totalAccuracy / analysisSnapshot.size)
        });
      } else {
        result.push({
          date: formattedDate,
          expressionAccuracy: 0
        });
      }
    }
    
    return result;
  }