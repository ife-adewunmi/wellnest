// import { MoodHistoryChart } from '../analysis/mood-history-chart'
import { MoodCheckIns } from '../analysis/mood-check-ins'
import { useDashboardSettings } from '@/shared/contexts/dashboard-settings-context'
import {
  AnalysisSectionWrapper,
  AnalysisHeader,
  AnalysisWidgetsContainer,
  MoodHistoryChart,
} from '../analysis'
import { MoodCheckIn } from '../../types/dashboard.types'

interface AnalysisSectionProps {
  moodCheckIns: MoodCheckIn[]
}

export function AnalysisSection({ moodCheckIns }: AnalysisSectionProps) {
  const { isWidgetEnabled } = useDashboardSettings()

  const hasMoodTracker = isWidgetEnabled('mood-tracker')
  const hasMoodHistory = isWidgetEnabled('mood-history')

  const analysisWidgets = [hasMoodTracker, hasMoodHistory].filter(Boolean)

  // Don't render if neither widget is enabled
  if (!analysisWidgets.length) {
    return null
  }

  return (
    <AnalysisSectionWrapper>
      <AnalysisHeader />
      {/* Analysis Overview: 2 widgets in a grid */}
      <AnalysisWidgetsContainer enabledCount={2}>
        {/* 1. Mood Check-Ins Widget */}
        <MoodCheckIns checkIns={moodCheckIns} />

        {/* 2. Mood History Chart */}
        <MoodHistoryChart />
      </AnalysisWidgetsContainer>
    </AnalysisSectionWrapper>
  )
}
