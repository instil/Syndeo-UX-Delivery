/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Use basePath only for production builds (GitHub Pages)
  basePath: process.env.NODE_ENV === 'production' ? '/Syndeo-UX' : '',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
