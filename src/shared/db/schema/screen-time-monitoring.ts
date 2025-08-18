import { pgTable, text, timestamp, integer, boolean, jsonb, uuid } from 'drizzle-orm/pg-core'
import { usersTable } from './users'

// Screen time data table
export const screenTimeDataTable = pgTable('screen_time_data', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => usersTable.id)
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

// Screen time sessions table
export const screenTimeSessionsTable = pgTable('screen_time_sessions', {
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
export const screenTimeThresholdsTable = pgTable('screen_time_thresholds', {
  userId: text('user_id').primaryKey(),
  dailyLimit: integer('daily_limit').notNull().default(120),
  weeklyLimit: integer('weekly_limit').notNull().default(600),
  breakReminder: integer('break_reminder').notNull().default(30),
  enabled: boolean('enabled').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Social media posts table
// export const socialMediaPostsTable = pgTable('social_media_posts', {
//   id: uuid('id').primaryKey().defaultRandom(),
//   userId: uuid('user_id')
//     .references(() => usersTable.id)
//     .notNull(),
//   platform: text('platform').notNull(),
//   postId: text('post_id').notNull(),
//   content: text('content'),
//   sentiment: text('sentiment'),
//   riskFlags: jsonb('risk_flags').$type<string[]>(),
//   mlAnalysis: jsonb('ml_analysis').$type<{
//     sentiment: 'positive' | 'neutral' | 'negative'
//     riskScore: number
//     flags: string[]
//   }>(),
//   postedAt: timestamp('posted_at').notNull(),
//   createdAt: timestamp('created_at').defaultNow(),
// })
