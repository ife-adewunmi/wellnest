'use client'

import type React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
// import { Toaster } from '@/shared/components/ui/toaster'
import { PWAProvider } from '@/shared/components/pwa-provider'
import { AuthProvider } from '@/users/auth/providers/auth-provider'
import { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
        <AuthProvider>
          <PWAProvider>
            {children}
            {/* <Toaster /> */}
          </PWAProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
