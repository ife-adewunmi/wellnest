import { UpcomingSessions } from '@/features/sessions/components/upcoming-sessions'
import { RecentMessages } from '@/features/messaging/components/recent-messages'

export function StudentActivitySection({ userId }: { userId: string }) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
      <UpcomingSessions userId={userId} />
      <RecentMessages userId={userId} />
    </div>
  )
}

