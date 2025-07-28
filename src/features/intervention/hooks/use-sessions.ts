"use client"

import { useState } from "react"
import type { Session, LogEntry } from "../types/session"
import { formatTime } from "../utils/time-formatter"

export function useSessions() {
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([
    {
      date: "2024-08-15",
      student: "Ethan Harper",
      intervention: "Counseling Session",
      time: "10:00 AM",
    },
    {
      date: "2024-08-16",
      student: "Olivia Bennett",
      intervention: "Workshop",
      time: "2:00 PM",
    },
    {
      date: "2024-08-17",
      student: "Noah Carter",
      intervention: "Follow-up Call",
      time: "11:30 AM",
    },
    {
      date: "2024-08-18",
      student: "Ava Mitchell",
      intervention: "Group Therapy",
      time: "3:00 PM",
    },
    {
      date: "2024-08-19",
      student: "Liam Foster",
      intervention: "Individual Counseling",
      time: "1:00 PM",
    },
  ])

  const logHistory: LogEntry[] = [
    {
      date: "2024-08-15",
      student: "Ethan Harper",
      intervention: "Counseling Session",
      status: "Completed",
    },
    {
      date: "2024-08-16",
      student: "Olivia Bennett",
      intervention: "Workshop",
      status: "Scheduled",
    },
    {
      date: "2024-08-17",
      student: "Noah Carter",
      intervention: "Follow-up Call",
      status: "Pending",
    },
    {
      date: "2024-08-18",
      student: "Ava Mitchell",
      intervention: "Group Therapy",
      status: "Completed",
    },
    {
      date: "2024-08-19",
      student: "Liam Foster",
      intervention: "Individual Counseling",
      status: "Scheduled",
    },
  ]

  const addSession = (newSession: Session) => {
    const formattedSession = {
      ...newSession,
      time: formatTime(newSession.time),
    }

    setUpcomingSessions((prev) => {
      // Sort sessions by date to maintain chronological order
      const updated = [...prev, formattedSession].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      )
      return updated
    })
  }

  return {
    upcomingSessions,
    logHistory,
    addSession,
  }
}
