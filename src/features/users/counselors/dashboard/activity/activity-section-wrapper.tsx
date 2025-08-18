interface ActivitySectionWrapperProps {
  children: React.ReactNode
}

export function ActivitySectionWrapper({ children }: ActivitySectionWrapperProps) {
  return <div className="mt-8 sm:mt-12 lg:mt-[4.5rem]">{children}</div>
}
