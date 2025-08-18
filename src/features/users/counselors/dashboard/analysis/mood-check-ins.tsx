'use client'

import { useState } from 'react'
import { Button } from '@/shared/components/ui/custom-button'
import { interBold, interMedium, interRegular } from '@/shared/styles/fonts'
import { MoodCheckIn } from '../../types/dashboard.types'
import Image from 'next/image'

interface MoodCheckInsProps {
  checkIns: MoodCheckIn[]
}

export function MoodCheckIns({ checkIns }: MoodCheckInsProps) {
  const [showAll, setShowAll] = useState(false)

  const displayedCheckIns = showAll ? checkIns : checkIns.slice(0, 5)

  // Get time ago string
  const getTimeAgo = (dateInput: string | Date) => {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  }

  // Map mood to color
  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'HAPPY':
        return 'text-green-600'
      case 'SAD':
      case 'VERY_SAD':
        return 'text-red-600'
      case 'ANXIOUS':
      case 'STRESSED':
        return 'text-orange-600'
      case 'NEUTRAL':
      default:
        return 'text-gray-600'
    }
  }

  if (checkIns.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 p-6">
        <h3 className={`${interBold.className} mb-4 text-[0.875rem] text-[#0F141A]`}>
          Recent Mood Check-ins
        </h3>
        <p className={`${interRegular.className} py-8 text-center text-[0.875rem] text-[#61758A]`}>
          No recent mood check-ins
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-gray-200 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className={`${interBold.className} text-[0.875rem] text-[#0F141A]`}>Mood Check-ins</h3>
        {checkIns.length > 5 && (
          <Button
            variant="ghost"
            className={`${interMedium.className} text-sm text-[#4A5568]`}
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show less' : 'View all'}
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {displayedCheckIns.map((checkIn) => (
          <div
            key={checkIn.id}
            className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-gray-50"
          >
            <div className="flex-shrink-0">
              {checkIn.avatar && checkIn.studentName ? (
                <Image
                  src={checkIn.avatar}
                  alt={checkIn.studentName}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                  <span className="text-xs font-medium text-gray-600">
                    {checkIn.studentName?.charAt(0) || '?'}
                  </span>
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className={`${interMedium.className} text-sm text-[#121417]`}>
                  {checkIn.studentName}
                </span>
                <span className="text-lg">{checkIn.emoji}</span>
                <span className={`text-xs ${getMoodColor(checkIn.mood)} ${interRegular.className}`}>
                  {checkIn.mood}
                </span>
              </div>
              <p className={`${interRegular.className} mt-1 truncate text-xs text-[#61758A]`}>
                {checkIn.description}
              </p>
              <span className={`${interRegular.className} mt-1 text-xs text-[#A0AEC0]`}>
                {getTimeAgo(checkIn.createdAt)}
              </span>
            </div>

            {checkIn.riskScore && checkIn.riskScore >= 7 && (
              <div className="flex-shrink-0">
                <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                  High Risk
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
