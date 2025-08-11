// import AverageScreenTime from '../average-screen-time'
// import { DistressScore } from '../distress-score'
import { useDashboardSettings } from '@/shared/contexts/dashboard-settings-context'

export function ActivitySection() {
  const { isWidgetEnabled } = useDashboardSettings()

  // Helper function to determine grid layout based on enabled widgets
  const getGridLayout = (enabledCount: number) => {
    if (enabledCount === 1) return 'grid-cols-1'
    return 'grid-cols-1 lg:grid-cols-2'
  }

  // Count enabled widgets for screen time section
  const screenTimeWidgets = [
    isWidgetEnabled('screen-time'),
    // Social media is separate but related to screen time
    true, // Keep social media always visible for now
  ].filter(Boolean)

  // Don't render if neither widget is enabled
  if (!isWidgetEnabled('screen-time') && !true) {
    return null
  }

  return (
    <div
      className={`mt-4 grid gap-4 sm:mt-6 sm:gap-6 lg:mt-[2rem] lg:gap-[2rem] ${getGridLayout(screenTimeWidgets.length)}`}
    >
      {/* {isWidgetEnabled('screen-time') && <AverageScreenTime />}
      <DistressScore /> */}
    </div>
  )
}
