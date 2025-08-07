'use client'

import * as React from 'react'
import { Button } from '@/shared/components/ui/custom-button'
import { interBold, interMedium, interRegular } from '@/shared/styles/fonts'
import { useRouter } from 'next/navigation'
import { useSessions } from '@/features/intervention/hooks/use-sessions'
import { getSession } from '@/features/auth/lib/auth'

interface Session {
  id: string
  student: string
  date: string
  time: string
  issue: string
}

export function UpcomingSessions() {
  const router = useRouter()
  const [showAll, setShowAll] = React.useState(false)
  const [currentUser, setCurrentUser] = React.useState<any>(null)

  // Get current user session
  React.useEffect(() => {
    const loadUser = async () => {
      try {
        const session = await getSession()
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

  const { upcomingSessions, loading } = useSessions(
    currentUser?.id,
    currentUser?.role || 'COUNSELOR'
  )

  // Convert intervention sessions to the expected format
  const sessions: Session[] = upcomingSessions.map((session, index) => ({
    id: (index + 1).toString(),
    student: session.student, // This should work as the convertToUISession maps studentName to student
    date: session.date,
    time: session.time,
    issue: session.intervention,
  }))

  console.log('🔍 Dashboard upcoming sessions:', { upcomingSessions, sessions })

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

  const handleSession = () => {
    // setShowAll(!showAll)
    router.push('/intervention')
  }

  if (loading) {
    return (
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
          <h1 className={`${interBold.className} text-lg sm:text-xl lg:text-[1.25rem] text-[#121417]`}>
            Upcoming Sessions
          </h1>
          <Button
            variant="ghost"
            className={`${interMedium.className} text-sm lg:text-[0.875rem] text-[#4A5568] self-start sm:self-auto`}
            onClick={handleSession}
          >
            View all
          </Button>
        </div>
        <div className="mt-4 sm:mt-6 lg:mt-[1.5rem] flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading sessions...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <h1 className={`${interBold.className} text-lg sm:text-xl lg:text-[1.25rem] text-[#121417]`}>
          Upcoming Sessions
        </h1>
        <Button
          variant="ghost"
          className={`${interMedium.className} text-sm lg:text-[0.875rem] text-[#4A5568] self-start sm:self-auto`}
          onClick={handleSession}
        >
          View all
        </Button>
      </div>
      <div className="mt-4 sm:mt-6 lg:mt-[1.5rem]">
        {sessions.length === 0 ? (
          <p className="text-sm text-gray-600">No upcoming sessions to show.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg sm:rounded-xl border border-[#CBD5E0]">
            <table className="w-full min-w-[640px] rounded-lg sm:rounded-xl border border-[#CBD5E0]">
              <thead>
                <tr className="border-b border-[#CBD5E0] bg-gray-50">
                  <th className={`py-2 sm:py-3 lg:py-[13px] pl-4 sm:pl-6 lg:pl-4 text-left ${interRegular.className} text-xs sm:text-sm lg:text-[0.875rem] text-[#121417] font-medium`}>
                    Student
                  </th>
                  <th className={`py-2 sm:py-3 lg:py-[13px] px-2 sm:px-3 lg:px-4 text-left ${interRegular.className} text-xs sm:text-sm lg:text-[0.875rem] text-[#121417] font-medium`}>
                    Date
                  </th>
                  <th className={`py-2 sm:py-3 lg:py-[13px] px-2 sm:px-3 lg:px-4 text-left ${interRegular.className} text-xs sm:text-sm lg:text-[0.875rem] text-[#121417] font-medium`}>
                    Time
                  </th>
                  <th className={`py-2 sm:py-3 lg:py-[13px] px-2 sm:px-3 pr-4 sm:pr-6 lg:pr-4 text-left ${interRegular.className} text-xs sm:text-sm lg:text-[0.875rem] text-[#121417] font-medium`}>
                    Issue
                  </th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session, index) => (
                  <tr key={session.id} className={`border-b border-[#CBD5E0] hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                    <td className={`py-3 sm:py-4 lg:py-[1.625rem] pl-4 sm:pl-6 lg:pl-4 ${interRegular.className} text-xs sm:text-sm lg:text-[0.875rem] text-[#121417] font-medium`}>
                      {session.student}
                    </td>
                    <td className={`py-3 sm:py-4 lg:py-[1.625rem] px-2 sm:px-3 lg:px-4 ${interRegular.className} text-xs sm:text-sm lg:text-[0.875rem] text-[#61758A]`}>
                      {session.date}
                    </td>
                    <td className={`py-3 sm:py-4 lg:py-[1.625rem] px-2 sm:px-3 lg:px-4 ${interRegular.className} text-xs sm:text-sm lg:text-[0.875rem] text-[#61758A]`}>
                      {session.time}
                    </td>
                    <td className={`py-3 sm:py-4 lg:py-[1.625rem] px-2 sm:px-3 pr-4 sm:pr-6 lg:pr-4 ${interRegular.className} text-xs sm:text-sm lg:text-[0.875rem] text-[#61758A]`}>
                      {session.issue}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
