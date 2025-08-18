import { pgTable, text, timestamp, uuid, boolean } from 'drizzle-orm/pg-core'
import { usersTable } from './users'

export const authSessionsTable = pgTable('auth_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => usersTable.id, { onDelete: 'cascade' })
    .notNull(),
  sessionToken: text('session_token').notNull().unique(),
  deviceInfo: text('device_info'), // User agent, device fingerprint, etc.
  ipAddress: text('ip_address'),
  isActive: boolean('is_active').default(true),
  lastActiveAt: timestamp('last_active_at').defaultNow(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})
