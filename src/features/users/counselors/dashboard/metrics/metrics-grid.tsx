interface MetricsGridProps {
  children: React.ReactNode
}

export function MetricsGrid({ children }: MetricsGridProps) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-4 lg:mt-[2.8125rem] lg:grid-cols-4 lg:gap-6">
      {children}
    </div>
  )
}
