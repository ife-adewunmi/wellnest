export * from '@/shared/enums/database'

// Export all table definitions
export {
  usersTable as users,
  counselorsTable as counselors,
  studentsTable as students,
} from './users'
export { counselorStudentTable as counselorStudent } from './counselor-student'
export {
  moodCheckInsTable as moodCheckIns,
  riskThresholdsTable as riskThresholds,
} from './mood-checkins'
export {
  screenTimeDataTable as screenTimeData,
  screenTimeSessionsTable as screenTimeSessions,
  screenTimeThresholdsTable as screenTimeThresholds,
} from './screen-time-monitoring'
export { sessionsTable as sessions, counselorNotesTable as counselorNotes } from './sessions'
export {
  messagesTable as messages,
  notificationsTable as notifications,
  pushSubscriptionsTable as pushSubscriptions,
} from './communication'

// Export all relations
export * from './relations'
