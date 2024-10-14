'use client';

export type Emotion = 
  | '행복한, 좋은 표정' 
  | '짜증난, 싫은 표정' 
  | '두려운, 무서운 표정' 
  | '화난, 분노의 표정' 
  | '슬픈, 우울한 표정' 
  | '놀란, 놀라는 표정' 
  | '덤덤한, 무표정' 

export interface ImageData {
  src: string;
  correctEmotion: Emotion;
  description: string;
}

export const emotions: Emotion[] = [
  '행복한, 좋은 표정', 
  '짜증난, 싫은 표정', 
  '두려운, 무서운 표정', 
  '화난, 분노의 표정', 
  '슬픈, 우울한 표정', 
  '놀란, 놀라는 표정', 
  '덤덤한, 무표정'
];


export const imageData: ImageData[] = [
  {
    src: '/img/emotion/angry.png',
    correctEmotion: '화난, 분노의 표정',
    description: '친구와 말다툼을 하고 있습니다. 어떤 표정을 짓고 있을까요?'
  },
  {
    src: '/img/emotion/happy1.png',
    correctEmotion: '행복한, 좋은 표정',
    description: '친구의 생일파티에 초대 되었고 친구가 생일 케이크를 불고 있습니다. 어떤 표정을 짓고 있을까요?'
  },
  {
    src: '/img/emotion/sad.png',
    correctEmotion: '슬픈, 우울한 표정',
    description: '좋아하는 장난감이 망가졌습니다. 어떤 표정을 짓고 있을까요?'
  }
];

export function getRandomImage(): ImageData {
  const randomIndex = Math.floor(Math.random() * imageData.length);
  return imageData[randomIndex];
}
