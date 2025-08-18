import { Endpoints } from '@/shared/enums/endpoints'
import { request } from '@/shared/service/request'
import type { StudentTableData } from '@/users/counselors/types/dashboard.types'
import { isLocalEnvironment } from '@/shared/enums/environment'
import { StudentDetail, StudentListItem } from '../../types/student.types'

interface StudentsApiRequests {
  getStudents: (counselorId: string) => Promise<StudentTableData[]>
  list: (params?: { limit?: number; offset?: number }) => Promise<StudentListItem[]>
  getStudentById: (id: string) => Promise<StudentDetail | null>
  updateStudent: (id: string, updates: Partial<StudentDetail>) => Promise<StudentDetail>
  searchStudents: (query: string, counselorId?: string) => Promise<StudentListItem[]>
}

class StudentsApi implements StudentsApiRequests {
  /**
   * Fetch students for a counselor
   */
  public getStudents = async (counselorId: string): Promise<StudentTableData[]> => {
    try {
      const response = await request.get(Endpoints.COUNSELORS.API.DASHBOARD, undefined, {
        params: { counselorId },
      })
      return response.data?.students || []
    } catch (error) {
      console.error('Failed to fetch students:', error)
      // Fallback to mock data in local environment when DB fails
      if (isLocalEnvironment()) {
        console.warn('Using mock students as fallback in local environment')
        // Generate mock student data
        return [
          {
            id: '1',
            studentId: 'CSC/20/19283',
            name: 'Ife Adewunmi',
            lastCheckIn: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            riskLevel: 'MEDIUM',
            currentMood: 'STRESSED',
            screenTimeToday: 240,
            avatar: '/avatars/student1.jpg',
          },
          {
            id: '2',
            studentId: 'BOT/21/7547',
            name: 'Tunde Balogun',
            lastCheckIn: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            riskLevel: 'LOW',
            currentMood: 'HAPPY',
            screenTimeToday: 180,
            avatar: '/avatars/student2.jpg',
          },
          {
            id: '3',
            studentId: 'MCB/25/17293',
            name: 'Bisi Ojo',
            lastCheckIn: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
            riskLevel: 'HIGH',
            currentMood: 'ANXIOUS',
            screenTimeToday: 420,
            avatar: '/avatars/student3.jpg',
          },
          {
            id: '4',
            studentId: 'STA/19/2560',
            name: 'Emeka Nwosu',
            lastCheckIn: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
            riskLevel: 'LOW',
            currentMood: 'NEUTRAL',
            screenTimeToday: 120,
            avatar: '/avatars/student4.jpg',
          },
          {
            id: '5',
            studentId: 'CSC/23/6844',
            name: 'Zara Ahmed',
            lastCheckIn: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            riskLevel: 'CRITICAL',
            currentMood: 'VERY_SAD',
            screenTimeToday: 480,
            avatar: '/avatars/student5.jpg',
          },
        ]
      }
      throw error
    }
  }

  list = async (params?: { limit?: number; offset?: number }): Promise<StudentListItem[]> => {
    const query = params ? { ...params } : undefined
    const data = await request.get('/api/students', undefined, { params: query })
    return data as StudentListItem[]
  }

  getStudentById = async (id: string): Promise<StudentDetail | null> => {
    try {
      const data = await request.get(Endpoints.COUNSELORS.API.STUDENT_PROFILE(id))
      return data as StudentDetail
    } catch (error) {
      console.error('Error fetching student by ID:', error)
      return null
    }
  }

  updateStudent = async (id: string, updates: Partial<StudentDetail>): Promise<StudentDetail> => {
    try {
      const data = await request.put(Endpoints.COUNSELORS.API.STUDENT_PROFILE(id), updates)
      return data as StudentDetail
    } catch (error) {
      console.error('Error updating student:', error)
      throw new Error('Failed to update student')
    }
  }

  searchStudents = async (query: string, counselorId?: string): Promise<StudentListItem[]> => {
    try {
      const params: any = { q: query }
      if (counselorId) params.counselorId = counselorId

      const data = await request.get('/api/students/search', undefined, { params })
      return data || []
    } catch (error) {
      console.error('Error searching students:', error)
      throw new Error('Failed to search students')
    }
  }
}

export const studentsApi = new StudentsApi()
