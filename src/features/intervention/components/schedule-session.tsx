'use client'

import { useState, useEffect } from 'react'
import { ScheduleHeader } from './schedule-header'
import { SessionsTable } from './session-table'
import { LogHistoryTable } from './log-history-table'
import { CreateSessionModal } from './create-session-modal'
import { useSessions } from '../hooks/use-sessions'
import { DashboardHeader } from '@/features/dashboard'
import { interBold } from '@/shared/styles/fonts'
import { getSession } from '@/features/auth/lib/auth'

export default function ScheduleSession() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  // Get current user session
  useEffect(() => {
    const loadUser = async () => {
      try {
        const session = await getSession()
        console.log('Current user session:', session)
        if (session?.user) {
          setCurrentUser(session.user)
        } else {
          // Fallback for development
          setCurrentUser({ id: 'mock-counselor', role: 'COUNSELOR' })
        }
      } catch (error) {
        console.error('Error loading user session:', error)
        // Fallback for development
        setCurrentUser({ id: 'mock-counselor', role: 'COUNSELOR' })
      }
    }

    loadUser()
  }, [])

  const sessionHook = useSessions(
    currentUser?.id,
    currentUser?.role || 'COUNSELOR'
  )
  console.log('Upcoming sessions:', sessionHook)


  const handleCreateSession = () => {
    setIsModalOpen(true)
  }

  if (!currentUser || sessionHook.loading) {
    return (
      <div className="flex flex-col">
        <DashboardHeader />
        <div className="mt-[4.44vh] flex flex-col items-center justify-center">
          <div className="mx-auto w-full max-w-[1152px] min-w-[320px] px-4 sm:px-6 lg:min-w-[1024px] lg:px-8 xl:px-0">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading sessions...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <DashboardHeader />
      <div className="mt-[4.44vh] flex flex-col items-center justify-center">
        <div className="mx-auto w-full max-w-[1152px] min-w-[320px] px-4 sm:px-6 lg:min-w-[1024px] lg:px-8 xl:px-0">
          {/* Error Message */}
          {sessionHook.error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{sessionHook.error}</p>
            </div>
          )}

          {/* Schedule Session Section */}
          <div className="flex flex-col gap-[24px] bg-white">
            <ScheduleHeader onCreateSession={handleCreateSession} />
            <SessionsTable sessions={sessionHook.upcomingSessions} />
          </div>

          {/* Log History Section */}
          <div className="mt-[24px] flex flex-col gap-[24px]">
            <div className="">
              <h2 className={`${interBold.className} text-[1rem] text-[#121417] lg:text-[1.5rem]`}>
                Log History
              </h2>
            </div>
            <LogHistoryTable logEntries={sessionHook.logHistory} />
          </div>
        </div>

        {/* Create Session Modal */}
        <CreateSessionModal open={isModalOpen} onOpenChange={setIsModalOpen} onSave={sessionHook.addSession} />
      </div>
    </div>
  )
}
