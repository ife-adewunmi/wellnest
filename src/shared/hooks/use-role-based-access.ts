import { useMemo } from 'react'
import { UserRole } from '@/features/users/auth/enums/user-role'
import { useUserStore } from '@/features/users/state/userStore'
import { getDefaultDashboard } from '@/shared/lib/role-based-navigation'

/**
 * Simplified custom hook for basic role-based access control
 */
export function useRoleBasedAccess() {
  const { user } = useUserStore()

  // Basic role-based access information
  const accessInfo = useMemo(() => {
    if (!user) {
      return {
        isCounselor: false,
        isStudent: false,
        isAdmin: false,
        userRole: null,
        defaultDashboard: '/signin',
      }
    }

    return {
      isCounselor: user.role === UserRole.COUNSELOR,
      isStudent: user.role === UserRole.STUDENT,
      isAdmin: user.role === UserRole.ADMIN,
      userRole: user.role,
      defaultDashboard: getDefaultDashboard(user.role as UserRole),
    }
  }, [user])

  return {
    // Basic access information
    ...accessInfo,

    // User information
    user,
  }
}
