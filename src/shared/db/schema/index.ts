// src/shared/db/schema/index.ts
import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
  jsonb,
  uuid,
  pgEnum,
  serial,
  varchar,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Enums
export const userRoleEnum = pgEnum('user_role', ['STUDENT', 'COUNSELOR'])
export const moodTypeEnum = pgEnum('mood_type', ['HAPPY', 'GOOD', 'NEUTRAL', 'BAD', 'STRESSED'])
export const riskLevelEnum = pgEnum('risk_level', ['LOW', 'MEDIUM', 'HIGH'])
export const sessionStatusEnum = pgEnum('session_status', [
  'SCHEDULED',
  'COMPLETED',
  'CANCELLED',
  'PENDING',
])
export const notificationTypeEnum = pgEnum('notification_type', [
  'MOOD_CHANGE',
  'SESSION_REMINDER',
  'CHECK_IN_REMINDER',
  'FLAGGED_POST',
  'SCREEN_TIME_RISK',
  'SYSTEM_UPDATE',
])
export const pushSubscriptionStatusEnum = pgEnum('push_subscription_status', ['ACTIVE', 'INACTIVE'])

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  role: userRoleEnum('role').notNull().default('STUDENT'),
  avatar: text('avatar'),
  department: text('department'),
  studentId: text('student_id'),
  level: text('level'),
  gender: text('gender'),
  phoneNumber: text('phone_number'),
  password: text('password').notNull(),
  emergencyContact: text('emergency_contact'),
  consentScreenTime: boolean('consent_screen_time').default(false),
  consentSocialMedia: boolean('consent_social_media').default(false),
  // Authentication enhancement fields
  emailVerified: boolean('email_verified').default(false),
  emailVerificationToken: text('email_verification_token'),
  passwordResetToken: text('password_reset_token'),
  passwordResetExpires: timestamp('password_reset_expires'),
  lastLoginAt: timestamp('last_login_at'),
  isActive: boolean('is_active').default(true),
  settings: jsonb('settings').$type<{
    notifications: {
      moodDrop: boolean
      riskLevelChange: boolean
      missedCheckIn: boolean
      pushNotification: boolean
      emailNotification: boolean
      smsNotification: boolean
    }
    dashboard: {
      moodTracker: boolean
      screenTimeTracker: boolean
      socialMediaActivity: boolean
      notificationWidget: boolean
      upcomingSessions: boolean
      studentTable: boolean
    }
  }>(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Mood check-ins table
export const moodCheckIns = pgTable('mood_check_ins', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id)
    .notNull(),
  mood: moodTypeEnum('mood').notNull(),
  reasons: jsonb('reasons').$type<string[]>(),
  description: text('description'),
  riskScore: integer('risk_score'),
  riskLevel: riskLevelEnum('risk_level'),
  mlAnalysis: jsonb('ml_analysis').$type<{
    riskScore: number
    category: 'low' | 'moderate' | 'high'
    recommendations: string[]
    confidence: number
  }>(),
  syncedAt: timestamp('synced_at'),
  createdAt: timestamp('created_at').defaultNow(),
})

// Screen time data table
export const screenTimeData = pgTable('screen_time_data', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id)
    .notNull(),
  date: timestamp('date').notNull(),
  totalMinutes: integer('total_minutes').notNull(),
  nightTimeMinutes: integer('night_time_minutes').notNull(), // 12AM-3AM
  appUsage: jsonb('app_usage').$type<
    {
      appName: string
      minutes: number
      category: string
    }[]
  >(),
  createdAt: timestamp('created_at').defaultNow(),
})

// Social media posts table
export const socialMediaPosts = pgTable('social_media_posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id)
    .notNull(),
  platform: text('platform').notNull(),
  postId: text('post_id').notNull(),
  content: text('content'),
  sentiment: text('sentiment'),
  riskFlags: jsonb('risk_flags').$type<string[]>(),
  mlAnalysis: jsonb('ml_analysis').$type<{
    sentiment: 'positive' | 'neutral' | 'negative'
    riskScore: number
    flags: string[]
  }>(),
  postedAt: timestamp('posted_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

// Counselor notes table
export const counselorNotes = pgTable('counselor_notes', {
  id: uuid('id').primaryKey().defaultRandom(),
  counselorId: uuid('counselor_id')
    .references(() => users.id)
    .notNull(),
  studentId: uuid('student_id')
    .references(() => users.id)
    .notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  tags: jsonb('tags').$type<string[]>(),
  isPrivate: boolean('is_private').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Sessions table
export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  counselorId: uuid('counselor_id')
    .references(() => users.id)
    .notNull(),
  studentId: uuid('student_id')
    .references(() => users.id)
    .notNull(),
  title: text('title').notNull(),
  description: text('description'),
  scheduledAt: timestamp('scheduled_at').notNull(),
  duration: integer('duration').notNull(), // in minutes
  status: sessionStatusEnum('status').default('SCHEDULED'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Messages table
export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  senderId: uuid('sender_id')
    .references(() => users.id)
    .notNull(),
  receiverId: uuid('receiver_id')
    .references(() => users.id)
    .notNull(),
  content: text('content').notNull(),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow(),
})

// Notifications table
export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id)
    .notNull(),
  type: notificationTypeEnum('type').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  data: jsonb('data'),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow(),
})

