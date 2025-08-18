interface NotificationsSectionWrapperProps {
  children: React.ReactNode
}

export function NotificationsSectionWrapper({ children }: NotificationsSectionWrapperProps) {
  return <div className="mt-8 mb-8 sm:mt-12 sm:mb-12 lg:mt-[5rem] lg:mb-[5rem]">{children}</div>
}
