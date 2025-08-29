# Wellnest Mobile App Deployment Guide

This guide covers how to set up and deploy the Wellnest mobile app using Capacitor for both local development and production environments.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Local Development Setup](#local-development-setup)
- [Production Deployment](#production-deployment)
- [Screen-Time Monitor Plugin](#screen-time-monitor-plugin)
- [Troubleshooting](#troubleshooting)
- [Build Scripts](#build-scripts)

## Prerequisites

### Development Environment
- **Node.js**: v18.0.0 or higher
- **Yarn**: Package manager
- **Android Studio**: Latest version with SDK
- **Java**: JDK 17 (required for Android builds)

### Android Development
```bash
# Install Android Studio and set up environment variables
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/tools
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-17.jdk/Contents/Home
```

### Capacitor CLI
```bash
npm install -g @capacitor/cli
```

## Environment Configuration

### 1. Environment Files Setup

Create/update your environment files:

**.env** (Base configuration):
```bash
# App Configuration
NEXT_PUBLIC_APP_ENV=local
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_PROD_APP_URL=https://prod-wellnest.vercel.app

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here

# Database Configuration
DATABASE_URL="your-database-url-here"
DATABASE_URL_UNPOOLED="your-database-url-here"

# ML API
ML_API_BASE_URL=https://mlapi.besideshosting.com
```

**.env.local** (Local development overrides):
```bash
# App Configuration
NEXT_PUBLIC_APP_ENV=local
NEXT_PUBLIC_APP_URL=http://192.168.0.3:3000  # Your local network IP

# Same database and other configs as .env
DATABASE_URL="your-database-url-here"
DATABASE_URL_UNPOOLED="your-database-url-here"
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here
ML_API_BASE_URL=https://mlapi.besideshosting.com
```

**.env.production** (Production configuration):
```bash
# App Configuration
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_APP_URL=https://prod-wellnest.vercel.app
NEXT_PUBLIC_PROD_APP_URL=https://prod-wellnest.vercel.app

# Authentication
NEXTAUTH_URL=https://prod-wellnest.vercel.app
NEXTAUTH_SECRET=your-production-secret

# Database Configuration (production)
DATABASE_URL="your-production-database-url"
DATABASE_URL_UNPOOLED="your-production-unpooled-database-url"

# ML API
ML_API_BASE_URL=https://mlapi.besideshosting.com
```

### 2. Capacitor Configuration

**capacitor.config.ts** (Dynamic configuration):
```typescript
import * as dotenv from 'dotenv'
import type { CapacitorConfig } from '@capacitor/cli'

// Load appropriate env file based on NODE_ENV
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local'
dotenv.config({ path: envFile })

const isProd = process.env.NODE_ENV === 'production'
const APP_URL = isProd 
  ? process.env.NEXT_PUBLIC_PROD_APP_URL 
  : process.env.NEXT_PUBLIC_APP_URL

const config: CapacitorConfig = {
  appId: 'com.wellnest.app',
  appName: 'Wellnest',
  webDir: isProd ? 'out' : 'out',
  server: isProd 
    ? {
        androidScheme: 'https'
      }
    : {
        url: APP_URL,
        cleartext: true
      },
  plugins: {
    ScreenTimeMonitor: {
      // Plugin configuration
    }
  }
}

export default config
```

## Local Development Setup

### 1. Install Dependencies
```bash
# Install node dependencies
yarn install

# Add Capacitor platforms (if not already added)
npx cap add android
npx cap add ios  # Optional, for iOS development
```

### 2. Get Your Local Network IP
```bash
# On macOS/Linux
ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1

# On Windows
ipconfig | findstr "IPv4"
```

Update your `.env.local` with your network IP:
```bash
NEXT_PUBLIC_APP_URL=http://YOUR_NETWORK_IP:3000
```

### 3. Start Development Server
```bash
# Start Next.js dev server on all network interfaces
yarn dev --hostname 0.0.0.0

# The server will be accessible at:
# - http://localhost:3000 (local machine)
# - http://YOUR_NETWORK_IP:3000 (network accessible)
```

### 4. Sync and Run on Mobile
```bash
# Sync web assets and native plugins
npx cap sync android

# Run on Android emulator/device
npx cap run android

# Or open in Android Studio for debugging
npx cap open android
```

## Production Deployment

### 1. Prepare Production Build

**Method A: Static Export (Recommended for mobile)**
```bash
# Update next.config.ts for static export
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  // ... other config
}
```

**Method B: Server Build with External Hosting**
Keep standard Next.js build and host on Vercel/similar platform.

### 2. Build Production Assets

**For Static Export:**
```bash
# Set production environment
NODE_ENV=production yarn build

# This creates 'out' directory with static files
```

**For Server Build:**
```bash
# Regular build for deployment
yarn build
```

### 3. Configure for Production

Update `capacitor.config.ts` to use production URLs:
```typescript
const config: CapacitorConfig = {
  appId: 'com.wellnest.app',
  appName: 'Wellnest',
  webDir: 'out',
  server: {
    url: 'https://prod-wellnest.vercel.app',
    androidScheme: 'https'
  }
}
```

### 4. Production Mobile Build
```bash
# Set production environment
export NODE_ENV=production

# Sync with production configuration
npx cap sync android

# Build release APK
npx cap run android --prod

# Or open Android Studio for release build
npx cap open android
```

### 5. Android Release Build (in Android Studio)

1. Open the project in Android Studio:
   ```bash
   npx cap open android
   ```

2. Generate signed APK:
   - Build → Generate Signed Bundle/APK
   - Choose APK
   - Create/use keystore
   - Build release APK

## Screen-Time Monitor Plugin

### Plugin Features
- **Usage Stats Permission**: Requests Android usage access
- **App Monitoring**: Tracks social media app usage
- **Background Sync**: 15-minute monitoring intervals
- **Data Storage**: Syncs with your database

### Integration Points
Located in: `src/features/screen-time/lib/ScreenTimeMonitoringToggle.tsx`

Used in: Student Dashboard (`src/features/users/students/dashboard/dashboard.tsx`)

### API Endpoints Required
```typescript
// Update user screen-time consent
PATCH /api/users/screen-time-consent
{
  userId: string,
  consent: boolean,
  consentDate: string
}
```

## Build Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    // Development
    "dev": "next dev --turbopack",
    "dev:mobile": "next dev --hostname 0.0.0.0",
    
    // Building
    "build": "next build",
    "build:mobile": "next build && npx cap sync",
    "build:prod": "NODE_ENV=production next build && npx cap sync",
    
    // Mobile Development
    "mobile:sync": "npx cap sync",
    "mobile:android": "npx cap run android",
    "mobile:android:dev": "npx cap run android --livereload --external",
    "mobile:android:prod": "NODE_ENV=production npx cap run android",
    
    // Utilities
    "mobile:clean": "npx cap clean android",
    "mobile:doctor": "npx cap doctor"
  }
}
```

## Troubleshooting

### Common Issues

#### 1. Connection Refused Error
**Problem**: Emulator can't connect to localhost
**Solution**: 
```bash
# Use network IP instead of localhost
yarn dev --hostname 0.0.0.0
# Update capacitor.config.ts with your network IP
```

#### 2. Database Connection Issues
**Problem**: DATABASE_URL errors during build
**Solution**: 
```bash
# Ensure both variables are set
DATABASE_URL="your-connection-string"
DATABASE_URL_UNPOOLED="your-connection-string"
```

#### 3. Build Memory Issues
**Problem**: JavaScript heap out of memory
**Solution**: 
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
yarn build
```

#### 4. Permission Issues (Android)
**Problem**: Screen-time monitoring not working
**Solution**: 
- Ensure plugin is properly installed
- Test permission flow on real device
- Check Android API level compatibility (requires API 21+)

#### 5. Hot Reload Issues
**Problem**: Changes not reflecting in mobile app
**Solution**: 
```bash
# Use livereload for development
npx cap run android --livereload --external
```

### Development Tips

1. **Network Testing**: Always test on the same network as your development machine
2. **HTTPS in Production**: Use HTTPS URLs for production builds
3. **Plugin Debugging**: Use Chrome DevTools via `chrome://inspect`
4. **Database Migrations**: Run migrations before mobile testing
5. **Environment Switching**: Use different environment files for different stages

### Deployment Checklist

#### Local Development
- [ ] Network IP configured in `.env.local`
- [ ] Development server running on `0.0.0.0`
- [ ] Database accessible
- [ ] Emulator/device connected
- [ ] Screen-time plugin permissions granted

#### Production Release
- [ ] Production environment variables set
- [ ] Database URLs point to production
- [ ] SSL certificates configured
- [ ] Build optimized and tested
- [ ] Signed APK generated
- [ ] Store deployment configured

## Additional Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Android Developer Guide](https://developer.android.com/guide)
- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Vercel Deployment](https://vercel.com/docs)

---

This guide ensures your Wellnest mobile app works seamlessly in both development and production environments with proper screen-time monitoring functionality.
