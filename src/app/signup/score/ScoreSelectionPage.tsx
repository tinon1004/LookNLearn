'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type ScoreStatus = 'slider' | 'unknown';

interface ScorData {
  iq: number | null;
  iqStatus: ScoreStatus;
  gas: number | null;
  gasStatus: ScoreStatus;
}

export default function ScoreSelectionPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ScorData>({
    iq: 71,
    iqStatus: 'slider',
    gas: 20,
    gasStatus: 'slider'
  });

  const handleIQStatusChange = (status: ScoreStatus) => {
    setFormData(prev => ({
      ...prev,
      iqStatus: status,
      iq: status === 'slider' ? prev.iq : null
    }));
  };

  const handleGASStatusChange = (status: ScoreStatus) => {
    setFormData(prev => ({
      ...prev,
      gasStatus: status,
      gas: status === 'slider' ? prev.gas : null
    }));
  };

  const handleSubmit = () => {
    console.log('IQ 데이터:', formData);
    router.push('/signup/symptoms');
  };

  const calculateIQProgress = (value: number) => {
    return ((value - 50) / (150 - 50)) * 100;
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">점수 입력</h1>
          <p className="mt-2 text-gray-600">IQ와 GAS 점수를 입력하거나 해당하는 옵션을 선택해주세요</p>
        </div>

        <div className="w-full space-y-6 bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">IQ 점수</h2>    
            <div className="space-y-4">
                <div className="flex items-center space-x-4">
                <input
                    type="radio"
                    id="useSlider"
                    checked={formData.iqStatus === 'slider'}
                    onChange={() => handleIQStatusChange('slider')}
                    className="w-4 h-4 text-[#9EBCDF] focus:ring-[#9EBCDF]"
                />
                <label htmlFor="useSlider" className="text-sm">
                    점수 입력
                </label>
                
                <input
                    type="radio"
                    id="unknown"
                    checked={formData.iqStatus === 'unknown'}
                    onChange={() => handleIQStatusChange('unknown')}
                    className="w-4 h-4 text-[#9EBCDF] focus:ring-[#9EBCDF]"
                />
                <label htmlFor="unknown" className="text-sm">
                    잘 알지 못함
                </label>
                </div>
            </div>

            {formData.iqStatus === 'slider' && (
                <div className="space-y-4">
                <div className="flex justify-between text-sm text-gray-600">
                    <span>50</span>
                    <span>71</span>
                    <span>150</span>
                </div>
                
                <input
                    type="range"
                    min="50"
                    max="150"
                    step="1"
                    value={formData.iq || 71}
                    onChange={(e) => setFormData(prev => ({
                    ...prev,
                    iq: Number(e.target.value)
                    }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    style={{
                        background: `linear-gradient(to right, #9EBCDF 0%, #9EBCDF ${calculateIQProgress(formData.iq || 71)}%, #E5E7EB ${calculateIQProgress(formData.iq || 71)}%, #E5E7EB 100%)`
                    }}
                />
                
                <div className="text-center">
                    <p className={`text-lg font-semibold ${
                    (formData.iq || 0) < 71 ? 'text-red-500' : 'text-gray-700'
                    }`}>
                    {formData.iq} 점
                    </p>
                </div>
                </div>
            )}

            {formData.iqStatus === 'unknown' && (
                <p className="text-center text-gray-600">
                정확한 IQ 점수를 모르는 것으로 기록됩니다.
                </p>
            )}

        </div>


        <div className="w-full space-y-6 bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">GAS 점수</h2>    
            <div className="space-y-4">
                <div className="flex items-center space-x-4">
                <input
                    type="radio"
                    id="gasSlider"
                    checked={formData.gasStatus === 'slider'}
                    onChange={() => handleGASStatusChange('slider')}
                    className="w-4 h-4 text-[#9EBCDF] focus:ring-[#9EBCDF]"
                />
                <label htmlFor="gasSlider" className="text-sm">
                    점수 입력
                </label>
                
                <input
                    type="radio"
                    id="gasUnknown"
                    checked={formData.gasStatus === 'unknown'}
                    onChange={() => handleGASStatusChange('unknown')}
                    className="w-4 h-4 text-[#9EBCDF] focus:ring-[#9EBCDF]"
                />
                <label htmlFor="gasUnknown" className="text-sm">
                    잘 알지 못함
                </label>
                </div>
            </div>

            {formData.gasStatus === 'slider' && (
                <div className="space-y-4">
                <div className="flex justify-between text-sm text-gray-600">
                    <span>0</span>
                    <span>20</span>
                    <span>40</span>
                    <span>50</span>
                </div>
                
                <input
                    type="range"
                    min="0"
                    max="50"
                    step="1"
                    value={formData.gas ?? 20}
                    onChange={(e) => {
                        const value = Number(e.target.value);
                        setFormData(prev => ({
                          ...prev,
                          gas: value
                        }));
                      }}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    style={{
                        background: `linear-gradient(to right, #9EBCDF 0%, #9EBCDF ${(formData.gas || 0) * 2}%, #E5E7EB ${(formData.gas || 0) * 2}%, #E5E7EB 100%)`
                      }}
                />
                
                <div className="text-center">
                    <p className="text-lg font-semibold text-gray-700">
                      {formData.gas} 점
                    </p>
                </div>
                </div>
            )}

            {formData.gasStatus === 'unknown' && (
                <p className="text-center text-gray-600">
                정확한 GAS 점수를 모르는 것으로 기록됩니다.
                </p>
            )}

        </div>

        <button
          onClick={handleSubmit}
          className="w-full px-4 py-3 bg-[#9EBCDF] hover:bg-[#8BAACE] text-white font-medium rounded-md transition duration-300"
        >
          다음으로 이동하기
        </button>
      </div>
    </div>
  );
}