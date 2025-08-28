'use client'

import { useUserStore } from '@/features/users/state'
import { StudentHeader } from './header'
import { StudentAnalysisSection } from './sections'
import { StudentMoodRecord } from './mood-checkin/student-mood-record'
import { StudentProfile } from './sidebar-profile/profile-card'
import Image from 'next/image'
import { PendingIssues } from './pending-issues/pending-issues'
import { RecentUpdates } from './recent-updates'
import { PaymentTransactions } from './payment-transaction'
import { pendingIssues, transactions } from '@/features/users/students/common/data'
import { SidebarNavigation } from './sidebar-navigation'

export default function StudentDashboardPage() {
  const { user } = useUserStore()
  if (!user) return null

  return (
    <div className="flex bg-[#F1F5FA]">
      <div className="flex w-full justify-center pt-[17px]">
        <div className="mt-[2.5rem] flex w-full max-w-[291px] flex-col items-center bg-[#FFFFFF] pt-[12px]">
          <StudentProfile
            name={user.firstName || 'Student'}
            studentId={user.id}
            department={user.department || 'Computer Science'}
            currentSession={'2024/2025'}
            currentSemester={'First Semester'}
            level={user.level || '400'}
          />
          <SidebarNavigation />
        </div>

        <div className="flex w-full max-w-[1127px] flex-col items-center px-[21px]">
          <div className="flex w-full flex-col gap-[10px]">
            <h1>Dashboard</h1>
            <Image src="/images/home.png" alt="Dashboard" width={12} height={9} />
          </div>
          <div className="flex w-full gap-[21px]">
            <StudentHeader />
            <StudentMoodRecord />
          </div>
          <main className="mx-auto mt-[2rem] w-full max-w-[1152px] min-w-[320px] px-4 sm:px-6 lg:min-w-[1024px] lg:px-8 xl:px-0">
            <div className="flex w-full justify-between">
              <PendingIssues issues={pendingIssues} />
              <RecentUpdates />
            </div>
            <StudentAnalysisSection userId={user.id} />
            <PaymentTransactions transactions={transactions} />
          </main>
        </div>
      </div>
    </div>
  )
}
