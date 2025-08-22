import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useUserStore } from '@/features/users/state'
import { toast } from 'react-toastify'
import { MoodType } from '@/shared/types/common.types'

export interface MoodCheckInData {
  mood: MoodType
  socialMediaImpact?: boolean
  influences?: string[]
  reasons?: string[]
  description?: string
}

export interface MoodCheckInFormData {
  step1: {
    mood: MoodType | null
  }
  step2: {
    socialMediaImpact: boolean | null
  }
  step3: {
    selectedReasons: string[]
    description: string
  }
}

const initialFormData: MoodCheckInFormData = {
  step1: { mood: null },
  step2: { socialMediaImpact: null },
  step3: { selectedReasons: [], description: '' },
}

export function useMoodCheckInModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<MoodCheckInFormData>(initialFormData)
  const { user } = useUserStore()

  // Toast function using react-toastify
  const showToast = (title: string, description: string, variant?: 'destructive') => {
    if (variant === 'destructive') {
      toast.error(`${title}: ${description}`)
    } else {
      toast.success(`${title}: ${description}`)
    }
  }

  const submitMoodCheckIn = async (data: MoodCheckInData) => {
    if (!user?.id) {
      throw new Error('User not authenticated')
    }

    const response = await fetch('/api/students/mood-check-in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.id,
        ...data,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to submit mood check-in')
    }

    return response.json()
  }

  const mutation = useMutation({
    mutationFn: submitMoodCheckIn,
    onSuccess: () => {
      showToast('Mood check-in submitted', "Thank you for sharing how you're feeling today.")
      handleClose()
    },
    onError: (error) => {
      showToast(
        'Error',
        error.message || 'Failed to submit mood check-in. Please try again.',
        'destructive',
      )
    },
  })

  const handleOpen = () => {
    setIsOpen(true)
    setCurrentStep(1)
    setFormData(initialFormData)
  }

  const handleClose = () => {
    setIsOpen(false)
    setCurrentStep(1)
    setFormData(initialFormData)
  }

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateFormData = (step: keyof MoodCheckInFormData, data: any) => {
    setFormData((prev) => ({
      ...prev,
      [step]: { ...prev[step], ...data },
    }))
  }

  const handleSubmit = () => {
    const submissionData: MoodCheckInData = {
      mood: formData.step1.mood!,
      socialMediaImpact: formData.step2.socialMediaImpact || false,
      reasons:
        formData.step3.selectedReasons.length > 0 ? formData.step3.selectedReasons : undefined,
      description: formData.step3.description || undefined,
    }

    mutation.mutate(submissionData)
  }

  const canProceedFromStep1 = formData.step1.mood !== null
  const canProceedFromStep2 = formData.step2.socialMediaImpact !== null

  return {
    isOpen,
    currentStep,
    formData,
    isLoading: mutation.isPending,
    handleOpen,
    handleClose,
    handleNext,
    handlePrevious,
    updateFormData,
    handleSubmit,
    canProceedFromStep1,
    canProceedFromStep2,
  }
}
