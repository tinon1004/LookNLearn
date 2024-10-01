// import withPWA from 'next-pwa';

// /** @type {import('next').NextConfig} */
// const nextConfig = {
// };

// // PWA 설정을 적용
// export default withPWA({
//   ...nextConfig,
//   dest: 'public', // PWA 관련 파일을 저장할 폴더
// });

// next.config.mjs

import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,      // Enable React strict mode for improved error handling
    swcMinify: true,            // Enable SWC minification for improved performance
    compiler: {
        removeConsole: process.env.NODE_ENV !== "development"     // Remove console.log in production
    }
};

export default withPWA({
    dest: "public",         // destination directory for the PWA files
    disable: process.env.NODE_ENV === "development",        // disable PWA in the development environment
    register: true,         // register the PWA service worker
    skipWaiting: true,      // skip waiting for service worker activation
})(nextConfig);
