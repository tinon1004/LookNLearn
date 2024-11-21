import { doc, getDoc, setDoc, collection, query, where, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export interface AttendanceRecord {
  date: string;
  stickerType: number;
  isComplete: boolean;
  year: number;
  month: number;
}

export interface MonthlyStats {
  sticker1: number;
  sticker2: number;
  sticker3: number;
  sticker4: number;
  totalComplete: number;
}

function getKoreanDate(): Date {
  const now = new Date();
  return new Date(now.getTime() + (9 * 60 * 60 * 1000)); 
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export async function updateAttendance(userId: string, learningCount: number): Promise<AttendanceRecord> {
  const today = getKoreanDate();
  const todayDate = formatDate(today);
  const isComplete = learningCount >= 5;
  
  const attendance: AttendanceRecord = {
    date: todayDate,
    stickerType: isComplete ? Math.floor(Math.random() * 4) + 1 : 0,
    isComplete: isComplete,
    year: today.getFullYear(),
    month: today.getMonth() + 1,
  };

  if (!isComplete) {
    return attendance;
  }

  const dailyRef = doc(db, `attendance/${userId}/daily`, todayDate);
  await setDoc(dailyRef, attendance);
  return attendance;
}

export async function getAttendance(userId: string): Promise<AttendanceRecord | null> {
  const todayDate = formatDate(getKoreanDate());
  const dailyRef = doc(db, `attendance/${userId}/daily`, todayDate);
  
  const docSnap = await getDoc(dailyRef);
  return docSnap.exists() ? (docSnap.data() as AttendanceRecord) : null;
}

export async function getMonthlyStats(userId: string, year: number, month: number): Promise<MonthlyStats> {
  const dailyRef = collection(db, `attendance/${userId}/daily`);
  let q;
  
  if (month === 0) {
    q = query(dailyRef, where("year", "==", year), where("isComplete", "==", true));
  } else {
    q = query(
      dailyRef,
      where("year", "==", year),
      where("month", "==", month),
      where("isComplete", "==", true)
    );
  }

  const querySnapshot = await getDocs(q);
  const stats: MonthlyStats = {
    sticker1: 0,
    sticker2: 0,
    sticker3: 0,
    sticker4: 0,
    totalComplete: 0
  };

  querySnapshot.forEach((doc) => {
    const data = doc.data() as AttendanceRecord;
    if (data.stickerType > 0) {
        switch (data.stickerType) {
          case 1:
            stats.sticker1++;
            break;
          case 2:
            stats.sticker2++;
            break;
          case 3:
            stats.sticker3++;
            break;
          case 4:
            stats.sticker4++;
            break;
        }
        stats.totalComplete++;
    }
  });

  return stats;
}

export async function checkAndUpdateAttendance(userId: string, learningCount: number): Promise<AttendanceRecord> {
  const existing = await getAttendance(userId);
  const isComplete = learningCount >= 5;
  
  if (!existing && isComplete) {
    return await updateAttendance(userId, learningCount);
  }
  
  if (existing && existing.isComplete !== isComplete) {
    const dailyRef = doc(db, `attendance/${userId}/daily`, existing.date);
    if (isComplete) {
      return await updateAttendance(userId, learningCount);
    } else {
      await deleteDoc(dailyRef);
      return {
        ...existing,
        isComplete: false,
        stickerType: 0
      };
    }
  }
  
  return (
    existing || {
    date: formatDate(getKoreanDate()),
    stickerType: 0,
    isComplete: false,
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    }
  );
}