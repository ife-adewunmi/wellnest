'use client'

import { useRouter } from 'next/navigation'
import Dashboard from '@/features/dashboard/components/dashboard'
import React, { useEffect } from 'react'
import { UserRole } from '@/features/users/auth/enums'
import { navigateTo } from '@/shared/store/navigation'
import { useUserStore } from '@/features/users/state'

export default function Page() {
  const router = useRouter()
  const { user } = useUserStore()

  useEffect(() => {
    if (!user) return
    if (user.role !== UserRole.COUNSELOR) {
      navigateTo(router, '/student')
    }
  }, [user, router])

  return (
    <div>
      <Dashboard />
    </div>
  )
}
