// src/features/intervention/services/session.service.ts
import type { Session, LogEntry } from '../types/session'

export interface DatabaseSession {
  id: string
  counselorId: string
  studentId: string
  title: string
  description?: string
  scheduledAt: string
  duration: number
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'PENDING'
  notes?: string
  createdAt: string
  updatedAt: string
  // Joined data
  counselorName?: string
  studentName?: string
}

export interface CreateSessionData {
  studentId: string
  counselorId: string
  title: string
  description?: string
  scheduledAt: string
  duration: number
  notes?: string
  studentName?: string // Store the actual student name
}

export class SessionService {
  /**
   * Fetch upcoming sessions for a user (student or counselor)
   */
  static async fetchUpcomingSessions(userId: string, userRole: 'STUDENT' | 'COUNSELOR' = 'STUDENT'): Promise<Session[]> {
    try {
      console.log('🔍 SessionService: Fetching upcoming sessions for', { userId, userRole })
      const response = await fetch(`/api/sessions?userId=${userId}&upcoming=true&role=${userRole}`)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('Failed to fetch sessions:', response.status, errorData)
        throw new Error(`Failed to fetch sessions: ${response.status} - ${errorData.error || 'Unknown error'}`)
      }

      const dbSessions: DatabaseSession[] = await response.json()
      console.log('📊 SessionService: Raw database sessions:', dbSessions)

      // Convert database sessions to UI format
      const uiSessions = dbSessions.map(this.convertToUISession)
      console.log('🔄 SessionService: Converted UI sessions:', uiSessions)

      return uiSessions
    } catch (error) {
      console.error('Error fetching upcoming sessions:', error)
      return []
    }
  }

  /**
   * Fetch session history/logs
   */
  static async fetchSessionHistory(userId: string, userRole: 'STUDENT' | 'COUNSELOR' = 'STUDENT'): Promise<LogEntry[]> {
    try {
      const response = await fetch(`/api/sessions?userId=${userId}&upcoming=false&role=${userRole}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch session history')
      }
      
      const dbSessions: DatabaseSession[] = await response.json()
      
      // Convert to log entries
      return dbSessions.map(this.convertToLogEntry)
    } catch (error) {
      console.error('Error fetching session history:', error)
      return []
    }
  }

  /**
   * Create a new session
   */
  static async createSession(sessionData: CreateSessionData): Promise<DatabaseSession | null> {
    try {
      console.log('Creating session with data:', sessionData)

      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('Failed to create session:', response.status, errorData)
        throw new Error(`Failed to create session: ${response.status} - ${errorData.error || 'Unknown error'}`)
      }

      const result = await response.json()
      console.log('Session created successfully:', result)
      return result
    } catch (error) {
      console.error('Error creating session:', error)
      throw error
    }
  }

  /**
   * Update session status
   */
  static async updateSessionStatus(sessionId: string, status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'PENDING'): Promise<boolean> {
    try {
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      return response.ok
    } catch (error) {
      console.error('Error updating session status:', error)
      return false
    }
  }

  /**
   * Convert database session to UI session format
   */
  static convertToUISession(dbSession: DatabaseSession): Session {
    console.log('🔄 Converting database session to UI format:', dbSession)

    const scheduledDate = new Date(dbSession.scheduledAt)

    const uiSession = {
      date: scheduledDate.toISOString().split('T')[0], // YYYY-MM-DD format
      time: scheduledDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }),
      student: dbSession.studentName || 'Unknown Student',
      intervention: dbSession.title,
    }

    console.log('✅ Converted UI session:', uiSession)
    return uiSession
  }

  /**
   * Convert database session to log entry format
   */
  private static convertToLogEntry(dbSession: DatabaseSession): LogEntry {
    const scheduledDate = new Date(dbSession.scheduledAt)
    
    return {
      date: scheduledDate.toISOString().split('T')[0],
      student: dbSession.studentName || 'Unknown Student',
      intervention: dbSession.title,
      status: SessionService.convertStatusToDisplayStatus(dbSession.status),
    }
  }

  /**
   * Convert database status to display status
   */
  private static convertStatusToDisplayStatus(status: string): string {
    switch (status) {
      case 'SCHEDULED':
        return 'Scheduled'
      case 'COMPLETED':
        return 'Completed'
      case 'CANCELLED':
        return 'Cancelled'
      case 'PENDING':
        return 'Pending'
      default:
        return status
    }
  }
}
