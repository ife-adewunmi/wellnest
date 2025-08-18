'use client'

import type React from 'react'
import { useEffect, useState } from 'react'
import { useToast } from '@/shared/hooks/use-toast'

export function PWAProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast()
  const [isOnline, setIsOnline] = useState(true)
  const [installPrompt, setInstallPrompt] = useState<any>(null)

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration)

          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  toast({
                    title: 'App Updated',
                    description: 'A new version is available. Refresh to update.',
                    action: (
                      <button
                        onClick={() => window.location.reload()}
                        className="bg-primary text-primary-foreground rounded px-3 py-1 text-sm"
                      >
                        Refresh
                      </button>
                    ),
                  })
                }
              })
            }
          })
        })
        .catch((error) => {
          console.log('SW registration failed: ', error)
        })
    }

    // Handle push notifications subscription
    const subscribeToPush = async () => {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.warn('Push notifications not supported.')
        return
      }

      const permissionResult = await Notification.requestPermission()

      if (permissionResult === 'granted') {
        try {
          const registration = await navigator.serviceWorker.ready
          const existingSubscription = await registration.pushManager.getSubscription()

          if (existingSubscription) {
            console.log('Existing push subscription found:', existingSubscription)
            // Optionally send existing subscription to server to ensure it's active
            await fetch('/api/push/subscribe', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(existingSubscription),
            })
            return
          }

          const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
          if (!vapidPublicKey) {
            console.error('VAPID Public Key is not set.')
            return
          }

          const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey)

          const newSubscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedVapidKey,
          })

          console.log('New push subscription:', newSubscription)

          // Send subscription to your backend
          const response = await fetch('/api/push/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newSubscription),
          })

          if (response.ok) {
            toast({
              title: 'Notifications Enabled',
              description: 'You will now receive push notifications.',
            })
          } else {
            toast({
              title: 'Error',
              description: 'Failed to subscribe to push notifications.',
              variant: 'destructive',
            })
          }
        } catch (error) {
          console.error('Error subscribing to push notifications:', error)
          toast({
            title: 'Error',
            description: 'Failed to subscribe to push notifications.',
            variant: 'destructive',
          })
        }
      } else {
        console.warn('Notification permission denied.')
        toast({
          title: 'Notifications Blocked',
          description: 'Please enable notifications in your browser settings.',
          variant: 'destructive',
        })
      }
    }

    // Add a button or trigger to call subscribeToPush, e.g., after user logs in or on a settings page.
    // For demonstration, let's add a timeout to prompt after a few seconds.
    // In a real app, you'd want a user-initiated action.
    const notificationPromptTimeout = setTimeout(() => {
      subscribeToPush()
    }, 5000) // Prompt after 5 seconds

    // Handle install prompt
    let deferredPrompt: any

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      deferredPrompt = e

      // Show install banner after a delay
      setTimeout(() => {
        toast({
          title: 'Install App',
          description: 'Install this app on your device for a better experience.',
          action: (
            <button
              onClick={async () => {
                if (deferredPrompt) {
                  deferredPrompt.prompt()
                  const { outcome } = await deferredPrompt.userChoice
                  console.log(`User response to the install prompt: ${outcome}`)
                  deferredPrompt = null
                }
              }}
              className="bg-primary text-primary-foreground rounded px-3 py-1 text-sm"
            >
              Install
            </button>
          ),
        })
      }, 3000)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Network status monitoring
    const handleOnline = () => {
      setIsOnline(true)
      toast({
        title: 'Back Online',
        description: 'Your connection has been restored. Syncing data...',
      })

      // Trigger background sync when back online
      if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
        navigator.serviceWorker.ready.then((registration: any) => {
          if (registration.sync) {
            return registration.sync.register('background-sync')
          }
        })
      }
    }

    const handleOffline = () => {
      setIsOnline(false)
      toast({
        title: "You're Offline",
        description: "Some features may be limited. Data will sync when you're back online.",
        variant: 'destructive',
      })
    }

    // Add event listeners for network status
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Set initial network status
    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      clearTimeout(notificationPromptTimeout) // Clean up timeout
    }
  }, [toast])

  function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  return <>{children}</>
}
