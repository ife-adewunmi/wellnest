export interface ReportFilters {
  department: string
  student: string
  level: string
  gender: string
  startDate: string
  endDate: string
  exportType: string
}

export interface ReportOptions {
  moodHistory: boolean
  screenTime: boolean
  socialMediaUsage: boolean
}

export interface StudentReportData {
    id?: string
  report?: string
  studentId: string
  student: string
  startDate?: string
  endDate?: string
  exportType?: string
  studentName?: string
  department: string
  level?: string
  gender?: string
  dateRange: {
    start: string
    end: string
  }
  moodHistory?: MoodEntry[]
  screenTime?: ScreenTimeEntry[]
  socialMediaUsage?: SocialMediaEntry[]
}

export interface MoodEntry {
  date: string
  mood: "excellent" | "good" | "neutral" | "poor" | "very-poor"
  notes?: string
}

export interface ScreenTimeEntry {
  date: string
  totalHours: number
  categories: {
    social: number
    entertainment: number
    productivity: number
    education: number
  }
}

export interface SocialMediaEntry {
  date: string
  platform: string
  timeSpent: number
  interactions: number
}
