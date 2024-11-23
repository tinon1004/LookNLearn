import React, { useEffect, useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer
  } from 'recharts';
import { auth, db } from '@/firebase/firebaseConfig';
import { getDailyLearning, DailyLearning, getLastSevenDaysLearning } from '@/firebase/api/dailyLearning';
import { getLastSevenDaysQuizData } from '@/firebase/api/quiz';
import { getLastSevenDaysAnalysisData } from '@/firebase/api/analysis';
import { collection, getDocs } from "firebase/firestore";

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

interface EmotionAccuracy {
    emotion: string;
    accuracy: number;
    count: number;
  }

const EmotionLearningReport = () => {
  const [accuracyData, setAccuracyData] = useState<AccuracyData[]>([]);
  const [dailyLearningData, setDailyLearningData] = useState<DailyLearning | null>(null);
  const [dailySessionsData, setDailySessionsData] = useState<{ date: string; totalSessions: number }[]>([]);
  
  const [emotionStats, setEmotionStats] = useState<{ 
        bestEmotion: string;
        needsPracticeEmotion: string;
        distribution: EmotionDistribution[];
    }>({ 
        bestEmotion: '', 
        needsPracticeEmotion: '', 
        distribution: [] 
    });
    const [loading, setLoading] = useState(true);

    const getEmotionStats = async (userId: string): Promise<{
        accuracies: EmotionAccuracy[];
        distribution: EmotionDistribution[];
    }> => {
        const emotionAccuracies: { [key: string]: { total: number; count: number } } = {};
        const emotionCounts: { [key: string]: number } = {};
        
        const dates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
        });

        for (const date of dates) {
        const analysisRef = collection(db, "analysis", userId, date);
        const snapshot = await getDocs(analysisRef);

        snapshot.forEach((doc) => {
            const data = doc.data();
            const emotion = data.emotion;

            if (!emotionAccuracies[emotion]) {
            emotionAccuracies[emotion] = { total: 0, count: 0 };
            }
            emotionAccuracies[emotion].total += data.accuracy;
            emotionAccuracies[emotion].count++;
            emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
        });
        }

        const accuracies: EmotionAccuracy[] = Object.entries(emotionAccuracies).map(([emotion, stats]) => ({
        emotion,
        accuracy: Math.round(stats.total / stats.count),
        count: emotionCounts[emotion]
        }));

        const distribution: EmotionDistribution[] = Object.entries(emotionCounts).map(([name, count]) => ({
        name,
        count
        }));

        return { accuracies, distribution };
    };

    useEffect(() => {
        const fetchLearningData = async () => {
        try {
            const userId = auth.currentUser?.uid;
            if (!userId) {
            console.error('No user ID found');
            return;
            }

            const learningData = await getDailyLearning(userId);
            const lastSevenDaysData = await getLastSevenDaysLearning(userId);
            setDailySessionsData(lastSevenDaysData);
            setDailyLearningData(learningData);
            const analysisData = await getLastSevenDaysAnalysisData(userId);
            const quizData = await getLastSevenDaysQuizData(userId);
            const combinedData = quizData.map((quizItem, index) => ({
                ...quizItem,
                expressionAccuracy: analysisData[index].expressionAccuracy
              }));
            
            setAccuracyData(combinedData);

            const { accuracies, distribution } = await getEmotionStats(userId);
            
            const sortedAccuracies = accuracies.sort((a, b) => b.accuracy - a.accuracy);
            const bestEmotion = sortedAccuracies[0]?.emotion || '데이터 없음';
            const needsPracticeEmotion = sortedAccuracies[sortedAccuracies.length - 1]?.emotion || '데이터 없음';
            
            setEmotionStats({
                bestEmotion,
                needsPracticeEmotion,
                distribution
              });

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
    return dailySessionsData.map(data => ({
      day: getDayOfWeek(new Date(data.date)),
      sessions: data.totalSessions
    }));
  };

  const dailyPracticeData = generateDailyPracticeData();
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ea4c89'];

  const calculateStats = (): Stats => {
    const nonZeroAccuracies = accuracyData.filter(day => day.quizAccuracy > 0);
    const nonZeroExpressionAccuracies = accuracyData.filter(day => day.expressionAccuracy > 0);
    const totalWeekSessions = dailySessionsData.reduce((sum, day) => sum + day.totalSessions, 0);

    return {
      totalSessions: totalWeekSessions,
      avgQuizAccuracy: nonZeroAccuracies.length > 0
        ? Math.round(nonZeroAccuracies.reduce((sum, day) => sum + day.quizAccuracy, 0) / nonZeroAccuracies.length)
        : 0,
      avgExpressionAccuracy: nonZeroExpressionAccuracies.length > 0
        ? Math.round(nonZeroExpressionAccuracies.reduce((sum, day) => sum + day.expressionAccuracy, 0) / nonZeroExpressionAccuracies.length)
        : 0
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
                    data={emotionStats.distribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {emotionStats.distribution.map((entry, index) => (
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
                <span className="font-medium">{emotionStats.bestEmotion}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="text-gray-600">더 연습이 필요한 감정</span>
                <span className="font-medium">{emotionStats.needsPracticeEmotion}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmotionLearningReport;