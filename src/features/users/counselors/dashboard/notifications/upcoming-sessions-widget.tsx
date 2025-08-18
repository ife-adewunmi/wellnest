// import { UpcomingSessions } from '@/features/student-management/components/upcoming-sessions'
import { useDashboardSettings } from '@/shared/contexts/dashboard-settings-context'
import { UpcomingSessions } from '../../manage-student'

interface UpcomingSessionsWidgetProps {
  hasNotifications: boolean
}

export function UpcomingSessionsWidget({ hasNotifications }: UpcomingSessionsWidgetProps) {
  const { isWidgetEnabled } = useDashboardSettings()

  if (!isWidgetEnabled('upcoming-sessions')) {
    return null
  }

  return (
    <div className={`w-full ${hasNotifications ? 'max-w-[806px]' : ''}`}>
      <UpcomingSessions />
    </div>
  )
}
