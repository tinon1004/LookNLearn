'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

export default function WebcamPage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
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
      }
    }
  }, []);

  const retakePhoto = () => {
    setImageSrc(null);
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
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>룩앤런</h1>
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
            <button onClick={stopWebcam} style={{ backgroundColor: '#e53e3e', color: 'white', padding: '10px 20px', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>
              웹캠 중지
            </button>
          </>
        )}
      </div>
    </div>
  );
}