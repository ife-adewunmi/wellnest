'use client'

import { Header } from './header'
import {
  DashboardTitle,
  MetricsSection,
  AnalysisSection,
  ActivitySection,
  NotificationsSection,
} from './sections'
import { MOCK_MOOD_CHECK_INS, MOCK_METRICS } from '../data/dashboard-data'

export default function Dashboard() {
  return (
    <div className="flex flex-col items-center justify-center pb-3">
      <Header />

      {/* Main Content */}
      <main className="mx-auto mt-[4rem] w-full max-w-[1152px] min-w-[320px] px-4 sm:px-6 lg:min-w-[1024px] lg:px-8 xl:px-0">
        <DashboardTitle />

        <MetricsSection metrics={MOCK_METRICS} />

        <AnalysisSection moodCheckIns={MOCK_MOOD_CHECK_INS} />

        <ActivitySection />

        <NotificationsSection />
      </main>
    </div>
  )
}
