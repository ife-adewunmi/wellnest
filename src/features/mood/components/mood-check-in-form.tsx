"use client"

import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/shared/hooks/use-toast"
import { useOfflineStorage } from "@/hooks/use-offline-storage"
import { submitMoodCheckIn } from "../services/mood-service"
import type { MoodType } from "@/shared/types/mood"

const MOOD_OPTIONS = [
  { value: "HAPPY" as MoodType, emoji: "😊", label: "Happy", color: "bg-green-500" },
  { value: "GOOD" as MoodType, emoji: "🙂", label: "Good", color: "bg-blue-500" },
  { value: "NEUTRAL" as MoodType, emoji: "😐", label: "Neutral", color: "bg-gray-500" },
  { value: "BAD" as MoodType, emoji: "😞", label: "Bad", color: "bg-orange-500" },
  { value: "STRESSED" as MoodType, emoji: "😰", label: "Stressed", color: "bg-red-500" },
]

const REASON_OPTIONS = [
  "Health",
  "Sleep",
  "Friends",
  "Family",
  "Weather",
  "School",
  "Finances",
  "Exercise",
  "Relationship",
  "Location",
  "Hobbies",
  "Food",
  "News",
]

interface MoodCheckInFormProps {
  onSuccess?: () => void
  userName?: string
}

export function MoodCheckInForm({ onSuccess, userName = "Samuel" }: MoodCheckInFormProps) {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null)
  const [selectedReasons, setSelectedReasons] = useState<string[]>([])
  const [description, setDescription] = useState("")
  const { toast } = useToast()
  const { storeOfflineData, isOnline } = useOfflineStorage()

  const mutation = useMutation({
    mutationFn: submitMoodCheckIn,
    onSuccess: () => {
      toast({
        title: "Mood check-in submitted",
        description: "Thank you for sharing how you're feeling today.",
      })
      resetForm()
      onSuccess?.()
    },
    onError: async (error) => {
      // Store offline if network error
      if (!isOnline) {
        await storeOfflineData("mood-check-ins", {
          mood: selectedMood,
          reasons: selectedReasons,
          description,
          timestamp: new Date().toISOString(),
        })
        toast({
          title: "Saved offline",
          description: "Your mood check-in will be submitted when you're back online.",
        })
        resetForm()
        onSuccess?.()
      } else {
        toast({
          title: "Error",
          description: "Failed to submit mood check-in. Please try again.",
          variant: "destructive",
        })
      }
    },
  })

  const resetForm = () => {
    setSelectedMood(null)
    setSelectedReasons([])
    setDescription("")
  }

  const handleReasonToggle = (reason: string) => {
    setSelectedReasons((prev) => (prev.includes(reason) ? prev.filter((r) => r !== reason) : [...prev, reason]))
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
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="text-2xl mb-2">👋 Hey {userName}!</div>
        <CardTitle className="text-xl">How are you feeling today?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mood Selection */}
        <div className="flex justify-center gap-4">
          {MOOD_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedMood(option.value)}
              className={`flex flex-col items-center p-4 rounded-lg transition-all hover:scale-105 ${
                selectedMood === option.value ? "ring-2 ring-primary ring-offset-2 bg-primary/10" : "hover:bg-gray-50"
              }`}
            >
              <div className="text-4xl mb-2">{option.emoji}</div>
              <span className="text-sm font-medium">{option.label}</span>
            </button>
          ))}
        </div>

        {/* Reason Selection */}
        {selectedMood && (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-medium">
                Why do you feel <span className="text-primary underline">{selectedMoodOption?.label}</span>?
              </h3>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {REASON_OPTIONS.map((reason) => (
                <button
                  key={reason}
                  type="button"
                  onClick={() => handleReasonToggle(reason)}
                  className="p-0 border-none bg-transparent cursor-pointer"
                >
                  <Badge
                    variant={selectedReasons.includes(reason) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/20"
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
            <h3 className="text-lg font-medium text-center">Is it some other thing? Describe it</h3>
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
              {mutation.isPending ? "Submitting..." : "Submit"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
