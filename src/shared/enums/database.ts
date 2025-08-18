import { pgEnum } from 'drizzle-orm/pg-core'

// User and Role enums
export const userRoleEnum = pgEnum('user_role', ['STUDENT', 'COUNSELOR', 'ADMIN'])

// Student-related enums
export const genderEnum = pgEnum('gender', ['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'])
export const levelEnum = pgEnum('level', ['100', '200', '300', '400', '500', 'MASTERS', 'PHD'])

// Assignment-related enums
export const assignmentStatusEnum = pgEnum('assignment_status', [
  'ACTIVE',
  'INACTIVE',
  'TRANSFERRED',
  'COMPLETED',
])

// Mood-related enums
export const moodTypeEnum = pgEnum('mood_type', [
  'HAPPY',
  'NEUTRAL',
  'SAD',
  'VERY_SAD',
  'ANXIOUS',
  'STRESSED',
])

export const riskLevelEnum = pgEnum('risk_level', ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])

// Session-related enums
export const sessionStatusEnum = pgEnum('session_status', [
  'SCHEDULED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
  'NO_SHOW',
  'RESCHEDULED',
])

export const sessionTypeEnum = pgEnum('session_type', [
  'INDIVIDUAL',
  'GROUP',
  'CRISIS',
  'FOLLOW_UP',
  'INTAKE',
  'EMERGENCY',
])

// Notification-related enums
export const notificationTypeEnum = pgEnum('notification_type', [
  'MOOD_CHANGE',
  'SESSION_REMINDER',
  'CHECK_IN_REMINDER',
  'FLAGGED_POST',
  'SCREEN_TIME_RISK',
  'SYSTEM_UPDATE',
  'NEW_ASSIGNMENT',
  'CRISIS_ALERT',
])

export const pushSubscriptionStatusEnum = pgEnum('push_subscription_status', ['ACTIVE', 'INACTIVE'])
