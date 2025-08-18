'use client'

import { useUserStore } from '@/features/users/state'
import { StudentHeader } from './header'
import { StudentDashboardTitle, StudentMetricsSection, StudentAnalysisSection, StudentActivitySection } from './sections'

export default function StudentDashboardPage() {
  const { user } = useUserStore()
  if (!user) return null

  const studentStats = {
    weeklyCheckIns: 0,
    totalCheckIns: 7,
    averageMood: 'Good',
    moodEmoji: '🙂',
  }

  return (
    <div className="flex flex-col items-center justify-center pb-3">
      <StudentHeader />
      <main className="mx-auto mt-[2rem] w-full max-w-[1152px] min-w-[320px] px-4 sm:px-6 lg:min-w-[1024px] lg:px-8 xl:px-0">
        <StudentDashboardTitle />
        <StudentMetricsSection {...studentStats} />
        <StudentAnalysisSection userId={user.id} />
        <StudentActivitySection userId={user.id} />
      </main>
    </div>
  )
}

