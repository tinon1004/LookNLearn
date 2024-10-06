import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

const LearningStep2Content = dynamic(() => import('./LearningStep2Content'), {
  loading: () => <p>Loading...</p>,
  ssr: false
});

export default function LearningStep2Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LearningStep2Content />
    </Suspense>
  );
}