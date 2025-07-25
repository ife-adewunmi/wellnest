import React from 'react'
import { useViewContext } from '@/context/view-context'
import Avatar from '@/shared/components/ui/avatar'
import { MoodHistoryChart } from '@/shared/components/line-charts'
import { Button } from '@/shared/components/ui/custom-button'
import ScreenTimeDashboard from '@/shared/components/average-screen-time'
import Submenu from '@/shared/components/submenu'
import { interBold, manropeRegular } from '@/shared/styles/fonts'
import { DistressScore } from '@/shared/components/distress-score'
import SocialMedia from '@/shared/components/social-media'
import { CounselorNotes } from '@/shared/components/councilor-note'

interface Student {
  id: string
  studentId: string
  lastCheckIn: string
  riskLevel: "High" | "Medium" | "Low"
  mood: string
  screenTime: string
}

interface ProfileProps {
  student: Student | null
}

const Profile = ({ student }: ProfileProps) => {
  const { setCurrentView } = useViewContext()

  if (!student) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No student selected</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-[1152px] min-w-[320px] lg:min-w-[1024px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-0">
      <div className="bg-white">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 lg:gap-0">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 lg:gap-[1rem]">
            <div className="flex-shrink-0">
              <Avatar
                size={128}
                type="user"
              />
            </div>
            
            <div className='flex flex-col items-center gap-2'>
              <div className="flex flex-col items-center gap-1 sm:gap-2">
                <label className={`text-[#4A739C] text-[0.875rem] lg:text-[1rem] ${manropeRegular.className}`}>Risk Level:</label>
                <span className={`text-[#4A739C] text-[0.875rem] lg:text-[1rem] font-medium ${manropeRegular.className}`}>
                  {student.riskLevel}
                </span>
              </div>
              <div className='flex flex-col  items-center gap-1 sm:gap-2'>
                <label className={`text-[#4A739C] text-[0.875rem] lg:text-[1rem] ${manropeRegular.className}`}>Student ID:</label>
                <p className={`text-[#4A739C] text-[0.875rem] lg:text-[1rem] font-medium ${manropeRegular.className}`}>{student.studentId}</p>
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            <Submenu />
          </div>
        </div>

        <div className='flex justify-between items-center sm:justify-between w-full mt-[2rem] lg:mt-[3rem] mb-[1rem] gap-2 sm:gap-0'>
          <label className={`${interBold.className} text-[#121417] text-[1.125rem] lg:text-[1.375rem] text-center sm:text-left`}>Mood History</label>
          <Button
            variant="dropdown"
            className="self-center sm:self-auto"
          >
            Weekly
          </Button>
        </div>
        <div className="w-full">
          <MoodHistoryChart />
        </div>

        <div className='flex flex-row items-center justify-between w-full mt-[2rem] lg:mt-[3rem] mb-[1rem] gap-2 sm:gap-0'>
          <label className={`${interBold.className} text-[#121417] text-[1.125rem] lg:text-[1.375rem] text-center sm:text-left`}>Screen Time</label>
          <Button
            variant="dropdown"
            className="self-center sm:self-auto"
          >
            Weekly
          </Button>
        </div>
        <div className="w-full">
          <ScreenTimeDashboard />
        </div>

        <div className='flex flex-col lg:flex-row items-center mt-[3rem] lg:mt-[5rem] gap-6 lg:gap-[3.33vw]'>
          <div className="w-full lg:flex-1">
            <SocialMedia />
          </div>
          <div className="w-full lg:flex-1">
            <DistressScore />
          </div>
        </div>

        <div className='mt-[3rem] lg:mt-[5rem]'>
          <CounselorNotes />
        </div>

        <div className="mt-6 flex justify-center lg:justify-start">
          <button
            onClick={() => setCurrentView('students')}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
          >
            Back to Students Table
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile
