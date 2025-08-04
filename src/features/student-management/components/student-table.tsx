'use client'

import * as React from 'react'
import { Button } from '@/shared/components/ui/custom-button'
import { interBold, interMedium, interRegular } from '@/shared/styles/fonts'
import { useRouter } from 'next/navigation'

interface Student {
  id: string
  studentId: string
  lastCheckIn: string
  riskLevel: 'High' | 'Medium' | 'Low'
  mood: string
  screenTime: string
}

export function StudentTable() {
  const router = useRouter()
  const allStudents: Student[] = [
    {
      id: '1',
      studentId: 'CSC/20/19283',
      lastCheckIn: '1 week',
      riskLevel: 'High',
      mood: 'Happy',
      screenTime: '2 hours',
    },
    {
      id: '2',
      studentId: 'BOT/21/7547',
      lastCheckIn: '2 days',
      riskLevel: 'Medium',
      mood: 'Neutral',
      screenTime: '4 hours',
    },
    {
      id: '3',
      studentId: 'MCB/25/17293',
      lastCheckIn: '3 weeks',
      riskLevel: 'High',
      mood: 'Sad',
      screenTime: '1 hour',
    },
    {
      id: '4',
      studentId: 'BCH/20/92822',
      lastCheckIn: 'Yesterday',
      riskLevel: 'Medium',
      mood: 'Angry',
      screenTime: '5 hours',
    },
    {
      id: '5',
      studentId: 'APH/20/8222',
      lastCheckIn: '1 hour',
      riskLevel: 'Low',
      mood: 'Neutral',
      screenTime: '3 hours',
    },
    {
      id: '6',
      studentId: 'EEE/24/87932',
      lastCheckIn: '30 minutes',
      riskLevel: 'Low',
      mood: 'Happy',
      screenTime: '2 hours',
    },
    {
      id: '7',
      studentId: 'PHY/22/45678',
      lastCheckIn: '2 hours',
      riskLevel: 'Medium',
      mood: 'Worried',
      screenTime: '6 hours',
    },
    {
      id: '8',
      studentId: 'CHE/21/98765',
      lastCheckIn: '4 days',
      riskLevel: 'High',
      mood: 'Depressed',
      screenTime: '8 hours',
    },
    {
      id: '9',
      studentId: 'BIO/23/11223',
      lastCheckIn: '6 hours',
      riskLevel: 'Low',
      mood: 'Content',
      screenTime: '1.5 hours',
    },
    {
      id: '10',
      studentId: 'MAT/22/33445',
      lastCheckIn: '3 hours',
      riskLevel: 'Medium',
      mood: 'Happy',
      screenTime: '2.5 hours',
    },
    {
      id: '11',
      studentId: 'ENG/21/55667',
      lastCheckIn: '5 days',
      riskLevel: 'High',
      mood: 'Stressed',
      screenTime: '7 hours',
    },
    {
      id: '12',
      studentId: 'HIS/23/77889',
      lastCheckIn: '1 day',
      riskLevel: 'Low',
      mood: 'Calm',
      screenTime: '1 hour',
    },
    {
      id: '13',
      studentId: 'GEO/24/99001',
      lastCheckIn: '2 weeks',
      riskLevel: 'High',
      mood: 'Anxious',
      screenTime: '9 hours',
    },
    {
      id: '14',
      studentId: 'ART/22/11223',
      lastCheckIn: '4 hours',
      riskLevel: 'Medium',
      mood: 'Creative',
      screenTime: '3 hours',
    },
    {
      id: '15',
      studentId: 'MUS/21/44556',
      lastCheckIn: '6 hours',
      riskLevel: 'Low',
      mood: 'Joyful',
      screenTime: '2 hours',
    },
  ]

  const [showAll, setShowAll] = React.useState(false)

  // Show first 10 items by default, all items when showAll is true
  const displayedStudents = showAll ? allStudents : allStudents.slice(0, 10)

  const handleViewDetails = (studentId: string) => {
    // Navigate to student details page or open modal
    router.push(`/student-details/${studentId}`)
  }
  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'High':
        return 'py-1 sm:py-2 w-16 sm:w-20 lg:w-[86px] text-xs sm:text-sm bg-[#FED7D7B2] rounded-full'
      case 'Medium':
        return 'py-1 sm:py-2 w-16 sm:w-20 lg:w-[86px] text-xs sm:text-sm bg-[#FEFCBFB2] rounded-full'
      case 'Low':
        return 'py-1 sm:py-2 w-16 sm:w-20 lg:w-[86px] text-xs sm:text-sm bg-[#C6F6D5B2] rounded-full'
      default:
        return 'py-1 sm:py-2 w-16 sm:w-20 lg:w-[86px] text-xs sm:text-sm bg-[#FED7D7B2] rounded-full'
    }
  }

  return (
    <div className="mt-8 sm:mt-12 lg:mt-[5rem]">
      <div className="flex sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <h1 className={`${interBold.className} text-lg sm:text-xl lg:text-[1.25rem] text-[#121417]`}>Student Table</h1>
        <Button
          variant="ghost"
          className={`${interMedium.className} text-sm lg:text-[0.875rem] text-[#4A5568] self-start sm:self-auto`}
          onClick={() => {
            if (showAll) {
              setShowAll(false)
            } else {
              router.push('/student-table')
            }
          }}
        >
          {showAll ? 'Show less' : 'View all table'}
        </Button>
      </div>
      <div className="mt-4 sm:mt-6 lg:mt-[25px]">
        <div
          className={`overflow-x-auto rounded-lg sm:rounded-xl border border-[#CBD5E0] ${showAll ? 'max-h-64 sm:max-h-80 lg:max-h-96 overflow-y-auto' : ''}`}
        >
          <table className="w-full min-w-[640px] rounded-lg sm:rounded-xl border border-[#CBD5E0]">
            <thead>
              <tr className="border-b border-[#CBD5E0] bg-gray-50">

                <th
                  className={`py-2 sm:py-3 lg:py-[12px] pl-4 sm:pl-6 lg:pl-8 text-left ${interRegular.className} text-xs sm:text-sm lg:text-[0.875rem] text-[#121417] font-medium`}
                >
                  Student ID
                </th>
                <th
                  className={`py-2 sm:py-3 lg:py-[12px] px-2 sm:px-3 text-left ${interRegular.className} text-xs sm:text-sm lg:text-[0.875rem] text-[#121417] font-medium`}
                >
                  Last check-in
                </th>
                <th
                  className={`py-2 sm:py-3 lg:py-[12px] px-2 sm:px-3 text-left ${interRegular.className} text-xs sm:text-sm lg:text-[0.875rem] text-[#121417] font-medium`}
                >
                  Risk level
                </th>
                <th
                  className={`py-2 sm:py-3 lg:py-[12px] px-2 sm:px-3 text-left ${interRegular.className} text-xs sm:text-sm lg:text-[0.875rem] text-[#121417] font-medium`}
                >
                  Mood
                </th>
                <th
                  className={`py-2 sm:py-3 lg:py-[12px] px-2 sm:px-3 pr-4 sm:pr-6 lg:pr-8 text-left ${interRegular.className} text-xs sm:text-sm lg:text-[0.875rem] text-[#121417] font-medium`}
                >
                  Screen time
                </th>
              </tr>
            </thead>
            <tbody>
              {displayedStudents.map((student, index) => (
                <tr key={student.id} className={`border-b border-[#CBD5E0] hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                  <td
                    className={`py-3 sm:py-4 lg:py-[1.625rem] pl-4 sm:pl-6 lg:pl-8 ${interRegular.className} text-xs sm:text-sm lg:text-[0.875rem] text-[#121417] font-medium`}
                  >
                    {student.studentId}
                  </td>
                  <td
                    className={`py-3 sm:py-4 lg:py-[1.625rem] px-2 sm:px-3 ${interRegular.className} text-xs sm:text-sm lg:text-[0.875rem] text-[#61758A]`}
                  >
                    {student.lastCheckIn}
                  </td>
                  <td className="py-3 sm:py-4 lg:py-[1.625rem] px-2 sm:px-3">
                    <span
                      className={`flex justify-center ${interMedium.className} ${getRiskLevelColor(student.riskLevel)} text-xs sm:text-sm text-[#121417]`}
                    >
                      {student.riskLevel}
                    </span>
                  </td>
                  <td
                    className={`py-3 sm:py-4 lg:py-[1.625rem] px-2 sm:px-3 ${interRegular.className} text-xs sm:text-sm lg:text-[0.875rem] text-[#61758A]`}
                  >
                    {student.mood}
                  </td>
                  <td
                    className={`py-3 sm:py-4 lg:py-[1.625rem] px-2 sm:px-3 pr-4 sm:pr-6 lg:pr-8 ${interRegular.className} text-xs sm:text-sm lg:text-[0.875rem] text-[#61758A]`}
                  >
                    {student.screenTime}
                  </td>
                   <td className="py-3 sm:py-4 lg:py-[1.625rem] px-2 sm:px-3 pr-4 sm:pr-6 lg:pr-8">
                    <Button
                      variant="destructive"
                      // onClick={() => handleViewDetails(student.id)}
                    >
                      View details
                    </Button>
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
