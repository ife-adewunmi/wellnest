import { UserRole } from '@/features/users/auth/enums/user-role'
import { Endpoints } from '@/shared/enums/endpoints'

/**
 * Get the default dashboard route for a user role
 */
export function getDefaultDashboard(role: UserRole): string {
  switch (role) {
    case UserRole.COUNSELOR:
      return Endpoints.COUNSELORS.DASHBOARD
    case UserRole.STUDENT:
      return Endpoints.STUDENTS.DASHBOARD
    case UserRole.ADMIN:
      return Endpoints.COUNSELORS.DASHBOARD // Default to counselor dashboard for admin
    default:
      return Endpoints.AUTH_PAGE.SIGNIN
  }
}
