'use client'

import React, { useEffect, useState } from 'react';
import { auth, db } from '@/firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import type { UserProfile } from '@/firebase/api/auth';

const ReportPage = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserProfile(userDoc.data() as UserProfile);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="container mx-auto p-6">Loading...</div>;
  }

  if (!userProfile) {
    return <div className="container mx-auto p-6">Please log in to view your profile.</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="bg-white rounded-3xl shadow-sm p-8">
        <h2 className="text-xl font-medium mb-4">마이페이지</h2>
        
        <div className="flex mb-6">
          {/* Left side - User Info */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">이름</span>
              <span>{userProfile.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">아이디</span>
              <span>{userProfile.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">생년월일</span>
              <span>{userProfile.birthDate}</span>
            </div>
          </div>

          {/* Divider */}
          <div className="mx-6 border-l border-gray-300"></div>

          {/* Right side - IQ & GAS */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">IQ</span>
              <span className="font-medium">{userProfile.scores?.iq || '-'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">GAS</span>
              <span className="font-medium">{userProfile.scores?.gas || '-'}점</span>
            </div>
          </div>
        </div>

        {/* Symptoms */}
        <div className="flex flex-wrap gap-2">
          {userProfile.symptoms?.map((symptom, index) => (
            <span 
              key={index} 
              className="px-4 py-2 text-blue-600 rounded-full text-sm border border-blue-200"
            >
              {symptom}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportPage;