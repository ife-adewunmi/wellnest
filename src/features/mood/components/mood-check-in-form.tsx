'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Button } from '@/components/ui/custom-button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { toast } from 'react-toastify'
import { useOfflineStorage } from '@/hooks/use-offline-storage'
import { submitMoodCheckIn } from '../services/mood-service'
import type { MoodType } from '@/shared/types/mood'
import { interBold, interSemiBold } from '@/shared/styles/fonts'

const MOOD_OPTIONS = [
  { value: 'HAPPY' as MoodType, emoji: '😊', label: 'Happy', color: 'bg-green-500' },
  { value: 'GOOD' as MoodType, emoji: '🙂', label: 'Good', color: 'bg-blue-500' },
  { value: 'NEUTRAL' as MoodType, emoji: '😐', label: 'Neutral', color: 'bg-gray-500' },
  { value: 'BAD' as MoodType, emoji: '😞', label: 'Bad', color: 'bg-orange-500' },
  { value: 'STRESSED' as MoodType, emoji: '😰', label: 'Stressed', color: 'bg-red-500' },
]

const REASON_OPTIONS = [
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

interface MoodCheckInFormProps {
  onSuccess?: () => void
  userName?: string
}

export function MoodCheckInForm({ onSuccess, userName = 'Samuel' }: MoodCheckInFormProps) {
  // Wizard step state
  const [step, setStep] = useState(1);

  // Data
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null)
  const [socialMediaImpact, setSocialMediaImpact] = useState<null|boolean>(null)
  const [selectedReasons, setSelectedReasons] = useState<string[]>([])
  const [description, setDescription] = useState('')
  const { storeOfflineData, isOnline } = useOfflineStorage()

  // Submission
  const mutation = useMutation({
    mutationFn: submitMoodCheckIn,
    onSuccess: () => {
      toast.success("Mood check-in submitted! Thank you for sharing how you're feeling today.")
      resetForm()
      onSuccess?.()
    },
    onError: async (error) => {
      // Store offline if network error
      if (!isOnline) {
        await storeOfflineData('mood-check-ins', {
          mood: selectedMood,
          socialMediaImpact,
          reasons: selectedReasons,
          description,
          timestamp: new Date().toISOString(),
        })
        toast.success("Saved offline! Your mood check-in will be submitted when you're back online.")
        resetForm()
        onSuccess?.()
      } else {
        toast.error('Failed to submit mood check-in. Please try again.')
      }
    },
  })

  const resetForm = () => {
    setStep(1);
    setSelectedMood(null)
    setSocialMediaImpact(null)
    setSelectedReasons([])
    setDescription('')
  }

  // Step logic
  const handleNext = () => {
    if (step === 1 && selectedMood) setStep(2)
    else if (step === 2 && socialMediaImpact !== null) setStep(3)
    else if (step === 3) handleSubmit()
  }
  const handlePrev = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleReasonToggle = (reason: string) => {
    setSelectedReasons((prev) => prev.includes(reason) ? prev.filter((r) => r !== reason) : [...prev, reason])
  }

  const handleSubmit = () => {
    if (!selectedMood) {
      toast.error('Pick a mood to submit!')
      return
    }
    mutation.mutate({
      mood: selectedMood,
      reasons: selectedReasons,
      description: description.trim() || undefined,
      socialMediaImpact: socialMediaImpact || undefined,
    })
  }

  const selectedMoodOption = MOOD_OPTIONS.find((option) => option.value === selectedMood)

  // RENDER
  return (
    <div className="w-full max-w-[615px]">
             {/* Progress Bar */}
 <div className="mt-6 px-4 justify-center  flex items-center">
  {/* Progress Bar with Separate Lines */}
  <div className="flex items-center h-[8px] space-x-2 w-[80%]">
    {/* Line 1 */}
    <div className={`h-full flex-1 rounded-full transition-all duration-300 ${
      step >= 1 ? 'bg-[#63B3ED]' : 'bg-gray-200'
    }`}></div>
    
    {/* Line 2 */}
    <div className={`h-full flex-1 rounded-full transition-all duration-300 ${
      step >= 2 ? 'bg-[#63B3ED]' : 'bg-gray-200'
    }`}></div>
    
    {/* Line 3 */}
    <div className={`h-full flex-1 rounded-full transition-all duration-300 ${
      step >= 3 ? 'bg-[#63B3ED]' : 'bg-gray-200'
    }`}></div>
  </div>
</div>

      <CardContent className="space-y-6 mt-[5rem]">
        {/* Step 1: Mood selection */}
        
        {step === 1 && (
          <>
                <CardHeader className="text-center mt-[3.5rem]">
        <div className={`text-[#000000] ${interSemiBold.className} text-[1.5rem} mb-[8px]`}>👋 Hey {userName}!</div>
        <div className={`text-[#121417] ${interBold.className} text-[1.75rem]`}>How are you feeling today?</div>

 
      </CardHeader>
            <div className="flex justify-center gap-4">
              {MOOD_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedMood(option.value)}
                  className={`flex flex-col items-center rounded-lg p-4 transition-all hover:scale-105 ${selectedMood === option.value ? ' border border-[#3182CE] bg-primary/10 ring-1 ring-[#3182CE]' : 'hover:bg-gray-50'}`}
                >
                  <div className="mb-2 text-4xl">{option.emoji}</div>
                  <span className="text-sm font-medium">{option.label}</span>
                </button>
              ))}
            </div>
            <div className="flex justify-end mt-[4rem] ">
              <Button variant="ghost" onClick={handleNext} disabled={!selectedMood}>Continue</Button>
            </div>
          </>
        )}

        {/* Step 2: Social media impact */}
        {step === 2 && (
          <>
            <div className="text-center space-y-4 w-full ">
              <h3 className={`text-[#000000] ${interBold.className} text-[1.75rem]`}>Has social media influenced your mood today?</h3>
              <div className="flex items-center gap-[24px] mt-[5rem] w-full">
                <Button variant={socialMediaImpact === true ? 'moodSelected' : 'moodDefault'} onClick={() => setSocialMediaImpact(true)}>
                  Yes
                </Button>
                <Button variant={socialMediaImpact === false ? 'moodSelected' : 'moodDefault'} onClick={() => setSocialMediaImpact(false)}>
                  No
                </Button>
              </div>
            </div>
            <div className="flex gap-[24px] items-center justify-end mt-[4rem]">
              <Button className={`bg-[#EDF2F7] cursor-pointer  rounded-full py-[10px] px-[40px] text-[#1A202C]`} onClick={handlePrev}>Previous</Button>
              <Button className={`bg-[#3182CE] cursor-pointer  text-white rounded-full py-[10px] px-[40px]`}  onClick={handleNext} disabled={socialMediaImpact === null}>Continue</Button>
            </div>
          </>
        )}

        {/* Step 3: Other factors & text */}
        {step === 3 && (
          <>
            <div className="space-y-4">
              <div className="text-center">
                <h3 className={`text-[#000000] ${interBold.className} text-[1.75rem]`}>Why do you feel <span className="text-[#3182CE]">Stressed!</span></h3>
              </div>
              <div className="flex flex-wrap justify-center gap-[1rem]">
                {REASON_OPTIONS.map((reason) => (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => handleReasonToggle(reason)}
                    className="cursor-pointer border-none bg-transparent p-0"
                  >
                    <Badge
                      variant={selectedReasons.includes(reason) ? 'default' : 'outline'}
                      className="hover:bg-primary/20 cursor-pointer"
                    >
                      {reason}
                    </Badge>
                  </button>
                ))}
              </div>
              <div className="space-y-2 mt-[5rem]">
                <h3 className={`text-[#000000] ${interBold.className} text-[1.75rem] mb-[2rem]` }>Is it some other thing? Describe it</h3>
                <Textarea
                  placeholder="Tell us more about how you're feeling..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[144px] rounded-[12px] border border-[#718096] p-[12px]"
                />
              </div>
            </div>
            <div className="flex gap-[24px] items-center justify-end mt-[4rem]">
              <Button className={`bg-[#EDF2F7] cursor-pointer rounded-full py-[10px] px-[40px] text-[#1A202C]`} onClick={handlePrev}>Previous</Button>
              <Button  className={`bg-[#3182CE] cursor-pointer  text-white rounded-full py-[10px] px-[40px]`}  onClick={handleNext} disabled={mutation.isPending}>
                {mutation.isPending ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </div>
  )
}
