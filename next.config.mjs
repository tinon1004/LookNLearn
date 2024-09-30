const withPWA = require('next-pwa')({
    dest: 'public', // PWA 관련 파일이 저장될 폴더 (예: service worker)
  });
  
  /** @type {import('next').NextConfig} */
  const nextConfig = {
    // 기존 Next.js 설정을 여기에 추가할 수 있습니다
  };
  
  module.exports = withPWA(nextConfig);
  