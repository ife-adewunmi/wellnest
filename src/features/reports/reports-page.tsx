'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/shared/components/ui/card'
import { exportToExcel, exportToCSV, exportToPDF } from './utils/export-utils'
import type {
  ReportFilters as ReportFiltersType,
  ReportOptions as ReportOptionsType,
} from './types/report-types'
import { generateReportData } from './utils/reports-generator'
import { ReportHeader } from './components/report-header'
import { ReportFilters } from './components/reports-filter'
import { ReportOptions } from './components/reports-options'
import { toast } from 'react-toastify'
import { Header } from '@/features/users/counselors/components/header'

export default function Reports() {
  const [filters, setFilters] = useState<ReportFiltersType>({
    department: 'computer-science',
    student: 'oyemakinde-tinubu',
    level: '400',
    gender: 'male',
    startDate: '2025-01-22',
    endDate: '2025-06-30',
    exportType: 'xlsx',
  })

  const [options, setOptions] = useState<ReportOptionsType>({
    moodHistory: true,
    screenTime: true,
    socialMediaUsage: true,
  })

  const [isDownloading, setIsDownloading] = useState(false)

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleOptionChange = (key: string, checked: boolean) => {
    setOptions((prev) => ({ ...prev, [key]: checked }))
  }

  const handleDownload = async () => {
    setIsDownloading(true)

    try {
      // Generate report data
      const reportData = generateReportData(filters, options)

      // Create filename
      const studentName = filters.student.replace('-', '_')
      const timestamp = new Date().toISOString().split('T')[0]
      const filename = `${studentName}_wellbeing_report_${timestamp}`

      // Export based on selected format
      switch (filters.exportType) {
        case 'xlsx':
          await exportToExcel(reportData, `${filename}.xlsx`)
          break
        case 'csv':
          exportToCSV(reportData, `${filename}.csv`)
          break
        case 'pdf':
          exportToPDF(reportData, `${filename}.pdf`)
          break
        default:
          throw new Error('Unsupported export format')
      }

      toast.success(
        `Your ${filters.exportType.toUpperCase()} report has been downloaded successfully.`,
      )
    } catch (error) {
      console.error('Download error:', error)
      toast.error('There was an error generating your report. Please try again.')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="flex flex-col">
      <Header />
      <div className="mt-[4.44vh] flex flex-col items-center justify-center">
        <div className="mx-auto w-full max-w-[1152px] min-w-[320px] px-4 sm:px-6 lg:min-w-[1024px] lg:px-8 xl:px-0">
          <div className="">
            <ReportHeader onDownload={handleDownload} isDownloading={isDownloading} />
            <div className="mt-[3.5rem] flex flex-col gap-[3.5rem]">
              <ReportFilters filters={filters} onFilterChange={handleFilterChange} />
              <ReportOptions options={options} onOptionChange={handleOptionChange} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
