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
import { Info } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [dailyLearningData, setDailyLearningData] = useState<DailyLearning | null>(null);
  const [dailySessionsData, setDailySessionsData] = useState<{ date: string; totalSessions: number }[]>([]);
  const [showReportHelp, setShowReportHelp] = useState(false);
  const [reportRef, setReportRef] = useState<HTMLDivElement | null>(null);

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
    if (!reportRef) return;

    try {
      const canvas = await html2canvas(reportRef, {
        scale: 2, 
        logging: false,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      const imgWidth = 210; 
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const now = new Date();
      const koreaTime = new Date(now.getTime() + (9 * 60 * 60 * 1000));
      
      const year = koreaTime.getFullYear();
      const month = String(koreaTime.getMonth() + 1).padStart(2, '0');
      const day = String(koreaTime.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      pdf.save(`감정 학습 리포트_${dateStr}.pdf`);

    } catch (error) {
      console.error('PDF 생성 중 오류 발생:', error);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div 
        ref={setReportRef}
        className="bg-white rounded-3xl shadow-sm p-8"
      >
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-medium">감정 학습 리포트</h2>
            <button
              onClick={() => setShowReportHelp(true)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Info size={20} className="text-blue-500" />
            </button>
          </div>
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
                <span className="font-medium">13회</span>
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
        
        {showReportHelp && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">감정 학습 리포트 안내</h3>
                <button 
                  onClick={() => setShowReportHelp(false)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-600 text-sm">
                    이 리포트는 최근 7일 동안의 <br/> 학습 데이터를 기반으로 작성되었습니다.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">리포트 구성</h4>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li>• <span className="font-medium">학습 정확도 추이:</span> 퀴즈와 표정 분석의 일별 정확도를 보여줍니다.</li>
                    <li>• <span className="font-medium">감정별 학습 분포:</span> 학습한 감정들의 비율을 확인할 수 있습니다.</li>
                    <li>• <span className="font-medium">일별 학습 횟수:</span> 날짜별 학습 세션 수를 표시합니다.</li>
                    <li>• <span className="font-medium">학습 통계 요약:</span> 전체 학습 세트 수와 평균 정확도 등을 보여줍니다.</li>
                  </ul>
                </div>

                <p className="text-sm text-gray-500 mt-4">
                  지속적인 학습을 통해 감정 표현 능력을 향상시켜보세요!
                </p>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowReportHelp(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default EmotionLearningReport;