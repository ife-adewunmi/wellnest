import { MoodHistoryChart } from '../line-charts'
import { MoodCheckIns } from '../mood-check-ins'
import { useDashboardSettings } from '@/shared/contexts/dashboard-settings-context'
import { interBold } from '@/shared/styles/fonts'

interface MoodCheckIn {
  name: string
  avatar: string
  time: string
  message: string
  emoji: string
}

interface AnalysisSectionProps {
  moodCheckIns: MoodCheckIn[]
}

export function AnalysisSection({ moodCheckIns }: AnalysisSectionProps) {
  const { isWidgetEnabled } = useDashboardSettings()

  // Helper function to determine grid layout based on enabled widgets
  const getGridLayout = (enabledCount: number) => {
    if (enabledCount === 1) return 'grid-cols-1'
    return 'grid-cols-1 lg:grid-cols-2'
  }

  // Count enabled widgets for analysis section
  const analysisWidgets = [
    isWidgetEnabled('mood-tracker'),
    // Add mood history chart as it's part of mood tracking
    isWidgetEnabled('mood-tracker'),
  ].filter(Boolean)

  if (!isWidgetEnabled('mood-tracker')) {
    return null
  }

  return (
    <div className="mt-8 sm:mt-12 lg:mt-[4.5rem]">
      <h2 className={`text-lg text-[#121417] sm:text-xl lg:text-[1.375rem] ${interBold.className}`}>
        Analysis Overview
      </h2>

      <div
        className={`mt-4 grid gap-4 sm:mt-6 sm:gap-6 lg:mt-[2rem] lg:gap-[2rem] ${getGridLayout(analysisWidgets.length)}`}
      >
        <MoodCheckIns checkIns={moodCheckIns} />
        <MoodHistoryChart />
      </div>
    </div>
  )
}
