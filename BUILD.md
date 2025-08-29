# Build Instructions

## Screen Time Monitor Local Package

This project includes a local Capacitor plugin called `screen-time-monitor` located at `src/shared/lib/screen-time-monitor/`.

### Automatic Build Process

The build process is automated with the following npm scripts:

- **`postinstall`**: Automatically builds the screen-time-monitor package after `yarn install`
- **`prebuild`**: Builds the screen-time-monitor package before the main Next.js build
- **`build:screen-time-monitor`**: Manually build the screen-time-monitor package

### For Local Development

```bash
# Install dependencies (automatically builds screen-time-monitor)
yarn install

# Start development server
yarn dev

# Manually rebuild screen-time-monitor if needed
yarn build:screen-time-monitor
```

### For Vercel Deployment

The project is configured to work seamlessly with Vercel:

1. **`vercel.json`** specifies yarn as the package manager
2. **`postinstall` script** ensures screen-time-monitor is built during deployment
3. **`prebuild` script** ensures screen-time-monitor is built before Next.js build

### Troubleshooting

If you encounter module resolution errors:

1. Clean and rebuild the screen-time-monitor package:
   ```bash
   yarn build:screen-time-monitor
   ```

2. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules yarn.lock
   rm -rf src/shared/lib/screen-time-monitor/node_modules
   yarn install
   ```

### Package Structure

```
src/shared/lib/screen-time-monitor/
├── package.json          # Local package configuration
├── tsconfig.json         # TypeScript configuration
├── src/                  # Source TypeScript files
├── dist/                 # Built files (auto-generated)
├── android/              # Android native code
└── ios/                  # iOS native code
```

The built package exports:
- `ScreenTimeMonitor` - Main plugin interface
- Type definitions for TypeScript support
