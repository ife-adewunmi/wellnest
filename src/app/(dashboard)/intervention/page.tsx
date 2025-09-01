'use client'

import { useState, useEffect, useRef } from 'react'
import { useUserStore } from '@/features/users/state'
import { LoadingSpinner } from '@/shared/components/loading-spinner'
import { ErrorMessage } from '@/shared/components/error-message'
import { Header } from '@/features/users/counselors/dashboard/header'
import {
  SessionsTable,
  SessionHistory,
  CreateSessionModal,
} from '@/features/users/counselors/manage-interventions'
import {
  useInterventionsActions,
  useInterventionsLoading,
  useInterventionsError,
} from '@/features/users/counselors/state/interventions'

export default function InterventionPage() {
  const { user } = useUserStore()
  const isLoading = useInterventionsLoading()
  const error = useInterventionsError()
  const { fetchUpcomingSessions, fetchSessionHistory, clearError } = useInterventionsActions()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const hasFetchedRef = useRef(false)

  useEffect(() => {
    if (!user?.id || isLoading || hasFetchedRef.current) return

    hasFetchedRef.current = true
    // Fetch both upcoming sessions and history
    fetchUpcomingSessions(user.id)
    fetchSessionHistory(user.id)
  }, [user?.id])

  const handleRetry = () => {
    if (user?.id) {
      clearError()
      fetchUpcomingSessions(user.id)
      fetchSessionHistory(user.id)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col">
        <Header />
        <div className="flex min-h-[400px] flex-col items-center justify-center">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-gray-600">Loading interventions...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col">
        <div className="flex min-h-[400px] flex-col items-center justify-center">
          <ErrorMessage message={error} />
          <button
            onClick={handleRetry}
            className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <Header />
      <div className="mx-auto mt-[4rem] w-full max-w-[1152px] min-w-[320px] px-4 sm:px-6 lg:min-w-[1024px] lg:px-8 xl:px-0">
        <h1 className="mb-6 text-2xl font-bold">Intervention Management</h1>
        <div className="space-y-6">
          <SessionsTable onCreateSession={() => setIsCreateModalOpen(true)} />
          <SessionHistory />
        </div>
      </div>
      <CreateSessionModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />
    </div>
  )
}
