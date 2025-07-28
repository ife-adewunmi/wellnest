import type {
  ReportFilters,
  ReportOptions,
  StudentReportData,
  MoodEntry,
  ScreenTimeEntry,
  SocialMediaEntry,
} from "../types/report-types"

// Mock data generator - in a real app, this would fetch from your API
export function generateReportData(filters: ReportFilters, options: ReportOptions): StudentReportData {
  const startDate = new Date(filters.startDate)
  const endDate = new Date(filters.endDate)

  const reportData: StudentReportData = {
    studentId: `STU${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    student: filters.student.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    studentName: filters.student.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    department: filters.department.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    level: filters.level,
    gender: filters.gender,
    dateRange: {
      start: filters.startDate,
      end: filters.endDate,
    },
  }

  // Generate mock mood history data
  if (options.moodHistory) {
    reportData.moodHistory = generateMoodData(startDate, endDate)
  }

  // Generate mock screen time data
  if (options.screenTime) {
    reportData.screenTime = generateScreenTimeData(startDate, endDate)
  }

  // Generate mock social media data
  if (options.socialMediaUsage) {
    reportData.socialMediaUsage = generateSocialMediaData(startDate, endDate)
  }

  return reportData
}

function generateMoodData(startDate: Date, endDate: Date): MoodEntry[] {
  const moods: MoodEntry["mood"][] = ["excellent", "good", "neutral", "poor", "very-poor"]
  const data: MoodEntry[] = []

  const currentDate = new Date(startDate)
  while (currentDate <= endDate) {
    if (Math.random() > 0.3) {
      // 70% chance of having mood data for any given day
      data.push({
        date: currentDate.toISOString().split("T")[0],
        mood: moods[Math.floor(Math.random() * moods.length)],
        notes: Math.random() > 0.7 ? "Feeling stressed about exams" : undefined,
      })
    }
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return data
}

function generateScreenTimeData(startDate: Date, endDate: Date): ScreenTimeEntry[] {
  const data: ScreenTimeEntry[] = []

  const currentDate = new Date(startDate)
  while (currentDate <= endDate) {
    if (Math.random() > 0.2) {
      // 80% chance of having screen time data
      const social = Math.random() * 4
      const entertainment = Math.random() * 3
      const productivity = Math.random() * 2
      const education = Math.random() * 2

      data.push({
        date: currentDate.toISOString().split("T")[0],
        totalHours: social + entertainment + productivity + education,
        categories: {
          social: Math.round(social * 100) / 100,
          entertainment: Math.round(entertainment * 100) / 100,
          productivity: Math.round(productivity * 100) / 100,
          education: Math.round(education * 100) / 100,
        },
      })
    }
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return data
}

function generateSocialMediaData(startDate: Date, endDate: Date): SocialMediaEntry[] {
  const platforms = ["Instagram", "Twitter", "Facebook", "TikTok", "LinkedIn"]
  const data: SocialMediaEntry[] = []

  const currentDate = new Date(startDate)
  while (currentDate <= endDate) {
    if (Math.random() > 0.4) {
      // 60% chance of social media usage
      const platform = platforms[Math.floor(Math.random() * platforms.length)]
      data.push({
        date: currentDate.toISOString().split("T")[0],
        platform,
        timeSpent: Math.round(Math.random() * 180), // 0-180 minutes
        interactions: Math.floor(Math.random() * 50), // 0-50 interactions
      })
    }
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return data
}
