export function formatTime(time: string): string {
  // Convert 24-hour format to 12-hour format if needed
  if (time.includes(':') && !time.includes('AM') && !time.includes('PM')) {
    const [hours, minutes] = time.split(':')
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }
  return time
}
