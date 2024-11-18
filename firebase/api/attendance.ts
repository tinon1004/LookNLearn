import { doc, getDoc, setDoc, collection, query, where, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export interface AttendanceRecord {
  date: string;
  stickerType: number;
  isComplete: boolean;
  year: number;
  month: number;
  userId: string; 
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
  const isComplete = learningCount >= 5;
  
  const attendance: AttendanceRecord = {
    date: today.toISOString().split('T')[0],
    stickerType: isComplete ? Math.floor(Math.random() * 4) + 1 : 0,
    isComplete: isComplete,
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    userId: userId
  };

  if (!isComplete) {
    return attendance;
  }

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
  let q;
  
  if (month === 0) {
    q = query(
        attendanceRef, 
        where("year", "==", year),
        where("userId", "==", userId),
        where("isComplete", "==", true)
      );
  } else {
    q = query(
      attendanceRef,
      where("year", "==", year),
      where("month", "==", month),
      where("userId", "==", userId),
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
    if (data.userId === userId && data.stickerType > 0) { 
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
    if (isComplete) {
      return await updateAttendance(userId, learningCount);
    } else {
      await deleteDoc(doc(db, "attendance", `${userId}_${existing.date}`));
      return {
        ...existing,
        isComplete: false,
        stickerType: 0
      };
    }
  }
  
  return existing || {
    date: new Date().toISOString().split('T')[0],
    stickerType: 0,
    isComplete: false,
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    userId: userId
  };
}