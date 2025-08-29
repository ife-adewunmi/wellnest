import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // experimental: {
  //   optimizePackageImports: ['@tailwindcss/postcss'],
  // },
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  webpack: (config, { isServer }) => {
    // Fix for PostgreSQL client modules not available in browser
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        pg: false,
        'pg-native': false,
      }
    }
    return config
  },
}

export default nextConfig
