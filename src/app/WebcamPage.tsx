'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

export default function WebcamPage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUploaded, setIsUploaded] = useState<boolean>(false);
  const [result, setResult] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startWebcam = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCapturing(true);
      setError(null);
    } catch (err) {
      console.error("웹캠을 시작하는 데 실패했습니다:", err);
      setError("카메라 접근에 실패했습니다. 권한을 확인해주세요.");
    }
  }, []);

  useEffect(() => {
    if (isCapturing && !imageSrc) {
      startWebcam();
    }
  }, [isCapturing, imageSrc, startWebcam]);

  const stopWebcam = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCapturing(false);
    setImageSrc(null);
    setResult(null);
    setIsUploaded(false);
  }, []);

  const captureImage = useCallback(() => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        setImageSrc(canvas.toDataURL('image/jpeg'));
        setIsUploaded(false);
      }
    }
  }, []);

  const uploadPhoto = async () => {
    if (!imageSrc) return;

    setIsLoading(true);
    try {
      // Base64 데이터를 Blob으로 변환
      const response = await fetch(imageSrc);
      const blob = await response.blob();

      // FormData 생성 및 이미지 추가
      const formData = new FormData();
      formData.append('image', blob, 'captured_image.jpg');

      // 서버로 이미지 전송
      const uploadResponse = await fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('업로드 실패');
      }

      setIsUploaded(true);
      setError(null);

    } catch (err) {
      console.error('업로드 오류:', err);
      setError('이미지 업로드 중 오류가 발생했습니다.');
      setIsUploaded(false);
    } finally {
      setIsLoading(false);
    }
  };

  const checkAccuracy = async () => {
    if (!isUploaded) {
      setError('먼저 사진을 업로드해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const resultResponse = await fetch('http://127.0.0.1:5000/');
      if (!resultResponse.ok) {
        throw new Error('결과 가져오기 실패');
      }

      const resultData = await resultResponse.json();
      console.log('서버 응답:', resultData);
      setResult(JSON.stringify(resultData, null, 2));
      setError(null);

    } catch (err) {
      console.error('결과 확인 오류:', err);
      setError('결과를 가져오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const retakePhoto = () => {
    setImageSrc(null);
    setResult(null);
    setIsUploaded(false);
    startWebcam();
  };

  const mirrorStyle = {
    transform: 'scaleX(-1)',
    WebkitTransform: 'scaleX(-1)',
    width: '100%', 
    height: '100%', 
    objectFit: 'cover' as const,
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>웹캠 앱</h1>
      <div style={{ width: '100%', maxWidth: '640px', aspectRatio: '16 / 9', backgroundColor: '#f0f0f0', borderRadius: '8px', overflow: 'hidden', margin: '0 auto' }}>
        {isCapturing && !imageSrc && (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            style={mirrorStyle}
          />
        )}
        {imageSrc && (
          <img 
            src={imageSrc} 
            alt="Captured" 
            style={mirrorStyle}
          />
        )}
        {!isCapturing && !imageSrc && (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
            웹캠이 비활성화되었습니다
          </div>
        )}
      </div>
      {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>{error}</p>}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', gap: '10px' }}>
        {!isCapturing ? (
          <button onClick={startWebcam} style={{ backgroundColor: '#3490dc', color: 'white', padding: '10px 20px', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>
            웹캠 시작
          </button>
        ) : (
          <>
            <button 
              onClick={imageSrc ? retakePhoto : captureImage} 
              style={{ backgroundColor: '#38a169', color: 'white', padding: '10px 20px', borderRadius: '5px', border: 'none', cursor: 'pointer' }}
            >
              {imageSrc ? '다시 찍기' : '사진 찍기'}
            </button>
            {imageSrc && (
              <>
                <button 
                  onClick={uploadPhoto}
                  disabled={isLoading}
                  style={{ 
                    backgroundColor: '#6366f1', 
                    color: 'white', 
                    padding: '10px 20px', 
                    borderRadius: '5px', 
                    border: 'none', 
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: isLoading ? 0.7 : 1
                  }}
                >
                  {isLoading ? '업로드 중...' : '사진 업로드하기'}
                </button>
                <button 
                  onClick={checkAccuracy}
                  disabled={isLoading || !isUploaded}
                  style={{ 
                    backgroundColor: '#9333ea', 
                    color: 'white', 
                    padding: '10px 20px', 
                    borderRadius: '5px', 
                    border: 'none', 
                    cursor: (isLoading || !isUploaded) ? 'not-allowed' : 'pointer',
                    opacity: (isLoading || !isUploaded) ? 0.7 : 1
                  }}
                >
                  {isLoading ? '처리 중...' : '정확도 확인하기'}
                </button>
              </>
            )}
            <button onClick={stopWebcam} style={{ backgroundColor: '#e53e3e', color: 'white', padding: '10px 20px', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>
              웹캠 중지
            </button>
          </>
        )}
      </div>
      {result && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f7fafc', borderRadius: '5px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>분석 결과:</h2>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{result}</pre>
        </div>
      )}
    </div>
  );
}