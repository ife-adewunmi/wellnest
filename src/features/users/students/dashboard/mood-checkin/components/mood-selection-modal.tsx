"use client"

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
    <div className="fixed inset-0 bg-[#00000066] bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-[20px] p-8 max-w-[600px] w-full mx-4 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Progress bar */}
        <div className="w-full flex justify-center">
          <div className="flex w-full max-w-[409px]">
            <div className="flex-1 h-2 bg-[#63B3ED] rounded-full"></div>
            <div className="flex-1 h-2 bg-[#E5E7EB] rounded-full"></div>
            <div className="flex-1 h-2 bg-[#E5E7EB] rounded-full"></div>
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-8">
          <div className="mb-2 flex items-center mt-[2.5rem] justify-center">
            <span className="text-2xl">👋</span>
                      <h2 className={`${interBold.className} text-[1.5rem] text-[#000000] mb-[8px]`}>
            Hey {userName}!
          </h2>
          </div>

          <h3 className={`${interBold.className} text-[1.75rem] text-[#111111] mb-6`}>
            How are you feeling today?
          </h3>

          {/* Mood options */}
          <div className="flex justify-center space-x-4 mb-8">
            {moodOptions.map((mood) => (
              <button
                key={mood.type}
                onClick={() => onMoodSelect(mood.type)}
                className={`flex flex-col items-center p-3 rounded-lg transition-all ${
                  selectedMood === mood.type
                    ? 'bg-blue-50 border-2 border-blue-500'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="w-16 h-16 mb-2">
                  <Image
                    src={mood.image}
                    alt={mood.label}
                    width={64}
                    height={64}
                    className="w-full h-full object-contain"
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
            className={`${interBold.className} cursor-pointer bg-[#63B3ED] hover:bg-[#2563EB] justify-end flex  text-white px-8 py-3 rounded-full text-[16px] disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Continue →
          </Button>
             </div>
        </div>
      </div>
    </div>
  )
}
