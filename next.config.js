/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // This enables static export for GitHub Pages
  images: {
    unoptimized: true, // Images must be unoptimized for static export
  },
   compiler: {
    styledComponents: true,
    // removeConsole: process.env.NODE_ENV !== 'development' ? true : false,
  }
};

module.exports = nextConfig;