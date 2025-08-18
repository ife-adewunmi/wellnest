import { useDashboardSettings } from '@/shared/contexts/dashboard-settings-context'
import {
  NotificationsSectionWrapper,
  NotificationsHeader,
  NotificationsWidgetsContainer,
  NotificationsWidget,
  UpcomingSessionsWidget,
} from '../notifications'

export function NotificationsSection() {
  const { isWidgetEnabled } = useDashboardSettings()

  const hasNotifications = isWidgetEnabled('notification-widget')
  const hasSessions = isWidgetEnabled('upcoming-sessions')

  // Don't render if neither widget is enabled
  if (!hasNotifications && !hasSessions) {
    return null
  }

  return (
    <NotificationsSectionWrapper>
      <NotificationsWidgetsContainer hasNotifications={hasNotifications} hasSessions={hasSessions}>
        <NotificationsWidget />
        <UpcomingSessionsWidget hasNotifications={hasNotifications} />
      </NotificationsWidgetsContainer>
    </NotificationsSectionWrapper>
  )
}
