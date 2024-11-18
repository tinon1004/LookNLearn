'use client';

import React, { useState, useEffect  } from 'react';
import { useRouter } from 'next/navigation';
import Calendar from './Calendar';
import StickerStatus from './StickerStatus';
import BadgeStatus from './BadgeStatus';
import Image from 'next/image';
import { UserProfile } from '@/firebase/api/auth';
import { auth, db } from '@/firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const MainPage: React.FC = () => {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data() as UserProfile);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleNavigation = (path: string): void => {
    router.push(path);
  };

  const handleDayClick = (day: number, year: number, month: number): void => {
    const today = new Date();
    if (year === today.getFullYear() && month === today.getMonth() + 1 && day === today.getDate()) {
      handleNavigation('/main/step1');
    } 
  };

  return (
    <div className="flex flex-col min-h-screen items-center">
      <header className="w-full px-4 py-2">
        <div className="w-[640px] mx-auto flex justify-between items-center mt-3">
          <div className="h-10 w-20 relative">
            <Image
              src="/img/Left_Logo.png"
              alt="Logo"
              fill
              className="object-contain"
            />
          </div>
         
          <div className="relative flex items-center space-x-2">
            <span className="mr-2 text-gray-800">
                {userData?.name ? `${userData.name} 님` : '게스트님'}
            </span>
            <div className="relative">
              <div 
                className="w-8 h-8 relative flex-shrink-0 cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <Image
                  src="/icons/list.png"
                  alt="list"
                  fill
                  className="object-contain"
                />
              </div>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10">
                  <button
                    onClick={() => {
                      handleNavigation('/main/report');
                      setIsDropdownOpen(false);
                    }}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    보고서 보기
                  </button>
                  <button
                    onClick={() => {
                      handleNavigation('/main/signout');
                      setIsDropdownOpen(false);
                    }}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    로그아웃 하기
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
     
        <div className="max-w-5xl mx-auto mt-3">
        <Calendar onDayClick={handleDayClick} />
        <div className="flex gap-4 w-full max-w-5xl mt-4">
          <StickerStatus />
          <BadgeStatus />
        </div>
        <div className="flex justify-center mt-8 mb-4">
          <button
            onClick={() => router.push('/main/introduction')} 
            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
          >
            서비스 소개
          </button>
          <button 
            onClick={() => router.push('/main/information')} 
            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition duration-300 ml-4"
          >
            정보 자료실
          </button>
        </div>
        </div>
    </div>
  );
}

export default MainPage;