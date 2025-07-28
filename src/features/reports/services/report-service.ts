import { ReportData, ReportFilterValues } from "../types/report-types";

// Mock data for development
const mockReports: ReportData[] = [
  {
    id: "1",
    report: "Academic Performance Report",
    student: "John Doe",
    level: "400",
    gender: "male",
    startDate: "2024-01-01",
    endDate: "2024-01-31",
    exportType: "xlsx"
  },
  {
    id: "2",
    report: "Mood Assessment Report",
    student: "Jane Smith",
    level: "300",
    gender: "female",
    startDate: "2024-01-01",
    endDate: "2024-01-31",
    exportType: "pdf"
  },
  {
    id: "3",
    report: "Digital Wellness Report",
    student: "Mike Johnson",
    level: "400",
    gender: "male",
    startDate: "2024-02-01",
    endDate: "2024-02-28",
    exportType: "csv"
  },
  {
    id: "4",
    report: "Academic Performance Report",
    student: "Sarah Wilson",
    level: "200",
    gender: "female",
    startDate: "2024-01-15",
    endDate: "2024-02-15",
    exportType: "xlsx"
  }
];

export async function getReports(filters: ReportFilterValues): Promise<ReportData[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // In a real app, this would be an API call
  return mockReports.filter(report => {
    // Filter by report type
    if (filters.reportType === "academic" && !report.report.toLowerCase().includes("academic")) {
      return false;
    }
    if (filters.reportType === "mood" && !report.report.toLowerCase().includes("mood")) {
      return false;
    }
    if (filters.reportType === "digital" && !report.report.toLowerCase().includes("digital")) {
      return false;
    }

    // Filter by level
    if (filters.level && report.level !== filters.level) {
      return false;
    }

    // Filter by student (partial match)
    if (filters.student && !report.student.toLowerCase().includes(filters.student.toLowerCase())) {
      return false;
    }

    // Filter by gender
    if (filters.gender && report.gender !== filters.gender) {
      return false;
    }

    // Filter by date range (simplified - in real app would be more sophisticated)
    if (filters.startDate && report.startDate < filters.startDate) {
      return false;
    }
    if (filters.endDate && report.endDate > filters.endDate) {
      return false;
    }

    return true;
  });
}