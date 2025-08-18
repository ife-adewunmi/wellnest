import { SectionTitle } from '@/shared/components/section-title'

interface ActivityHeaderProps {
  title?: string
}

export function ActivityHeader({ title = 'Activity Overview' }: ActivityHeaderProps) {
  return <SectionTitle>{title}</SectionTitle>
}
