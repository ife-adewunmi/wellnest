'use client'

import React, { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { User } from '@/features/users/auth/types'
import { UserRole } from '@/features/users/auth/enums/user-role'
import { Endpoints } from '@/shared/enums/endpoints'
import { navigateTo } from '@/shared/state/navigation'
import Dashboard from '@/features/users/counselors/dashboard/dashboard'
import StudentDashboardPage from '@/features/users/students/dashboard/dashboard'

interface RoleBasedDashboardGuardProps {
  user: User
  children: React.ReactNode
}

const RoleBasedDashboardGuard: React.FC<RoleBasedDashboardGuardProps> = ({
  user,
  children,
}) => {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!user) return

    // Counselor trying to access student route
    if (pathname === '/student' && user.role !== UserRole.STUDENT) {
      navigateTo(router, Endpoints.COUNSELORS.DASHBOARD, { replace: true })
      return
    }

    if (pathname === '/dashboard' && user.role !== UserRole.COUNSELOR) {
      navigateTo(router, Endpoints.STUDENTS.DASHBOARD, { replace: true })
      return
    }

    if (user.role === UserRole.STUDENT && ['/students', '/reports', '/intervention'].includes(pathname)) {
      navigateTo(router, Endpoints.STUDENTS.DASHBOARD, { replace: true })
      return
    }

    // Counselor trying to access student-only routes
    if (user.role === UserRole.COUNSELOR && pathname.startsWith('/student/')) {
      navigateTo(router, Endpoints.COUNSELORS.DASHBOARD, { replace: true })
      return
    }
  }, [pathname, user, router])

  // Render appropriate dashboard component for main routes
  if (pathname === '/dashboard' && user.role === UserRole.COUNSELOR) {
    return <Dashboard />
  }

  if (pathname === '/student' && user.role === UserRole.STUDENT) {
    return <StudentDashboardPage />
  }

  // For all other routes, render children (normal page content)
  return <>{children}</>
}

export default RoleBasedDashboardGuard
