'use client'

import { useState, useEffect } from 'react'
import { useUserStore } from '@/features/users/state'
import { useInterventionsActions } from '../state/interventions'
import { useStudentsStore } from '../state'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/components/ui/dialog'
import { toast } from 'react-toastify'

interface CreateSessionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateSessionModal({ open, onOpenChange }: CreateSessionModalProps) {
  const { user } = useUserStore()
  const { createSession } = useInterventionsActions()
  const students = useStudentsStore((state) => state.students)
  const fetchStudents = useStudentsStore((state) => state.fetchStudents)

  const [formData, setFormData] = useState({
    studentId: '',
    title: '',
    description: '',
    scheduledAt: '',
    duration: 60,
    notes: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (open && user?.id && students.length === 0) {
      fetchStudents(user.id)
    }
  }, [open, user?.id, students.length])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id) return

    if (!formData.studentId || !formData.title || !formData.scheduledAt) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    try {
      const success = await createSession({
        counselorId: user.id,
        studentId: formData.studentId,
        title: formData.title,
        description: formData.description,
        scheduledAt: new Date(formData.scheduledAt),
        duration: formData.duration,
        notes: formData.notes,
      })

      if (success) {
        toast.success('Session scheduled successfully')
        setFormData({
          studentId: '',
          title: '',
          description: '',
          scheduledAt: '',
          duration: 60,
          notes: '',
        })
        onOpenChange(false)
      }
    } catch (error) {
      toast.error('Failed to create session')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Get minimum date (today)
  const today = new Date()
  const minDate = today.toISOString().slice(0, 16)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule New Session</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="student">Student *</Label>
            <Select
              value={formData.studentId}
              onValueChange={(value) => handleInputChange('studentId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a student" />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name} ({student.studentId})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Session Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g., Weekly Check-in, Crisis Intervention"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Brief description of the session purpose"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scheduledAt">Date & Time *</Label>
              <Input
                id="scheduledAt"
                type="datetime-local"
                value={formData.scheduledAt}
                onChange={(e) => handleInputChange('scheduledAt', e.target.value)}
                min={minDate}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Select
                value={formData.duration.toString()}
                onValueChange={(value) => handleInputChange('duration', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                  <SelectItem value="90">90 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Initial Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Any initial notes or preparation for the session"
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Scheduling...' : 'Schedule Session'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
