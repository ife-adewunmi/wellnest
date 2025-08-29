import * as dotenv from 'dotenv'
import type { CapacitorConfig } from '@capacitor/cli'

// Load appropriate env file based on NODE_ENV
// const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local'
dotenv.config({ path: '.env' })

const isProd = process.env.NODE_ENV === 'production'
const APP_URL = isProd ? process.env.NEXT_PUBLIC_PROD_APP_URL : process.env.NEXT_PUBLIC_APP_URL

const config: CapacitorConfig = {
  appId: 'com.wellnest.app',
  appName: 'Wellnest',
  webDir: 'out',
  server: isProd
    ? {
        // Production: Use hosted web app
        androidScheme: 'https',
      }
    : {
        // Development: Use local development server
        url: APP_URL,
        cleartext: true,
      },
  plugins: {
    ScreenTimeMonitor: {
      // Screen time monitoring plugin configuration
    },
  },
}

export default config
