/**
 * Formats time string to a consistent format
 * @param time - Time string in various formats (e.g., "10:00", "10:00 AM", "14:00")
 * @returns Formatted time string in 12-hour format with AM/PM
 */
export function formatTime(time: string): string {
  // If time already has AM/PM, return as is
  if (time.includes('AM') || time.includes('PM')) {
    return time
  }

  // Parse time string (assuming format like "10:00" or "14:30")
  const [hours, minutes] = time.split(':').map(Number)

  if (isNaN(hours) || isNaN(minutes)) {
    return time // Return original if parsing fails
  }

  // Convert to 12-hour format
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
  const displayMinutes = minutes.toString().padStart(2, '0')

  return `${displayHours}:${displayMinutes} ${period}`
}

/**
 * Formats date string to a readable format
 * @param date - Date string in ISO format (e.g., "2024-08-15")
 * @returns Formatted date string (e.g., "Aug 15, 2024")
 */
export function formatDate(date: string): string {
  try {
    const dateObj = new Date(date)
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch (error) {
    return date // Return original if parsing fails
  }
}

/**
 * Formats datetime for display
 * @param date - Date string
 * @param time - Time string
 * @returns Combined formatted date and time
 */
export function formatDateTime(date: string, time: string): string {
  return `${formatDate(date)} at ${formatTime(time)}`
}
