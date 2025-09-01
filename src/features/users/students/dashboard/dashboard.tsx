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
import ScreenTimeMonitoringToggle from '@/src/features/users/students/components/ScreenTimeMonitoringToggle'

export default function StudentDashboard() {
  const { user } = useUserStore()
  if (!user) return null

  return (
    <div className="flex bg-[#F1F5FA]">
      <div className="flex w-full justify-center gap-[1.5625rem] pt-[17px]">
        {/* Desktop Sidebar - Hidden on mobile */}
        <div className="mt-[2.5rem] hidden w-full max-w-[291px] flex-col items-center bg-[#FFFFFF] pt-[12px] lg:flex">
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

        {/* Main Content Area */}
        <div className="flex w-full min-w-[320px] flex-col justify-center px-4 sm:px-6 lg:max-w-[1107px] lg:items-center lg:px-8 xl:px-0">
          {/* Desktop Dashboard Title */}
          <div className="hidden w-full flex-col gap-[10px] lg:flex lg:max-w-[1092px]">
            <h1>Dashboard</h1>
            <Image src="/images/home.png" alt="Dashboard" width={12} height={9} />
          </div>

          {/* Header and Mood Record Section */}
          <div className="flex w-full max-w-[380px] flex-col justify-center gap-[10px] lg:max-w-[1092px] lg:flex-row lg:pr-[1rem]">
            <StudentHeader />
            <StudentMoodRecord />
          </div>
          {/* Main Content */}
          <main className="mt-4 w-full max-w-[380px] lg:mt-[2rem] lg:max-w-[1092px] lg:min-w-[1024px] lg:pr-[1rem]">
            {/* Pending Issues and Recent Updates - Stack on mobile */}
            <div className="mb-6 flex w-full flex-col gap-4 lg:flex-row lg:gap-[21px]">
              <PendingIssues issues={pendingIssues} />
              <RecentUpdates />
            </div>

            {/* Analysis Section */}
            <div className="mb-6">
              <StudentAnalysisSection userId={user.id} />
            </div>

            <div className="mt-8 rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Screen Time Monitoring</h2>
              <ScreenTimeMonitoringToggle userId={user.id} />
            </div>

            {/* Payment Transactions */}
            <div className="mb-6">
              <PaymentTransactions transactions={transactions} />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
