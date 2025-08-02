'use client'

import { useState } from 'react'

import { Plus } from 'lucide-react'
import { Label } from '@/shared/components/ui/label'
import { Input } from '@/shared/components/ui/custom-input'
import { Button } from '@/shared/components/ui/custom-button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialogue'

interface AddNoteDialogProps {
  onAddNote: (note: { title: string; content: string }) => void
}

export function AddNoteDialog({ onAddNote }: AddNoteDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newNote, setNewNote] = useState({ title: '', content: '' })

  const handleAddNote = () => {
    if (newNote.title.trim() && newNote.content.trim()) {
      onAddNote(newNote)
      setNewNote({ title: '', content: '' })
      setIsDialogOpen(false)
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="dropdown" className="flex items-center gap-[8px]">
          <Plus className="h-4 w-4" />
          Add Note
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Counselor Note</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              placeholder="Enter note title..."
            />
          </div>
          <div>
            <Label htmlFor="content">Content</Label>
            <textarea
              id="content"
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              placeholder="Enter your note..."
              rows={4}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddNote}>Add Note</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
