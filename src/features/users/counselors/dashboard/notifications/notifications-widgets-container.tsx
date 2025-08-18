interface NotificationsWidgetsContainerProps {
  children: React.ReactNode
  hasNotifications: boolean
  hasSessions: boolean
}

export function NotificationsWidgetsContainer({
  children,
  hasNotifications,
  hasSessions,
}: NotificationsWidgetsContainerProps) {
  // Determine layout based on which widgets are enabled
  const getLayoutClass = () => {
    if (hasNotifications && hasSessions) {
      return 'flex flex-col gap-4 sm:gap-6 lg:flex-row lg:gap-[2rem]'
    }
    return 'flex flex-col gap-4 sm:gap-6'
  }

  return <div className={getLayoutClass()}>{children}</div>
}
