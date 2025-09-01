import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { reportsApi } from '@/users/counselors/services/models'
import { ExportFormat, ReportFilters, StudentReportData } from '@/users/counselors/types'
import { ActionTypes } from '../actionTypes'
import { convertToCSV, convertToText, downloadFile } from '@/shared/lib/utils'

export interface ReportsState {
  // Data
  availableStudents: Array<{
    id: string
    name: string
    studentId: string
    department: string
    level: string
  }>
  studentReport: StudentReportData | null
  studentsReports: StudentReportData[]
  isLoading: boolean
  isGenerating: boolean
  error: string | null
  lastFetched: Date | null

  // Actions
  fetchAvailableStudents: (counselorId: string) => Promise<void>
  generateStudentReport: (
    studentId: string,
    filters: ReportFilters,
  ) => Promise<StudentReportData | null>
  generateStudentsSummaryReport: (
    counselorId: string,
    filters: ReportFilters,
  ) => Promise<StudentReportData[] | null>
  exportReport: (reports: StudentReportData[], format: ExportFormat) => Promise<void>
  clearError: () => void
  reset: () => void
}

const initialState = {
  availableStudents: [],
  studentReport: null,
  studentsReports: [],
  isLoading: false,
  isGenerating: false,
  error: null,
  lastFetched: null,
}

export const useReportsStore = create<ReportsState>()(
  devtools(
    (set) => ({
      ...initialState,

      fetchAvailableStudents: async (counselorId: string) => {
        set({ isLoading: true, error: null })
        try {
          const students = await reportsApi.getAvailableStudents(counselorId)
          set({
            availableStudents: students,
            isLoading: false,
            lastFetched: new Date(),
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch available students',
            isLoading: false,
          })
        }
      },

      generateStudentReport: async (studentId: string, filters: ReportFilters) => {
        set({ isGenerating: true, error: null })
        try {
          const result = await reportsApi.generateReport(studentId, filters)
          if (result && result.data) {
            const report = result.data as StudentReportData
            set({
              studentReport: report,
              isGenerating: false,
            })
            return report
          } else {
            set({
              error: result?.error || 'Failed to generate student report',
              isGenerating: false,
            })
            return null
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to generate student report',
            isGenerating: false,
          })
          return null
        }
      },

      generateStudentsSummaryReport: async (counselorId: string, filters: ReportFilters) => {
        set({ isGenerating: true, error: null })
        try {
          const result = await reportsApi.generateSummaryReport(counselorId, filters)
          if (result && Array.isArray(result)) {
            set({
              studentsReports: result,
              isGenerating: false,
            })
            return result
          } else if (result && (result as any).data) {
            const reports = Array.isArray((result as any).data)
              ? (result as any).data
              : [(result as any).data]
            set({
              studentsReports: reports,
              isGenerating: false,
            })
            return reports
          } else {
            set({
              error: 'Failed to generate summary report',
              isGenerating: false,
            })
            return null
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to generate summary report',
            isGenerating: false,
          })
          return null
        }
      },

      exportReport: async (reports: StudentReportData[], format: 'csv' | 'pdf' | 'xlsx') => {
        try {
          const timestamp = new Date().toISOString().split('T')[0]
          const filename = `student-reports-${timestamp}.${format}`

          if (format === 'csv') {
            // Convert to CSV
            const csvContent = convertToCSV(reports)
            downloadFile(csvContent, filename, 'text/csv')
          } else if (format === 'xlsx') {
            // For Excel format, we'll use a simplified approach
            // In a real implementation, you'd use a library like xlsx or similar
            const csvContent = convertToCSV(reports)
            downloadFile(csvContent, `student-reports-${timestamp}.csv`, 'text/csv')
          } else if (format === 'pdf') {
            // For PDF, you'd typically use a library like jsPDF or similar
            // For now, we'll create a simple text-based PDF content
            const textContent = convertToText(reports)
            downloadFile(textContent, `student-reports-${timestamp}.txt`, 'text/plain')
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to export report',
          })
        }
      },

      clearError: () => set({ error: null }),

      reset: () => set(initialState),
    }),
    {
      name: ActionTypes.REPORTS,
    },
  ),
)
