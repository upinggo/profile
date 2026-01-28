/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['avatars.githubusercontent.com', 'images.unsplash.com'], // Add any image domains you'll use
  },
};

module.exports = nextConfig;