interface ActivityWidgetsContainerProps {
  children: React.ReactNode
  enabledCount: number
}

export function ActivityWidgetsContainer({
  children,
  enabledCount,
}: ActivityWidgetsContainerProps) {
  // Helper function to determine grid layout based on enabled widgets
  const getGridLayout = (count: number) => {
    if (count === 1) return 'grid-cols-1'
    return 'grid-cols-1 lg:grid-cols-2'
  }

  return (
    <div
      className={`mt-4 grid gap-4 sm:mt-6 sm:gap-6 lg:mt-[2rem] lg:gap-[2rem] ${getGridLayout(enabledCount)}`}
    >
      {children}
    </div>
  )
}
