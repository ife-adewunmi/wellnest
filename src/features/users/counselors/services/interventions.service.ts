import { db } from '@/shared/db'
import { sessions, counselorNotes, users, students } from '@/shared/db/schema'
import { eq, and, desc, gte, sql, asc, inArray } from 'drizzle-orm'

export interface CreateSessionData {
  counselorId: string
  studentId: string
  title: string
  description?: string
  scheduledAt: Date
  duration: number
  status?: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW' | 'RESCHEDULED'
  notes?: string
}

export interface SessionTableData {
  id: string
  title: string
  studentName: string
  studentId: string
  scheduledAt: Date
  duration: number
  status: string
  notes?: string
  createdAt: Date
}

export interface InterventionResult {
  success: boolean
  session?: any
  sessions?: SessionTableData[]
  error?: string
  details?: string
}

export class InterventionService {
  /**
   * Get sessions for a counselor
   */
  static async getSessions(counselorId: string): Promise<SessionTableData[]> {
    try {
      const sessionsList = await db
        .select({
          id: sessions.id,
          title: sessions.title,
          scheduledAt: sessions.scheduledAt,
          duration: sessions.duration,
          status: sessions.status,
          notes: sessions.notes,
          createdAt: sessions.createdAt,
          studentName: sql<string>`${users.firstName} || ' ' || ${users.lastName}`,
          studentId: students.studentId,
          studentUserId: users.id,
        })
        .from(sessions)
        .innerJoin(users, eq(sessions.studentId, users.id))
        .innerJoin(students, eq(users.id, students.userId))
        .where(eq(sessions.counselorId, counselorId))
        .orderBy(desc(sessions.scheduledAt))

      return sessionsList.map((session) => ({
        id: session.id,
        title: session.title,
        studentName: session.studentName,
        studentId: session.studentId,
        scheduledAt: session.scheduledAt,
        duration: session.duration,
        status: session.status || 'SCHEDULED',
        notes: session.notes || undefined,
        createdAt: session.createdAt || new Date(),
      }))
    } catch (error) {
      console.error('Error fetching sessions:', error)
      return []
    }
  }

  /**
   * Get upcoming sessions for a counselor
   */
  static async getUpcomingSessions(counselorId: string): Promise<SessionTableData[]> {
    try {
      const now = new Date()
      const sessionsList = await db
        .select({
          id: sessions.id,
          title: sessions.title,
          scheduledAt: sessions.scheduledAt,
          duration: sessions.duration,
          status: sessions.status,
          notes: sessions.notes,
          createdAt: sessions.createdAt,
          studentName: sql<string>`${users.firstName} || ' ' || ${users.lastName}`,
          studentId: students.studentId,
        })
        .from(sessions)
        .innerJoin(users, eq(sessions.studentId, users.id))
        .innerJoin(students, eq(users.id, students.userId))
        .where(
          and(
            eq(sessions.counselorId, counselorId),
            gte(sessions.scheduledAt, now),
            inArray(sessions.status, ['SCHEDULED', 'IN_PROGRESS']),
          ),
        )
        .orderBy(asc(sessions.scheduledAt))

      return sessionsList.map((session) => ({
        id: session.id,
        title: session.title,
        studentName: session.studentName,
        studentId: session.studentId,
        scheduledAt: session.scheduledAt,
        duration: session.duration,
        status: session.status || 'SCHEDULED',
        notes: session.notes || undefined,
        createdAt: session.createdAt || new Date(),
      }))
    } catch (error) {
      console.error('Error fetching upcoming sessions:', error)
      return []
    }
  }

  /**
   * Get session history (completed sessions)
   */
  static async getSessionHistory(counselorId: string): Promise<SessionTableData[]> {
    try {
      const sessionsList = await db
        .select({
          id: sessions.id,
          title: sessions.title,
          scheduledAt: sessions.scheduledAt,
          duration: sessions.duration,
          status: sessions.status,
          notes: sessions.notes,
          createdAt: sessions.createdAt,
          studentName: sql<string>`${users.firstName} || ' ' || ${users.lastName}`,
          studentId: students.studentId,
        })
        .from(sessions)
        .innerJoin(users, eq(sessions.studentId, users.id))
        .innerJoin(students, eq(users.id, students.userId))
        .where(
          and(
            eq(sessions.counselorId, counselorId),
            inArray(sessions.status, ['COMPLETED', 'CANCELLED', 'NO_SHOW']),
          ),
        )
        .orderBy(desc(sessions.scheduledAt))

      return sessionsList.map((session) => ({
        id: session.id,
        title: session.title,
        studentName: session.studentName,
        studentId: session.studentId,
        scheduledAt: session.scheduledAt,
        duration: session.duration,
        status: session.status || 'SCHEDULED',
        notes: session.notes || undefined,
        createdAt: session.createdAt || new Date(),
      }))
    } catch (error) {
      console.error('Error fetching session history:', error)
      return []
    }
  }

  /**
   * Create a new counseling session
   */
  static async createSession(data: CreateSessionData): Promise<InterventionResult> {
    try {
      // Validate required fields
      if (!data.counselorId || !data.studentId || !data.title || !data.scheduledAt) {
        return {
          success: false,
          error: 'Validation failed',
          details: 'Missing required fields',
        }
      }

      // Create session
      const [newSession] = await db
        .insert(sessions)
        .values({
          counselorId: data.counselorId,
          studentId: data.studentId,
          title: data.title,
          description: data.description,
          scheduledAt: data.scheduledAt,
          duration: data.duration,
          status: data.status || 'SCHEDULED',
          notes: data.notes,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning()

      return {
        success: true,
        session: newSession,
      }
    } catch (error) {
      console.error('Error creating session:', error)
      return {
        success: false,
        error: 'Database error',
        details: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  /**
   * Update session status
   */
  static async updateSessionStatus(
    sessionId: string,
    status: string,
    notes?: string,
  ): Promise<InterventionResult> {
    try {
      const [updatedSession] = await db
        .update(sessions)
        .set({
          status: status as any,
          notes: notes || undefined,
          updatedAt: new Date(),
        })
        .where(eq(sessions.id, sessionId))
        .returning()

      if (!updatedSession) {
        return {
          success: false,
          error: 'Session not found',
        }
      }

      return {
        success: true,
        session: updatedSession,
      }
    } catch (error) {
      console.error('Error updating session status:', error)
      return {
        success: false,
        error: 'Database error',
        details: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  /**
   * Delete a session
   */
  static async deleteSession(sessionId: string): Promise<InterventionResult> {
    try {
      const [deletedSession] = await db
        .delete(sessions)
        .where(eq(sessions.id, sessionId))
        .returning()

      if (!deletedSession) {
        return {
          success: false,
          error: 'Session not found',
        }
      }

      return {
        success: true,
        session: deletedSession,
      }
    } catch (error) {
      console.error('Error deleting session:', error)
      return {
        success: false,
        error: 'Database error',
        details: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }
}
