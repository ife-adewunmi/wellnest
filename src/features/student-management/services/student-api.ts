import { request } from '@/shared/service/request'

export interface StudentListItem {
  id: string
  name: string
  email: string
  department?: string | null
  studentId?: string | null
  level?: string | null
  avatar?: string | null
  createdAt: string | Date
  latestMood?: string | null
  latestMoodDate?: string | Date | null
  riskScore?: number | null
  totalSessions?: number | null
  upcomingSessions?: number | null
}

class StudentApi {
  list = async (params?: { limit?: number; offset?: number }): Promise<StudentListItem[]> => {
    const query = params ? { ...params } : undefined
    const data = await request.get<StudentListItem[]>('/api/students', { params: query })
    return data as unknown as StudentListItem[]
  }
}

export const studentApi = new StudentApi()
