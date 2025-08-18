'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { AddNoteDialog } from './add-note-dialogue'
import { interBold, interMedium, interSemiBold } from '@/shared/styles/fonts'
import Image from 'next/image'

interface Note {
  id: number
  title: string
  date: string
  content: string
  expanded: boolean
}

export function CounselorNotes() {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: 1,
      title: 'Initial Assessment',
      date: '2024-03-15',
      content:
        'Student reported feeling overwhelmed with academic pressure and social anxiety. Recommended weekly check-ins and resources on stress management.',
      expanded: true,
    },
    {
      id: 2,
      title: 'Initial Assessment',
      date: '2024-03-15',
      content: '',
      expanded: false,
    },
  ])

  const addNote = (noteData: { title: string; content: string }) => {
    const note: Note = {
      id: Date.now(),
      title: noteData.title,
      date: new Date().toISOString().split('T')[0],
      content: noteData.content,
      expanded: true,
    }
    setNotes([note, ...notes])
  }

  const toggleNote = (id: number) => {
    setNotes(notes.map((note) => (note.id === id ? { ...note, expanded: !note.expanded } : note)))
  }

  return (
    <div>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className={`${interBold.className} text-[22px] text-[#121417]`}>
            Counselor Notes
          </CardTitle>
          <AddNoteDialog onAddNote={addNote} />
        </div>
      </CardHeader>
      <div className="mt-[1rem]">
        {notes.map((note) => (
          <div key={note.id}>
            <div className="mt-[1rem] flex w-full justify-between rounded-[12px] border border-[#CBD5E0] px-[1.5rem] py-[1rem]">
              <div className="flex flex-col gap-[12px]">
                <div className="flex gap-[1rem]">
                  <Image src="/svg/note.svg" alt="notes" width={24} height={24} />
                  <div className="flex items-center gap-[1rem]">
                    <p className={`${interSemiBold.className} text-[18px] text-[#1A202C]`}>
                      {note.title}
                    </p>
                    <p className={`${interMedium.className} text-[12px] text-[#718096]`}>
                      {note.date}
                    </p>
                  </div>
                </div>
                {note.expanded && note.content && (
                  <p className="text-sm text-gray-700">{note.content}</p>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded"></div>
                </div>
                <button className="cursor-pointer" onClick={() => toggleNote(note.id)}>
                  {note.expanded ? (
                    <ChevronDown className="h-[32px] w-[32px]" color="#1A202C" />
                  ) : (
                    <ChevronUp className="h-[32px] w-[32px]" color="#1A202C" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
