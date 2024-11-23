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
  {
    src: '/img/emotion/angry3.png',
    correctEmotion: '화난, 분노의 표정',
    description: '친구가 내가 열심히 그린 그림 위에 실수로 낙서를 했어요. 어떤 감정이 들까요?'
  },
  {
    src: '/img/emotion/angry4.png',
    correctEmotion: '화난, 분노의 표정',
    description: '레고 블록을 열심히 쌓아올리던 중 갑자기 탑이 무너져버렸어요. 어떤 감정이 들까요?'
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
  {
    src: '/img/emotion/happy3.png',
    correctEmotion: '행복한, 좋은 표정',
    description: '퍼즐을 다 맞춘 후 부모님이 칭찬을 해주셨어요. 어떤 표정을 짓고 있을까요?'
  },
  {
    src: '/img/emotion/happy4.png',
    correctEmotion: '행복한, 좋은 표정',
    description: '가족과 함께 소풍을 갔어요. 어떤 표정을 짓고 있을까요?'
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
  {
    src: '/img/emotion/sad3.png',
    correctEmotion: '슬픈, 우울한 표정',
    description: '만화의 슬픈 장면을 보았어요. 어떤 표정을 짓고 있을까요?'
  },
  {
    src: '/img/emotion/sad4.png',
    correctEmotion: '슬픈, 우울한 표정',
    description: '다리를 다쳐서 친구들과 놀이터에서 놀지 못해요. 어떤 표정을 짓고 있을까요?'
  },
  
  // 짜증난, 싫은 표정
  {
    src: '/img/emotion/annoyed1.png',
    correctEmotion: '짜증난, 싫은 표정',
    description: '동생이 계속 장난을 치고 있습니다. 어떤 표정을 짓고 있을까요?'
  },
  {
    src: '/img/emotion/annoyed2.png',
    correctEmotion: '짜증난, 싫은 표정',
    description: '길을 가다가 강아지 배설물을 보았어요. 기분이 어떨까요?'
  },
  {
    src: '/img/emotion/annoyed3.png',
    correctEmotion: '짜증난, 싫은 표정',
    description: '물이 더러운 웅덩이에 빠졌어요. 기분이 어떨까요?'
  },

  // 두려운, 무서운 표정
  {
    src: '/img/emotion/scared1.png',
    correctEmotion: '두려운, 무서운 표정',
    description: '높은 곳에서 밑을 내려다보고 있습니다. 어떤 표정을 짓고 있을까요?'
  },
  {
    src: '/img/emotion/scared2.png',
    correctEmotion: '두려운, 무서운 표정',
    description: '병원에서 주사를 맞아야 해요. 어떤 표정을 짓고 있을까요?'
  },
  {
    src: '/img/emotion/scared3.png',
    correctEmotion: '두려운, 무서운 표정',
    description: '잠을 자다가 악몽을 꾸었어요. 어떤 표정을 짓고 있을까요?'
  },

  // 놀란, 놀라는 표정
  {
    src: '/img/emotion/surprised2.png',
    correctEmotion: '놀란, 놀라는 표정',
    description: '생일 선물로 원하던 장난감을 받았습니다. 어떤 표정을 짓고 있을까요?'
  },
  {
    src: '/img/emotion/surprised3.png',
    correctEmotion: '놀란, 놀라는 표정',
    description: '아침에 일어나 보니 크리스마스 선물이 놓여있어요. 어떤 표정을 짓고 있을까요?'
  },
  {
    src: '/img/emotion/surprised4.png',
    correctEmotion: '놀란, 놀라는 표정',
    description: '잡고 있던 풍선을 놓쳤어요. 어떤 표정을 짓고 있을까요?'
  },

  // 덤덤한, 무표정
  {
    src: '/img/emotion/neutral1.png',
    correctEmotion: '덤덤한, 무표정',
    description: '엄마와 함께 산책을 해요. 어떤 표정을 짓고 있을까요?'
  },
  {
    src: '/img/emotion/neutral2.png',
    correctEmotion: '덤덤한, 무표정',
    description: '책상에 앉아서 숙제를 해요. 어떤 표정을 짓고 있을까요?'
  }
];

export function getRandomImage(): ImageData {
  const randomIndex = Math.floor(Math.random() * imageData.length);
  return imageData[randomIndex];
}
