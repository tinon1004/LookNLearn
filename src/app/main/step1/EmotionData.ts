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

  // 화난, 분노의 표정
  {
    src: '/img/emotion/angry1.png',
    correctEmotion: '화난, 분노의 표정',
    description: '친구와 말다툼을 하고 있습니다. 어떤 표정을 짓고 있을까요?'
  },
  {
    src: '/img/emotion/angry2.png',
    correctEmotion: '화난, 분노의 표정',
    description: '게임을 하다가 실수로 졌습니다. 어떤 표정을 짓고 있을까요?'
  },

  // 행복한, 좋은 표정
  {
    src: '/img/emotion/happy1.png',
    correctEmotion: '행복한, 좋은 표정',
    description: '친구의 생일파티에 초대 되었고 친구가 생일 케이크를 불고 있습니다. 어떤 표정을 짓고 있을까요?'
  },
  {
    src: '/img/emotion/happy2.png',
    correctEmotion: '행복한, 좋은 표정',
    description: '엄마가 맛있는 음식을 준비해주셨습니다. 어떤 표정을 짓고 있을까요?'
  },

    // 슬픈, 우울한 표정
  {
    src: '/img/emotion/sad1.png',
    correctEmotion: '슬픈, 우울한 표정',
    description: '좋아하는 장난감이 망가졌습니다. 어떤 표정을 짓고 있을까요?'
  },
  {
    src: '/img/emotion/sad2.png',
    correctEmotion: '슬픈, 우울한 표정',
    description: '반려동물이 아프다는 소식을 들었습니다. 어떤 표정을 짓고 있을까요?'
  },
  
  // 짜증난, 싫은 표정
  {
    src: '/img/emotion/angry.png',
    correctEmotion: '짜증난, 싫은 표정',
    description: '동생이 계속 장난을 치고 있습니다. 어떤 표정을 짓고 있을까요?'
  },
  {
    src: '/img/emotion/angry.png',
    correctEmotion: '짜증난, 싫은 표정',
    description: '길이 너무 막혀서 약속 시간에 늦을 것 같습니다. 어떤 표정을 짓고 있을까요?'
  },

  // 두려운, 무서운 표정
  {
    src: '/img/emotion/scared1.png',
    correctEmotion: '두려운, 무서운 표정',
    description: '깜깜한 방 안에서 이상한 소리가 들렸습니다. 어떤 표정을 짓고 있을까요?'
  },
  {
    src: '/img/emotion/angry.png',
    correctEmotion: '두려운, 무서운 표정',
    description: '높은 곳에서 밑을 내려다보고 있습니다. 어떤 표정을 짓고 있을까요?'
  },

  // 놀란, 놀라는 표정
  {
    src: '/img/emotion/angry.png',
    correctEmotion: '놀란, 놀라는 표정',
    description: '생일 선물로 원하던 장난감을 받았습니다. 어떤 표정을 짓고 있을까요?'
  },
  {
    src: '/img/emotion/angry.png',
    correctEmotion: '놀란, 놀라는 표정',
    description: '갑자기 큰 천둥 번개 소리가 났습니다. 어떤 표정을 짓고 있을까요?'
  },

  // 덤덤한, 무표정
  {
    src: '/img/emotion/angry.png',
    correctEmotion: '덤덤한, 무표정',
    description: '덤덤한 표정1. 어떤 표정을 짓고 있을까요?'
  },
  {
    src: '/img/emotion/angry.png',
    correctEmotion: '덤덤한, 무표정',
    description: '덤덤한 표정2. 어떤 표정을 짓고 있을까요?'
  }
];

export function getRandomImage(): ImageData {
  const randomIndex = Math.floor(Math.random() * imageData.length);
  return imageData[randomIndex];
}
