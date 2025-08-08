import { pgTable, text, timestamp, boolean, jsonb, uuid } from 'drizzle-orm/pg-core'
import { notificationTypeEnum, pushSubscriptionStatusEnum } from '@/shared/enums/database'
import { usersTable } from './users'

// Messages table
export const messagesTable = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  senderId: uuid('sender_id')
    .references(() => usersTable.id)
    .notNull(),
  receiverId: uuid('receiver_id')
    .references(() => usersTable.id)
    .notNull(),
  content: text('content').notNull(),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow(),
})

// Notifications table
export const notificationsTable = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => usersTable.id)
    .notNull(),
  type: notificationTypeEnum('type').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  data: jsonb('data'),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow(),
})

// Push Subscriptions table
export const pushSubscriptionsTable = pgTable('push_subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => usersTable.id)
    .notNull(),
  endpoint: text('endpoint').notNull().unique(),
  p256dh: text('p256dh').notNull(),
  auth: text('auth').notNull(),
  status: pushSubscriptionStatusEnum('status').default('ACTIVE'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})
