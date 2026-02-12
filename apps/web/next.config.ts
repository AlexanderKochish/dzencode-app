import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,

  experimental: {
    //@ts-expect-error: turbo is a valid property in Next.js 15+
    turbo: {
      root: '../../',
    },
  },
}

export default nextConfig
