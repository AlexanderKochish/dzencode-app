import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactCompiler: true,

  // Пустой turbopack конфиг — говорит Next.js что мы знаем о Turbopack
  turbopack: {},

  images: {
    unoptimized: process.env.NODE_ENV === 'development',
  },

  env: {
    INTERNAL_API_URL: process.env.INTERNAL_API_URL ?? 'http://localhost:3001',
  },
}

export default nextConfig
