'use client'

import { Button } from '@/shared/components/ui/button'
import { Textarea } from '@/shared/components/ui/textarea'
import { X } from 'lucide-react'
import { interBold, interRegular } from '@/shared/styles/fonts'
import { MoodType } from '@/shared/types/common.types'

interface FinalModalProps {
  selectedMood: MoodType
  selectedReasons: string[]
  description: string
  onReasonToggle: (reason: string) => void
  onDescriptionChange: (description: string) => void
  onSubmit: () => void
  onPrevious: () => void
  onClose: () => void
  isLoading: boolean
}

const moodLabels: Record<MoodType, string> = {
  GOOD: 'Good',
  HAPPY: 'Happy',
  NEUTRAL: 'Neutral',
  BAD: 'Bad',
  SAD: 'Sad',
}

const moodColors: Record<MoodType, string> = {
  GOOD: '#10B981', // Green color
  HAPPY: '#F59E0B', // Yellow color
  NEUTRAL: '#6B7280', // Gray color
  BAD: '#F97316', // Orange color
  SAD: '#8B5CF6', // Lilac color
}

const reasonOptions = [
  'Health',
  'Sleep',
  'Friends',
  'Family',
  'Weather',
  'School',
  'Finances',
  'Exercise',
  'Relationship',
  'Location',
  'Hobbies',
  'Food',
  'News',
]

export function FinalModal({
  selectedMood,
  selectedReasons,
  description,
  onReasonToggle,
  onDescriptionChange,
  onSubmit,
  onPrevious,
  onClose,
  isLoading,
}: FinalModalProps) {
  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-[#00000066]">
      <div className="relative w-full max-w-[600px] overflow-y-auto rounded-[20px] bg-white p-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Progress bar */}
        <div className="mb-[3.125rem] flex w-full items-center justify-center">
          <div className="flex w-full max-w-[409px] space-x-2">
            <div className="h-2 flex-1 rounded-full bg-[#63B3ED]"></div>
            <div className="h-2 flex-1 rounded-full bg-[#63B3ED]"></div>
            <div className="h-2 flex-1 rounded-full bg-[#63B3ED]"></div>
          </div>
        </div>

        {/* Content */}
        <div className="mb-[2rem] text-center">
          <h2 className={`${interBold.className} mb-2 text-[20px] text-[#111111]`}>
            Why do you feel{' '}
            <span style={{ color: moodColors[selectedMood] }}>{moodLabels[selectedMood]}</span>!
          </h2>

          {/* Reason tags */}
          <div className="mb-[5rem] flex flex-wrap justify-center gap-2">
            {reasonOptions.map((reason) => {
              const isSelected = selectedReasons.includes(reason)
              return (
                <button
                  key={reason}
                  onClick={() => onReasonToggle(reason)}
                  className={`${interRegular.className} cursor-pointer rounded-[2rem] border px-4 py-2 text-[14px] transition-all ${
                    isSelected
                      ? 'border-[#3B82F6] bg-[#3B82F6] text-white'
                      : 'border-[#4A5568] text-[#374151] hover:border-[#3B82F6] hover:bg-[#EBF4FF]'
                  }`}
                >
                  {reason}
                </button>
              )
            })}
          </div>

          {/* Description section */}
          <div className="mb-[2rem] text-center">
            <h3 className={`${interBold.className} mb-4 text-[16px] text-[#111111]`}>
              Is it some other thing? Describe it
            </h3>
            <Textarea
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="Tell us more about how you're feeling..."
              className="min-h-[144px] w-full resize-none rounded-[12px] border border-[#718096] p-4 focus:border-transparent focus:ring-2 focus:ring-[#63B3ED]"
            />
          </div>

          {/* Action buttons */}
          <div className="flex justify-end space-x-4">
            <Button
              onClick={onPrevious}
              variant="outline"
              disabled={isLoading}
              className={`${interRegular.className} rounded-full border-none bg-[#EDF2F7] px-8 py-3 text-[16px] text-[#111111] hover:bg-gray-50`}
            >
              Previous
            </Button>

            <Button
              onClick={onSubmit}
              disabled={isLoading}
              className={`${interBold.className} rounded-full border-none bg-[#63B3ED] px-8 py-3 text-[16px] text-white hover:bg-[#2563EB] disabled:cursor-not-allowed disabled:opacity-50`}
            >
              {isLoading ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
