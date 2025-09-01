import { RiskLevel, RiskTrend } from '@/shared/types/common.types'

// Defines the structure for mood history chart data
export interface Reports {
  id: string
  name: string
  studentId: string
  department: string
  level: string
}

export interface StudentReportData {
  id: string
  name: string
  email: string
  studentId: string
  department: string
  level: string
  gender: string | null

  // Mood data
  moodCheckins: Array<{
    date: string
    mood: string
    riskScore: number
    description?: string
  }>
  avgMood: number
  avgRiskScore: number

  // Screen time data
  screenTimeData: Array<{
    date: string
    totalHours: number
    socialMediaHours: number
  }>
  avgDailyScreenTime: number
  totalScreenTime: number

  // Session data
  sessions: Array<{
    date: string
    title: string
    duration: number
    status: string
    notes?: string
  }>
  totalSessions: number
  completedSessions: number

  // Risk assessment
  currentRiskLevel: RiskLevel
  riskTrend: RiskTrend

  // Summary
  reportPeriod: { start: string; end: string }
  generatedAt: string
}

export interface ReportResult {
  success: boolean
  data?: StudentReportData | StudentReportData[]
  error?: string
  details?: string
}

export interface ReportFilters {
  studentId?: string
  department?: string
  level?: string
  startDate: string
  endDate: string
}

export type ExportFormat = 'csv' | 'pdf' | 'xlsx' | '.txt'
