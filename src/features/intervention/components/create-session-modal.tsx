'use client'

import { useState } from 'react'
import { Calendar, Clock, Search } from 'lucide-react'
import { Button } from '@/shared/components/ui/custom-button'
import { Input } from '@/shared/components/ui/custom-input'
import { Label } from '@/shared/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialogue'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import type { Session } from '../types/session'
interface CreateSessionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (session: Session) => void
}

export function CreateSessionModal({ open, onOpenChange, onSave }: CreateSessionModalProps) {
  const [formData, setFormData] = useState({
    student: '',
    date: '',
    time: '',
    intervention: '',
  })

  const interventionOptions = [
    'Counseling Session',
    'Workshop',
    'Follow-up Call',
    'Group Therapy',
    'Individual Counseling',
    'Assessment',
    'Crisis Intervention',
  ]

  const handleSave = () => {
    if (formData.student && formData.date && formData.time && formData.intervention) {
      onSave({
        date: formData.date,
        student: formData.student,
        intervention: formData.intervention,
        time: formData.time,
      })

      // Reset form
      setFormData({
        student: '',
        date: '',
        time: '',
        intervention: '',
      })

      onOpenChange(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Create new session</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Student Field */}
          <div className="space-y-2">
            <Label htmlFor="student" className="text-sm font-medium text-gray-700">
              Student
            </Label>
            <div className="relative mt-[12px]">
              <Input
                id="student"
                placeholder="Enter student name"
                value={formData.student}
                onChange={(e) => handleInputChange('student', e.target.value)}
                className="placeholder:text[#1A202C] w-full pr-10"
              />
              <Search
                className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform"
                color="#1A202C"
              />
            </div>
          </div>

          {/* Date and Time Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-medium text-gray-700">
                Date
              </Label>
              <div className="relative mt-[12px]">
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="placeholder:text[#1A202C] pr-10"
                />
                {/* <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" /> */}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time" className="text-sm font-medium text-gray-700">
                Time
              </Label>
              <div className="relative mt-[12px]">
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  className="placeholder:text[#1A202C] pr-10"
                />
                {/* <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" /> */}
              </div>
            </div>
          </div>

          {/* Intervention Description Field */}
          <div className="flex flex-col gap-[12px]">
            <Label htmlFor="intervention" className="text-sm font-medium text-gray-700">
              Intervention Description
            </Label>
            <Select
              value={formData.intervention}
              onValueChange={(value) => handleInputChange('intervention', value)}
            >
              <SelectTrigger className="flex w-full items-center justify-between rounded-[6px] border border-[#E2E8F0] px-[1rem] py-[17px] placeholder:text-[18px] placeholder:text-[#A0AEC0] focus:border-[#4299E1] focus:ring-1 focus:ring-[#4299E1] focus:outline-none">
                <SelectValue placeholder="Select intervention type" />
              </SelectTrigger>
              <SelectContent>
                {interventionOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-[1rem]">
          <Button
            onClick={handleSave}
            variant="ghost"
            disabled={
              !formData.student || !formData.date || !formData.time || !formData.intervention
            }
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
