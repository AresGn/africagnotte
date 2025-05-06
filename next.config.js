/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
    unoptimized: process.env.NODE_ENV !== 'production',
  },
  experimental: {
    scrollRestoration: true,
  },
};

module.exports = nextConfig; 