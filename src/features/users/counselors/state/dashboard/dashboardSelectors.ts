import { useStudentsStore } from '../students'
import { useDashboardStore } from './dashboardStore'
import { RiskLevel } from '@/shared/types/common.types'

// Time constants for cache invalidation (in milliseconds)
const CACHE_DURATION = {
  METRICS: 5 * 60 * 1000, // 5 minutes
  MOOD_CHECKINS: 2 * 60 * 1000, // 2 minutes
  ACTIVITIES: 5 * 60 * 1000, // 5 minutes
  NOTIFICATIONS: 1 * 60 * 1000, // 1 minute
  STUDENTS: 5 * 60 * 1000, // 5 minutes
  DASHBOARD: 5 * 60 * 1000, // 5 minutes
}

// Selectors for metrics
export const useMetrics = () => useDashboardStore((state) => state.metrics)

export const useMetricByTitle = (title: string) =>
  useDashboardStore((state) => state.metrics.find((metric) => metric.title === title))

export const useTotalStudentsMetric = () =>
  useDashboardStore((state) => state.metrics.find((metric) => metric.title === 'Total Students'))

export const useAtRiskCountMetric = () =>
  useDashboardStore((state) => state.metrics.find((metric) => metric.title === 'At-Risk Count'))

// Selectors for mood check-ins
export const useMoodCheckIns = () => useDashboardStore((state) => state.moodCheckIns)

export const useRecentMoodCheckIns = (limit: number = 5) =>
  useDashboardStore((state) => state.moodCheckIns.slice(0, limit))

export const useUrgentMoodCheckIns = () =>
  useDashboardStore((state) =>
    state.moodCheckIns.filter((checkIn) => checkIn.riskScore && checkIn.riskScore >= 7),
  )

// Selectors for activities
export const useActivities = () => useDashboardStore((state) => state.activities)

export const useUpcomingActivities = () =>
  useDashboardStore((state) => {
    const now = new Date()
    return state.activities.filter(
      (activity) => new Date(activity.scheduledAt) > now && activity.status === 'SCHEDULED',
    )
  })

export const useRecentActivities = (days: number = 7) =>
  useDashboardStore((state) => {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)
    return state.activities.filter((activity) => new Date(activity.createdAt) > cutoffDate)
  })

// Selectors for notifications
export const useNotifications = () => useDashboardStore((state) => state.notifications)

export const useUnreadNotifications = () =>
  useDashboardStore((state) => state.notifications.filter((notification) => !notification.isRead))

export const useUnreadNotificationCount = () =>
  useDashboardStore(
    (state) => state.notifications.filter((notification) => !notification.isRead).length,
  )

// Selectors for students
export const useStudents = () => useDashboardStore((state) => state.students)

export const useStudentById = (studentId: string) =>
  useDashboardStore((state) => state.students.find((student) => student.id === studentId))

export const useStudentsByRiskLevel = (riskLevel: RiskLevel) =>
  useDashboardStore((state) => state.students.filter((student) => student.riskLevel === riskLevel))

export const useAtRiskStudents = () =>
  useDashboardStore((state) =>
    state.students.filter(
      (student) => student.riskLevel === 'HIGH' || student.riskLevel === 'CRITICAL',
    ),
  )

export const useStudentCount = () => useDashboardStore((state) => state.students.length)

// Selectors for loading and error states
export const useIsLoading = () => useDashboardStore((state) => state.isLoading)

export const useError = () => useDashboardStore((state) => state.error)

// Selectors for data freshness
export const useLastFetched = () => useDashboardStore((state) => state.lastFetched)

export const useIsDataStale = (dataType?: keyof typeof CACHE_DURATION) => {
  return useDashboardStore((state) => {
    const lastFetched = dataType
      ? state.lastFetchedByType[dataType.toLowerCase() as keyof typeof state.lastFetchedByType]
      : state.lastFetched

    if (!lastFetched) return true

    const cacheTime = dataType ? CACHE_DURATION[dataType] : CACHE_DURATION.DASHBOARD
    const now = Date.now()
    const lastFetchedTime =
      typeof lastFetched === 'string' ? new Date(lastFetched).getTime() : lastFetched.getTime()

    return now - lastFetchedTime > cacheTime
  })
}

// Composite selectors
export const useDashboardSummary = () =>
  useDashboardStore((state) => ({
    totalStudents: state.students.length,
    atRiskCount: state.students.filter((s) => s.riskLevel === 'HIGH' || s.riskLevel === 'CRITICAL')
      .length,
    unreadNotifications: state.notifications.filter((n) => !n.isRead).length,
    recentMoodCheckIns: state.moodCheckIns.slice(0, 5),
    upcomingActivities: state.activities.filter(
      (a) => new Date(a.scheduledAt) > new Date() && a.status === 'SCHEDULED',
    ).length,
  }))

// Selector for checking if we have any data
export const useHasData = () =>
  useDashboardStore(
    (state) =>
      state.metrics.length > 0 || state.students.length > 0 || state.moodCheckIns.length > 0,
  )

// Selector for getting students with additional computed properties
export const useEnrichedStudents = () =>
  useDashboardStore((state) =>
    state.students.map((student) => {
      const recentMoodCheckIn = state.moodCheckIns.find((checkIn) => checkIn.userId === student.id)

      return {
        ...student,
        hasRecentCheckIn: !!recentMoodCheckIn,
        lastMoodEmoji: recentMoodCheckIn?.emoji,
        needsAttention: student.riskLevel === 'HIGH' || student.riskLevel === 'CRITICAL',
        screenTimeExceeded: (student.screenTimeToday || 0) > 240, // 4 hours
      }
    }),
  )

// Actions selectors (for convenience)
export const useDashboardActions = () => {
  const store = useDashboardStore()
  return {
    fetchDashboardData: store.fetchDashboardData,
    resetStore: store.resetStore,
  }
}

// Smart fetch selector - only fetches if data is stale
export const useSmartFetch = () => {
  const store = useDashboardStore()
  const studentStore = useStudentsStore()
  const isStale = useIsDataStale()

  return {
    fetchDashboardDataIfNeeded: async (counselorId: string, force = false) => {
      if (force || isStale) {
        await store.fetchDashboardData(counselorId)
      }
    },
    fetchStudentsIfNeeded: async (counselorId: string, force = false) => {
      const isStudentsStale = useIsDataStale('STUDENTS')
      if (force || isStudentsStale) {
        await studentStore.fetchStudents(counselorId)
      }
    },
  }
}
