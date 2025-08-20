'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { StudentDashboard } from '@/features/students/components/student-dashboard'
import { UserRole } from '@/features/users/auth/enums/user-role'
import { useUserStore } from '@/users/state'
import { navigateTo } from '@/shared/state/navigation'
import { Endpoints } from '@/shared/enums/endpoints'

export default function StudentPage() {
  const router = useRouter()
  const { user } = useUserStore()

  useEffect(() => {
    if (!user) return
    if (user.role !== UserRole.STUDENT) {
      navigateTo(router, Endpoints.COUNSELORS.DASHBOARD, { replace: true })
    }
  }, [user, router])

  if (!user) return null
  if (user.role !== UserRole.STUDENT) return null

  return <StudentDashboard user={user} />
}
