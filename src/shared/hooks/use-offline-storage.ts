'use client'

import { useState, useEffect } from 'react'

interface OfflineData {
  id: string
  type: string
  data: any
  timestamp: string
}

export function useOfflineStorage() {
  const [isOnline, setIsOnline] = useState(true)
  const [pendingSync, setPendingSync] = useState<OfflineData[]>([])

  useEffect(() => {
    // Check online status
    setIsOnline(navigator.onLine)

    const handleOnline = () => {
      setIsOnline(true)
      syncOfflineData()
    }

    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Load pending sync data on mount
    loadPendingSync()

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const storeOfflineData = async (type: string, data: any) => {
    const offlineData: OfflineData = {
      id: crypto.randomUUID(),
      type,
      data,
      timestamp: new Date().toISOString(),
    }

    // Store in IndexedDB
    if ('indexedDB' in window) {
      try {
        const db = await openDB()
        const transaction = db.transaction(['offline_data'], 'readwrite')
        const store = transaction.objectStore('offline_data')
        await store.add(offlineData)
      } catch (error) {
        console.error('Failed to store offline data:', error)
        // Fallback to localStorage
        const existing = JSON.parse(localStorage.getItem('offline_data') || '[]')
        existing.push(offlineData)
        localStorage.setItem('offline_data', JSON.stringify(existing))
      }
    } else {
      // Fallback to localStorage
      const existing = JSON.parse(localStorage.getItem('offline_data') || '[]')
      existing.push(offlineData)
      localStorage.setItem('offline_data', JSON.stringify(existing))
    }

    setPendingSync((prev) => [...prev, offlineData])
  }

  const loadPendingSync = async () => {
    if ('indexedDB' in window) {
      try {
        const db = await openDB()
        const transaction = db.transaction(['offline_data'], 'readonly')
        const store = transaction.objectStore('offline_data')
        const request = store.getAll()
        request.onsuccess = () => {
          setPendingSync(request.result)
        }
        request.onerror = () => {
          console.error('Failed to load offline data from IndexedDB:', request.error)
          const data = JSON.parse(localStorage.getItem('offline_data') || '[]')
          setPendingSync(data)
        }
      } catch (error) {
        console.error('Failed to load offline data:', error)
        // Fallback to localStorage
        const data = JSON.parse(localStorage.getItem('offline_data') || '[]')
        setPendingSync(data)
      }
    } else {
      const data = JSON.parse(localStorage.getItem('offline_data') || '[]')
      setPendingSync(data)
    }
  }

  const syncOfflineData = async () => {
    if (!isOnline || pendingSync.length === 0) return

    for (const item of pendingSync) {
      try {
        if (item.type === 'mood-check-ins') {
          await fetch('/api/mood-check-in', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item.data),
          })
        }
        // Add other sync types as needed

        // Remove from offline storage
        await removeOfflineData(item.id)
      } catch (error) {
        console.error('Failed to sync offline data:', error)
      }
    }

    setPendingSync([])
  }

  const removeOfflineData = async (id: string) => {
    if ('indexedDB' in window) {
      try {
        const db = await openDB()
        const transaction = db.transaction(['offline_data'], 'readwrite')
        const store = transaction.objectStore('offline_data')
        await store.delete(id)
      } catch (error) {
        console.error('Failed to remove offline data:', error)
      }
    } else {
      const existing = JSON.parse(localStorage.getItem('offline_data') || '[]')
      const filtered = existing.filter((item: OfflineData) => item.id !== id)
      localStorage.setItem('offline_data', JSON.stringify(filtered))
    }
  }

  const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('DistressDetectionDB', 1)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)

      request.onupgradeneeded = () => {
        const db = request.result
        if (!db.objectStoreNames.contains('offline_data')) {
          db.createObjectStore('offline_data', { keyPath: 'id' })
        }
      }
    })
  }

  return {
    isOnline,
    pendingSync,
    storeOfflineData,
    syncOfflineData,
  }
}
