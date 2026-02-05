/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // This enables static export for GitHub Pages
  images: {
    unoptimized: true, // Images must be unoptimized for static export
  },
   compiler: {
    styledComponents: true,
    // removeConsole: process.env.NODE_ENV !== 'development' ? true : false,
  },
   eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  }
};

module.exports = nextConfig;