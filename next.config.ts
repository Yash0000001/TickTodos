import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  images: {
    domains: ["example.com"], // Add your image domains
  },
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
  },
};

export default nextConfig;
