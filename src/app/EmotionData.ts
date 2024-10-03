export type Emotion = '분노' | '경멸' | '역겨움' | '두려움' | '행복' | '중립' | '슬픔' | '놀람';

export interface ImageData {
  src: string;
  correctEmotion: Emotion;
}

export const emotions: Emotion[] = ['분노', '경멸', '역겨움', '두려움', '행복', '중립', '슬픔', '놀람'];

export const imageData: ImageData[] = [
  {
    src: '/img/emotion/angry.png',
    correctEmotion: '분노'
  },
  {
    src: '/img/emotion/happy.png',
    correctEmotion: '행복'
  },
  {
    src: '/img/emotion/sad.png',
    correctEmotion: '슬픔'
  }
];

export function getRandomImage(): ImageData {
  const randomIndex = Math.floor(Math.random() * imageData.length);
  return imageData[randomIndex];
}

export const emotionColors = {
  '분노': 'bg-red-400 hover:bg-red-500',
  '경멸': 'bg-purple-400 hover:bg-purple-500',
  '역겨움': 'bg-green-400 hover:bg-green-500',
  '두려움': 'bg-blue-400 hover:bg-blue-500',
  '행복': 'bg-yellow-400 hover:bg-yellow-500',
  '중립': 'bg-gray-400 hover:bg-gray-500',
  '슬픔': 'bg-indigo-400 hover:bg-indigo-500',
  '놀람': 'bg-pink-400 hover:bg-pink-500'
} as const;