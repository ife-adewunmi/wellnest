'use client'

import type React from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AppSidebar } from '@/shared/components/app-sidebar'
import { SidebarProvider } from '@/shared/components/ui/sidebar-context'
import { SidebarInset } from '@/shared/components/ui/sidebar'
import { OfflineIndicator } from '@/shared/components/offline-indicator'
import { Header } from '@/shared/components/header'
import { useUserStore } from '@/features/users/state'
import { useAuthStore } from '@/features/users/auth/state/authStore'
import { navigateToAuth } from '@/shared/state/navigation'
import { useSessionStore } from '@/features/users/auth/state/sessionStore'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user } = useUserStore()
  const { isAuthenticated, isInitialized } = useAuthStore()

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      navigateToAuth(router, '/signin')
    }
  }, [isInitialized, isAuthenticated, router])

  // Also check session validity
  useEffect(() => {
    const sessionStore = useSessionStore.getState()
    if (sessionStore.shouldRedirectToAuth()) {
      navigateToAuth(router, '/signin')
    }
  }, [])

  if (!user) {
    return null
  }

  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar user={user} />
      <SidebarInset>
        <Header user={user} />
        <main className="flex-1 p-6">{children}</main>
        <OfflineIndicator />
      </SidebarInset>
    </SidebarProvider>
  )
}
