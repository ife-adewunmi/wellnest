'use client'

import * as React from 'react'
import { Button } from '@/shared/components/ui/custom-button'
import { interBold, interMedium, interRegular } from '@/shared/styles/fonts'

interface Session {
  id: string
  student: string
  date: string
  time: string
  issue: string
}

export function UpcomingSessions() {
  const [showAll, setShowAll] = React.useState(false)

  const sessions: Session[] = [
    {
      id: '1',
      student: 'Sophia Evans',
      date: '2024-07-29',
      time: '10:00 AM',
      issue: 'Academic Planning',
    },
    {
      id: '2',
      student: 'Liam Foster',
      date: '2024-07-30',
      time: '2:00 PM',
      issue: 'Personal Development',
    },
    {
      id: '3',
      student: 'Liam Foster',
      date: '2024-07-30',
      time: '2:00 PM',
      issue: 'Personal Development',
    },
  ]

  const allSessions: Session[] = [
    ...sessions,
    {
      id: '4',
      student: 'Marcus Thompson',
      date: '2024-07-31',
      time: '11:00 AM',
      issue: 'Stress Management',
    },
    {
      id: '5',
      student: 'Emma Rodriguez',
      date: '2024-08-01',
      time: '3:30 PM',
      issue: 'Academic Support',
    },
    {
      id: '6',
      student: 'David Kim',
      date: '2024-08-02',
      time: '9:00 AM',
      issue: 'Career Counseling',
    },
  ]

  const displayedSessions = showAll ? allSessions : sessions

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <h1 className={`${interBold.className} text-lg sm:text-xl lg:text-[1.25rem] text-[#121417]`}>
          Upcoming Sessions
        </h1>
        <Button
           variant="ghost"
                   className={`${interMedium.className} text-sm lg:text-[0.875rem] text-[#4A5568] self-start sm:self-auto`}
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? 'Show less' : 'View all'}
        </Button>
      </div>
      <div className="mt-4 sm:mt-6 lg:mt-[1.5rem]">
        <div
          className={`overflow-x-auto rounded-lg sm:rounded-xl border border-[#CBD5E0] ${showAll ? 'max-h-64 sm:max-h-80 lg:max-h-96 overflow-y-auto' : ''}`}
        >
          <table className="w-full min-w-[640px] rounded-lg sm:rounded-xl border border-[#CBD5E0]">
            <thead>
              <tr className="border-b border-[#CBD5E0] bg-gray-50">
                <th
                  className={`py-2 sm:py-3 lg:py-[13px] pl-4 sm:pl-6 lg:pl-4 text-left ${interRegular.className} text-xs sm:text-sm lg:text-[0.875rem] text-[#121417] font-medium`}
                >
                  Student
                </th>
                <th
                  className={`py-2 sm:py-3 lg:py-[13px] px-2 sm:px-3 lg:px-4 text-left ${interRegular.className} text-xs sm:text-sm lg:text-[0.875rem] text-[#121417] font-medium`}
                >
                  Date
                </th>
                <th
                  className={`py-2 sm:py-3 lg:py-[13px] px-2 sm:px-3 lg:px-4 text-left ${interRegular.className} text-xs sm:text-sm lg:text-[0.875rem] text-[#121417] font-medium`}
                >
                  Time
                </th>
                <th
                  className={`py-2 sm:py-3 lg:py-[13px] px-2 sm:px-3 pr-4 sm:pr-6 lg:pr-4 text-left ${interRegular.className} text-xs sm:text-sm lg:text-[0.875rem] text-[#121417] font-medium`}
                >
                  Issue
                </th>
              </tr>
            </thead>
            <tbody>
              {displayedSessions.map((session, index) => (
                <tr key={session.id} className={`border-b border-[#CBD5E0] hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                  <td
                    className={`py-3 sm:py-4 lg:py-[1.625rem] pl-4 sm:pl-6 lg:pl-4 ${interRegular.className} text-xs sm:text-sm lg:text-[0.875rem] text-[#121417] font-medium`}
                  >
                    {session.student}
                  </td>
                  <td
                    className={`py-3 sm:py-4 lg:py-[1.625rem] px-2 sm:px-3 lg:px-4 ${interRegular.className} text-xs sm:text-sm lg:text-[0.875rem] text-[#61758A]`}
                  >
                    {session.date}
                  </td>
                  <td
                    className={`py-3 sm:py-4 lg:py-[1.625rem] px-2 sm:px-3 lg:px-4 ${interRegular.className} text-xs sm:text-sm lg:text-[0.875rem] text-[#61758A]`}
                  >
                    {session.time}
                  </td>
                  <td
                    className={`py-3 sm:py-4 lg:py-[1.625rem] px-2 sm:px-3 pr-4 sm:pr-6 lg:pr-4 ${interRegular.className} text-xs sm:text-sm lg:text-[0.875rem] text-[#61758A]`}
                  >
                    {session.issue}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
