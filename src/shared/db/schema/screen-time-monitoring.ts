import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
  jsonb,
  uuid,
  decimal,
  date,
} from 'drizzle-orm/pg-core'
import { usersTable } from './users'

// Enhanced screen time data table aligned with ML model payload
export const screenTimeDataTable = pgTable('screen_time_data', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => usersTable.id)
    .notNull(),
  date: date('date').notNull(), // Date only for daily aggregation

  // Core ML model fields
  socialMediaUsageHours: decimal('social_media_usage_hours', { precision: 5, scale: 2 })
    .notNull()
    .default('0.00'), // Social Media Usage (hours/day)
  screenTimeBeforeSleepHours: decimal('screen_time_before_sleep_hours', { precision: 5, scale: 2 })
    .notNull()
    .default('0.00'), // Screen Time Before Sleep (hours)
  totalScreenTimeHours: decimal('total_screen_time_hours', { precision: 5, scale: 2 })
    .notNull()
    .default('0.00'), // Total daily screen time
  sleepToScreenRatio: decimal('sleep_to_screen_ratio', { precision: 5, scale: 2 }).default('1.00'), // sleep_to_screen_ratio
  notificationsPerDay: integer('notifications_per_day').default(0), // Number of Notifications (per day)

  // Detailed app usage breakdown
  appUsage: jsonb('app_usage').$type<
    {
      appName: string
      packageName: string
      durationSeconds: number
      category: 'Social' | 'Entertainment' | 'Productivity' | 'Communication' | 'Other'
      lastUsed: number
    }[]
  >(),

  // Additional tracking data
  focusAppsUsed: boolean('focus_apps_used').default(false), // Uses Focus Apps
  dominantEmotion: text('dominant_emotion').default('Neutral'), // Dominant Daily Emotion

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
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
