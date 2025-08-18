'use client'

import { useEffect, useRef } from 'react'
import { useUserStore } from '@/features/users/state/userStore'
import { LoadingSpinner } from '@/shared/components/loading-spinner'
import { ErrorMessage } from '@/shared/components/error-message'
import { useDashboardStore } from '@/features/users/counselors/state/dashboard/dashboardStore'
import {
  useIsLoading,
  useError,
  useIsDataStale,
  useHasData,
} from '@/features/users/counselors/state/dashboard/dashboardSelectors'
import { StudentsTable } from '@/features/users/counselors/manage-student/students-table'
import { Header } from '@/features/users/counselors/dashboard/header'
import { useStudentsStore } from '@/features/users/counselors/state'

export default function StudentsPage() {
  const { user } = useUserStore()
  const isLoading = useIsLoading()
  const error = useError()
  const isStale = useIsDataStale('STUDENTS')
  const hasData = useHasData()

  // Get actions directly from store to avoid recreation
  const fetchStudents = useStudentsStore((state) => state.fetchStudents)
  const fetchDashboardData = useDashboardStore((state) => state.fetchDashboardData)

  // Use ref to track if we've initiated a fetch
  const hasFetchedRef = useRef(false)

  useEffect(() => {
    // Only fetch once when component mounts or user changes
    if (!user?.id || isLoading) return

    // Check if we need to fetch data
    const shouldFetch = !hasData || (isStale && !hasFetchedRef.current)

    if (shouldFetch) {
      hasFetchedRef.current = true

      if (!hasData) {
        // If we have no data at all, fetch everything
        fetchDashboardData(user.id)
      } else if (isStale) {
        // If students data is stale, just fetch students
        fetchStudents(user.id)
      }
    }
  }, [user?.id]) // Only depend on user ID

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <LoadingSpinner size="large" />
        <p className="mt-4 text-gray-600">Loading students...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <ErrorMessage message={error} />
        <button
          onClick={() => user?.id && fetchStudents(user.id)}
          className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <>
      <Header />
      <div className="mx-auto mt-[4rem] w-full max-w-[1152px] min-w-[320px] px-4 sm:px-6 lg:min-w-[1024px] lg:px-8 xl:px-0">
        <h1 className="mb-6 text-2xl font-bold">Students Management</h1>
        <StudentsTable />
      </div>
    </>
  )
}
