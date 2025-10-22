/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true, // koristi app folder umesto pages
  },
};

module.exports = nextConfig;
