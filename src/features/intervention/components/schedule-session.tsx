'use client'

import { useState } from 'react'
import { ScheduleHeader } from './schedule-header'
import { SessionsTable } from './session-table'
import { LogHistoryTable } from './log-history-table'
import { CreateSessionModal } from './create-session-modal'
import { useSessions } from '../hooks/use-sessions'
import { interBold } from '@/shared/styles/fonts'
import { Header } from '@/features/users/counselors/components/header'

export default function ScheduleSession() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { upcomingSessions, logHistory, addSession } = useSessions()

  const handleCreateSession = () => {
    setIsModalOpen(true)
  }

  return (
    <div className="flex flex-col">
      <Header />
      <div className="mt-[4.44vh] flex flex-col items-center justify-center">
        <div className="mx-auto w-full max-w-[1152px] min-w-[320px] px-4 sm:px-6 lg:min-w-[1024px] lg:px-8 xl:px-0">
          {/* Schedule Session Section */}
          <div className="flex flex-col gap-[24px] bg-white">
            <ScheduleHeader onCreateSession={handleCreateSession} />
            <SessionsTable sessions={upcomingSessions} />
          </div>

          {/* Log History Section */}
          <div className="mt-[24px] flex flex-col gap-[24px]">
            <div className="">
              <h2 className={`${interBold.className} text-[1rem] text-[#121417] lg:text-[1.5rem]`}>
                Log History
              </h2>
            </div>
            <LogHistoryTable logEntries={logHistory} />
          </div>
        </div>

        {/* Create Session Modal */}
        <CreateSessionModal open={isModalOpen} onOpenChange={setIsModalOpen} onSave={addSession} />
      </div>
    </div>
  )
}
