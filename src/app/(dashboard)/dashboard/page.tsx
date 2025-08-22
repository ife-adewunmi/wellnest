'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { UserRole } from '@/features/users/auth/enums/user-role'
import { navigateTo } from '@/shared/state/navigation'
import { useUserStore } from '@/users/state/index'
import { Endpoints } from '@/shared-enums/endpoints'
import {
  Header,
  DashboardTitle,
  MetricsSection,
  AnalysisSection,
  ActivitySection,
  NotificationsSection,
  StudentTableSection,
} from '@/features/users/counselors/dashboard/sections'
import { LoadingSpinner } from '@/shared/components/loading-spinner'
import { ErrorMessage } from '@/shared/components/error-message'
import {
  useIsDataStale,
  useIsLoading,
  useHasData,
  useError,
  useMetrics,
  useMoodCheckIns,
  useStudents,
  useDashboardStore,
} from '@/users/counselors/state/dashboard'
import { isLocal, isProd } from '@/src/shared/enums/environment'

export default function Page() {
  const router = useRouter()
  const { user } = useUserStore()

  console.log('isLocal: ', isLocal())
  console.log('isProd: ', isProd())

  useEffect(() => {
    if (!user) return
    if (user.role !== UserRole.COUNSELOR) {
      navigateTo(router, Endpoints.STUDENTS.DASHBOARD, { replace: true })
    }
  }, [user, router])

  // Data from stores
  const metrics = useMetrics()
  const moodCheckIns = useMoodCheckIns()
  const students = useStudents()

  // Loading states
  const isLoading = useIsLoading()

  // Error states
  const error = useError()

  // Data freshness
  const isMetricsStale = useIsDataStale()
  const hasData = useHasData()

  // Track if we've initiated a fetch
  const hasFetchedRef = useRef(false)
  const fetchDashboardData = useDashboardStore((state) => state.fetchDashboardData)

  useEffect(() => {
    // Only fetch when component mounts or user changes
    if (!user?.id || isLoading) return

    // Determine if we should fetch
    const shouldFetch = !hasData || (isMetricsStale && !hasFetchedRef.current)

    if (shouldFetch) {
      hasFetchedRef.current = true
      fetchDashboardData(user.id)
    }
  }, [user?.id]) // Only depend on user ID

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <LoadingSpinner size="large" />
        <p className="mt-4 text-gray-600">Loading dashboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <ErrorMessage message={error} />
        <button
          onClick={() => user?.id && fetchDashboardData(user.id)}
          className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center pb-3">
      <Header />

      {/* Main Content */}
      <main className="mx-auto mt-[4rem] w-full max-w-[1152px] min-w-[320px] px-4 sm:px-6 lg:min-w-[1024px] lg:px-8 xl:px-0">
        <DashboardTitle />

        {/* First Row: Metrics (4 cards) */}
        <MetricsSection metrics={metrics} />

        {/* Second Row: Analysis Overview (4 widgets) */}
        <AnalysisSection moodCheckIns={moodCheckIns} />

        <ActivitySection />

        {/* Third Row: Notifications & Sessions (Less Important) */}
        <NotificationsSection />

        {/* Fourth Row: Student Table */}
        <StudentTableSection students={students} isLoading={isLoading} />
      </main>
    </div>
  )
}