// Push Subscriptions table
export const pushSubscriptions = pgTable('push_subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id)
    .notNull(),
  endpoint: text('endpoint').notNull().unique(),
  p256dh: text('p256dh').notNull(),
  auth: text('auth').notNull(),
  status: pushSubscriptionStatusEnum('status').default('ACTIVE'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Risk thresholds table
export const riskThresholds = pgTable('risk_thresholds', {
  id: uuid('id').primaryKey().defaultRandom(),
  counselorId: uuid('counselor_id')
    .references(() => users.id)
    .notNull(),
  studentId: uuid('student_id').references(() => users.id),
  moodThreshold: integer('mood_threshold').default(3),
  screenTimeThreshold: integer('screen_time_threshold').default(180), // minutes
  nightTimeThreshold: integer('night_time_threshold').default(60), // minutes
  socialMediaRiskThreshold: integer('social_media_risk_threshold').default(70),
  isGlobal: boolean('is_global').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  moodCheckIns: many(moodCheckIns),
  screenTimeData: many(screenTimeData),
  socialMediaPosts: many(socialMediaPosts),
  counselorNotes: many(counselorNotes, { relationName: 'counselor' }),
  studentNotes: many(counselorNotes, { relationName: 'student' }),
  counselorSessions: many(sessions, { relationName: 'counselor' }),
  studentSessions: many(sessions, { relationName: 'student' }),
  sentMessages: many(messages, { relationName: 'sender' }),
  receivedMessages: many(messages, { relationName: 'receiver' }),
  notifications: many(notifications),
  pushSubscriptions: many(pushSubscriptions),
}))

export const moodCheckInsRelations = relations(moodCheckIns, ({ one }) => ({
  user: one(users, {
    fields: [moodCheckIns.userId],
    references: [users.id],
  }),
}))

export const screenTimeDataRelations = relations(screenTimeData, ({ one }) => ({
  user: one(users, {
    fields: [screenTimeData.userId],
    references: [users.id],
  }),
}))

export const socialMediaPostsRelations = relations(socialMediaPosts, ({ one }) => ({
  user: one(users, {
    fields: [socialMediaPosts.userId],
    references: [users.id],
  }),
}))

export const counselorNotesRelations = relations(counselorNotes, ({ one }) => ({
  counselor: one(users, {
    fields: [counselorNotes.counselorId],
    references: [users.id],
    relationName: 'counselor',
  }),
  student: one(users, {
    fields: [counselorNotes.studentId],
    references: [users.id],
    relationName: 'student',
  }),
}))

export const sessionsRelations = relations(sessions, ({ one }) => ({
  counselor: one(users, {
    fields: [sessions.counselorId],
    references: [users.id],
    relationName: 'counselor',
  }),
  student: one(users, {
    fields: [sessions.studentId],
    references: [users.id],
    relationName: 'student',
  }),
}))

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: 'sender',
  }),
  receiver: one(users, {
    fields: [messages.receiverId],
    references: [users.id],
    relationName: 'receiver',
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

// Screen time sessions table
export const screenTimeSessions = pgTable('screen_time_sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time'),
  duration: integer('duration').notNull().default(0),
  isActive: boolean('is_active').default(true),
  url: text('url').notNull(),
  userAgent: text('user_agent').notNull(),
  deviceType: text('device_type').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Screen time thresholds table
export const screenTimeThresholds = pgTable('screen_time_thresholds', {
  userId: text('user_id').primaryKey(),
  dailyLimit: integer('daily_limit').notNull().default(120),
  weeklyLimit: integer('weekly_limit').notNull().default(600),
  breakReminder: integer('break_reminder').notNull().default(30),
  enabled: boolean('enabled').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const screenTimeSessionsRelations = relations(screenTimeSessions, ({ one }) => ({
  user: one(users, {
    fields: [screenTimeSessions.userId],
    references: [users.id],
  }),
}))

export const screenTimeThresholdsRelations = relations(screenTimeThresholds, ({ one }) => ({
  user: one(users, {
    fields: [screenTimeThresholds.userId],
    references: [users.id],
  }),
}))
