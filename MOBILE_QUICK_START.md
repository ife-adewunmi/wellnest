# Wellnest Mobile App - Quick Start Guide

## 🚀 Quick Setup

### First Time Setup
```bash
# Run the automated setup script
yarn mobile:setup

# Or manually:
# 1. Update your network IP in .env.local
# 2. Install dependencies: yarn install
# 3. Sync Capacitor: npx cap sync android
```

### Environment Configuration
Update `.env.local` with your network IP:
```bash
NEXT_PUBLIC_APP_URL=http://YOUR_NETWORK_IP:3000
```

## 📱 Development Commands

### Local Development
```bash
# Start dev server for mobile (accessible on network)
yarn dev:mobile

# In another terminal, run on Android
yarn mobile:android

# Or with live reload
yarn mobile:android:dev
```

### Production Testing
```bash
# Build and test production version
yarn build:prod
yarn mobile:android:prod
```

### Utilities
```bash
yarn mobile:sync          # Sync changes to mobile app
yarn mobile:open          # Open in Android Studio
yarn mobile:clean         # Clean build artifacts
yarn mobile:doctor        # Check Capacitor setup
```

## 🌍 Environment Modes

### Local Development
- **Server**: `http://YOUR_NETWORK_IP:3000`
- **Config**: Uses `.env.local`
- **Database**: Local/development database

### Production
- **Server**: `https://prod-wellnest.vercel.app`
- **Config**: Uses `.env.production` 
- **Database**: Production database

## 🔧 Screen-Time Monitor Testing

1. **Navigate to Student Dashboard** in the mobile app
2. **Scroll down** to "Screen Time Monitoring" section
3. **Toggle the switch** to request permissions
4. **Grant "Usage Access"** permission in Android settings
5. **Return to app** and toggle again to start monitoring
6. **Test "View Today's Data"** button

## 📋 Troubleshooting

### Connection Issues
- Ensure emulator/device is on same network as your dev machine
- Check firewall settings allow port 3000
- Verify correct IP in `.env.local`

### Build Issues
- Run `yarn mobile:clean` then try again
- Check Node.js memory: `export NODE_OPTIONS="--max-old-space-size=4096"`
- Verify all environment variables are set

### Permission Issues
- Screen-time monitoring requires Android API 21+
- Test on real device for full functionality
- Use Chrome DevTools: `chrome://inspect`

## 🔄 Typical Development Workflow

1. **Start development server**:
   ```bash
   yarn dev:mobile
   ```

2. **Run on mobile** (new terminal):
   ```bash
   yarn mobile:android
   ```

3. **Make changes** to your React components

4. **See changes** automatically in the mobile app

5. **Sync when needed**:
   ```bash
   yarn mobile:sync
   ```

## 📦 Production Deployment

1. **Update production environment**:
   - Set production database URLs in `.env.production`
   - Update production secrets

2. **Build for production**:
   ```bash
   yarn build:prod
   ```

3. **Generate signed APK**:
   ```bash
   yarn mobile:open  # Opens Android Studio
   # Build → Generate Signed Bundle/APK
   ```

## 🎯 Key Features

- ✅ **Hot Reload**: Changes reflect immediately during development
- ✅ **Screen-Time Monitoring**: Native Android usage stats integration
- ✅ **Network Access**: App connects to your local development server
- ✅ **Production Ready**: Seamless switch between dev and production
- ✅ **PWA Features**: Offline support and caching

---

Need help? Check the full [MOBILE_DEPLOYMENT_GUIDE.md](./MOBILE_DEPLOYMENT_GUIDE.md) for detailed instructions.
