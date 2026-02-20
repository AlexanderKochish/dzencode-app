declare module '@ducanh2912/next-pwa' {
  import type { NextConfig } from 'next'

  interface PWAConfig {
    dest?: string
    register?: boolean
    skipWaiting?: boolean
    disable?: boolean
    scope?: string
    sw?: string
    runtimeCaching?: unknown[]
    buildExcludes?: (string | RegExp)[]
    publicExcludes?: string[]
    fallbacks?: {
      document?: string
      image?: string
      font?: string
      audio?: string
      video?: string
    }
    cacheOnFrontEndNav?: boolean
    reloadOnOnline?: boolean
    customWorkerSrc?: string
    customWorkerDest?: string
    customWorkerPrefix?: string
    extendDefaultRuntimeCaching?: boolean
    workboxOptions?: Record<string, unknown>
  }

  function withPWAInit(config: PWAConfig): (nextConfig: NextConfig) => NextConfig

  export default withPWAInit
}
