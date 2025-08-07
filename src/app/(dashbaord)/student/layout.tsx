import type React from 'react'
import { getSession } from '@/features/auth/lib/auth.server'
import { redirect } from 'next/navigation'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar-context'
import { SidebarInset } from '@/components/ui/sidebar'
import { OfflineIndicator } from '@/components/offline-indicator'
import { cookies } from 'next/headers'
import { Header } from '@/components/header'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()

  if (!session) {
    redirect('/signin')
  }

  const cookieStore = cookies()
  const defaultOpen = (await cookieStore).get('sidebar:state')?.value === 'true'

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar user={session.user} />
      <SidebarInset>
        <Header user={session.user} />
        <main className="flex-1 p-6">{children}</main>
        <OfflineIndicator />
      </SidebarInset>
    </SidebarProvider>
  )
}
