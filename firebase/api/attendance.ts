import { doc, getDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
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

export async function updateAttendance(userId: string, learningCount: number): Promise<AttendanceRecord> {
  const today = new Date();
  const attendance: AttendanceRecord = {
    date: today.toISOString().split('T')[0],
    stickerType: Math.floor(Math.random() * 4) + 1,
    isComplete: learningCount >= 5,
    year: today.getFullYear(),
    month: today.getMonth() + 1
  };

  await setDoc(doc(db, "attendance", `${userId}_${attendance.date}`), attendance);
  return attendance;
}

export async function getAttendance(userId: string): Promise<AttendanceRecord | null> {
  const today = new Date().toISOString().split('T')[0];
  const docRef = doc(db, "attendance", `${userId}_${today}`);
  
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? (docSnap.data() as AttendanceRecord) : null;
}

export async function getMonthlyStats(userId: string, year: number, month: number): Promise<MonthlyStats> {
  const attendanceRef = collection(db, "attendance");
  const q = query(
    attendanceRef,
    where("year", "==", year),
    where("month", "==", month)
  );

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
    if (data.isComplete) stats.totalComplete++;
  });

  return stats;
}

export async function checkAndUpdateAttendance(userId: string, learningCount: number): Promise<AttendanceRecord> {
  const existing = await getAttendance(userId);
  
  if (!existing || existing.isComplete !== (learningCount >= 5)) {
    return await updateAttendance(userId, learningCount);
  }
  
  return existing;
}