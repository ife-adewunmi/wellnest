import { StudentReportData } from '@/users/counselors/types'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper functions
export const convertToCSV = (reports: StudentReportData[]): string => {
  if (reports.length === 0) return ''

  const headers = [
    'Student ID',
    'Name',
    'Email',
    'Department',
    'Level',
    'Average Mood',
    'Average Risk Score',
    'Current Risk Level',
    'Risk Trend',
    'Total Screen Time',
    'Average Daily Screen Time',
    'Total Sessions',
    'Completed Sessions',
    'Report Period Start',
    'Report Period End',
    'Generated At',
  ].join(',')

  const rows = reports.map((report) =>
    [
      report.studentId,
      `"${report.name}"`,
      report.email,
      report.department,
      report.level,
      report.avgMood.toFixed(2),
      report.avgRiskScore.toFixed(2),
      report.currentRiskLevel,
      report.riskTrend,
      report.totalScreenTime.toFixed(2),
      report.avgDailyScreenTime.toFixed(2),
      report.totalSessions,
      report.completedSessions,
      report.reportPeriod.start,
      report.reportPeriod.end,
      report.generatedAt,
    ].join(','),
  )

  return [headers, ...rows].join('\n')
}

export const convertToText = (reports: StudentReportData[]): string => {
  return reports
    .map(
      (report) =>
        `Student Report
===============
Name: ${report.name}
Student ID: ${report.studentId}
Email: ${report.email}
Department: ${report.department}
Level: ${report.level}
Gender: ${report.gender}

Metrics:
- Average Mood: ${report.avgMood.toFixed(2)}
- Average Risk Score: ${report.avgRiskScore.toFixed(2)}
- Current Risk Level: ${report.currentRiskLevel}
- Risk Trend: ${report.riskTrend}
- Total Screen Time: ${report.totalScreenTime.toFixed(2)} hours
- Average Daily Screen Time: ${report.avgDailyScreenTime.toFixed(2)} hours
- Total Sessions: ${report.totalSessions}
- Completed Sessions: ${report.completedSessions}

Report Period: ${report.reportPeriod.start} to ${report.reportPeriod.end}
Generated: ${report.generatedAt}

`,
    )
    .join('\n---\n\n')
}

export const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
