import React from 'react'
import { useViewContext } from '@/context/view-context'
import Avatar from '@/shared/components/ui/avatar'
import { MoodHistoryChart } from '@/features/dashboard/components/line-charts'
import { Button } from '@/shared/components/ui/custom-button'
import ScreenTimeDashboard from '@/features/dashboard/components/average-screen-time'
import Submenu from '@/shared/components/submenu'
import { interBold, manropeRegular } from '@/shared/styles/fonts'
import { DistressScore } from '@/features/dashboard/components/distress-score'
import SocialMedia from '@/features/social-media/components/social-media'
import { CounselorNotes } from '@/features/notes/components/councilor-note'

interface Student {
  id: string
  studentId: string
  lastCheckIn: string
  riskLevel: 'High' | 'Medium' | 'Low'
  mood: string
  screenTime: string
}

interface ProfileProps {
  student: Student | null
}

export const Profile = ({ student }: ProfileProps) => {
  const { setCurrentView } = useViewContext()

  if (!student) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500">No student selected</p>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-[1152px] min-w-[320px] px-4 sm:px-6 lg:min-w-[1024px] lg:px-8 xl:px-0">
      <div className="bg-white">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-0">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start lg:gap-[1rem]">
            <div className="flex-shrink-0">
              <Avatar size={128} type="user" />
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="flex flex-col items-center gap-1 sm:gap-2">
                <label
                  className={`text-[0.875rem] text-[#4A739C] lg:text-[1rem] ${manropeRegular.className}`}
                >
                  Risk Level:
                </label>
                <span
                  className={`text-[0.875rem] font-medium text-[#4A739C] lg:text-[1rem] ${manropeRegular.className}`}
                >
                  {student.riskLevel}
                </span>
              </div>
              <div className="flex flex-col items-center gap-1 sm:gap-2">
                <label
                  className={`text-[0.875rem] text-[#4A739C] lg:text-[1rem] ${manropeRegular.className}`}
                >
                  Student ID:
                </label>
                <p
                  className={`text-[0.875rem] font-medium text-[#4A739C] lg:text-[1rem] ${manropeRegular.className}`}
                >
                  {student.studentId}
                </p>
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            <Submenu />
          </div>
        </div>

        <div className="mt-[2rem] mb-[1rem] flex w-full items-center justify-between gap-2 sm:justify-between sm:gap-0 lg:mt-[3rem]">
          <label
            className={`${interBold.className} text-center text-[1.125rem] text-[#121417] sm:text-left lg:text-[1.375rem]`}
          >
            Mood History
          </label>
          <Button variant="dropdown" className="self-center sm:self-auto">
            Weekly
          </Button>
        </div>
        <div className="w-full">
          <MoodHistoryChart />
        </div>

        <div className="mt-[2rem] mb-[1rem] flex w-full flex-row items-center justify-between gap-2 sm:gap-0 lg:mt-[3rem]">
          <label
            className={`${interBold.className} text-center text-[1.125rem] text-[#121417] sm:text-left lg:text-[1.375rem]`}
          >
            Screen Time
          </label>
          <Button variant="dropdown" className="self-center sm:self-auto">
            Weekly
          </Button>
        </div>
        {/* <div className="w-full">
          <ScreenTimeDashboard />
        </div> */}

        <div className="mt-[3rem] flex flex-col items-center gap-6 lg:mt-[5rem] lg:flex-row lg:gap-[3.33vw]">
          <div className="w-full lg:flex-1">
            <SocialMedia />
          </div>
          <div className="w-full lg:flex-1">
            <DistressScore />
          </div>
        </div>

        <div className="mt-[3rem] lg:mt-[5rem]">
          <CounselorNotes />
        </div>

        <div className="mt-6 flex justify-center lg:justify-start">
          <button
            onClick={() => setCurrentView('students')}
            className="w-full rounded-lg bg-blue-600 px-6 py-3 text-center text-white transition-colors hover:bg-blue-700 sm:w-auto"
          >
            Back to Students Table
          </button>
        </div>
      </div>
    </div>
  )
}
