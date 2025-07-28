
import { StudentReportData, ReportFilters } from "../types/report-types";

// Mock data for development
const mockReports: StudentReportData[] = [
  {
    id: "1",
    report: "Academic Performance Report",
    studentId: "STU001",
    student: "John Doe",
    studentName: "John Doe",
    department: "Computer Science",
    level: "400",
    gender: "male",
    startDate: "2024-01-01",
    endDate: "2024-01-31",
    exportType: "xlsx",
    dateRange: {
      start: "2024-01-01",
      end: "2024-01-31"
    }
  },
  {
    id: "2",
    report: "Mood Assessment Report",
    studentId: "STU002",
    student: "Jane Smith",
    studentName: "Jane Smith",
    department: "Psychology",
    level: "300",
    gender: "female",
    startDate: "2024-01-01",
    endDate: "2024-01-31",
    exportType: "pdf",
    dateRange: {
      start: "2024-01-01",
      end: "2024-01-31"
    }
  },
  {
    id: "3",
    report: "Digital Wellness Report",
    studentId: "STU003",
    student: "Mike Johnson",
    studentName: "Mike Johnson",
    department: "Engineering",
    level: "400",
    gender: "male",
    startDate: "2024-02-01",
    endDate: "2024-02-28",
    exportType: "csv",
    dateRange: {
      start: "2024-02-01",
      end: "2024-02-28"
    }
  },
  {
    id: "4",
    report: "Academic Performance Report",
    studentId: "STU004",
    student: "Sarah Wilson",
    studentName: "Sarah Wilson",
    department: "Business",
    level: "200",
    gender: "female",
    startDate: "2024-01-15",
    endDate: "2024-02-15",
    exportType: "xlsx",
    dateRange: {
      start: "2024-01-15",
      end: "2024-02-15"
    }
  }
];

export async function getReports(filters: ReportFilters): Promise<StudentReportData[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // In a real app, this would be an API call
  return mockReports.filter(report => {
    // Filter by department
    if (filters.department && report.department.toLowerCase() !== filters.department.toLowerCase()) {
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
    if (filters.startDate && report.startDate && report.startDate < filters.startDate) {
      return false;
    }
    if (filters.endDate && report.endDate && report.endDate > filters.endDate) {
      return false;
    }

    return true;
  });
}