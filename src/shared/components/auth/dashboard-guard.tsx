'use client'

import React, { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { User } from '@/features/users/auth/types'
import { UserRole } from '@/features/users/auth/enums/user-role'
import { Endpoints } from '@/shared/enums/endpoints'
import { navigateTo } from '@/shared/state/navigation'
import Dashboard from '@/features/users/counselors/dashboard/dashboard'
import StudentDashboard from '@/features/users/students/dashboard/dashboard'

interface DashboardGuardProps {
  user: User
  children: React.ReactNode
}

const DashboardGuard: React.FC<DashboardGuardProps> = ({ user, children }) => {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!user) return

    // Redirect based on role and attempted path
    if (
      user.role === UserRole.COUNSELOR &&
      (pathname.startsWith('/student/') || pathname === Endpoints.STUDENTS.DASHBOARD)
    ) {
      navigateTo(router, Endpoints.COUNSELORS.DASHBOARD, { replace: true })
      return
    }

    if (
      user.role === UserRole.STUDENT &&
      [
        Endpoints.COUNSELORS.DASHBOARD,
        Endpoints.COUNSELORS.MANAGE_STUDENT,
        Endpoints.COUNSELORS.REPORTS,
        Endpoints.COUNSELORS.INTERVENTION,
      ].includes(pathname as any)
    ) {
      navigateTo(router, Endpoints.STUDENTS.DASHBOARD, { replace: true })
      return
    }
  }, [pathname, user, router])

  // Render appropriate dashboard component for main routes
  if (pathname === '/dashboard' && user.role === UserRole.COUNSELOR) {
    return <Dashboard />
  }

  if (pathname === '/student' && user.role === UserRole.STUDENT) {
    return <StudentDashboard />
  }

  // For all other routes, render children (normal page content)
  return <>{children}</>
}

export default DashboardGuard
