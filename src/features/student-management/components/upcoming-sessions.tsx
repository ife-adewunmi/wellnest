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
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center sm:gap-0">
        <h1
          className={`${interBold.className} text-lg text-[#121417] sm:text-xl lg:text-[1.25rem]`}
        >
          Upcoming Sessions
        </h1>
        <Button
          variant="ghost"
          className={`${interMedium.className} self-start text-sm text-[#4A5568] sm:self-auto lg:text-[0.875rem]`}
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? 'Show less' : 'View all'}
        </Button>
      </div>
      <div className="mt-4 sm:mt-6 lg:mt-[1.5rem]">
        <div
          className={`overflow-x-auto rounded-lg border border-[#CBD5E0] sm:rounded-xl ${showAll ? 'max-h-64 overflow-y-auto sm:max-h-80 lg:max-h-96' : ''}`}
        >
          <table className="w-full min-w-[640px] rounded-lg border border-[#CBD5E0] sm:rounded-xl">
            <thead>
              <tr className="border-b border-[#CBD5E0] bg-gray-50">
                <th
                  className={`py-2 pl-4 text-left sm:py-3 sm:pl-6 lg:py-[13px] lg:pl-4 ${interRegular.className} text-xs font-medium text-[#121417] sm:text-sm lg:text-[0.875rem]`}
                >
                  Student
                </th>
                <th
                  className={`px-2 py-2 text-left sm:px-3 sm:py-3 lg:px-4 lg:py-[13px] ${interRegular.className} text-xs font-medium text-[#121417] sm:text-sm lg:text-[0.875rem]`}
                >
                  Date
                </th>
                <th
                  className={`px-2 py-2 text-left sm:px-3 sm:py-3 lg:px-4 lg:py-[13px] ${interRegular.className} text-xs font-medium text-[#121417] sm:text-sm lg:text-[0.875rem]`}
                >
                  Time
                </th>
                <th
                  className={`px-2 py-2 pr-4 text-left sm:px-3 sm:py-3 sm:pr-6 lg:py-[13px] lg:pr-4 ${interRegular.className} text-xs font-medium text-[#121417] sm:text-sm lg:text-[0.875rem]`}
                >
                  Issue
                </th>
              </tr>
            </thead>
            <tbody>
              {displayedSessions.map((session, index) => (
                <tr
                  key={session.id}
                  className={`border-b border-[#CBD5E0] transition-colors hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}
                >
                  <td
                    className={`py-3 pl-4 sm:py-4 sm:pl-6 lg:py-[1.625rem] lg:pl-4 ${interRegular.className} text-xs font-medium text-[#121417] sm:text-sm lg:text-[0.875rem]`}
                  >
                    {session.student}
                  </td>
                  <td
                    className={`px-2 py-3 sm:px-3 sm:py-4 lg:px-4 lg:py-[1.625rem] ${interRegular.className} text-xs text-[#61758A] sm:text-sm lg:text-[0.875rem]`}
                  >
                    {session.date}
                  </td>
                  <td
                    className={`px-2 py-3 sm:px-3 sm:py-4 lg:px-4 lg:py-[1.625rem] ${interRegular.className} text-xs text-[#61758A] sm:text-sm lg:text-[0.875rem]`}
                  >
                    {session.time}
                  </td>
                  <td
                    className={`px-2 py-3 pr-4 sm:px-3 sm:py-4 sm:pr-6 lg:py-[1.625rem] lg:pr-4 ${interRegular.className} text-xs text-[#61758A] sm:text-sm lg:text-[0.875rem]`}
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
