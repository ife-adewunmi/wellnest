'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Button } from '@/shared-components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared-components/ui/card'
import { Textarea } from '@/shared-components/ui/textarea'
import { Badge } from '@/shared-components/ui/badge'
import { useToast } from '@/shared/hooks/use-toast'
import { useOfflineStorage } from '@/shared/hooks/use-offline-storage'
import { submitMoodCheckIn } from '../services/mood-service'
import type { MoodType } from '@/shared/types/common.types'

const MOOD_OPTIONS = [
  { value: 'GOOD' as MoodType, emoji: '😊', label: 'Good', color: 'bg-green-500' },
  { value: 'HAPPY' as MoodType, emoji: '😄', label: 'Happy', color: 'bg-yellow-500' },
  { value: 'NEUTRAL' as MoodType, emoji: '😐', label: 'Neutral', color: 'bg-gray-500' },
  { value: 'BAD' as MoodType, emoji: '😞', label: 'Bad', color: 'bg-orange-500' },
  { value: 'SAD' as MoodType, emoji: '😢', label: 'Sad', color: 'bg-purple-500' },
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
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null)
  const [selectedReasons, setSelectedReasons] = useState<string[]>([])
  const [description, setDescription] = useState('')
  const { toast } = useToast()
  const { storeOfflineData, isOnline } = useOfflineStorage()

  const mutation = useMutation({
    mutationFn: submitMoodCheckIn,
    onSuccess: () => {
      toast({
        title: 'Mood check-in submitted',
        description: "Thank you for sharing how you're feeling today.",
      })
      resetForm()
      onSuccess?.()
    },
    onError: async (error) => {
      // Store offline if network error
      if (!isOnline) {
        await storeOfflineData('mood-check-ins', {
          mood: selectedMood,
          reasons: selectedReasons,
          description,
          timestamp: new Date().toISOString(),
        })
        toast({
          title: 'Saved offline',
          description: "Your mood check-in will be submitted when you're back online.",
        })
        resetForm()
        onSuccess?.()
      } else {
        toast({
          title: 'Error',
          description: 'Failed to submit mood check-in. Please try again.',
          variant: 'destructive',
        })
      }
    },
  })

  const resetForm = () => {
    setSelectedMood(null)
    setSelectedReasons([])
    setDescription('')
  }

  const handleReasonToggle = (reason: string) => {
    setSelectedReasons((prev) =>
      prev.includes(reason) ? prev.filter((r) => r !== reason) : [...prev, reason],
    )
  }

  const handleSubmit = () => {
    if (!selectedMood) return

    mutation.mutate({
      mood: selectedMood,
      reasons: selectedReasons,
      description: description.trim() || undefined,
    })
  }

  const selectedMoodOption = MOOD_OPTIONS.find((option) => option.value === selectedMood)

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader className="text-center">
        <div className="mb-2 text-2xl">👋 Hey {userName}!</div>
        <CardTitle className="text-xl">How are you feeling today?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mood Selection */}
        <div className="flex justify-center gap-4">
          {MOOD_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedMood(option.value)}
              className={`flex flex-col items-center rounded-lg p-4 transition-all hover:scale-105 ${
                selectedMood === option.value
                  ? 'ring-primary bg-primary/10 ring-2 ring-offset-2'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="mb-2 text-4xl">{option.emoji}</div>
              <span className="text-sm font-medium">{option.label}</span>
            </button>
          ))}
        </div>

        {/* Reason Selection */}
        {selectedMood && (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-medium">
                Why do you feel{' '}
                <span className="text-primary underline">{selectedMoodOption?.label}</span>?
              </h3>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
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
          </div>
        )}

        {/* Description */}
        {selectedMood && (
          <div className="space-y-2">
            <h3 className="text-center text-lg font-medium">Is it some other thing? Describe it</h3>
            <Textarea
              placeholder="Tell us more about how you're feeling..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        )}

        {/* Submit Button */}
        {selectedMood && (
          <div className="flex justify-center">
            <Button onClick={handleSubmit} disabled={mutation.isPending} className="px-8 py-2">
              {mutation.isPending ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
