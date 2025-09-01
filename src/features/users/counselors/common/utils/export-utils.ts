import * as XLSX from 'xlsx'
import { StudentReportData } from '@/users/counselors/types'

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF
  }
}

export async function exportToExcel(data: StudentReportData, filename: string) {
  const workbook = XLSX.utils.book_new()

  // Summary sheet
  const summaryData = [
    ['Student Report Summary'],
    [''],
    ['Student Name', data.name],
    ['Department', data.department],
    ['Level', data.level],
    ['Gender', data.gender],
    ['Report Period', `${data.reportPeriod.start} to ${data.reportPeriod.end}`],
    [''],
  ]

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary')

  // Mood History sheet
  if (data.moodCheckins) {
    const moodData = [
      ['Date', 'Mood', 'Score'],
      ...data.moodCheckins.map((entry) => [entry.date, entry.mood, entry.riskScore || '']),
    ]
    const moodSheet = XLSX.utils.aoa_to_sheet(moodData)
    XLSX.utils.book_append_sheet(workbook, moodSheet, 'Mood History')
  }

  // Screen Time sheet
  if (data.screenTimeData) {
    const screenTimeData = [
      ['Date', 'Total Hours', 'Total Social Media Hours'],
      ...data.screenTimeData.map((entry) => [
        entry.date,
        entry.totalHours.toFixed(2),
        entry.socialMediaHours.toFixed(2),
      ]),
    ]
    const screenTimeSheet = XLSX.utils.aoa_to_sheet(screenTimeData)
    XLSX.utils.book_append_sheet(workbook, screenTimeSheet, 'Screen Time')
  }

  // Social Media sheet
  if (data.screenTimeData) {
    const socialMediaData = [
      ['Platform', 'Total Time Spent (minutes)', 'Average Time Spent per day'],
      [data.totalScreenTime.toFixed(2), data.avgDailyScreenTime.toFixed(2)],
    ]
    const socialMediaSheet = XLSX.utils.aoa_to_sheet(socialMediaData)
    XLSX.utils.book_append_sheet(workbook, socialMediaSheet, 'Social Media Usage')
  }

  XLSX.writeFile(workbook, filename)
}

export function exportToCSV(data: StudentReportData, filename: string) {
  let csvContent = `Student Report\n`
  csvContent += `Student Name, ${data.name}\n`
  csvContent += `Department, ${data.department}\n`
  csvContent += `Level, ${data.level}\n`
  csvContent += `Gender, ${data.gender}\n`
  csvContent += `Report Period, ${data.reportPeriod.start} to ${data.reportPeriod.end}\n\n`

  if (data.moodCheckins) {
    csvContent += `Mood History\n`
    csvContent += `Date,Mood,Score\n`
    data.moodCheckins.forEach((entry) => {
      csvContent += `${entry.date},${entry.mood},${entry.riskScore || ''}\n`
    })
    csvContent += `\n`
  }

  if (data.screenTimeData) {
    csvContent += `Screen Time\n`
    csvContent += `Date,Total Hours,Social,Entertainment,Productivity,Education\n`
    data.screenTimeData.forEach((entry) => {
      csvContent += `${entry.date},${entry.totalHours.toFixed(2)}\n`
    })
    csvContent += `\n`
  }

  if (data.screenTimeData) {
    csvContent += `Social Media Usage\n`
    csvContent += `Total Time Spent (minutes), ${data.totalScreenTime}\n`
    csvContent += `Average Time Spent per day (minutes),${data.avgDailyScreenTime}\n`
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

export async function exportToPDF(data: StudentReportData, filename: string) {
  const { default: jsPDF } = await import('jspdf')
  await import('jspdf-autotable')

  const doc = new jsPDF()

  // Title
  doc.setFontSize(20)
  doc.text('Student Well-being Report', 20, 20)

  // Summary information
  doc.setFontSize(12)
  doc.text(`Student: ${data.name}`, 20, 40)
  doc.text(`Department: ${data.department}`, 20, 50)
  doc.text(`Level: ${data.level}`, 20, 60)
  doc.text(`Gender: ${data.gender}`, 20, 70)
  doc.text(`Period: ${data.reportPeriod.start} to ${data.reportPeriod.end}}`, 20, 80)

  let yPosition = 100

  // Mood History
  if (data.moodCheckins && data.moodCheckins.length > 0) {
    doc.setFontSize(14)
    doc.text('Mood History', 20, yPosition)
    yPosition += 10

    const moodTableData = data.moodCheckins
      .slice(0, 10)
      .map((entry) => [entry.date, entry.mood, entry.riskScore || ''])

    doc.autoTable({
      startY: yPosition,
      head: [['Date', 'Mood', 'Notes']],
      body: moodTableData,
      margin: { left: 20 },
    })

    yPosition = (doc as any).lastAutoTable.finalY + 20
  }

  // Screen Time (if there's space)
  if (data.screenTimeData && data.screenTimeData.length > 0 && yPosition < 200) {
    doc.setFontSize(14)
    doc.text('Screen Time Summary', 20, yPosition)
    yPosition += 10

    const screenTimeTableData = data.screenTimeData
      .slice(0, 5)
      .map((entry) => [entry.date, entry.totalHours.toFixed(2), entry.socialMediaHours.toFixed(2)])

    doc.autoTable({
      startY: yPosition,
      head: [['Date', 'Total Hours', 'Social Media Hours']],
      body: screenTimeTableData,
      margin: { left: 20 },
    })
  }

  doc.save(filename)
}
