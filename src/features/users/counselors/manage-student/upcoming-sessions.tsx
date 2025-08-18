'use client'

import * as React from 'react'
import { Button } from '@/shared/components/ui/custom-button'
import { interBold, interMedium, interRegular } from '@/shared/styles/fonts'
import {
  useActivities,
  useActivitiesLoading,
} from '@/features/users/counselors/state/activities/activitiesSelectors'
import { LoadingSpinner } from '@/shared/components/loading-spinner'

interface Session {
  id: string
  studentName: string
  scheduledAt: Date
  title: string
  status: string
  duration: number
}

export function UpcomingSessions() {
  const [showAll, setShowAll] = React.useState(false)
  const activities = useActivities()
  const isLoading = useActivitiesLoading()

  // Filter for upcoming sessions only
  const upcomingSessions = React.useMemo(() => {
    const now = new Date()
    return activities
      .filter(
        (activity) =>
          activity.type === 'session' &&
          activity.status === 'SCHEDULED' &&
          new Date(activity.scheduledAt) >= now,
      )
      .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
      .map((activity) => ({
        id: activity.id,
        studentName: activity.studentName || 'Unknown Student',
        scheduledAt: new Date(activity.scheduledAt),
        title: activity.title,
        status: activity.status,
        duration: activity.duration,
      }))
  }, [activities])

  const displayedSessions = showAll ? upcomingSessions : upcomingSessions.slice(0, 3)

  // Format date and time
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  // Show loading state
  if (isLoading && activities.length === 0) {
    return (
      <div>
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center sm:gap-0">
          <h1
            className={`${interBold.className} text-lg text-[#121417] sm:text-xl lg:text-[1.25rem]`}
          >
            Upcoming Sessions
          </h1>
        </div>
        <div className="mt-4 sm:mt-6 lg:mt-[1.5rem]">
          <div className="flex items-center justify-center overflow-x-auto rounded-lg border border-[#CBD5E0] p-8 sm:rounded-xl">
            <LoadingSpinner size="medium" />
          </div>
        </div>
      </div>
    )
  }

  // Show empty state
  if (upcomingSessions.length === 0) {
    return (
      <div>
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center sm:gap-0">
          <h1
            className={`${interBold.className} text-lg text-[#121417] sm:text-xl lg:text-[1.25rem]`}
          >
            Upcoming Sessions
          </h1>
        </div>
        <div className="mt-4 sm:mt-6 lg:mt-[1.5rem]">
          <div className="flex items-center justify-center overflow-x-auto rounded-lg border border-[#CBD5E0] p-8 sm:rounded-xl">
            <p className={`${interRegular.className} text-[0.875rem] text-[#61758A]`}>
              No upcoming sessions scheduled
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center sm:gap-0">
        <h1
          className={`${interBold.className} text-lg text-[#121417] sm:text-xl lg:text-[1.25rem]`}
        >
          Upcoming Sessions
        </h1>
        {upcomingSessions.length > 3 && (
          <Button
            variant="ghost"
            className={`${interMedium.className} self-start text-sm text-[#4A5568] sm:self-auto lg:text-[0.875rem]`}
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show less' : 'View all'}
          </Button>
        )}
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
                  Topic
                </th>
                <th
                  className={`px-2 py-2 pr-4 text-left sm:px-3 sm:py-3 sm:pr-6 lg:py-[13px] lg:pr-4 ${interRegular.className} text-xs font-medium text-[#121417] sm:text-sm lg:text-[0.875rem]`}
                >
                  Duration
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
                    {session.studentName}
                  </td>
                  <td
                    className={`px-2 py-3 sm:px-3 sm:py-4 lg:px-4 lg:py-[1.625rem] ${interRegular.className} text-xs text-[#61758A] sm:text-sm lg:text-[0.875rem]`}
                  >
                    {formatDate(session.scheduledAt)}
                  </td>
                  <td
                    className={`px-2 py-3 sm:px-3 sm:py-4 lg:px-4 lg:py-[1.625rem] ${interRegular.className} text-xs text-[#61758A] sm:text-sm lg:text-[0.875rem]`}
                  >
                    {formatTime(session.scheduledAt)}
                  </td>
                  <td
                    className={`px-2 py-3 pr-4 sm:px-3 sm:py-4 sm:pr-6 lg:py-[1.625rem] lg:pr-4 ${interRegular.className} text-xs text-[#61758A] sm:text-sm lg:text-[0.875rem]`}
                  >
                    {session.title}
                  </td>
                  <td
                    className={`px-2 py-3 pr-4 sm:px-3 sm:py-4 sm:pr-6 lg:py-[1.625rem] lg:pr-4 ${interRegular.className} text-xs text-[#61758A] sm:text-sm lg:text-[0.875rem]`}
                  >
                    {session.duration} min
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
