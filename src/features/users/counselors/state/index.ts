// Export the feature-specific stores
export * from './metrics'
export * from './notifications'
export * from './mood'
export * from './activities'
export * from './students'

// Legacy exports for backward compatibility (to be deprecated)
export * from './dashboard/dashboardStore'

// Re-export types for convenience
export type {
  DashboardState,
  Metric,
  MoodCheckIn,
  ActivityData,
  Notification,
  StudentTableData,
} from '@/users/counselors/types/dashboard.types'
