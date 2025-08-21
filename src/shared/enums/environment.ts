import { isServer } from '@/shared/lib/is-server'

export enum Environment {
  LOCAL = 'local',
  DEVELOPMENT = 'develop',
  STAGING = 'staging',
  PRODUCTION = 'production',
}

export const getEnvironment = (): Environment => {
  const nodeEnv = process.env.NODE_ENV || 'development'
  const appEnv = process.env.NEXT_PUBLIC_APP_ENV || nodeEnv
  const hostname = !isServer ? window.location.hostname : ''

  // Check for local development
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('192.168')) {
    return Environment.LOCAL
  }

  // Check based on NEXT_PUBLIC_APP_ENV first, then NODE_ENV
  if (appEnv === 'staging') {
    return Environment.STAGING
  }

  switch (nodeEnv) {
    case 'production':
      // Could still be staging if NEXT_PUBLIC_APP_ENV is set
      return appEnv === 'staging' ? Environment.STAGING : Environment.PRODUCTION
    case 'development':
      return Environment.DEVELOPMENT
    case 'test':
      return Environment.DEVELOPMENT
    default:
      return Environment.LOCAL
  }
}

export const isLocal = (): boolean => {
  return getEnvironment() === Environment.LOCAL
}

export const isDevelop = (): boolean => {
  const env = getEnvironment()
  return env === Environment.LOCAL || env === Environment.DEVELOPMENT
}

export const isProd = (): boolean => {
  return getEnvironment() === Environment.PRODUCTION
}
