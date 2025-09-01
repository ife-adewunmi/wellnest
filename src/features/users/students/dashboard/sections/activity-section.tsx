import { RecentMessages } from '@/users/students/components/recent-messages'
import { UpcomingSessions } from '@/users/students/components/upcoming-sessions'

export function StudentActivitySection({ userId }: { userId: string }) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
      <UpcomingSessions userId={userId} />
      <RecentMessages userId={userId} />
    </div>
  )
}
