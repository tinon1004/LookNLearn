import React, { useEffect, useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer
  } from 'recharts';
import { auth } from '@/firebase/firebaseConfig';
import { getDailyLearning, DailyLearning } from '@/firebase/api/dailyLearning';
import { getLastSevenDaysQuizData } from '@/firebase/api/quiz';

interface AccuracyData {
  date: string;
  quizAccuracy: number;
  expressionAccuracy: number;
}

interface DailyPractice {
  day: string;
  sessions: number;
}

interface EmotionDistribution {
  name: string;
  count: number;
}

interface Stats {
  totalSessions: number;
  avgQuizAccuracy: number;
  avgExpressionAccuracy: number;
}

const EmotionLearningReport = () => {
  const [accuracyData, setAccuracyData] = useState<AccuracyData[]>([]);
  const [dailyLearningData, setDailyLearningData] = useState<DailyLearning | null>(null);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLearningData = async () => {
        try {
            const userId = auth.currentUser?.uid;
            if (!userId) {
            console.error('No user ID found');
            return;
            }

            const learningData = await getDailyLearning(userId);
            setDailyLearningData(learningData);

            const quizData = await getLastSevenDaysQuizData(userId);
            setAccuracyData(quizData);

            const generateLastSevenDays = (): AccuracyData[] => {
            const dates = [];
            for (let i = 6; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;
                
                dates.push({
                date: formattedDate,
                quizAccuracy: Math.floor(Math.random() * (75 - 45) + 45),
                expressionAccuracy: Math.floor(Math.random() * (70 - 40) + 40)
                });
            }
            return dates;
            };

            setAccuracyData(generateLastSevenDays());
            setLoading(false);
        } catch (error) {
            console.error('Error fetching learning data:', error);
            setLoading(false);
        }
    };

    fetchLearningData();
  }, []);

  const getDayOfWeek = (date: Date): string => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return days[date.getDay()];
  };

  const generateDailyPracticeData = (): DailyPractice[] => {
    const data = [];
    const lastSessionDate = dailyLearningData?.lastSessionDate 
      ? new Date(dailyLearningData.lastSessionDate)
      : null;
    const lastSessionDay = lastSessionDate?.getDay();
  
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const currentDay = date.getDay();
      
      data.push({
        day: getDayOfWeek(date),
        sessions: currentDay === lastSessionDay && dailyLearningData 
          ? dailyLearningData.totalSessions 
          : 0
      });
    }
    return data;
  };

  const emotionDistribution: EmotionDistribution[] = [
    { name: '행복한 표정', count: 15 },
    { name: '슬픈 표정', count: 12 },
    { name: '화난 표정', count: 8 },
    { name: '두려운 표정', count: 7 },
    { name: '놀란 표정', count: 6 },
    { name: '짜증난 표정', count: 5 },
    { name: '무표정', count: 5 },
  ];

  const dailyPracticeData = generateDailyPracticeData();
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ea4c89'];

  const calculateStats = (): Stats => {
    return {
      totalSessions: dailyLearningData?.totalSessions || 0,
      avgQuizAccuracy: Math.round(
        accuracyData.reduce((sum, day) => sum + day.quizAccuracy, 0) / (accuracyData.length || 1)
      ),
      avgExpressionAccuracy: Math.round(
        accuracyData.reduce((sum, day) => sum + day.expressionAccuracy, 0) / (accuracyData.length || 1)
      )
    };
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  };

  const stats = calculateStats();

  const generatePDF = async (): Promise<void> => {
    console.log('Generating PDF report');
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="bg-white rounded-3xl shadow-sm p-8 mt-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-medium">감정 학습 리포트</h2>
          <button 
            onClick={generatePDF}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors"
          >
            <span>PDF 리포트 다운로드</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="text-lg font-medium mb-4">학습 정확도 추이</h3>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={accuracyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip 
                    formatter={(value: number) => [`${value}%`, "정확도"]}
                    labelStyle={{ fontWeight: 'bold' }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="quizAccuracy" 
                    stroke="#4F46E5" 
                    name="퀴즈 정확도"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="expressionAccuracy" 
                    stroke="#10B981" 
                    name="표정 분석 정확도"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="text-lg font-medium mb-4">감정별 학습 분포</h3>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={emotionDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {emotionDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="text-lg font-medium mb-4">일별 학습 횟수</h3>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyPracticeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [`${Math.round(value)}회`, "학습 횟수"]} 
                    contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255)',
                        borderRadius: '8px',
                        padding: '8px'
                    }}
                    labelStyle={{ fontWeight: 'bold' }}
                    />
                  <Bar dataKey="sessions" fill="#4F46E5" name="학습 횟수"  radius={[4, 4, 0, 0]}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="text-lg font-medium mb-4">학습 통계 요약</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="text-gray-600">총 학습 세트 완료</span>
                <span className="font-medium">{stats.totalSessions}회</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="text-gray-600">퀴즈 평균 정확도</span>
                <span className="font-medium">{stats.avgQuizAccuracy}%</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="text-gray-600">표정 분석 평균 정확도</span>
                <span className="font-medium">{stats.avgExpressionAccuracy}%</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="text-gray-600">가장 잘하는 감정</span>
                <span className="font-medium">행복한 표정</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="text-gray-600">더 연습이 필요한 감정</span>
                <span className="font-medium">두려운 표정</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">학습 지속 기간</span>
                <span className="font-medium">7일</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmotionLearningReport;