import * as XLSX from 'xlsx'
import { StudentReportData } from '@/users/counselors/types'

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF
  }
}

export async function exportToExcel(
  data: StudentReportData | StudentReportData[],
  filename: string,
) {
  const reports = Array.isArray(data) ? data : [data]

  if (reports.length === 0) {
    throw new Error('No report data provided')
  }

  const workbook = XLSX.utils.book_new()

  // Create a summary sheet with all students
  const summaryData = [
    ['Students Report Summary'],
    [''],
    [
      'Student Name',
      'Student ID',
      'Department',
      'Level',
      'Gender',
      'Avg Mood',
      'Avg Risk Score',
      'Current Risk Level',
      'Risk Trend',
      'Total Screen Time',
      'Total Sessions',
    ],
    ...reports.map((report) => [
      report.name || 'Unknown',
      report.studentId || 'N/A',
      report.department || 'N/A',
      report.level || 'N/A',
      report.gender || 'N/A',
      (report.avgMood ?? 0).toFixed(2),
      (report.avgRiskScore ?? 0).toFixed(2),
      report.currentRiskLevel || 'LOW',
      report.riskTrend || 'STABLE',
      (report.totalScreenTime ?? 0).toFixed(2),
      report.totalSessions ?? 0,
    ]),
  ]
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary')

  // For single report, add detailed sheets
  if (reports.length === 1) {
    const report = reports[0]

    // Mood History sheet
    if (report.moodCheckins && report.moodCheckins.length > 0) {
      const moodData = [
        ['Date', 'Mood', 'Risk Score', 'Description'],
        ...report.moodCheckins.map((entry) => [
          entry.date || 'N/A',
          entry.mood || 'Unknown',
          entry.riskScore ?? 0,
          entry.description || '',
        ]),
      ]
      const moodSheet = XLSX.utils.aoa_to_sheet(moodData)
      XLSX.utils.book_append_sheet(workbook, moodSheet, 'Mood History')
    }

    // Screen Time sheet
    if (report.screenTimeData && report.screenTimeData.length > 0) {
      const screenTimeData = [
        ['Date', 'Total Hours', 'Social Media Hours'],
        ...report.screenTimeData.map((entry) => [
          entry.date || 'N/A',
          (entry.totalHours ?? 0).toFixed(2),
          (entry.socialMediaHours ?? 0).toFixed(2),
        ]),
      ]
      const screenTimeSheet = XLSX.utils.aoa_to_sheet(screenTimeData)
      XLSX.utils.book_append_sheet(workbook, screenTimeSheet, 'Screen Time')
    }

    // Sessions sheet
    if (report.sessions && report.sessions.length > 0) {
      const sessionsData = [
        ['Date', 'Title', 'Duration (minutes)', 'Status', 'Notes'],
        ...report.sessions.map((session) => [
          session.date || 'N/A',
          session.title || 'N/A',
          session.duration ?? 0,
          session.status || 'SCHEDULED',
          session.notes || '',
        ]),
      ]
      const sessionsSheet = XLSX.utils.aoa_to_sheet(sessionsData)
      XLSX.utils.book_append_sheet(workbook, sessionsSheet, 'Sessions')
    }
  }

  XLSX.writeFile(workbook, filename)
}

export function exportToCSV(data: StudentReportData | StudentReportData[], filename: string) {
  const reports = Array.isArray(data) ? data : [data]

  if (reports.length === 0) {
    throw new Error('No report data provided')
  }

  let csvContent = ''

  // If multiple reports, create a summary CSV
  if (reports.length > 1) {
    csvContent += 'Students Report Summary\n\n'
    csvContent +=
      'Student Name,Student ID,Department,Level,Gender,Avg Mood,Avg Risk Score,Current Risk Level,Risk Trend,Total Screen Time,Total Sessions\n'

    reports.forEach((report) => {
      csvContent += `"${report.name || 'Unknown'}",${report.studentId || 'N/A'},${report.department || 'N/A'},${report.level || 'N/A'},${report.gender || 'N/A'},${(report.avgMood ?? 0).toFixed(2)},${(report.avgRiskScore ?? 0).toFixed(2)},${report.currentRiskLevel || 'LOW'},${report.riskTrend || 'STABLE'},${(report.totalScreenTime ?? 0).toFixed(2)},${report.totalSessions ?? 0}\n`
    })
  } else {
    // Single report detailed CSV
    const report = reports[0]
    csvContent += 'Student Report\n\n'
    csvContent += `Student Name,${report.name || 'Unknown'}\n`
    csvContent += `Student ID,${report.studentId || 'N/A'}\n`
    csvContent += `Department,${report.department || 'N/A'}\n`
    csvContent += `Level,${report.level || 'N/A'}\n`
    csvContent += `Gender,${report.gender || 'N/A'}\n`
    csvContent += `Report Period,${report.reportPeriod?.start || 'N/A'} to ${report.reportPeriod?.end || 'N/A'}\n\n`

    if (report.moodCheckins && report.moodCheckins.length > 0) {
      csvContent += 'Mood History\n'
      csvContent += 'Date,Mood,Risk Score,Description\n'
      report.moodCheckins.forEach((entry) => {
        csvContent += `${entry.date || 'N/A'},${entry.mood || 'Unknown'},${entry.riskScore ?? 0},"${entry.description || ''}"\n`
      })
      csvContent += '\n'
    }

    if (report.screenTimeData && report.screenTimeData.length > 0) {
      csvContent += 'Screen Time\n'
      csvContent += 'Date,Total Hours,Social Media Hours\n'
      report.screenTimeData.forEach((entry) => {
        csvContent += `${entry.date || 'N/A'},${(entry.totalHours ?? 0).toFixed(2)},${(entry.socialMediaHours ?? 0).toFixed(2)}\n`
      })
      csvContent += '\n'
    }

    if (report.sessions && report.sessions.length > 0) {
      csvContent += 'Sessions\n'
      csvContent += 'Date,Title,Duration (minutes),Status,Notes\n'
      report.sessions.forEach((session) => {
        csvContent += `${session.date || 'N/A'},"${session.title || 'N/A'}",${session.duration ?? 0},${session.status || 'SCHEDULED'},"${session.notes || ''}"\n`
      })
    }
  }

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export async function exportToPDF(data: StudentReportData | StudentReportData[], filename: string) {
  try {
    // For now, let's create a simpler PDF without tables to avoid import issues
    // Import jsPDF
    const jsPDF = (await import('jspdf')).default

    const reports = Array.isArray(data) ? data : [data]

    if (reports.length === 0) {
      throw new Error('No report data provided')
    }

    const doc = new jsPDF()

    if (reports.length > 1) {
      // Multiple reports summary
      doc.setFontSize(20)
      doc.text('Students Well-being Reports Summary', 20, 20)

      let yPosition = 50
      doc.setFontSize(12)

      reports.forEach((report, index) => {
        if (yPosition > 270) {
          doc.addPage()
          yPosition = 20
        }

        doc.text(
          `${index + 1}. ${report.name || 'Unknown'} (${report.studentId || 'N/A'})`,
          20,
          yPosition,
        )
        yPosition += 10
        doc.text(
          `   Department: ${report.department || 'N/A'}, Level: ${report.level || 'N/A'}`,
          20,
          yPosition,
        )
        yPosition += 10
        doc.text(
          `   Avg Mood: ${(report.avgMood ?? 0).toFixed(1)}, Risk Level: ${report.currentRiskLevel || 'LOW'}`,
          20,
          yPosition,
        )
        yPosition += 15
      })
    } else {
      // Single detailed report
      const report = reports[0]

      // Title
      doc.setFontSize(20)
      doc.text('Student Well-being Report', 20, 20)

      // Summary information
      doc.setFontSize(12)
      doc.text(`Student: ${report.name || 'Unknown'}`, 20, 40)
      doc.text(`Student ID: ${report.studentId || 'N/A'}`, 20, 50)
      doc.text(`Department: ${report.department || 'N/A'}`, 20, 60)
      doc.text(`Level: ${report.level || 'N/A'}`, 20, 70)
      doc.text(`Gender: ${report.gender || 'N/A'}`, 20, 80)
      doc.text(
        `Period: ${report.reportPeriod?.start || 'N/A'} to ${report.reportPeriod?.end || 'N/A'}`,
        20,
        90,
      )

      // Metrics
      doc.text(`Average Mood: ${(report.avgMood ?? 0).toFixed(2)}`, 20, 110)
      doc.text(`Average Risk Score: ${(report.avgRiskScore ?? 0).toFixed(2)}`, 20, 120)
      doc.text(`Current Risk Level: ${report.currentRiskLevel || 'LOW'}`, 20, 130)
      doc.text(`Risk Trend: ${report.riskTrend || 'STABLE'}`, 20, 140)
      doc.text(`Total Screen Time: ${(report.totalScreenTime ?? 0).toFixed(2)} hours`, 20, 150)
      doc.text(`Total Sessions: ${report.totalSessions ?? 0}`, 20, 160)
      doc.text(`Completed Sessions: ${report.completedSessions ?? 0}`, 20, 170)

      let yPosition = 190

      // Mood History (simplified)
      if (report.moodCheckins && report.moodCheckins.length > 0) {
        doc.setFontSize(14)
        doc.text('Recent Mood Check-ins:', 20, yPosition)
        yPosition += 15
        doc.setFontSize(10)

        report.moodCheckins.slice(0, 8).forEach((entry) => {
          if (yPosition > 270) {
            doc.addPage()
            yPosition = 20
          }
          doc.text(
            `${entry.date || 'N/A'}: ${entry.mood || 'Unknown'} (Risk: ${entry.riskScore ?? 0})`,
            25,
            yPosition,
          )
          yPosition += 10
        })
      }
    }

    doc.save(filename)
  } catch (error) {
    console.error('PDF export error:', error)
    throw new Error('Failed to generate PDF report')
  }
}
