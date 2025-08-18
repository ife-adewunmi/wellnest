/**
 * Common types used across the application to maintain consistency
 * and avoid repetition. These types should match the database enums.
 */

// Mood types matching mood_type_enum in database
export type MoodType = 'HAPPY' | 'NEUTRAL' | 'SAD' | 'VERY_SAD' | 'ANXIOUS' | 'STRESSED'

// Risk level types matching risk_level_enum in database
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

// Session status types matching session_status_enum in database
export type SessionStatus =
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW'
  | 'RESCHEDULED'

// Session types matching session_type_enum in database
export type SessionType = 'INDIVIDUAL' | 'GROUP' | 'CRISIS' | 'FOLLOW_UP' | 'INTAKE' | 'EMERGENCY'

// Notification types matching notification_type_enum in database
export type NotificationType =
  | 'MOOD_CHANGE'
  | 'SESSION_REMINDER'
  | 'CHECK_IN_REMINDER'
  | 'FLAGGED_POST'
  | 'SCREEN_TIME_RISK'
  | 'SYSTEM_UPDATE'
  | 'NEW_ASSIGNMENT'
  | 'CRISIS_ALERT'

// User role types matching user_role_enum in database
export type UserRole = 'STUDENT' | 'COUNSELOR' | 'ADMIN'

// Gender types matching gender_enum in database
export type Gender = 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY'

// Academic level types matching level_enum in database
export type AcademicLevel = '100' | '200' | '300' | '400' | '500' | 'MASTERS' | 'PHD'

// Assignment status types matching assignment_status_enum in database
export type AssignmentStatus = 'ACTIVE' | 'INACTIVE' | 'TRANSFERRED' | 'COMPLETED'

// Push subscription status types
export type PushSubscriptionStatus = 'ACTIVE' | 'INACTIVE'

// ML Analysis categories (lowercase convention for ML outputs)
export type MLRiskCategory = 'low' | 'moderate' | 'high'

// Time period types for metrics and analytics
export type TimePeriod = 'daily' | 'weekly' | 'monthly' | 'yearly'

// Activity types for UI categorization
export type ActivityType = 'session' | 'assessment' | 'intervention' | 'group'

// Helper type guards
export const isMoodType = (value: any): value is MoodType => {
  return ['HAPPY', 'NEUTRAL', 'SAD', 'VERY_SAD', 'ANXIOUS', 'STRESSED'].includes(value)
}

export const isRiskLevel = (value: any): value is RiskLevel => {
  return ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].includes(value)
}

export const isSessionStatus = (value: any): value is SessionStatus => {
  return ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW', 'RESCHEDULED'].includes(
    value,
  )
}

// Utility functions for type conversions
export const getMoodEmoji = (mood: MoodType): string => {
  const moodEmojis: Record<MoodType, string> = {
    HAPPY: '😊',
    NEUTRAL: '😐',
    SAD: '😔',
    VERY_SAD: '😢',
    ANXIOUS: '😰',
    STRESSED: '😩',
  }
  return moodEmojis[mood] || '😐'
}

export const getRiskLevelColor = (level: RiskLevel): string => {
  const colors: Record<RiskLevel, string> = {
    LOW: 'green',
    MEDIUM: 'yellow',
    HIGH: 'orange',
    CRITICAL: 'red',
  }
  return colors[level] || 'gray'
}

export const getRiskLevelBadgeClass = (level: RiskLevel): string => {
  const classes: Record<RiskLevel, string> = {
    LOW: 'bg-green-100 text-green-800',
    MEDIUM: 'bg-yellow-100 text-yellow-800',
    HIGH: 'bg-orange-100 text-orange-800',
    CRITICAL: 'bg-red-100 text-red-800',
  }
  return classes[level] || 'bg-gray-100 text-gray-800'
}

export const getSessionStatusBadgeClass = (status: SessionStatus): string => {
  const classes: Record<SessionStatus, string> = {
    SCHEDULED: 'bg-blue-100 text-blue-800',
    IN_PROGRESS: 'bg-indigo-100 text-indigo-800',
    COMPLETED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
    NO_SHOW: 'bg-orange-100 text-orange-800',
    RESCHEDULED: 'bg-yellow-100 text-yellow-800',
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}
