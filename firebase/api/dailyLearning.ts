import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { checkAndUpdateAttendance } from './attendance';

export interface DailyLearning {
  totalSessions: number;
  lastSessionDate: string;
  isFirstCompletion: boolean;
}

export async function getDailyLearning(userId: string): Promise<DailyLearning> {
  const docRef = doc(db, "dailyLearning", userId);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists() || isNewDay(docSnap.data()?.lastSessionDate)) {
    const initialLearning = {
      totalSessions: 0,
      lastSessionDate: new Date().toISOString(),
      isFirstCompletion: true
    };
    await setDoc(docRef, initialLearning);
    return initialLearning;
  }
  
  return docSnap.data() as DailyLearning;
}

export async function incrementDailyCount(userId: string): Promise<number> {
  const docRef = doc(db, "dailyLearning", userId);
  await updateDoc(docRef, {
    totalSessions: increment(1),
    lastSessionDate: new Date().toISOString()
  });
  
  const updatedDoc = await getDoc(docRef);
  const totalSessions = (updatedDoc.data() as DailyLearning).totalSessions;

  await checkAndUpdateAttendance(userId, totalSessions);
  
  return totalSessions;
}

export async function markFirstCompletionDone(userId: string): Promise<void> {
  const docRef = doc(db, "dailyLearning", userId);
  await updateDoc(docRef, {
    isFirstCompletion: false
  });
}

function isNewDay(lastDate: string): boolean {
  if (!lastDate) return true;
  const last = new Date(lastDate).toDateString();
  const now = new Date().toDateString();
  return last !== now;
}

