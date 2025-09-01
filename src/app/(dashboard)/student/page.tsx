'use client'

// Role-based access control is now handled by RoleBasedDashboardGuard in the layout
// This page will only render for users with STUDENT role

export default function StudentPage() {
  // The RoleBasedDashboardGuard will automatically render the StudentDashboardPage component
  // for students accessing this route, so we just return a placeholder
  return (
    <div>
      {/* Content will be rendered by RoleBasedDashboardGuard */}
    </div>
  )
}
