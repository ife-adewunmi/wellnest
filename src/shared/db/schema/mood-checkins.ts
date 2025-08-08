import { pgTable, text, timestamp, integer, boolean, jsonb, uuid } from 'drizzle-orm/pg-core'
import { moodTypeEnum, riskLevelEnum } from '@/shared/enums/database'
import { usersTable } from './users'

// Mood check-ins table
export const moodCheckInsTable = pgTable('mood_check_ins', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => usersTable.id)
    .notNull(),
  mood: moodTypeEnum('mood').notNull(),
  socialMediaImpact: boolean('social_media_impact').default(false),
  influences: jsonb('influences').$type<string[]>().default([]),
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

// Risk thresholds table
export const riskThresholdsTable = pgTable('risk_thresholds', {
  id: uuid('id').primaryKey().defaultRandom(),
  counselorId: uuid('counselor_id')
    .references(() => usersTable.id)
    .notNull(),
  studentId: uuid('student_id').references(() => usersTable.id),
  moodThreshold: integer('mood_threshold').default(3),
  screenTimeThreshold: integer('screen_time_threshold').default(180), // minutes
  nightTimeThreshold: integer('night_time_threshold').default(60), // minutes
  socialMediaRiskThreshold: integer('social_media_risk_threshold').default(70),
  isGlobal: boolean('is_global').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})
