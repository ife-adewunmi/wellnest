import * as XLSX from "xlsx"
import { StudentReportData } from "../types/report-types"

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF
  }
}

export async function exportToExcel(data: StudentReportData, filename: string) {
  const workbook = XLSX.utils.book_new()

  // Summary sheet
  const summaryData = [
    ["Student Report Summary"],
    [""],
    ["Student Name", data.studentName],
    ["Department", data.department],
    ["Level", data.level],
    ["Gender", data.gender],
    ["Report Period", `${data.dateRange.start} to ${data.dateRange.end}`],
    [""],
  ]

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
  XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary")

  // Mood History sheet
  if (data.moodHistory) {
    const moodData = [
      ["Date", "Mood", "Notes"],
      ...data.moodHistory.map((entry) => [entry.date, entry.mood, entry.notes || ""]),
    ]
    const moodSheet = XLSX.utils.aoa_to_sheet(moodData)
    XLSX.utils.book_append_sheet(workbook, moodSheet, "Mood History")
  }

  // Screen Time sheet
  if (data.screenTime) {
    const screenTimeData = [
      ["Date", "Total Hours", "Social", "Entertainment", "Productivity", "Education"],
      ...data.screenTime.map((entry) => [
        entry.date,
        entry.totalHours.toFixed(2),
        entry.categories.social.toFixed(2),
        entry.categories.entertainment.toFixed(2),
        entry.categories.productivity.toFixed(2),
        entry.categories.education.toFixed(2),
      ]),
    ]
    const screenTimeSheet = XLSX.utils.aoa_to_sheet(screenTimeData)
    XLSX.utils.book_append_sheet(workbook, screenTimeSheet, "Screen Time")
  }

  // Social Media sheet
  if (data.socialMediaUsage) {
    const socialMediaData = [
      ["Date", "Platform", "Time Spent (minutes)", "Interactions"],
      ...data.socialMediaUsage.map((entry) => [entry.date, entry.platform, entry.timeSpent, entry.interactions]),
    ]
    const socialMediaSheet = XLSX.utils.aoa_to_sheet(socialMediaData)
    XLSX.utils.book_append_sheet(workbook, socialMediaSheet, "Social Media Usage")
  }

  XLSX.writeFile(workbook, filename)
}

export function exportToCSV(data: StudentReportData, filename: string) {
  let csvContent = `Student Report\n`
  csvContent += `Student Name,${data.studentName}\n`
  csvContent += `Department,${data.department}\n`
  csvContent += `Level,${data.level}\n`
  csvContent += `Gender,${data.gender}\n`
  csvContent += `Report Period,${data.dateRange.start} to ${data.dateRange.end}\n\n`

  if (data.moodHistory) {
    csvContent += `Mood History\n`
    csvContent += `Date,Mood,Notes\n`
    data.moodHistory.forEach((entry) => {
      csvContent += `${entry.date},${entry.mood},${entry.notes || ""}\n`
    })
    csvContent += `\n`
  }

  if (data.screenTime) {
    csvContent += `Screen Time\n`
    csvContent += `Date,Total Hours,Social,Entertainment,Productivity,Education\n`
    data.screenTime.forEach((entry) => {
      csvContent += `${entry.date},${entry.totalHours.toFixed(2)},${entry.categories.social.toFixed(2)},${entry.categories.entertainment.toFixed(2)},${entry.categories.productivity.toFixed(2)},${entry.categories.education.toFixed(2)}\n`
    })
    csvContent += `\n`
  }

  if (data.socialMediaUsage) {
    csvContent += `Social Media Usage\n`
    csvContent += `Date,Platform,Time Spent (minutes),Interactions\n`
    data.socialMediaUsage.forEach((entry) => {
      csvContent += `${entry.date},${entry.platform},${entry.timeSpent},${entry.interactions}\n`
    })
  }

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export async function exportToPDF(data: StudentReportData, filename: string) {
  const { default: jsPDF } = await import("jspdf")
  await import("jspdf-autotable")

  const doc = new jsPDF()

  // Title
  doc.setFontSize(20)
  doc.text("Student Well-being Report", 20, 20)

  // Summary information
  doc.setFontSize(12)
  doc.text(`Student: ${data.studentName}`, 20, 40)
  doc.text(`Department: ${data.department}`, 20, 50)
  doc.text(`Level: ${data.level}`, 20, 60)
  doc.text(`Gender: ${data.gender}`, 20, 70)
  doc.text(`Period: ${data.dateRange.start} to ${data.dateRange.end}`, 20, 80)

  let yPosition = 100

  // Mood History
  if (data.moodHistory && data.moodHistory.length > 0) {
    doc.setFontSize(14)
    doc.text("Mood History", 20, yPosition)
    yPosition += 10

    const moodTableData = data.moodHistory.slice(0, 10).map((entry) => [entry.date, entry.mood, entry.notes || ""])

    doc.autoTable({
      startY: yPosition,
      head: [["Date", "Mood", "Notes"]],
      body: moodTableData,
      margin: { left: 20 },
    })

    yPosition = (doc as any).lastAutoTable.finalY + 20
  }

  // Screen Time (if there's space)
  if (data.screenTime && data.screenTime.length > 0 && yPosition < 200) {
    doc.setFontSize(14)
    doc.text("Screen Time Summary", 20, yPosition)
    yPosition += 10

    const screenTimeTableData = data.screenTime
      .slice(0, 5)
      .map((entry) => [
        entry.date,
        entry.totalHours.toFixed(2),
        entry.categories.social.toFixed(2),
        entry.categories.entertainment.toFixed(2),
      ])

    doc.autoTable({
      startY: yPosition,
      head: [["Date", "Total Hours", "Social", "Entertainment"]],
      body: screenTimeTableData,
      margin: { left: 20 },
    })
  }

  doc.save(filename)
}
