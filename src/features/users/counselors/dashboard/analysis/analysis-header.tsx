import { SectionTitle } from '@/shared/components/section-title'

interface AnalysisHeaderProps {
  title?: string
}

export function AnalysisHeader({ title = 'Analysis Overview' }: AnalysisHeaderProps) {
  return <SectionTitle>{title}</SectionTitle>
}
