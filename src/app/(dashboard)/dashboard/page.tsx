'use client'

// Role-based access control is now handled by RoleBasedDashboardGuard in the layout
// This page will only render for users with COUNSELOR role

export default function Page() {
  // The RoleBasedDashboardGuard will automatically render the Dashboard component
  // for counselors accessing this route, so we just return a placeholder
  return (
    <div>
      {/* Content will be rendered by RoleBasedDashboardGuard */}
    </div>
  )
}
