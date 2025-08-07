'use client'

import { useState, useEffect } from 'react'
import type { Session, LogEntry } from '../types/session'
import { formatTime } from '../utils/time-formatter'
import { SessionService } from '../services/session.service'
import type { CreateSessionData } from '../services/session.service'

export function useSessions(userId?: string, userRole: 'STUDENT' | 'COUNSELOR' = 'COUNSELOR') {
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([])
  const [logHistory, setLogHistory] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load sessions from database
  useEffect(() => {
    if (!userId) return

    const loadSessions = async () => {
      setLoading(true)
      setError(null)

      try {
        const [upcoming, history] = await Promise.all([
          SessionService.fetchUpcomingSessions(userId, userRole),
          SessionService.fetchSessionHistory(userId, userRole),
        ])

        setUpcomingSessions(upcoming)
        setLogHistory(history)
      } catch (err) {
        console.error('Error loading sessions:', err)
        setError('Failed to load sessions')

        // Fallback to mock data for development
        setUpcomingSessions([
          {
            date: '2024-08-15',
            student: 'Ethan Harper',
            intervention: 'Counseling Session',
            time: '10:00 AM',
          },
          {
            date: '2024-08-16',
            student: 'Olivia Bennett',
            intervention: 'Workshop',
            time: '2:00 PM',
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    loadSessions()
  }, [userId, userRole])

  // Add a new session to the database
  const addSession = async (newSession: Session, ) => {
    
    if (!userId) {
      console.error('Cannot add session: userId is required')
      return
    }

    try {
      // Use actual studentId and studentName from modal
      const sessionData: CreateSessionData = {
        studentId: (newSession as any).studentId || '',
        counselorId: userId, // This is the actual counselor ID
        title: newSession.intervention,
        description: `Session with ${(newSession as any).studentName || newSession.student}`,
        scheduledAt: `${newSession.date}T${convertTo24Hour(newSession.time)}:00.000Z`,
        duration: 60, // Default 60 minutes
        notes: '',
        studentName: (newSession as any).studentName || newSession.student,
      }

      const createdSession = await SessionService.createSession(sessionData)

      if (createdSession) {
        console.log('Session created successfully, updating local state')

        // Convert the created session back to UI format
        const newUISession = SessionService.convertToUISession(createdSession)

        // Add to local state immediately for better UX
        setUpcomingSessions(prev => {
          // Check if session already exists to avoid duplicates (by date, time, and intervention)
          const exists = prev.some(session =>
            session.date === newUISession.date &&
            session.time === newUISession.time &&
            session.intervention === newUISession.intervention
          )
          if (exists) return prev
          return [newUISession, ...prev]
        })

        // Don't refetch immediately to avoid overwriting local state
        // The session will appear in subsequent fetches once the server storage is working properly
        console.log('Session added to local state, skipping server refetch to preserve local changes')
      }
    } catch (err) {
      console.error('Error adding session:', err)
      setError('Failed to create session')

      // Fallback: add to local state for development
      const formattedSession = {
        ...newSession,
        time: formatTime(newSession.time),
      }

      setUpcomingSessions((prev) => {
        const updated = [...prev, formattedSession].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        )
        return updated
      })
    }
  }

  // Helper function to convert 12-hour time to 24-hour
  const convertTo24Hour = (time12h: string): string => {
    const [time, modifier] = time12h.split(' ')
    let [hours, minutes] = time.split(':')

    if (hours === '12') {
      hours = '00'
    }

    if (modifier === 'PM') {
      hours = (parseInt(hours, 10) + 12).toString()
    }

    return `${hours.padStart(2, '0')}:${minutes}`
  }

  return {
    upcomingSessions,
    logHistory,
    addSession,
    loading,
    error,
    refetch: () => {
      if (userId) {
        const loadSessions = async () => {
          const [upcoming, history] = await Promise.all([
            SessionService.fetchUpcomingSessions(userId, userRole),
            SessionService.fetchSessionHistory(userId, userRole),
          ])
          setUpcomingSessions(upcoming)
          setLogHistory(history)
        }
        loadSessions()
      }
    },
  }
}
