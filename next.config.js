/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
    unoptimized: process.env.NODE_ENV !== 'production',
  },
  experimental: {
    scrollRestoration: true,
  },
  reactStrictMode: true,
  webpack: (config, { isServer, dev }) => {
    if (dev && !isServer) {
      config.devtool = 'eval-source-map';
    }
    return config;
  },
};

module.exports = nextConfig; 