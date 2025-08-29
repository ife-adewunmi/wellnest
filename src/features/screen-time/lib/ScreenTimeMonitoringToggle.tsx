'use client'

import { useState, useEffect } from 'react'
import { Capacitor } from '@capacitor/core'
import { MonitoringStatus, ScreenTimeMonitor } from '@/shared/lib/screen-time-monitor/src'

interface ScreenTimeMonitoringToggleProps {
  userId: string
  onStatusChange?: (isActive: boolean) => void
}

export default function ScreenTimeMonitoringToggle({
  userId,
  onStatusChange,
}: ScreenTimeMonitoringToggleProps) {
  const [isEnabled, setIsEnabled] = useState(false)
  const [hasPermission, setHasPermission] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [monitoringStatus, setMonitoringStatus] = useState<MonitoringStatus | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Check if running on mobile platform
  const isMobile = Capacitor.isNativePlatform()

  useEffect(() => {
    initializeStatus()
  }, [])

  const initializeStatus = async () => {
    if (!isMobile) {
      setIsLoading(false)
      return
    }

    try {
      // Check permissions first
      const permissionResult = await ScreenTimeMonitor.isUsageStatsPermissionGranted()
      setHasPermission(permissionResult.granted)

      if (permissionResult.granted) {
        // Get current monitoring status
        const status = await ScreenTimeMonitor.getMonitoringStatus()
        setMonitoringStatus(status)
        setIsEnabled(status.isActive)
        onStatusChange?.(status.isActive)
      }
    } catch (err) {
      console.error('Error initializing screen time status:', err)
      setError('Failed to initialize screen time monitoring')
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggle = async () => {
    if (!isMobile) {
      alert('Screen time monitoring is only available on mobile devices')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      if (!hasPermission) {
        // Open settings to grant permission
        await ScreenTimeMonitor.openUsageStatsSettings()

        // After user returns, check permission again
        setTimeout(async () => {
          const permissionResult = await ScreenTimeMonitor.isUsageStatsPermissionGranted()
          setHasPermission(permissionResult.granted)
          setIsLoading(false)

          if (!permissionResult.granted) {
            setError('Usage access permission is required for screen time monitoring')
          }
        }, 1000)
        return
      }

      if (isEnabled) {
        // Stop monitoring
        await ScreenTimeMonitor.stopMonitoring()
        setIsEnabled(false)
        onStatusChange?.(false)

        // Update database to reflect monitoring is disabled
        await updateUserScreenTimeConsent(false)
      } else {
        // Start monitoring with social media apps focus
        const socialMediaApps = [
          'com.instagram.android',
          'com.facebook.katana',
          'com.zhiliaoapp.musically', // TikTok
          'com.twitter.android',
          'com.snapchat.android',
          'com.whatsapp',
          'com.telegram.messenger',
        ]

        await ScreenTimeMonitor.startMonitoring({
          apps: socialMediaApps,
          intervalMinutes: 15, // Check every 15 minutes
        })

        setIsEnabled(true)
        onStatusChange?.(true)

        // Update database to reflect monitoring is enabled
        await updateUserScreenTimeConsent(true)
      }

      // Refresh status
      const status = await ScreenTimeMonitor.getMonitoringStatus()
      setMonitoringStatus(status)
    } catch (err) {
      console.error('Error toggling screen time monitoring:', err)
      setError('Failed to toggle screen time monitoring')
    } finally {
      setIsLoading(false)
    }
  }

  const updateUserScreenTimeConsent = async (consent: boolean) => {
    try {
      const response = await fetch('/api/users/screen-time-consent', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          consent,
          consentDate: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update consent')
      }
    } catch (err) {
      console.error('Error updating screen time consent:', err)
    }
  }

  const handleViewCurrentData = async () => {
    if (!isMobile || !hasPermission) return

    try {
      setIsLoading(true)
      const currentData = await ScreenTimeMonitor.getCurrentDayUsage()

      // Display current day data in a modal or navigate to detailed view
      console.log('Current day usage:', currentData)

      // You could dispatch this to a modal component or navigate to a detailed view
      // For now, we'll just show an alert with summary
      const totalTime = currentData.apps.reduce((sum, app) => sum + app.durationSeconds, 0)
      const hours = Math.floor(totalTime / 3600)
      const minutes = Math.floor((totalTime % 3600) / 60)

      alert(
        `Today&apos;s screen time: ${hours}h ${minutes}m across ${currentData.apps.length} apps`,
      )
    } catch (err) {
      console.error('Error fetching current data:', err)
      setError('Failed to fetch screen time data')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isMobile) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h3 className="font-semibold text-gray-700">Screen Time Monitoring</h3>
        <p className="mt-2 text-sm text-gray-600">
          Screen time monitoring is only available on mobile devices. Install the Wellnest mobile
          app to enable this feature.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">Screen Time Monitoring</h3>
          <p className="mt-1 text-sm text-gray-600">
            {hasPermission
              ? 'Allow Wellnest to monitor your app usage to provide better insights'
              : 'Grant usage access permission to enable screen time monitoring'}
          </p>

          {monitoringStatus && isEnabled && (
            <div className="mt-2 space-y-1 text-xs text-gray-500">
              <p>Monitoring interval: {monitoringStatus.intervalMinutes} minutes</p>
              <p>Monitored apps: {monitoringStatus.monitoredApps.length} social media apps</p>
              {monitoringStatus.lastUpdate && (
                <p>Last update: {new Date(monitoringStatus.lastUpdate).toLocaleTimeString()}</p>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col items-end space-y-2">
          <button
            onClick={handleToggle}
            disabled={isLoading}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none ${
              isEnabled ? 'bg-blue-600' : hasPermission ? 'bg-gray-200' : 'bg-orange-200'
            } ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>

          {hasPermission && (
            <button
              onClick={handleViewCurrentData}
              disabled={isLoading || !isEnabled}
              className="text-xs text-blue-600 hover:text-blue-800 disabled:text-gray-400"
            >
              View Today&apos;s Data
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-3 rounded-md bg-red-50 p-2">
          <p className="text-sm text-red-700">{error}</p>
          <button
            onClick={() => setError(null)}
            className="ml-2 text-xs text-red-600 hover:text-red-800"
          >
            Dismiss
          </button>
        </div>
      )}

      {!hasPermission && (
        <div className="mt-3 rounded-md bg-orange-50 p-3">
          <p className="text-sm text-orange-700">
            To enable screen time monitoring, you need to grant usage access permission. Tap the
            toggle above to open the settings.
          </p>
        </div>
      )}

      <div className="mt-4 border-t pt-3">
        <h4 className="text-sm font-medium text-gray-700">What we monitor:</h4>
        <ul className="mt-1 space-y-1 text-xs text-gray-600">
          <li>• Social media app usage (Instagram, Facebook, TikTok, etc.)</li>
          <li>• Daily screen time patterns</li>
          <li>• Screen time before bedtime</li>
          <li>• App usage categories</li>
        </ul>
        <p className="mt-2 text-xs text-gray-500">
          This data is used to provide personalized wellness insights and is only shared with your
          assigned counselor.
        </p>
      </div>
    </div>
  )
}
