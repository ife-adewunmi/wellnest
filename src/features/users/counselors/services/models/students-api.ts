import { Endpoints } from '@/shared/enums/endpoints'
import { request } from '@/shared/service/request'
import type { StudentDetail, /*StudentListItem,*/ StudentTableData } from '@/users/counselors/types'
import { isLocal } from '@/shared/enums/environment'
import { MOCK_STUDENTS } from '../../common/data'

interface StudentsApiRequests {
  getStudents: (counselorId: string) => Promise<StudentTableData[]>
  // list: (params?: { limit?: number; offset?: number }) => Promise<StudentListItem[]>
  getStudentById: (id: string) => Promise<StudentDetail | null>
  updateStudent: (id: string, updates: Partial<StudentDetail>) => Promise<StudentDetail>
  // searchStudents: (query: string, counselorId?: string) => Promise<StudentListItem[]>
}

class StudentsApi implements StudentsApiRequests {
  /**
   * Fetch students for a counselor
   */
  public getStudents = async (counselorId: string): Promise<StudentTableData[]> => {
    try {
      const response = await request.get(Endpoints.COUNSELORS.API.STUDENTS, undefined, {
        params: { counselorId },
      })
      // return response.data?.students || []
      return response as Array<StudentTableData>
    } catch (error) {
      console.error('Failed to fetch students:', error)
      // Fallback to mock data in local environment when DB fails
      if (isLocal()) {
        console.warn('Using mock students as fallback in local environment')
        // Generate mock student data
        return MOCK_STUDENTS
      }
      throw error
    }
  }

  // list = async (params?: { limit?: number; offset?: number }): Promise<StudentListItem[]> => {
  //   const query = params ? { ...params } : undefined
  //   const data = await request.get('/api/students', undefined, { params: query })
  //   return data as StudentListItem[]
  // }

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

  // searchStudents = async (query: string, counselorId?: string): Promise<StudentListItem[]> => {
  //   try {
  //     const params: any = { q: query }
  //     if (counselorId) params.counselorId = counselorId

  //     const data = await request.get('/api/students/search', undefined, { params })
  //     return data || []
  //   } catch (error) {
  //     console.error('Error searching students:', error)
  //     throw new Error('Failed to search students')
  //   }
  // }
}

export const studentsApi = new StudentsApi()
