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
      report.studentId || 'N/A',
      `"${report.name || 'Unknown'}"`,
      report.email || 'N/A',
      report.department || 'N/A',
      report.level || 'N/A',
      (report.avgMood ?? 0).toFixed(2),
      (report.avgRiskScore ?? 0).toFixed(2),
      report.currentRiskLevel || 'LOW',
      report.riskTrend || 'STABLE',
      (report.totalScreenTime ?? 0).toFixed(2),
      (report.avgDailyScreenTime ?? 0).toFixed(2),
      report.totalSessions ?? 0,
      report.completedSessions ?? 0,
      report.reportPeriod?.start || 'N/A',
      report.reportPeriod?.end || 'N/A',
      report.generatedAt || new Date().toISOString(),
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
Name: ${report.name || 'Unknown'}
Student ID: ${report.studentId || 'N/A'}
Email: ${report.email || 'N/A'}
Department: ${report.department || 'N/A'}
Level: ${report.level || 'N/A'}
Gender: ${report.gender || 'N/A'}

Metrics:
- Average Mood: ${(report.avgMood ?? 0).toFixed(2)}
- Average Risk Score: ${(report.avgRiskScore ?? 0).toFixed(2)}
- Current Risk Level: ${report.currentRiskLevel || 'LOW'}
- Risk Trend: ${report.riskTrend || 'STABLE'}
- Total Screen Time: ${(report.totalScreenTime ?? 0).toFixed(2)} hours
- Average Daily Screen Time: ${(report.avgDailyScreenTime ?? 0).toFixed(2)} hours
- Total Sessions: ${report.totalSessions ?? 0}
- Completed Sessions: ${report.completedSessions ?? 0}

Report Period: ${report.reportPeriod?.start || 'N/A'} to ${report.reportPeriod?.end || 'N/A'}
Generated: ${report.generatedAt || new Date().toISOString()}

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
