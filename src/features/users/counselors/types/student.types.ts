import { StudentTableData } from './dashboard.types'

export interface StudentListItem extends StudentTableData {
  id: string
  email: string
  createdAt: string | Date
  latestMood?: string | null
  latestMoodDate?: string | Date | null
  riskScore?: number | null
  totalSessions?: number | null
  upcomingSessions?: number | null
}

export interface StudentDetail extends StudentListItem {
  firstName: string
  lastName: string
  phoneNumber?: string | null
  dateOfBirth?: string | Date | null
  gender?: string | null
  faculty?: string | null
  admissionYear?: string | null
  graduationYear?: string | null
  nationality?: string | null
  stateOfOrigin?: string | null
  homeAddress?: string | null
  emergencyContact?: {
    name: string
    relationship: string
    phone: string
    email?: string
  } | null
  medicalInfo?: any | null
  academicInfo?: {
    gpa?: number
    academicStanding?: string
    currentCourses?: string[]
  } | null
  moodDescription?: string | null
  hasActiveCounselor?: boolean
  counselorId?: string | null
}

export interface StudentFilters {
  department?: string
  level?: string
  riskLevel?: string
  hasActiveCounselor?: boolean
  limit?: number
  offset?: number
}
