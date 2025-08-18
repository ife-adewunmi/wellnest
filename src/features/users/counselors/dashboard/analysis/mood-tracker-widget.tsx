import type { MoodCheckIn } from '../../types/dashboard.types'
import { MoodCheckIns } from './mood-check-ins'

interface MoodTrackerWidgetProps {
  checkIns: MoodCheckIn[]
}

export function MoodTrackerWidget({ checkIns }: MoodTrackerWidgetProps) {
  return <MoodCheckIns checkIns={checkIns} />
}
