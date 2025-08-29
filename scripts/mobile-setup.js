#!/usr/bin/env node

/**
 * Wellnest Mobile Development Setup Script
 * This script helps configure the development environment for mobile app testing
 */

const { execSync } = require('child_process')
const fs = require('fs')
const os = require('os')

console.log('🚀 Wellnest Mobile Development Setup\n')

// Function to execute commands and handle errors
function runCommand(command, description) {
  try {
    console.log(`⏳ ${description}...`)
    execSync(command, { stdio: 'inherit' })
    console.log(`✅ ${description} completed\n`)
  } catch (error) {
    console.error(`❌ Error during ${description}:`, error.message)
    process.exit(1)
  }
}

// Function to get local network IP
function getNetworkIP() {
  const interfaces = os.networkInterfaces()

  for (const name of Object.keys(interfaces)) {
    for (const interface of interfaces[name]) {
      if (interface.family === 'IPv4' && !interface.internal) {
        return interface.address
      }
    }
  }

  return 'localhost'
}

// Main setup function
async function setupMobileDev() {
  console.log('1. Checking environment...\n')

  // Get network IP
  const networkIP = getNetworkIP()
  console.log(`📡 Detected network IP: ${networkIP}\n`)

  // Update .env.local with network IP
  const envLocalPath = '.env.local'
  let envContent = ''

  if (fs.existsSync(envLocalPath)) {
    envContent = fs.readFileSync(envLocalPath, 'utf8')
  }

  // Update or add NEXT_PUBLIC_APP_URL
  const urlPattern = /NEXT_PUBLIC_APP_URL=.*/
  const newUrl = `NEXT_PUBLIC_APP_URL=http://${networkIP}:3000`

  if (urlPattern.test(envContent)) {
    envContent = envContent.replace(urlPattern, newUrl)
  } else {
    envContent += `\n${newUrl}\n`
  }

  fs.writeFileSync(envLocalPath, envContent)
  console.log(`✅ Updated ${envLocalPath} with network IP\n`)

  // 2. Install dependencies
  console.log('2. Installing dependencies...\n')
  runCommand('yarn install', 'Installing Node.js dependencies')

  // 3. Check Capacitor setup
  console.log('3. Checking Capacitor setup...\n')

  if (!fs.existsSync('android')) {
    console.log('📱 Adding Android platform...')
    runCommand('npx cap add android', 'Adding Android platform')
  } else {
    console.log('✅ Android platform already exists\n')
  }

  // 4. Sync Capacitor
  runCommand('npx cap sync', 'Syncing Capacitor plugins and assets')

  // 5. Check for Android development tools
  console.log('4. Checking Android development tools...\n')

  try {
    execSync('adb --version', { stdio: 'pipe' })
    console.log('✅ ADB is installed and available\n')
  } catch (error) {
    console.log('⚠️  ADB not found. Please install Android Studio and SDK tools.\n')
  }

  try {
    execSync('emulator -list-avds', { stdio: 'pipe' })
    console.log('✅ Android emulators are configured\n')
  } catch (error) {
    console.log('⚠️  No Android emulators found. Please create an AVD in Android Studio.\n')
  }

  // 6. Final instructions
  console.log('🎉 Setup Complete!\n')
  console.log('Next steps:')
  console.log('1. Start development server: yarn dev:mobile')
  console.log('2. Open new terminal and run: yarn mobile:android')
  console.log('3. Or use Android Studio: yarn mobile:open\n')

  console.log('Available commands:')
  console.log('  yarn dev:mobile          - Start dev server for mobile')
  console.log('  yarn mobile:android       - Run on Android emulator/device')
  console.log('  yarn mobile:android:dev   - Run with live reload')
  console.log('  yarn mobile:android:prod  - Run production build')
  console.log('  yarn mobile:open          - Open in Android Studio')
  console.log('  yarn mobile:sync          - Sync Capacitor changes')
  console.log('  yarn mobile:clean         - Clean build artifacts')
  console.log('  yarn mobile:doctor        - Check Capacitor setup\n')

  console.log(`📱 Your app will connect to: http://${networkIP}:3000`)
  console.log('🔧 Make sure your mobile device/emulator is on the same network!\n')
}

// Run setup
setupMobileDev().catch((error) => {
  console.error('❌ Setup failed:', error)
  process.exit(1)
})
