"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { AddNoteDialog } from "./add-note-dialogue"


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
      title: "Initial Assessment",
      date: "2024-03-15",
      content:
        "Student reported feeling overwhelmed with academic pressure and social anxiety. Recommended weekly check-ins and resources on stress management.",
      expanded: true,
    },
    {
      id: 2,
      title: "Initial Assessment",
      date: "2024-03-15",
      content: "",
      expanded: false,
    },
  ])

  const addNote = (noteData: { title: string; content: string }) => {
    const note: Note = {
      id: Date.now(),
      title: noteData.title,
      date: new Date().toISOString().split("T")[0],
      content: noteData.content,
      expanded: true,
    }
    setNotes([note, ...notes])
  }

  const toggleNote = (id: number) => {
    setNotes(notes.map((note) => (note.id === id ? { ...note, expanded: !note.expanded } : note)))
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Counselor Notes</CardTitle>
          <AddNoteDialog onAddNote={addNote} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {notes.map((note) => (
          <div key={note.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                  <div className="w-4 h-4 bg-blue-600 rounded"></div>
                </div>
                <div>
                  <p className="font-medium">{note.title}</p>
                  <p className="text-sm text-gray-500">{note.date}</p>
                </div>
              </div>
              <button onClick={() => toggleNote(note.id)}>
                {note.expanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronUp className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
            {note.expanded && note.content && <p className="text-sm text-gray-700">{note.content}</p>}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
