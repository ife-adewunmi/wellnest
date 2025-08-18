import { request } from '@/shared/service/request'
import { Endpoints } from '@/shared/enums/endpoints'
import { User } from '../types'

export interface AuthSession {
  id: string
  expiresAt: Date
  lastActiveAt: Date
  deviceInfo?: string
}

export interface SessionResponse {
  user: User | null
  isAuthenticated: boolean
  session?: AuthSession
}

export interface SessionExtendResponse {
  success: boolean
  session?: AuthSession
  message?: string
}

export interface ActiveSessionsResponse {
  sessions: AuthSession[]
  total: number
}

interface SessionApiRequests {
  validateSession: () => Promise<SessionResponse>
  extendSession: () => Promise<SessionExtendResponse>
  invalidateSession: (sessionId?: string) => Promise<{ success: boolean }>
  invalidateAllSessions: () => Promise<{ success: boolean }>
  getActiveSessions: () => Promise<ActiveSessionsResponse>
}

export class SessionApi implements SessionApiRequests {
  /**
   * Validate current session and get user data
   */
  public async validateSession(): Promise<SessionResponse> {
    return await request.get(Endpoints.API.concat(Endpoints.AUTH_SESSION.VALIDATE))
  }

  /**
   * Extend current session expiration
   */
  public async extendSession(): Promise<SessionExtendResponse> {
    return await request.post(Endpoints.API.concat(Endpoints.AUTH_SESSION.EXTEND))
  }

  /**
   * Invalidate a specific session (current session if no ID provided)
   */
  public async invalidateSession(sessionId?: string): Promise<{ success: boolean }> {
    const endpoint = sessionId
      ? Endpoints.API.concat(Endpoints.AUTH_SESSION.INVALIDATE_BY_ID(sessionId))
      : Endpoints.API.concat(Endpoints.AUTH_SESSION.INVALIDATE)

    return await request.post(endpoint)
  }

  /**
   * Invalidate all sessions for the current user
   */
  public async invalidateAllSessions(): Promise<{ success: boolean }> {
    return await request.post(Endpoints.API.concat(Endpoints.AUTH_SESSION.INVALIDATE_ALL))
  }

  /**
   * Get all active sessions for the current user
   */
  public async getActiveSessions(): Promise<ActiveSessionsResponse> {
    return await request.get(Endpoints.API.concat(Endpoints.AUTH_SESSION.ACTIVE))
  }

  /**
   * Refresh session activity (updates last active time)
   */
  public async refreshActivity(): Promise<{ success: boolean }> {
    return await request.post(Endpoints.API.concat(Endpoints.AUTH_SESSION.REFRESH))
  }
}

export const sessionApi = new SessionApi()
