"use client"

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
    <div className="fixed inset-0 bg-[#00000066] bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-[20px] max-w-[661px] w-full relative py-[2.5rem] px-[5.6875rem]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Progress bar */}
        <div className="mb-[3.125rem] w-full justify-center items-center flex">
          <div className="flex w-full max-w-[409px] ">
            <div className="flex-1 h-2 bg-[#63B3ED] rounded-full"></div>
            <div className="flex-1 h-2 bg-[#63B3ED] rounded-full"></div>
            <div className="flex-1 h-2 bg-[#E5E7EB] rounded-full"></div>
          </div>
        </div>

        {/* Content */}
        <div className="text-center">
          <h2 className={`${interBold.className} text-[24px] text-[#111111] `}>
            Has social media influenced your mood today?
          </h2>

          {/* Options */}
          <div className="flex justify-center gap-[48px] w-full max-w-[615px] mt-[5rem]">
            <button
              onClick={() => onSocialMediaSelect(true)}
              className={`px-12 py-4 rounded-[50px] border-2 w-full transition-all ${
                socialMediaImpact === true
                  ? 'bg-[#63B3ED] border-[#63B3ED] text-white'
                  : 'bg-white border-[#D1D5DB] text-[#111111] hover:border-[#63B3ED]'
              }`}
            >
              <span className={`${interRegular.className} text-[18px]`}>
                Yes
              </span>
            </button>
            
            <button
              onClick={() => onSocialMediaSelect(false)}
              className={`px-12 py-4 rounded-[50px] border-2 w-full transition-all ${
                socialMediaImpact === false
                  ? 'bg-[#63B3ED] border-[#63B3ED] text-white'
                  : 'bg-white border-[#D1D5DB] text-[#111111] hover:border-[#63B3ED]'
              }`}
            >
              <span className={`${interRegular.className} text-[18px]`}>
                No
              </span>
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end space-x-4 mt-[5rem]">
            <Button
              onClick={onPrevious}
              variant="outline"
              className={`${interRegular.className} border-none text-[#111111] px-8 py-3 bg-[#EDF2F7] rounded-full text-[16px] hover:bg-gray-50`}
            >
              Previous
            </Button>
            
            <Button
              onClick={onContinue}
              disabled={!canProceed}
              className={`${interBold.className} bg-[#3182CE] hover:bg-[#2563EB] text-white px-8 py-3 rounded-full text-[16px] disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Continue →
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
