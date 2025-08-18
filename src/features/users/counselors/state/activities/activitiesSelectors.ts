import { useActivitiesStore } from './activitiesStore'

// Basic selectors
export const useActivities = () => useActivitiesStore((state) => state.activities)
export const useActivitiesLoading = () => useActivitiesStore((state) => state.isLoading)
export const useActivitiesError = () => useActivitiesStore((state) => state.error)

// Filtered selectors
export const useUpcomingActivities = () =>
  useActivitiesStore((state) => {
    const now = new Date()
    return state.activities.filter(
      (activity) => new Date(activity.scheduledAt) > now && activity.status === 'SCHEDULED',
    )
  })

export const usePastActivities = () =>
  useActivitiesStore((state) => {
    const now = new Date()
    return state.activities.filter((activity) => new Date(activity.scheduledAt) < now)
  })

export const useRecentActivities = (days: number = 7) =>
  useActivitiesStore((state) => {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)
    return state.activities.filter((activity) => new Date(activity.createdAt) > cutoffDate)
  })

export const useActivitiesByStatus = (status: string) =>
  useActivitiesStore((state) => state.activities.filter((activity) => activity.status === status))

export const useActivitiesByType = (type: string) =>
  useActivitiesStore((state) => state.activities.filter((activity) => activity.type === type))

export const useTodayActivities = () =>
  useActivitiesStore((state) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    return state.activities.filter((activity) => {
      const activityDate = new Date(activity.scheduledAt)
      return activityDate >= today && activityDate < tomorrow
    })
  })

// Computed selectors
export const useActivitiesSummary = () =>
  useActivitiesStore((state) => {
    const now = new Date()
    const activities = state.activities

    return {
      total: activities.length,
      upcoming: activities.filter((a) => new Date(a.scheduledAt) > now && a.status === 'SCHEDULED')
        .length,
      completed: activities.filter((a) => a.status === 'COMPLETED').length,
      cancelled: activities.filter((a) => a.status === 'CANCELLED').length,
      inProgress: activities.filter((a) => a.status === 'IN_PROGRESS').length,
    }
  })

export const useActivityStats = () =>
  useActivitiesStore((state) => {
    const activities = state.activities
    const completed = activities.filter((a) => a.status === 'COMPLETED').length
    const total = activities.length

    return {
      completionRate: total > 0 ? (completed / total) * 100 : 0,
      totalHours: activities.reduce((sum, a) => sum + (a.duration || 0), 0) / 60,
      averageDuration:
        total > 0 ? activities.reduce((sum, a) => sum + (a.duration || 0), 0) / total : 0,
    }
  })

// Action selectors
export const useActivitiesActions = () => {
  const store = useActivitiesStore()
  return {
    fetchActivities: store.fetchActivities,
    updateActivity: store.updateActivity,
    setError: store.setError,
    resetStore: store.resetStore,
  }
}

// Data freshness selectors
export const useActivitiesDataStale = () => useActivitiesStore((state) => state.isDataStale())
export const useActivitiesLastFetched = () => useActivitiesStore((state) => state.lastFetched)
