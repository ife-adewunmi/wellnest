# WellNest PWA Setup Guide

This document outlines the Progressive Web App (PWA) configuration for WellNest.

## 🚀 What's Been Updated

### 1. Enhanced Manifest (`public/manifest.json`)
- ✅ Complete PWA manifest with all required fields
- ✅ Multiple icon sizes for different devices
- ✅ Shortcuts for quick actions
- ✅ Screenshots for app store listings
- ✅ Proper categorization and metadata

### 2. Updated Layout (`src/app/layout.tsx`)
- ✅ Comprehensive PWA metadata
- ✅ Apple Touch Icons and splash screens
- ✅ Windows tile configuration
- ✅ SEO optimization
- ✅ Social media meta tags (Open Graph, Twitter)

### 3. Next.js Configuration (`next.config.ts`)
- ✅ Updated PWA configuration with caching strategies
- ✅ Performance optimizations
- ✅ Image optimization settings
- ✅ Modern TypeScript export

### 4. Additional Files Created
- ✅ `public/browserconfig.xml` - Windows tile configuration
- ✅ `public/robots.txt` - SEO robots file
- ✅ `src/components/PWAInstallPrompt.tsx` - Install prompt component
- ✅ `scripts/generate-icons.js` - Icon generation script

## 📱 Required Icons

You need to generate the following icons. Use the provided script to generate them automatically:

### Standard Icons
- 16x16, 32x32 (Favicon)
- 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512 (PWA Icons)

### Apple Icons
- 180x180 (Apple Touch Icon)
- 152x152, 167x167 (iPad variants)

### Microsoft Tiles
- 70x70, 150x150, 310x310 (Windows tiles)

### Apple Splash Screens
- Various sizes for different iOS devices

## 🛠️ Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Generate Icons
1. Place your source icon (1024x1024 PNG) at `public/icon-source.png`
2. Run the icon generator:
```bash
npm run generate-icons
```

### 3. Update Environment Variables
Create a `.env.local` file with:
```env
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### 4. Customize Content
- Update the app name, description, and colors in `public/manifest.json`
- Modify the metadata in `src/app/layout.tsx`
- Update the domain in `public/robots.txt`

## 🧪 Testing Your PWA

### 1. Development Testing
```bash
npm run dev
```
Visit `http://localhost:3000` and check:
- Install prompt appears (in supported browsers)
- App works offline after first visit
- Icons display correctly

### 2. PWA Audit
```bash
npm run pwa-audit
```
This runs a Lighthouse PWA audit to check compliance.

### 3. Production Testing
```bash
npm run build
npm start
```

## 📊 PWA Features Implemented

### ✅ Core PWA Requirements
- [x] Web App Manifest
- [x] Service Worker (via next-pwa)
- [x] HTTPS (required for production)
- [x] Responsive design
- [x] Fast loading

### ✅ Enhanced Features
- [x] Offline functionality
- [x] Install prompts
- [x] App shortcuts
- [x] Splash screens
- [x] Icon variations
- [x] Caching strategies

### ✅ Platform Support
- [x] iOS Safari
- [x] Android Chrome
- [x] Desktop Chrome/Edge
- [x] Windows tiles
- [x] macOS Safari

## 🔧 Customization Options

### Caching Strategy
The current setup uses `NetworkFirst` strategy. You can modify this in `next.config.ts`:

```typescript
runtimeCaching: [
  {
    urlPattern: /^https?.*/,
    handler: 'NetworkFirst', // or 'CacheFirst', 'StaleWhileRevalidate'
    options: {
      cacheName: 'offlineCache',
      expiration: {
        maxEntries: 200,
        maxAgeSeconds: 24 * 60 * 60, // 24 hours
      },
    },
  },
]
```

### Theme Colors
Update theme colors in:
- `public/manifest.json` - `theme_color` and `background_color`
- `src/app/layout.tsx` - meta theme-color
- `public/browserconfig.xml` - TileColor

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Generate all required icons
- [ ] Update `NEXT_PUBLIC_APP_URL` environment variable
- [ ] Update domain in `public/robots.txt`
- [ ] Test PWA functionality in production environment
- [ ] Run PWA audit and achieve score > 90
- [ ] Test install prompt on different devices
- [ ] Verify offline functionality

## 📱 Install Prompt Component

Add the install prompt to your app:

```tsx
import PWAInstallPrompt from '@/components/PWAInstallPrompt'

export default function Layout({ children }) {
  return (
    <>
      {children}
      <PWAInstallPrompt />
    </>
  )
}
```

## 🐛 Troubleshooting

### Service Worker Not Updating
- Clear browser cache and storage
- Check if `skipWaiting: true` is set in next.config.ts

### Icons Not Displaying
- Verify all icon files exist in `public/icons/`
- Check file paths in manifest.json
- Ensure icons are properly sized

### Install Prompt Not Showing
- PWA criteria must be met (manifest, service worker, HTTPS)
- Some browsers have specific requirements
- Test in Chrome DevTools > Application > Manifest

## 📚 Resources

- [PWA Checklist](https://web.dev/pwa-checklist/)
- [Next.js PWA Documentation](https://github.com/shadowwalker/next-pwa)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
