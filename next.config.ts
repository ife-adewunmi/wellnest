import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  webpack: (config, { isServer }) => {
    // Fix for PostgreSQL client modules not available in browser
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: 'net-browserify',
        tls: 'tls-browserify',
        dns: 'dns-socket',
        pg: false,
        'pg-native': false,
        crypto: 'crypto-browserify',
        stream: 'stream-browserify',
        util: require.resolve('util'),
        buffer: require.resolve('buffer'),
        'node:crypto': 'crypto-browserify',
        'node:stream': 'stream-browserify',
        'node:util': require.resolve('util'),
        'node:buffer': require.resolve('buffer'),
      }
    }
    return config
  },
}

export default nextConfig
