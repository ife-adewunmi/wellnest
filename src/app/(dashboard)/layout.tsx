'use client'

import type React from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AppSidebar } from '@/shared/components/app-sidebar'
import { SidebarProvider } from '@/shared/components/ui/sidebar-context'
import { SidebarInset } from '@/shared/components/ui/sidebar'
import { OfflineIndicator } from '@/shared/components/offline-indicator'
import { RoleAwareHeader } from '@/shared/components/role-aware-header'
import { useUserStore } from '@/features/users/state/userStore'
import { useAuthStore } from '@/features/users/auth/state/authStore'
import { navigateToAuth } from '@/shared/state/navigation'
import { useSessionStore } from '@/features/users/auth/state/sessionStore'
import { RoleBasedDashboardGuard } from '@/shared/components/auth'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user } = useUserStore()
  const { isAuthenticated, isInitialized } = useAuthStore()

  // Authentication checks
  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      navigateToAuth(router, '/signin')
    }
  }, [isInitialized, isAuthenticated, router])

  // Session validity check
  useEffect(() => {
    const sessionStore = useSessionStore.getState()
    if (sessionStore.shouldRedirectToAuth()) {
      navigateToAuth(router, '/signin')
    }
  }, [router])

  // Don't render anything if user is not available
  if (!user) {
    return null
  }

  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar user={user} />
      <SidebarInset>
        <RoleAwareHeader user={user} />
        <main className="flex-1 p-6">
          <RoleBasedDashboardGuard user={user}>
            {children}
          </RoleBasedDashboardGuard>
        </main>
        <OfflineIndicator />
      </SidebarInset>
    </SidebarProvider>
  )
}