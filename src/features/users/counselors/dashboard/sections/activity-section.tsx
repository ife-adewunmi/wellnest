import { useDashboardSettings } from '@/shared/contexts/dashboard-settings-context'
import {
  ActivitySectionWrapper,
  ActivityWidgetsContainer,
  ScreenTimeWidget,
  DistressScoreWidget,
} from '../activity'

export function ActivitySection() {
  const { isWidgetEnabled } = useDashboardSettings()

  // Count enabled widgets for activity section
  const activityWidgets = [
    isWidgetEnabled('screen-time'),
    true, // Keep distress score always visible for now
  ].filter(Boolean)

  // Don't render if no widgets are enabled
  if (!activityWidgets.length) {
    return null
  }

  return (
    <ActivitySectionWrapper>
      <ActivityWidgetsContainer enabledCount={activityWidgets.length}>
        {/* 1. Average Screen Time Bar Chart */}
        <ScreenTimeWidget />

        {/* 2. Overall Distress Score Progress */}
        <DistressScoreWidget />
      </ActivityWidgetsContainer>
    </ActivitySectionWrapper>
  )
}
