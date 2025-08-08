import { pgTable, text, timestamp, integer, boolean, jsonb, uuid } from 'drizzle-orm/pg-core'
import { sessionStatusEnum } from '@/shared/enums/database'
import { usersTable } from './users'

// Sessions table
export const sessionsTable = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  counselorId: uuid('counselor_id')
    .references(() => usersTable.id)
    .notNull(),
  studentId: uuid('student_id')
    .references(() => usersTable.id)
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

// Counselor notes table
export const counselorNotesTable = pgTable('counselor_notes', {
  id: uuid('id').primaryKey().defaultRandom(),
  counselorId: uuid('counselor_id')
    .references(() => usersTable.id)
    .notNull(),
  studentId: uuid('student_id')
    .references(() => usersTable.id)
    .notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  tags: jsonb('tags').$type<string[]>(),
  isPrivate: boolean('is_private').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})
