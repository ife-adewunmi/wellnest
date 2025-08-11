import { UpcomingSessions } from '@/features/student-management/components/upcoming-sessions'
import { Notifications } from '@/shared/components/notification'
import { useDashboardSettings } from '@/shared/contexts/dashboard-settings-context'

export function NotificationsSection() {
  const { isWidgetEnabled } = useDashboardSettings()

  // Don't render if neither widget is enabled
  if (!isWidgetEnabled('notification-widget') && !isWidgetEnabled('upcoming-sessions')) {
    return null
  }

  return (
    <div className="mt-8 mb-8 flex flex-col gap-4 sm:mt-12 sm:mb-12 sm:gap-6 lg:mt-[5rem] lg:mb-[5rem] lg:flex-row lg:gap-[2rem]">
      {isWidgetEnabled('notification-widget') && <Notifications />}
      {isWidgetEnabled('upcoming-sessions') && (
        <div
          className={`w-full ${isWidgetEnabled('notification-widget') ? 'max-w-[806px]' : ''}`}
        >
          <UpcomingSessions />
        </div>
      )}
    </div>
  )
}
