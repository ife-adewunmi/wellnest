import type {
  MoodType,
  RiskLevel,
  SessionStatus,
  NotificationType,
  TimePeriod,
  ActivityType,
  MLRiskCategory,
} from '@/shared/types/common.types'

// Defines the structure for mood history chart data
export interface MoodHistoryData {
  date: string
  mood: number | null
  wellbeing: number | null
  count: number
}

// Dashboard metric types (for dashboard display)
export interface Metric {
  id?: string
  title: string
  value: string
  change: string
  positive: boolean
  description?: string
  period?: TimePeriod
  counselorId?: string
  createdAt?: Date | string
  updatedAt?: Date | string
}

// Mood check-in types (based on mood_check_ins table)
export interface MoodCheckIn {
  id: string
  userId: string
  studentId?: string
  studentName?: string
  avatar?: string
  mood: MoodType
  socialMediaImpact?: boolean
  influences?: string[]
  reasons?: string[]
  description?: string
  riskScore?: number
  riskLevel?: RiskLevel
  mlAnalysis?: {
    riskScore: number
    category: MLRiskCategory
    recommendations: string[]
    confidence: number
  }
  emoji?: string // For UI display
  isUrgent?: boolean // Derived from riskLevel
  syncedAt?: Date | string
  createdAt: Date | string
}

// Session/Activity data types (based on sessions table)
export interface ActivityData {
  id: string
  counselorId: string
  studentId: string
  studentName?: string // For display purposes
  title: string
  description?: string
  scheduledAt: Date | string
  duration: number // in minutes
  status: SessionStatus
  notes?: string
  type?: ActivityType // For UI categorization
  createdAt: Date | string
  updatedAt?: Date | string
}

// Notification types (based on notifications table)
export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  data?: any // jsonb field
  isRead: boolean
  studentId?: string | null // For linking to specific student
  createdAt: Date | string
}

// Student table data type
export interface StudentTableData {
  id: string
  studentId: string
  name: string
  lastCheckIn?: Date | string
  riskLevel: RiskLevel
  currentMood?: MoodType
  screenTimeToday?: number // in minutes
  avatar?: string
  department?: string
  level?: string
}

// Dashboard state type
export interface DashboardState {
  metrics: Metric[]
  moodCheckIns: MoodCheckIn[]
  activities: ActivityData[]
  notifications: Notification[]
  students: StudentTableData[]
  isLoading: boolean
  error: string | null
}

// API response types
export interface DashboardDataResponse {
  metrics: Metric[]
  moodCheckIns: MoodCheckIn[]
  moodHistory?: MoodHistoryData[]
  activities?: ActivityData[]
  recentActivities?: ActivityData[]
  notifications: Notification[]
  students?: StudentTableData[]
  summary?: {
    totalStudents: number
    atRiskCount: number
    avgMoodScore: number
    totalScreenTime: number // cumulative hours
    sessionsToday: number
    pendingReports?: number
    upcomingSessions?: number
  }
  lastUpdated?: string
}

export interface ApiResponse<T> {
  data: T
  message?: string
  error?: string
  status: number
}
