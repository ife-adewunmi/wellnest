"use client"

import { MoodSelectionModal } from './mood-selection-modal'
import { SocialMediaModal } from './social-media-modal'
import { FinalModal } from './final-modal'
import { MoodCheckInFormData } from '../hooks/use-mood-checkin-modal'
import { MoodType } from '@/shared/types/common.types'

interface MoodCheckInModalProps {
  isOpen: boolean
  currentStep: number
  formData: MoodCheckInFormData
  isLoading: boolean
  onClose: () => void
  onNext: () => void
  onPrevious: () => void
  onUpdateFormData: (step: keyof MoodCheckInFormData, data: any) => void
  onSubmit: () => void
  canProceedFromStep1: boolean
  canProceedFromStep2: boolean
  userName?: string
}

export function MoodCheckInModal({
  isOpen,
  currentStep,
  formData,
  isLoading,
  onClose,
  onNext,
  onPrevious,
  onUpdateFormData,
  onSubmit,
  canProceedFromStep1,
  canProceedFromStep2,
  userName,
}: MoodCheckInModalProps) {

  if (!isOpen) return null

  const handleStep1Continue = () => {
    if (canProceedFromStep1) {
      onNext()
    }
  }

  const handleStep2Continue = () => {
    if (canProceedFromStep2) {
      onNext()
    }
  }

  const handleMoodSelect = (mood: MoodType) => {
    onUpdateFormData('step1', { mood })
  }

  const handleSocialMediaSelect = (socialMediaImpact: boolean) => {
    onUpdateFormData('step2', { socialMediaImpact })
  }

  const handleDescriptionChange = (description: string) => {
    onUpdateFormData('step3', { description })
  }

  const handleReasonToggle = (reason: string) => {
    const currentReasons = formData.step3.selectedReasons
    const updatedReasons = currentReasons.includes(reason)
      ? currentReasons.filter(r => r !== reason)
      : [...currentReasons, reason]

    onUpdateFormData('step3', { selectedReasons: updatedReasons })
  }

  switch (currentStep) {
    case 1:
      return (
        <MoodSelectionModal
          selectedMood={formData.step1.mood}
          onMoodSelect={handleMoodSelect}
          onContinue={handleStep1Continue}
          onClose={onClose}
          canProceed={canProceedFromStep1}
          userName={userName}
        />
      )

    case 2:
      return (
        <SocialMediaModal
          socialMediaImpact={formData.step2.socialMediaImpact}
          onSocialMediaSelect={handleSocialMediaSelect}
          onContinue={handleStep2Continue}
          onPrevious={onPrevious}
          onClose={onClose}
          canProceed={canProceedFromStep2}
        />
      )

    case 3:
      return (
        <FinalModal
          selectedMood={formData.step1.mood!}
          selectedReasons={formData.step3.selectedReasons}
          description={formData.step3.description}
          onReasonToggle={handleReasonToggle}
          onDescriptionChange={handleDescriptionChange}
          onSubmit={onSubmit}
          onPrevious={onPrevious}
          onClose={onClose}
          isLoading={isLoading}
        />
      )

    default:
      return null
  }
}
