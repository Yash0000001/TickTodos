import withPWA from 'next-pwa';
// import runtimeCaching from 'next-pwa/cache';
const isProduction = process.env.NODE_ENV === 'production';
const config = {
 // here goes your Next.js configuration
 reactStrictMode: true,
};
const nextConfig = withPWA({
 dest: 'public',
 disable: !isProduction,
//  runtimeCaching
})(
 config
);
export default nextConfig;