import { SectionTitle } from '@/shared/components/section-title'

interface NotificationsHeaderProps {
  title?: string
}

export function NotificationsHeader({
  title = 'Notifications & Sessions',
}: NotificationsHeaderProps) {
  return <SectionTitle>{title}</SectionTitle>
}
