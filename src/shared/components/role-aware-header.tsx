'use client'

import React from 'react'
import { User } from '@/features/users/auth/types'
import { UserRole } from '@/features/users/auth/enums/user-role'
import { Header as CounselorHeader } from '@/features/users/counselors/dashboard/sections/header'
import { StudentNavigationHeader } from '@/shared/components/student-navigation-header'

interface RoleAwareHeaderProps {
  user: User
}

export function RoleAwareHeader({ user }: RoleAwareHeaderProps) {
  // Render counselor-specific header for counselors
  if (user.role === UserRole.COUNSELOR) {
    return <CounselorHeader />
  }

  // Render student-specific header for students
  if (user.role === UserRole.STUDENT) {
    return <StudentNavigationHeader user={user} />
  }

  // For other roles, use the counselor header as default
  return <CounselorHeader />
}
