import { relations } from 'drizzle-orm/relations'
import {
  users,
  counselors,
  students,
  counselorStudent,
  moodCheckIns,
  riskThresholds,
  screenTimeData,
  counselorNotes,
  sessions,
  messages,
  notifications,
  pushSubscriptions,
} from './schema'

export const counselorsRelations = relations(counselors, ({ one, many }) => ({
  user: one(users, {
    fields: [counselors.userId],
    references: [users.id],
  }),
  counselorStudents: many(counselorStudent),
}))

export const usersRelations = relations(users, ({ many }) => ({
  counselors: many(counselors),
  students: many(students),
  moodCheckIns: many(moodCheckIns),
  riskThresholds_counselorId: many(riskThresholds, {
    relationName: 'riskThresholds_counselorId_users_id',
  }),
  riskThresholds_studentId: many(riskThresholds, {
    relationName: 'riskThresholds_studentId_users_id',
  }),
  screenTimeData: many(screenTimeData),
  counselorNotes_counselorId: many(counselorNotes, {
    relationName: 'counselorNotes_counselorId_users_id',
  }),
  counselorNotes_studentId: many(counselorNotes, {
    relationName: 'counselorNotes_studentId_users_id',
  }),
  sessions_counselorId: many(sessions, {
    relationName: 'sessions_counselorId_users_id',
  }),
  sessions_studentId: many(sessions, {
    relationName: 'sessions_studentId_users_id',
  }),
  messages_senderId: many(messages, {
    relationName: 'messages_senderId_users_id',
  }),
  messages_receiverId: many(messages, {
    relationName: 'messages_receiverId_users_id',
  }),
  notifications: many(notifications),
  pushSubscriptions: many(pushSubscriptions),
}))

export const studentsRelations = relations(students, ({ one, many }) => ({
  user: one(users, {
    fields: [students.userId],
    references: [users.id],
  }),
  counselorStudents: many(counselorStudent),
}))

export const counselorStudentRelations = relations(counselorStudent, ({ one }) => ({
  counselor: one(counselors, {
    fields: [counselorStudent.counselorId],
    references: [counselors.id],
  }),
  student: one(students, {
    fields: [counselorStudent.studentId],
    references: [students.id],
  }),
}))

export const moodCheckInsRelations = relations(moodCheckIns, ({ one }) => ({
  user: one(users, {
    fields: [moodCheckIns.userId],
    references: [users.id],
  }),
}))

export const riskThresholdsRelations = relations(riskThresholds, ({ one }) => ({
  user_counselorId: one(users, {
    fields: [riskThresholds.counselorId],
    references: [users.id],
    relationName: 'riskThresholds_counselorId_users_id',
  }),
  user_studentId: one(users, {
    fields: [riskThresholds.studentId],
    references: [users.id],
    relationName: 'riskThresholds_studentId_users_id',
  }),
}))

export const screenTimeDataRelations = relations(screenTimeData, ({ one }) => ({
  user: one(users, {
    fields: [screenTimeData.userId],
    references: [users.id],
  }),
}))

export const counselorNotesRelations = relations(counselorNotes, ({ one }) => ({
  user_counselorId: one(users, {
    fields: [counselorNotes.counselorId],
    references: [users.id],
    relationName: 'counselorNotes_counselorId_users_id',
  }),
  user_studentId: one(users, {
    fields: [counselorNotes.studentId],
    references: [users.id],
    relationName: 'counselorNotes_studentId_users_id',
  }),
}))

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user_counselorId: one(users, {
    fields: [sessions.counselorId],
    references: [users.id],
    relationName: 'sessions_counselorId_users_id',
  }),
  user_studentId: one(users, {
    fields: [sessions.studentId],
    references: [users.id],
    relationName: 'sessions_studentId_users_id',
  }),
}))

export const messagesRelations = relations(messages, ({ one }) => ({
  user_senderId: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: 'messages_senderId_users_id',
  }),
  user_receiverId: one(users, {
    fields: [messages.receiverId],
    references: [users.id],
    relationName: 'messages_receiverId_users_id',
  }),
}))

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}))

export const pushSubscriptionsRelations = relations(pushSubscriptions, ({ one }) => ({
  user: one(users, {
    fields: [pushSubscriptions.userId],
    references: [users.id],
  }),
}))
