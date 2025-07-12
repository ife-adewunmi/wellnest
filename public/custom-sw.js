// WellNest Advanced Service Worker
// This service worker provides advanced PWA functionality including:
// - Advanced caching strategies
// - Background sync
// - Push notifications
// - Offline data management
// - Performance monitoring

import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching'
import { registerRoute, NavigationRoute } from 'workbox-routing'
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies'
import { BackgroundSync } from 'workbox-background-sync'
import { ExpirationPlugin } from 'workbox-expiration'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'

// Precache and route setup
precacheAndRoute(self.__WB_MANIFEST)
cleanupOutdatedCaches()

// Constants
const CACHE_NAMES = {
  STATIC: 'wellnest-static-v1',
  DYNAMIC: 'wellnest-dynamic-v1',
  API: 'wellnest-api-v1',
  IMAGES: 'wellnest-images-v1',
  OFFLINE: 'wellnest-offline-v1'
}

const OFFLINE_PAGE = '/offline'
const OFFLINE_IMAGE = '/images/offline-fallback.png'

// Background Sync Setup
const bgSync = new BackgroundSync('wellnest-background-sync', {
  maxRetentionTime: 24 * 60 // 24 hours in minutes
})

// Advanced Caching Strategies

// API Routes with Background Sync
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: CACHE_NAMES.API,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 5 * 60, // 5 minutes
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      bgSync,
    ],
  })
)

// Static Assets - Long-term caching
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: CACHE_NAMES.IMAGES,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 200,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
)

// CSS and JS files
registerRoute(
  ({ request }) => 
    request.destination === 'style' || 
    request.destination === 'script',
  new StaleWhileRevalidate({
    cacheName: CACHE_NAMES.STATIC,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
      }),
    ],
  })
)

// Navigation requests (HTML pages)
const navigationRoute = new NavigationRoute(
  new NetworkFirst({
    cacheName: CACHE_NAMES.DYNAMIC,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 24 * 60 * 60, // 24 hours
      }),
    ],
    networkTimeoutSeconds: 3,
  }),
  {
    allowlist: [/^\/(?!api)/], // Exclude API routes
  }
)

registerRoute(navigationRoute)

// Offline Fallback Strategy
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(OFFLINE_PAGE)
      })
    )
  }
  
  if (event.request.destination === 'image') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(OFFLINE_IMAGE)
      })
    )
  }
})

// Push Notification Handling
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event)
  
  const options = {
    body: 'You have a new notification from WellNest',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Open App',
        icon: '/icons/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/icon-192x192.png'
      }
    ]
  }

  if (event.data) {
    const data = event.data.json()
    options.body = data.body || options.body
    options.title = data.title || 'WellNest'
    options.data = { ...options.data, ...data }
  }

  event.waitUntil(
    self.registration.showNotification('WellNest', options)
  )
})

// Notification Click Handling
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event)
  
  event.notification.close()
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    )
  } else if (event.action === 'close') {
    // Just close the notification
    return
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})

// Background Sync Event
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag)
  
  if (event.tag === 'wellnest-background-sync') {
    event.waitUntil(syncData())
  }
})

// Sync function for background sync
async function syncData() {
  try {
    console.log('Starting background sync...')

    // Get pending requests from IndexedDB
    const pendingRequests = await getPendingRequests()
    console.log(`Found ${pendingRequests.length} pending requests`)

    let successCount = 0
    let failureCount = 0

    for (const request of pendingRequests) {
      try {
        const headers = deserializeHeaders(request.headers)
        const response = await fetch(request.url, {
          method: request.method,
          headers,
          body: request.body
        })

        if (response.ok) {
          await removePendingRequest(request.id)
          successCount++
          console.log('Successfully synced request:', request.id)
        } else {
          // Update retry count
          const newRetryCount = request.retryCount + 1
          if (newRetryCount >= request.maxRetries) {
            await removePendingRequest(request.id)
            failureCount++
            console.error('Max retries reached for request:', request.id)
          } else {
            await updateRetryCount(request.id, newRetryCount)
            console.log(`Retry ${newRetryCount}/${request.maxRetries} for request:`, request.id)
          }
        }
      } catch (error) {
        const newRetryCount = request.retryCount + 1
        if (newRetryCount >= request.maxRetries) {
          await removePendingRequest(request.id)
          failureCount++
          console.error('Max retries reached for request:', request.id, error)
        } else {
          await updateRetryCount(request.id, newRetryCount)
          console.log(`Retry ${newRetryCount}/${request.maxRetries} for request:`, request.id)
        }
      }
    }

    console.log(`Background sync completed: ${successCount} successful, ${failureCount} failed`)

    // Notify clients about sync completion
    const clients = await self.clients.matchAll()
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_COMPLETE',
        data: { successCount, failureCount, total: pendingRequests.length }
      })
    })

  } catch (error) {
    console.error('Background sync failed:', error)
  }
}

// IndexedDB helpers for background sync
async function getPendingRequests() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('wellnest-sync-db', 1)

    request.onsuccess = () => {
      const db = request.result
      const transaction = db.transaction(['sync-requests'], 'readonly')
      const store = transaction.objectStore('sync-requests')
      const getAllRequest = store.getAll()

      getAllRequest.onsuccess = () => {
        const requests = getAllRequest.result
        // Sort by priority and timestamp
        requests.sort((a, b) => {
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
          return priorityDiff !== 0 ? priorityDiff : a.timestamp - b.timestamp
        })
        resolve(requests)
      }

      getAllRequest.onerror = () => reject(getAllRequest.error)
    }

    request.onerror = () => reject(request.error)
  })
}

async function removePendingRequest(id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('wellnest-sync-db', 1)

    request.onsuccess = () => {
      const db = request.result
      const transaction = db.transaction(['sync-requests'], 'readwrite')
      const store = transaction.objectStore('sync-requests')
      const deleteRequest = store.delete(id)

      deleteRequest.onsuccess = () => resolve()
      deleteRequest.onerror = () => reject(deleteRequest.error)
    }

    request.onerror = () => reject(request.error)
  })
}

async function updateRetryCount(id, retryCount) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('wellnest-sync-db', 1)

    request.onsuccess = () => {
      const db = request.result
      const transaction = db.transaction(['sync-requests'], 'readwrite')
      const store = transaction.objectStore('sync-requests')
      const getRequest = store.get(id)

      getRequest.onsuccess = () => {
        const syncRequest = getRequest.result
        if (syncRequest) {
          syncRequest.retryCount = retryCount
          const updateRequest = store.put(syncRequest)
          updateRequest.onsuccess = () => resolve()
          updateRequest.onerror = () => reject(updateRequest.error)
        } else {
          reject(new Error('Request not found'))
        }
      }

      getRequest.onerror = () => reject(getRequest.error)
    }

    request.onerror = () => reject(request.error)
  })
}

function deserializeHeaders(headers) {
  const result = new Headers()
  Object.entries(headers || {}).forEach(([key, value]) => {
    result.set(key, value)
  })
  return result
}

// Performance monitoring
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: '1.0.0' })
  }
})

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...')
  
  event.waitUntil(
    caches.open(CACHE_NAMES.OFFLINE).then((cache) => {
      return cache.addAll([
        OFFLINE_PAGE,
        OFFLINE_IMAGE,
        '/icons/icon-192x192.png',
        '/manifest.json'
      ])
    })
  )
  
  self.skipWaiting()
})

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...')
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!Object.values(CACHE_NAMES).includes(cacheName)) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  
  self.clients.claim()
})

console.log('WellNest Advanced Service Worker loaded successfully!')
