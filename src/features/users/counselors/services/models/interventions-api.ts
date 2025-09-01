import { request } from '@/shared/service/request'
import { Endpoints } from '@/shared/enums/endpoints'
import { isLocal } from '@/shared/enums/environment'

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

export interface InterventionResult {
  success: boolean
  session?: any
  sessions?: SessionTableData[]
  error?: string
  details?: string
}

interface InterventionsApiRequests {
  getSessions: (counselorId: string) => Promise<SessionTableData[]>
  getUpcomingSessions: (counselorId: string) => Promise<SessionTableData[]>
  getSessionHistory: (counselorId: string) => Promise<SessionTableData[]>
  createSession: (sessionData: CreateSessionData) => Promise<InterventionResult>
  updateSessionStatus: (
    sessionId: string,
    status: string,
    notes?: string,
  ) => Promise<InterventionResult>
  deleteSession: (sessionId: string) => Promise<InterventionResult>
}

export class InterventionsApi implements InterventionsApiRequests {
  /**
   * Get all sessions for a counselor
   */
  public async getSessions(counselorId: string): Promise<SessionTableData[]> {
    try {
      const response = await request.get(Endpoints.COUNSELORS.API.SESSIONS.BASE, undefined, {
        params: { counselorId, type: 'all' },
      })
      return response.data || []
    } catch (error) {
      console.error('Failed to fetch sessions:', error)
      // Fallback to mock data in local environment
      if (isLocal()) {
        console.warn('Using mock sessions data as fallback in local environment')
        return this.getMockSessions()
      }
      throw error
    }
  }

  /**
   * Get upcoming sessions for a counselor
   */
  public async getUpcomingSessions(counselorId: string): Promise<SessionTableData[]> {
    try {
      const response = await request.get(Endpoints.COUNSELORS.API.SESSIONS.BASE, undefined, {
        params: { counselorId, type: 'upcoming' },
      })
      return response.data || []
    } catch (error) {
      console.error('Failed to fetch upcoming sessions:', error)
      // Fallback to mock data in local environment
      if (isLocal()) {
        console.warn('Using mock upcoming sessions data as fallback in local environment')
        return this.getMockSessions().filter(
          (s) =>
            ['SCHEDULED', 'IN_PROGRESS'].includes(s.status) && new Date(s.scheduledAt) > new Date(),
        )
      }
      throw error
    }
  }

  /**
   * Get session history for a counselor
   */
  public async getSessionHistory(counselorId: string): Promise<SessionTableData[]> {
    try {
      const response = await request.get(Endpoints.COUNSELORS.API.SESSIONS.BASE, undefined, {
        params: { counselorId, type: 'history' },
      })
      return response.data || []
    } catch (error) {
      console.error('Failed to fetch session history:', error)
      // Fallback to mock data in local environment
      if (isLocal()) {
        console.warn('Using mock session history data as fallback in local environment')
        return this.getMockSessions().filter((s) =>
          ['COMPLETED', 'CANCELLED', 'NO_SHOW'].includes(s.status),
        )
      }
      throw error
    }
  }

  /**
   * Create a new session
   */
  public async createSession(sessionData: CreateSessionData): Promise<InterventionResult> {
    try {
      const response = await request.post(Endpoints.COUNSELORS.API.SESSIONS.BASE, sessionData)
      return {
        success: true,
        session: response.data,
      }
    } catch (error) {
      console.error('Failed to create session:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create session',
      }
    }
  }

  /**
   * Update session status
   */
  public async updateSessionStatus(
    sessionId: string,
    status: string,
    notes?: string,
  ): Promise<InterventionResult> {
    try {
      const response = await request.put(`${Endpoints.COUNSELORS.API.SESSIONS.BASE}/${sessionId}`, {
        status,
        notes,
      })
      return {
        success: true,
        session: response.data,
      }
    } catch (error) {
      console.error('Failed to update session status:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update session status',
      }
    }
  }

  /**
   * Delete a session
   */
  public async deleteSession(sessionId: string): Promise<InterventionResult> {
    try {
      const response = await request.delete(
        `${Endpoints.COUNSELORS.API.SESSIONS.BASE}/${sessionId}`,
      )
      return {
        success: true,
        session: response.data,
      }
    } catch (error) {
      console.error('Failed to delete session:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete session',
      }
    }
  }

  /**
   * Mock sessions for local development fallback
   */
  private getMockSessions(): SessionTableData[] {
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const nextWeek = new Date(now)
    nextWeek.setDate(nextWeek.getDate() + 7)
    const lastWeek = new Date(now)
    lastWeek.setDate(lastWeek.getDate() - 7)

    return [
      {
        id: '1',
        title: 'Initial Counseling Session',
        studentName: 'Ife Adewunmi',
        studentId: 'CSC/20/19283',
        scheduledAt: tomorrow,
        duration: 60,
        status: 'SCHEDULED',
        notes: 'First time meeting',
        createdAt: now,
      },
      {
        id: '2',
        title: 'Follow-up Session',
        studentName: 'Tunde Balogun',
        studentId: 'BOT/21/7547',
        scheduledAt: nextWeek,
        duration: 45,
        status: 'SCHEDULED',
        createdAt: now,
      },
      {
        id: '3',
        title: 'Crisis Intervention',
        studentName: 'Zara Ahmed',
        studentId: 'CSC/23/6844',
        scheduledAt: lastWeek,
        duration: 90,
        status: 'COMPLETED',
        notes: 'Student responded well to intervention',
        createdAt: lastWeek,
      },
    ]
  }
}

export const interventionsApi = new InterventionsApi()
