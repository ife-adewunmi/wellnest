'use client'

import { useEffect } from 'react'
import { useUserStore } from '@/features/users/state'
import { LoadingSpinner } from '@/shared/components/loading-spinner'
import { ErrorMessage } from '@/shared/components/error-message'
import { Header } from '@/features/users/counselors/dashboard/header'
import { ReportsFilters } from '@/features/users/counselors/manage-reports'
import {
  useReportsActions,
  useReportsGenerating,
  useReportsError,
  useStudentsReports,
} from '@/features/users/counselors/state/reports'
import { ReportFilters } from '@/users/counselors/types'
import { toast } from 'react-toastify'
import { ExportFormat } from '@/users/counselors/types'

interface ExtendedReportFilters extends ReportFilters {
  gender?: string
  exportType?: string
  includeMoodHistory?: boolean
  includeScreenTime?: boolean
  includeDistressScore?: boolean
}

export default function ReportsPage() {
  const { user } = useUserStore()
  const isGenerating = useReportsGenerating()
  const error = useReportsError()
  const studentsReports = useStudentsReports()
  const { generateStudentReport, generateStudentsSummaryReport, clearError, exportReport } =
    useReportsActions()

  useEffect(() => {
    if (error) {
      toast.error(error)
      clearError()
    }
  }, [error, clearError])

  const handleGenerateReport = async (filters: ExtendedReportFilters) => {
    if (!user?.id) return

    try {
      // Create base filters for API
      const baseFilters: ReportFilters = {
        startDate: filters.startDate,
        endDate: filters.endDate,
        studentId: filters.studentId,
        department: filters.department,
        level: filters.level,
      }

      let reports = null

      if (filters.studentId) {
        // Generate report for specific student
        reports = await generateStudentReport(filters.studentId, baseFilters)
        if (reports) {
          reports = [reports] // Convert to array for consistent handling
        }
      } else {
        // Generate summary report for all students matching criteria
        reports = await generateStudentsSummaryReport(user.id, baseFilters)
      }

      if (reports && reports.length > 0) {
        // Apply additional filters
        let filteredReports = reports

        // Apply gender filter if specified
        if (filters.gender) {
          // This would require gender data in the report - for now we'll skip this filter
          // filteredReports = filteredReports.filter(report => report.gender === filters.gender)
        }

        // Filter report components based on checkboxes
        filteredReports = filteredReports.map((report) => ({
          ...report,
          // Only include data for selected components
          moodCheckins: filters.includeMoodHistory ? report.moodCheckins : [],
          screenTimeData: filters.includeScreenTime ? report.screenTimeData : [],
          // Distress score is part of risk assessment, so we keep risk data if distress score is selected
          avgRiskScore: filters.includeDistressScore ? report.avgRiskScore : 0,
          currentRiskLevel: filters.includeDistressScore
            ? report.currentRiskLevel
            : ('LOW' as const),
        }))

        // Export the report based on selected format
        await handleExportReport(filteredReports, filters.exportType || 'xlsx')

        toast.success(`Report generated and exported successfully as ${filters.exportType}`)
      } else {
        toast.warning('No data available for the selected criteria')
      }
    } catch (error) {
      console.error('Report generation error:', error)
      toast.error('Failed to generate report')
    }
  }

  const handleExportReport = async (reports: any[], format: string) => {
    try {
      // This would be implemented in the store/actions
      if (exportReport) {
        await exportReport(reports, format as ExportFormat)
      } else {
        // Fallback - trigger browser download
        const dataStr = JSON.stringify(reports, null, 2)
        const dataBlob = new Blob([dataStr], { type: 'application/json' })
        const url = URL.createObjectURL(dataBlob)
        const link = document.createElement('a')
        link.href = url
        link.download = `reports_${new Date().toISOString().split('T')[0]}${format}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export report')
    }
  }

  const handleRetry = () => {
    clearError()
  }

  if (error && studentsReports.length === 0 && !isGenerating) {
    return (
      <div className="flex flex-col">
        <div className="flex min-h-[400px] flex-col items-center justify-center">
          <ErrorMessage message={error} />
          <button
            onClick={handleRetry}
            className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (isGenerating) {
    return (
      <div className="flex flex-col">
        <div className="flex min-h-[400px] flex-col items-center justify-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Generating and exporting report...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div className="mx-auto mt-[4rem] w-full max-w-[1152px] min-w-[320px] px-4 sm:px-6 lg:min-w-[1024px] lg:px-8 xl:px-0">
        <ReportsFilters onGenerate={handleGenerateReport} isGenerating={isGenerating} />
      </div>
    </div>
  )
}
