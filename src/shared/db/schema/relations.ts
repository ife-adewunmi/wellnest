import { relations } from 'drizzle-orm'
import { usersTable, counselorsTable, studentsTable } from './users'
import { counselorStudentTable } from './counselor-student'
import { moodCheckInsTable } from './mood-checkins'
import {
  screenTimeDataTable,
  screenTimeSessionsTable,
  screenTimeThresholdsTable,
} from './screen-time-monitoring'
import { sessionsTable, counselorNotesTable } from './sessions'
import { messagesTable, notificationsTable, pushSubscriptionsTable } from './communication'

// Users relations
export const usersRelations = relations(usersTable, ({ one, many }) => ({
  counselor: one(counselorsTable, {
    fields: [usersTable.id],
    references: [counselorsTable.userId],
  }),
  student: one(studentsTable, {
    fields: [usersTable.id],
    references: [studentsTable.userId],
  }),
  moodCheckIns: many(moodCheckInsTable),
  screenTimeData: many(screenTimeDataTable),
  //   socialMediaPosts: many(socialMediaPostsTable),
  counselorNotes: many(counselorNotesTable, { relationName: 'counselor' }),
  studentNotes: many(counselorNotesTable, { relationName: 'student' }),
  counselorSessions: many(sessionsTable, { relationName: 'counselor' }),
  studentSessions: many(sessionsTable, { relationName: 'student' }),
  sentmessages: many(messagesTable, { relationName: 'sender' }),
  receivedmessages: many(messagesTable, { relationName: 'receiver' }),
  notifications: many(notificationsTable),
  pushSubscriptions: many(pushSubscriptionsTable),
}))

// Counselor relations
export const counselorsRelations = relations(counselorsTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [counselorsTable.userId],
    references: [usersTable.id],
  }),
  counselorStudent: many(counselorStudentTable),
}))

// Student relations
export const studentsRelations = relations(studentsTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [studentsTable.userId],
    references: [usersTable.id],
  }),
  counselorStudent: many(counselorStudentTable),
}))

// Counselor-Student relations
export const counselorStudentTableRelations = relations(counselorStudentTable, ({ one }) => ({
  counselor: one(counselorsTable, {
    fields: [counselorStudentTable.counselorId],
    references: [counselorsTable.id],
  }),
  student: one(studentsTable, {
    fields: [counselorStudentTable.studentId],
    references: [studentsTable.id],
  }),
}))

// Mood check-ins relations
export const moodCheckInsRelations = relations(moodCheckInsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [moodCheckInsTable.userId],
    references: [usersTable.id],
  }),
}))

// Screen time data relations
export const screenTimeDataRelations = relations(screenTimeDataTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [screenTimeDataTable.userId],
    references: [usersTable.id],
  }),
}))

// Screen time sessions relations
export const screenTimeSessionsRelations = relations(screenTimeSessionsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [screenTimeSessionsTable.userId],
    references: [usersTable.id],
  }),
}))

// Screen time thresholds relations
export const screenTimeThresholdsRelations = relations(screenTimeThresholdsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [screenTimeThresholdsTable.userId],
    references: [usersTable.id],
  }),
}))

// Social media posts relations
// export const socialMediaPostsRelations = relations(socialMediaPostsTable, ({ one }) => ({
//   user: one(usersTable, {
//     fields: [socialMediaPostsTable.userId],
//     references: [usersTable.id],
//   }),
// }))

// Counselor notes relations
export const counselorNotesRelations = relations(counselorNotesTable, ({ one }) => ({
  counselor: one(usersTable, {
    fields: [counselorNotesTable.counselorId],
    references: [usersTable.id],
    relationName: 'counselor',
  }),
  student: one(usersTable, {
    fields: [counselorNotesTable.studentId],
    references: [usersTable.id],
    relationName: 'student',
  }),
}))

// Sessions relations
export const sessionsRelations = relations(sessionsTable, ({ one }) => ({
  counselor: one(usersTable, {
    fields: [sessionsTable.counselorId],
    references: [usersTable.id],
    relationName: 'counselor',
  }),
  student: one(usersTable, {
    fields: [sessionsTable.studentId],
    references: [usersTable.id],
    relationName: 'student',
  }),
}))

// Messages, relations
export const messagesTableRelations = relations(messagesTable, ({ one }) => ({
  sender: one(usersTable, {
    fields: [messagesTable.senderId],
    references: [usersTable.id],
    relationName: 'sender',
  }),
  receiver: one(usersTable, {
    fields: [messagesTable.receiverId],
    references: [usersTable.id],
    relationName: 'receiver',
  }),
}))

// Notifications relations
export const notificationsTableRelations = relations(notificationsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [notificationsTable.userId],
    references: [usersTable.id],
  }),
}))

// Push subscriptions relations
export const pushSubscriptionsTableRelations = relations(pushSubscriptionsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [pushSubscriptionsTable.userId],
    references: [usersTable.id],
  }),
}))
