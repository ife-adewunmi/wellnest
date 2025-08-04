'use client'

import * as React from 'react'
import Avatar from '@/shared/components/ui/avatar'
import { Button } from '@/shared/components/ui/custom-button'
import { interBold, interMedium, interRegular } from '@/shared/styles/fonts'

interface MoodCheckIn {
  name: string
  avatar: string
  time: string
  message: string
  emoji: string
}

interface MoodCheckInsProps {
  checkIns: MoodCheckIn[]
}

export function MoodCheckIns({ checkIns }: MoodCheckInsProps) {
  const [showAll, setShowAll] = React.useState(false)

  const allCheckIns = [
    ...checkIns,
    {
      name: 'Emma S.',
      avatar: '/placeholder.svg?height=32&width=32',
      time: '8:45 AM',
      message: 'Had a really productive study session today!',
      emoji: '😊',
    },
    {
      name: 'Marcus T.',
      avatar: '/placeholder.svg?height=32&width=32',
      time: '11:20 AM',
      message: 'Feeling anxious about the upcoming exams.',
      emoji: '😰',
    },
    {
      name: 'Zara K.',
      avatar: '/placeholder.svg?height=32&width=32',
      time: '3:15 PM',
      message: 'Great day with friends at the campus event!',
      emoji: '😄',
    },
    {
      name: 'David L.',
      avatar: '/placeholder.svg?height=32&width=32',
      time: '5:30 PM',
      message: 'Struggling with time management lately.',
      emoji: '😔',
    },
  ]

  const displayedCheckIns = showAll ? allCheckIns : checkIns

  return (
    <div className="rounded-lg sm:rounded-xl border border-[#CBD5E0] p-3 sm:p-4 lg:p-[1rem]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
        <div>
          <h1 className={`${interBold.className} text-lg sm:text-xl lg:text-[1.25rem] text-[#121417]`}>Mood Check-Ins</h1>
          <h2 className={`${interRegular.className} text-sm lg:text-[0.875rem] text-[#667582]`}>
            Recent student mood check-in responses
          </h2>
        </div>
        {/* <Button variant="ghost" className="text-blue-600 hover:text-blue-700" onClick={() => setShowAll(!showAll)}>
          {showAll ? "Show less" : "View all"}
        </Button> */}
      </div>
      <div className={`space-y-3 sm:space-y-4 mt-3 sm:mt-4 ${showAll ? 'max-h-64 sm:max-h-80 lg:max-h-96 overflow-y-auto' : ''} overflow-y-auto`}>
        {displayedCheckIns.map((checkIn, index) => (
          <div key={index} className="flex gap-3 sm:gap-4 py-2 sm:py-[8px]">
            <Avatar
              size={32}
              type="user"
              //   headerImage={user?.header_image}
              //   profilePicture={user?.thumbnail}
              customDefault="thumbnail" // ✅ Forces fallback to DefaultThumbnail on this page only
            />
            <div className="flex w-full flex-col">
              <div className="flex w-full items-start sm:items-center justify-between flex-col sm:flex-row gap-1 sm:gap-0">
                <p className={`text-sm sm:text-base lg:text-[1rem] ${interMedium.className} text-[#121417]`}>
                  {checkIn.name} - {checkIn.emoji}
                </p>
                <span className={`${interRegular.className} text-xs sm:text-sm lg:text-[0.875rem] text-[#667582] flex-shrink-0`}>
                  {checkIn.time}
                </span>
              </div>
              <p className={`${interRegular.className} text-xs sm:text-sm lg:text-[0.875rem] text-[#667582] mt-1`}>
                {checkIn.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
