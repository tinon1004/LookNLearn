import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
};

// PWA 설정을 적용
export default withPWA({
  ...nextConfig,
  dest: 'public', // PWA 관련 파일을 저장할 폴더
});
