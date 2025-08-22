'use client'

import { Button } from '@/shared/components/ui/button'
import { X } from 'lucide-react'
import { interBold, interRegular } from '@/shared/styles/fonts'

interface SocialMediaModalProps {
  socialMediaImpact: boolean | null
  onSocialMediaSelect: (impact: boolean) => void
  onContinue: () => void
  onPrevious: () => void
  onClose: () => void
  canProceed: boolean
}

export function SocialMediaModal({
  socialMediaImpact,
  onSocialMediaSelect,
  onContinue,
  onPrevious,
  onClose,
  canProceed,
}: SocialMediaModalProps) {
  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-[#00000066]">
      <div className="relative w-full max-w-[661px] rounded-[20px] bg-white px-[5.6875rem] py-[2.5rem]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Progress bar */}
        <div className="mb-[3.125rem] flex w-full items-center justify-center">
          <div className="flex w-full max-w-[409px]">
            <div className="h-2 flex-1 rounded-full bg-[#63B3ED]"></div>
            <div className="h-2 flex-1 rounded-full bg-[#63B3ED]"></div>
            <div className="h-2 flex-1 rounded-full bg-[#E5E7EB]"></div>
          </div>
        </div>

        {/* Content */}
        <div className="text-center">
          <h2 className={`${interBold.className} text-[24px] text-[#111111]`}>
            Has social media influenced your mood today?
          </h2>

          {/* Options */}
          <div className="mt-[5rem] flex w-full max-w-[615px] justify-center gap-[48px]">
            <button
              onClick={() => onSocialMediaSelect(true)}
              className={`w-full rounded-[50px] border-2 px-12 py-4 transition-all ${
                socialMediaImpact === true
                  ? 'border-[#63B3ED] bg-[#63B3ED] text-white'
                  : 'border-[#D1D5DB] bg-white text-[#111111] hover:border-[#63B3ED]'
              }`}
            >
              <span className={`${interRegular.className} text-[18px]`}>Yes</span>
            </button>

            <button
              onClick={() => onSocialMediaSelect(false)}
              className={`w-full rounded-[50px] border-2 px-12 py-4 transition-all ${
                socialMediaImpact === false
                  ? 'border-[#63B3ED] bg-[#63B3ED] text-white'
                  : 'border-[#D1D5DB] bg-white text-[#111111] hover:border-[#63B3ED]'
              }`}
            >
              <span className={`${interRegular.className} text-[18px]`}>No</span>
            </button>
          </div>

          {/* Action buttons */}
          <div className="mt-[5rem] flex justify-end space-x-4">
            <Button
              onClick={onPrevious}
              variant="outline"
              className={`${interRegular.className} rounded-full border-none bg-[#EDF2F7] px-8 py-3 text-[16px] text-[#111111] hover:bg-gray-50`}
            >
              Previous
            </Button>

            <Button
              onClick={onContinue}
              disabled={!canProceed}
              className={`${interBold.className} rounded-full bg-[#3182CE] px-8 py-3 text-[16px] text-white hover:bg-[#2563EB] disabled:cursor-not-allowed disabled:opacity-50`}
            >
              Continue →
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
