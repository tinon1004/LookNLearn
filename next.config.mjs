import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  dest: 'public', // PWA 관련 파일을 저장할 폴더
});

export default nextConfig;

  