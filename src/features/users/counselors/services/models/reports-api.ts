import { request } from '@/shared/service/request'
import { Endpoints } from '@/shared/enums/endpoints'
import { isLocal } from '@/shared/enums/environment'
import { MOCK_REPORTS } from '@/users/counselors/common/data'
import { ReportFilters, ReportResult, Reports, StudentReportData } from '@/users/counselors/types'

interface ReportsApiRequests {
  getAvailableStudents: (counselorId: string) => Promise<Reports[]>
  generateReport: (studentId: string, filters: ReportFilters) => Promise<ReportResult>
  generateSummaryReport: (counselorId: string, filters: ReportFilters) => Promise<ReportResult>
}

export class ReportsApi implements ReportsApiRequests {
  /**
   * Fetch reports for a counselor
   */
  public async getAvailableStudents(counselorId: string): Promise<Reports[]> {
    try {
      const data = await request.get(Endpoints.COUNSELORS.API.STUDENTS, undefined, {
        params: { counselorId },
      })

      const students = Array.isArray(data) ? data : [data].filter(Boolean)
      return students.map((student) => ({
        id: student.id,
        name: student.name,
        studentId: student.studentId,
        department: student.department,
        level: student.level,
      })) as Reports[]
    } catch (error) {
      console.error('Failed to fetch reports:', error)
      // Fallback to mock data in local environment when DB fails
      if (isLocal()) {
        console.warn('Using mock reports as fallback in local environment')
        return MOCK_REPORTS
      }
      throw error
    }
  }

  /**
   * Generate a report for a specific student
   */
  public async generateReport(studentId: string, filters: ReportFilters): Promise<ReportResult> {
    try {
      const params = new URLSearchParams({
        action: 'generate',
        studentId,
        startDate: filters.startDate,
        endDate: filters.endDate,
        ...(filters.department && { department: filters.department }),
        ...(filters.level && { level: filters.level }),
      })

      const data = await request.get(`${Endpoints.COUNSELORS.API.REPORTS}?${params.toString()}`)
      return data as ReportResult
    } catch (error) {
      console.error('Failed to generate student report:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate student report',
      }
    }
  }

  /**
   * Generate summary reports for multiple students
   */
  public async generateSummaryReport(
    counselorId: string,
    filters: ReportFilters,
  ): Promise<ReportResult> {
    try {
      const params = new URLSearchParams({
        action: 'summary',
        counselorId,
        startDate: filters.startDate,
        endDate: filters.endDate,
        ...(filters.department && { department: filters.department }),
        ...(filters.level && { level: filters.level }),
        ...(filters.studentId && { studentId: filters.studentId }),
      })

      const data = await request.get(`${Endpoints.COUNSELORS.API.REPORTS}?${params.toString()}`)
      return data as ReportResult
    } catch (error) {
      console.error('Failed to generate summary reports:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate summary reports',
      }
    }
  }
}

export const reportsApi = new ReportsApi()
