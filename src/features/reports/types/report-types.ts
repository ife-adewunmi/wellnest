export interface ReportFilterValues {
  reportType: "academic" | "mood" | "digital"
  student: string
  level: string
  gender?: "male" | "female"
  startDate: string
  endDate: string
  exportType: "xlsx" | "csv" | "pdf"
}

export interface ReportData {
  id: string
  report: string
  student: string
  level: string
  gender: string
  startDate: string
  endDate: string
  exportType: string
}