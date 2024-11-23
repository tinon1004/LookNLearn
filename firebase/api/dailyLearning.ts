import { doc, getDoc, setDoc, updateDoc, increment, collection } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { checkAndUpdateAttendance } from './attendance';

export interface DailyLearning {
  totalSessions: number;
  lastSessionDate: string;
  isFirstCompletion: boolean;
}

function getTodayDate(): string {
  const now = new Date();
  const koreaTime = new Date(now.getTime() + (9 * 60 * 60 * 1000));
  return koreaTime.toISOString().split("T")[0];
}

async function getDailyDocRef(userId: string, date: string) {
  return doc(collection(doc(db, "dailyLearning", userId), "daily"), date);
}

export async function getLastSevenDaysLearning(userId: string): Promise<{ date: string; totalSessions: number }[]> {
  const result = [];
  const now = new Date();
  const koreaTime = new Date(now.getTime() + (9 * 60 * 60 * 1000));

  for(let i = 6; i >= 0; i--) { 
    const date = new Date(koreaTime);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    
    const docRef = await getDailyDocRef(userId, dateStr);
    const docSnap = await getDoc(docRef);
    
    result.push({
      date: dateStr,
      totalSessions: docSnap.exists() ? (docSnap.data() as DailyLearning).totalSessions : 0
    });
  }

  return result;
}

export async function getDailyLearning(userId: string): Promise<DailyLearning> {
  const today = getTodayDate();
  const docRef = await getDailyDocRef(userId, today)
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    const now = new Date();
    const koreaTime = new Date(now.getTime() + (9 * 60 * 60 * 1000));
    const initialLearning: DailyLearning = {
      totalSessions: 0,
      lastSessionDate: koreaTime.toISOString(),
      isFirstCompletion: true
    };
    await setDoc(docRef, initialLearning);
    return initialLearning;
  }
  
  return docSnap.data() as DailyLearning;
}

export async function incrementDailyCount(userId: string): Promise<number> {
  const today = getTodayDate();
  const docRef = await getDailyDocRef(userId, today);
  const now = new Date();
  const koreaTime = new Date(now.getTime() + (9 * 60 * 60 * 1000));

  await updateDoc(docRef, {
    totalSessions: increment(1),
    lastSessionDate: koreaTime.toISOString()
  });
  
  const updatedDoc = await getDoc(docRef);
  const totalSessions = (updatedDoc.data() as DailyLearning).totalSessions;

  await checkAndUpdateAttendance(userId, totalSessions);
  
  return totalSessions;
}

export async function markFirstCompletionDone(userId: string): Promise<void> {
  const today = getTodayDate();
  const docRef = await getDailyDocRef(userId, today);

  await updateDoc(docRef, { isFirstCompletion: false });
}


