/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Exclude demo pages from the build
  pageExtensions: ['tsx', 'ts', 'jsx', 'js']
}

module.exports = nextConfig
