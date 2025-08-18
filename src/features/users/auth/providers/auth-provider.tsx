'use client'

import { useEffect } from 'react'
import { useAuthStore } from '../state/authStore'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { initialize, isInitialized } = useAuthStore()

  useEffect(() => {
    // Initialize auth state on mount
    if (!isInitialized) {
      initialize()
    }
  }, [initialize, isInitialized])

  return <>{children}</>
}
