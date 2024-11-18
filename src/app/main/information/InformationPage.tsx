'use client';

import React from 'react';
import { Youtube, BookText, ExternalLink } from 'lucide-react';

interface BaseResourceItem {
  title: string;
  link: string;
  icon: React.ReactNode;
  description: string;
}

interface YoutubeItem extends BaseResourceItem {
  isYoutube: true;
}

interface OtherItem extends BaseResourceItem {
  isYoutube?: false;
}

type ResourceItem = YoutubeItem | OtherItem;

interface ResourceSection {
  category: string;
  items: ResourceItem[];
}

const getYoutubeVideoId = (url: string) => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
};

const getYoutubeThumbnail = (url: string): string => {
  const videoId = getYoutubeVideoId(url);
  return videoId 
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : '/api/placeholder/320/180';
};

const InfoPage = () => {
  const resources: ResourceSection[] = [
    {
      category: '추천 영상',
      items: [
        {
          title: '방글방글 얼굴체조 | 핑크퐁 체조 | 핑크퐁! 인기동요',
          link: 'https://www.youtube.com/watch?v=izQXHjVavLo',
          icon: <Youtube color="red" />,
          description: '아이와 함께할 수 있는 얼글 근육 운동',
          isYoutube: true
        },
        {
          title: '뽀로로와 감정 조절 배우기 | 감정 표현하기 | 뽀로로 생활습관',
          link: 'https://www.youtube.com/watch?v=lAA5T56ThGs',
          icon: <Youtube color="red" />,
          description: '뽀로로와 함께 배우는 감정 조절과 표현',
          isYoutube: true
        },
        {
          title: '지금 느끼는 감정은 뭘까? | 감정송',
          link: 'https://www.youtube.com/watch?v=KQW4hoM95v4',
          icon: <Youtube color="red" />,
          description: '즐거운 표정 노래로 감정 표현 배우기',
          isYoutube: true
        }
      ]
    },
    {
      category: '유용한 기사',
      items: [
        {
          title: '자폐증 아동, 안면기억훈련으로 개선 효과 가질 수 있어',
          link: 'https://www.nbntv.kr/news/articleView.html?idxno=64312',
          icon: <BookText color="blue" />,
          description: '반복적 얼굴 인식 훈련과 두뇌훈련으로 자폐 아동의 사회성과 인지 능력 개선 가능',
          isYoutube: false
        },
        {
          title: '자폐스펙트럼 장애 아동, 소셜 로봇 치료 "효과적"',
          link: 'https://www.newsis.com/view/NISX20170704_0000030855',
          icon: <BookText color="blue" />,
          description: '감정을 표현하는 로봇 치료 효과로 증명된 사회성 강화',
          isYoutube: false
        }
      ]
    },
    {
      category: '도움이 되는 사이트',
      items: [
        {
          title: '한국자폐인사랑협회',
          link: 'https://autismkorea.kr',
          icon: <ExternalLink color="green" />,
          description: '자폐 스펙트럼 장애 관련 정보 및 지원 안내',
          isYoutube: false
        },
        {
          title: '발달장애인 지원센터',
          link: 'https://broso.or.kr',
          icon: <ExternalLink color="green" />,
          description: '발달장애인과 가족을 위한 종합 지원',
          isYoutube: false
        }
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-700">정보 자료실</h1>
      
      {resources.map((section, index) => (
        <div key={index} className="mb-12">
          <h2 className="text-xl font-semibold mb-6 text-600 border-b pb-2">
            {section.category}
          </h2>
          <div className="grid gap-6">
            {section.items.map((item, itemIndex) => (
              <a 
                href={item.link} 
                key={itemIndex}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
              >
                {item.isYoutube && (
                  <div className="relative h-48 bg-gray-200">
                    <img
                      src={getYoutubeThumbnail(item.link)}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/api/placeholder/320/180';
                      }}
                    />
                    <div className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-lg">
                      {item.icon}
                    </div>
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    {!item.isYoutube && (
                      <div className="mt-1">{item.icon}</div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium text-lg text-gray-900 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default InfoPage;