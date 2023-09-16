/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: 'build',
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  reactStrictMode: true,
  swcMinify: true
}

module.exports = nextConfig
