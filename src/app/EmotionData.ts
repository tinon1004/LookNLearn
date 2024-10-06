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
    correctEmotion: '화난, 분노의 표정'
  },
  {
    src: '/img/emotion/happy.png',
    correctEmotion: '행복한, 좋은 표정'
  },
  {
    src: '/img/emotion/sad.png',
    correctEmotion: '슬픈, 우울한 표정'
  }
];

export function getRandomImage(): ImageData {
  const randomIndex = Math.floor(Math.random() * imageData.length);
  return imageData[randomIndex];
}
