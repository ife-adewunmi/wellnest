import {
  getMoodEmoji as getMoodEmojiCommon,
  getRiskLevelBadgeClass,
  type MoodType,
  type RiskLevel,
} from '@/shared/types/common.types'
import { formatDistanceToNow } from 'date-fns'

// Re-export from common types with wrapper for undefined handling
export const getMoodEmoji = (mood?: string): string => {
  if (!mood) return '-'
  return getMoodEmojiCommon(mood as MoodType)
}

// Re-export from common types
export const getRiskLevelColor = (level: string): string => {
  return getRiskLevelBadgeClass(level as RiskLevel)
}

// export const formatScreenTime = (minutes?: number): string => {
//   if (!minutes) return '-'
//   const hours = Math.floor(minutes / 60)
//   const mins = minutes % 60
//   if (hours > 0) {
//     return `${hours}h ${mins}m`
//   }
//   return `${mins}m`
// }

export const formatScreenTime = (minutes: number): string => {
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours} hours`
}

export const formatLastCheckIn = (date?: Date | string) => {
  if (!date) return 'Never'
  try {
    const checkInDate = typeof date === 'string' ? new Date(date) : date
    return formatDistanceToNow(checkInDate, { addSuffix: true })
  } catch {
    return 'Unknown'
  }
}

export const formatCheckInDate = (date?: Date | string): string => {
  if (!date) return 'Never'

  const checkInDate = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - checkInDate.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

  if (diffHours < 1) {
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    return `${diffMinutes} min ago`
  } else if (diffHours < 24) {
    return `${diffHours}h ago`
  } else {
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }
    return checkInDate.toLocaleDateString('en-US', options)
  }
}

// Export students data to CSV
export const exportStudentsToCSV = (students: any[], filename?: string) => {
  const dataToExport = students.map((student) => ({
    'Student ID': student.studentId,
    Name: student.name,
    'Last Check-in': formatLastCheckIn(student.lastCheckIn),
    'Risk Level': student.riskLevel,
    'Current Mood': student.currentMood || 'Unknown',
    'Screen Time Today': formatScreenTime(student.screenTimeToday),
    Email: student.email || '',
    Department: student.department || '',
    Level: student.level || '',
  }))

  // Convert to CSV format
  const headers = Object.keys(dataToExport[0] || {})
  const csvContent = [
    headers.join(','),
    ...dataToExport.map((row) =>
      headers.map((header) => `"${row[header as keyof typeof row] || ''}"`).join(','),
    ),
  ].join('\n')

  // Create and download the file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute(
    'download',
    filename || `students-data-${new Date().toISOString().split('T')[0]}.csv`,
  )
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
