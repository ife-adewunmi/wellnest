'use client'

import { useRouter } from 'next/navigation'
import Dashboard from '@/features/users/counselors/dashboard/dashboard'
import React, { useEffect } from 'react'
import { UserRole } from '@/features/users/auth/enums/index'
import { navigateTo } from '@/shared/state/navigation'
import { useUserStore } from '@/features/users/state/index'
import { Endpoints } from '@/shared/enums/endpoints'

export default function Page() {
  const router = useRouter()
  const { user } = useUserStore()

  useEffect(() => {
    if (!user) return
    if (user.role !== UserRole.COUNSELOR) {
      navigateTo(router, Endpoints.STUDENTS.DASHBOARD, { replace: true })
    }
  }, [user, router])

  return (
    <div>
      <Dashboard />
    </div>
  )
}
