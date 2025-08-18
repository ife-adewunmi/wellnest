interface AnalysisSectionWrapperProps {
  children: React.ReactNode
}

export function AnalysisSectionWrapper({ children }: AnalysisSectionWrapperProps) {
  return <div className="mt-8 sm:mt-12 lg:mt-[4.5rem]">{children}</div>
}
