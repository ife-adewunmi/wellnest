"use client"

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
  SAD: 'Sad'
}

const moodColors: Record<MoodType, string> = {
  GOOD: '#10B981',     // Green color
  HAPPY: '#F59E0B',    // Yellow color
  NEUTRAL: '#6B7280',  // Gray color
  BAD: '#F97316',      // Orange color
  SAD: '#8B5CF6'       // Lilac color
}

const reasonOptions = [
  'Health', 'Sleep', 'Friends', 'Family', 'Weather',
  'School', 'Finances', 'Exercise', 'Relationship', 'Location',
  'Hobbies', 'Food', 'News'
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
    <div className="fixed inset-0 bg-[#00000066] bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-[20px] p-8 max-w-[600px] w-full relative overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Progress bar */}
        <div className="mb-[3.125rem] w-full justify-center items-center flex">
          <div className="flex space-x-2 w-full max-w-[409px]">
            <div className="flex-1 h-2 bg-[#63B3ED] rounded-full"></div>
            <div className="flex-1 h-2 bg-[#63B3ED] rounded-full"></div>
            <div className="flex-1 h-2 bg-[#63B3ED] rounded-full"></div>
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-[2rem]">
          <h2 className={`${interBold.className} text-[20px] text-[#111111] mb-2`}>
            Why do you feel{' '}
            <span style={{ color: moodColors[selectedMood] }}>
              {moodLabels[selectedMood]}
            </span>
            !
          </h2>

          {/* Reason tags */}
          <div className="flex flex-wrap justify-center gap-2 mb-[5rem]">
            {reasonOptions.map((reason) => {
              const isSelected = selectedReasons.includes(reason)
              return (
                <button
                  key={reason}
                  onClick={() => onReasonToggle(reason)}
                  className={`${interRegular.className} px-4 py-2 rounded-[2rem] text-[14px] border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#3B82F6] text-white border-[#3B82F6]'
                      : 'text-[#374151] border-[#4A5568] hover:border-[#3B82F6] hover:bg-[#EBF4FF]'
                  }`}
                >
                  {reason}
                </button>
              )
            })}
          </div>

          {/* Description section */}
          <div className="text-center mb-[2rem]">
            <h3 className={`${interBold.className} text-[16px] text-[#111111] mb-4`}>
              Is it some other thing? Describe it
            </h3>
            <Textarea
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="Tell us more about how you're feeling..."
              className="w-full min-h-[144px] p-4 border border-[#718096] rounded-[12px] resize-none focus:ring-2 focus:ring-[#63B3ED] focus:border-transparent"
            />
          </div>

          {/* Action buttons */}
          <div className="flex justify-end space-x-4">
            <Button
              onClick={onPrevious}
              variant="outline"
              disabled={isLoading}
              className={`${interRegular.className} border-none bg-[#EDF2F7] text-[#111111] px-8 py-3 rounded-full text-[16px] hover:bg-gray-50`}
            >
              Previous
            </Button>
            
            <Button
              onClick={onSubmit}
              disabled={isLoading}
              className={`${interBold.className} bg-[#63B3ED] hover:bg-[#2563EB] border-none text-white px-8 py-3 rounded-full text-[16px] disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
