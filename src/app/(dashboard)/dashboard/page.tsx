'use client'

import { useRouter } from 'next/navigation'
import DashboardComponent from '@/users/counselors/dashboard/dashboard-component'
import React, { useEffect } from 'react'
import { UserRole } from '@/users/auth/enums'
import { navigateTo } from '@/shared/state/navigation'
import { useUserStore } from '@/users/state/index'
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
      <DashboardComponent />
    </div>
  )
}
