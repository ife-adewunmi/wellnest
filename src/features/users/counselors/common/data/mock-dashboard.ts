import type { DashboardDataResponse } from '@/users/counselors/types/dashboard.types'
import { MOCK_METRICS } from './mock-metrics'
import { MOCK_MOOD_CHECKINS } from './mock-mood-checkin'
import { MOCK_ACTIVITIES } from './mock-activities'
import { MOCK_NOTIFICATIONS } from './mock-notifications'
import { MOCK_STUDENTS } from './mock-students'

export const MOCK_DASHBOARD_DATA: DashboardDataResponse = {
  metrics: MOCK_METRICS,
  moodCheckIns: MOCK_MOOD_CHECKINS,
  activities: MOCK_ACTIVITIES,
  notifications: MOCK_NOTIFICATIONS,
  students: MOCK_STUDENTS,
  summary: {
    totalStudents: 25,
    atRiskCount: 8,
    avgMoodScore: 6.5,
    totalScreenTime: 5.2, // cumulative hours
    sessionsToday: 12,
    pendingReports: 3,
    upcomingSessions: 5,
  },
  lastUpdated: new Date().toISOString(),
}
