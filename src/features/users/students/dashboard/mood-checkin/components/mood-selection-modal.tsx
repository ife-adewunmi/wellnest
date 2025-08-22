'use client'

import { Button } from '@/shared/components/ui/button'
import { X } from 'lucide-react'
import Image from 'next/image'
import { MoodType } from '@/shared/types/common.types'
import { interBold, interRegular } from '@/shared/styles/fonts'

interface MoodSelectionModalProps {
  selectedMood: MoodType | null
  onMoodSelect: (mood: MoodType) => void
  onContinue: () => void
  onClose: () => void
  canProceed: boolean
  userName?: string
}

const moodOptions = [
  { type: 'GOOD' as MoodType, label: 'Good', image: '/images/good.png' },
  { type: 'HAPPY' as MoodType, label: 'Happy', image: '/images/happy.png' },
  { type: 'NEUTRAL' as MoodType, label: 'Neutral', image: '/images/neutral.png' },
  { type: 'BAD' as MoodType, label: 'Bad', image: '/images/bad.png' },
  { type: 'SAD' as MoodType, label: 'Sad', image: '/images/sad.png' },
]

export function MoodSelectionModal({
  selectedMood,
  onMoodSelect,
  onContinue,
  onClose,
  canProceed,
  userName = 'Samuel',
}: MoodSelectionModalProps) {
  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-[#00000066]">
      <div className="relative mx-4 w-full max-w-[600px] rounded-[20px] bg-white p-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Progress bar */}
        <div className="flex w-full justify-center">
          <div className="flex w-full max-w-[409px]">
            <div className="h-2 flex-1 rounded-full bg-[#63B3ED]"></div>
            <div className="h-2 flex-1 rounded-full bg-[#E5E7EB]"></div>
            <div className="h-2 flex-1 rounded-full bg-[#E5E7EB]"></div>
          </div>
        </div>

        {/* Content */}
        <div className="mb-8 text-center">
          <div className="mt-[2.5rem] mb-2 flex items-center justify-center">
            <span className="text-2xl">👋</span>
            <h2 className={`${interBold.className} mb-[8px] text-[1.5rem] text-[#000000]`}>
              Hey {userName}!
            </h2>
          </div>

          <h3 className={`${interBold.className} mb-6 text-[1.75rem] text-[#111111]`}>
            How are you feeling today?
          </h3>

          {/* Mood options */}
          <div className="mb-8 flex justify-center space-x-4">
            {moodOptions.map((mood) => (
              <button
                key={mood.type}
                onClick={() => onMoodSelect(mood.type)}
                className={`flex flex-col items-center rounded-lg p-3 transition-all ${
                  selectedMood === mood.type
                    ? 'border-2 border-blue-500 bg-blue-50'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="mb-2 h-16 w-16">
                  <Image
                    src={mood.image}
                    alt={mood.label}
                    width={64}
                    height={64}
                    className="h-full w-full object-contain"
                  />
                </div>
                <span className={`${interRegular.className} text-[14px] text-[#111111]`}>
                  {mood.label}
                </span>
              </button>
            ))}
          </div>

          {/* Continue button */}
          <div className="flex w-full justify-end">
            <Button
              onClick={onContinue}
              disabled={!canProceed}
              className={`${interBold.className} flex cursor-pointer justify-end rounded-full bg-[#63B3ED] px-8 py-3 text-[16px] text-white hover:bg-[#2563EB] disabled:cursor-not-allowed disabled:opacity-50`}
            >
              Continue →
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
