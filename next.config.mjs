import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,      
    swcMinify: true,            
    compiler: {
        removeConsole: process.env.NODE_ENV !== "development"    
    },
    async rewrites() {
        return [
            {
                source: "/api/upload",
                destination: process.env.NEXT_PUBLIC_FLASK_APIKEY + "/upload",
            }
        ];
    }
};

export default withPWA({
    dest: "public",        
    disable: process.env.NODE_ENV === "development",        
    register: true,        
    skipWaiting: true,      
})(nextConfig);
