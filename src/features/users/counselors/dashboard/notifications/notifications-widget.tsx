import { Notifications } from '@/shared/components/notification'
import { useDashboardSettings } from '@/shared/contexts/dashboard-settings-context'

export function NotificationsWidget() {
  const { isWidgetEnabled } = useDashboardSettings()

  if (!isWidgetEnabled('notification-widget')) {
    return null
  }

  return <Notifications />
}
