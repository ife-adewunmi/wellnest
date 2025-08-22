'use client'

import { Button } from '@/shared-components/ui/button'
import { interBold, interRegular } from '@/shared/styles/fonts'
import Image from 'next/image'
import { MoodCheckInModal } from './components/mood-checkin-modal'
import { useMoodCheckInModal } from './hooks/use-mood-checkin-modal'
import { useUserStore } from '@/features/users/state'

export function StudentMoodRecord() {
  const { user } = useUserStore()
  const {
    isOpen,
    currentStep,
    formData,
    isLoading,
    handleOpen,
    handleClose,
    handleNext,
    handlePrevious,
    updateFormData,
    handleSubmit,
    canProceedFromStep1,
    canProceedFromStep2,
  } = useMoodCheckInModal()

  return (
    <>
      <div className="flex w-full flex-col justify-center rounded-[12px] border border-[#CBD5E0] bg-[#F7FAFC] p-[15px]">
        <span className={`${interBold.className} text-center text-[19px] text-[#111111]`}>
          How do you feel today?
        </span>

        <div className="flex flex-col items-center justify-center">
          <Button
            onClick={handleOpen}
            className={`${interRegular.className} mb-4 cursor-pointer text-[15px] text-[#545454] hover:text-[#111111]`}
          >
            Record Mood
          </Button>

          <div className="mb-4 flex items-center">
            <Image src="/images/good.png" alt="Good" width={53} height={53} />
            <Image src="/images/happy.png" alt="Happy" width={53} height={53} />
            <Image src="/images/neutral.png" alt="Neutral" width={53} height={53} />
            <Image src="/images/bad.png" alt="Bad" width={53} height={53} />
            <Image src="/images/sad.png" alt="Stressed" width={53} height={53} />
          </div>
        </div>
      </div>

      <MoodCheckInModal
        isOpen={isOpen}
        currentStep={currentStep}
        formData={formData}
        isLoading={isLoading}
        onClose={handleClose}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onUpdateFormData={updateFormData}
        onSubmit={handleSubmit}
        canProceedFromStep1={canProceedFromStep1}
        canProceedFromStep2={canProceedFromStep2}
        userName={user?.firstName || 'Student'}
      />
    </>
  )
}
