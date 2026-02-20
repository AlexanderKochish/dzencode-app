import type { NextConfig } from 'next'
import withPWAInit from '@ducanh2912/next-pwa'

const withPWA = withPWAInit({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  customWorkerSrc: 'worker',
})

const nextConfig: NextConfig = {
  reactCompiler: true,

  images: {
    unoptimized: process.env.NODE_ENV === 'development',
  },

  env: {
    INTERNAL_API_URL: process.env.INTERNAL_API_URL ?? 'http://localhost:3001',
  },
}

export default withPWA(nextConfig)
