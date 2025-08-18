import { SectionTitle } from '@/shared/components/section-title'

interface DashboardTitleProps {
  title?: string
}

export function DashboardTitle({ title = 'Dashboard' }: DashboardTitleProps) {
  return <SectionTitle>{title}</SectionTitle>
}
