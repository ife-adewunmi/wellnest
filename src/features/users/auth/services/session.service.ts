import { db } from '@/shared/db'
import { eq, and, gt, lt } from 'drizzle-orm'
import { usersTable } from '@/shared/db/schema/users'
import { authSessionsTable } from '@/shared/db/schema/auth'
import { User } from '../types'
// Using Web Crypto API instead of Node.js crypto for Edge compatibility
import { generateToken } from '../lib/get-token'

export interface SessionData {
  id: string
  userId: string
  sessionToken: string
  deviceInfo?: string
  ipAddress?: string
  isActive: boolean
  lastActiveAt: Date
  expiresAt: Date
  createdAt: Date
  user?: User
}

const mapUser = (u: any): User => ({
  id: u.id.toString(),
  email: u.email,
  firstName: u.firstName,
  lastName: u.lastName,
  role: u.role,
  createdAt: u.createdAt,
  updatedAt: u.updatedAt,
})

export class SessionService {
  private static readonly SESSION_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
  private static readonly CLEANUP_INTERVAL = 24 * 60 * 60 * 1000 // 1 day in milliseconds

  /**
   * Generate a secure session token
   */
  private static async generateSessionToken(): Promise<string> {
    return await generateToken(32)
  }

  /**
   * Create a new authentication session
   */
  static async createSession(
    userId: string,
    deviceInfo?: string,
    ipAddress?: string
  ): Promise<SessionData> {
    const sessionToken = await this.generateSessionToken()
    const expiresAt = new Date(Date.now() + this.SESSION_DURATION)

    const [session] = await db
      .insert(authSessionsTable)
      .values({
        userId,
        sessionToken,
        deviceInfo,
        ipAddress,
        expiresAt,
        isActive: true,
        lastActiveAt: new Date(),
      })
      .returning()

    return {
      id: session.id,
      userId: session.userId,
      sessionToken: session.sessionToken,
      deviceInfo: session.deviceInfo || undefined,
      ipAddress: session.ipAddress || undefined,
      isActive: session.isActive || false,
      lastActiveAt: session.lastActiveAt || new Date(),
      expiresAt: session.expiresAt,
      createdAt: session.createdAt || new Date(),
    }
  }

  /**
   * Validate and retrieve session with user data
   */
  static async validateSession(sessionToken: string): Promise<SessionData | null> {
    try {
      const sessions = await db
        .select({
          session: authSessionsTable,
          user: usersTable,
        })
        .from(authSessionsTable)
        .innerJoin(usersTable, eq(authSessionsTable.userId, usersTable.id))
        .where(
          and(
            eq(authSessionsTable.sessionToken, sessionToken),
            eq(authSessionsTable.isActive, true),
            gt(authSessionsTable.expiresAt, new Date())
          )
        )
        .limit(1)

      if (sessions.length === 0) {
        return null
      }

      const { session, user } = sessions[0]

      // Update last active time
      await db
        .update(authSessionsTable)
        .set({
          lastActiveAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(authSessionsTable.id, session.id))

      return {
        id: session.id,
        userId: session.userId,
        sessionToken: session.sessionToken,
        deviceInfo: session.deviceInfo || undefined,
        ipAddress: session.ipAddress || undefined,
        isActive: session.isActive || false,
        lastActiveAt: new Date(), // Updated time
        expiresAt: session.expiresAt,
        createdAt: session.createdAt || new Date(),
        user: mapUser(user),
      }
    } catch (error) {
      console.error('Session validation error:', error)
      return null
    }
  }

  /**
   * Invalidate a specific session
   */
  static async invalidateSession(sessionToken: string): Promise<boolean> {
    try {
      const result = await db
        .update(authSessionsTable)
        .set({
          isActive: false,
          updatedAt: new Date(),
        })
        .where(eq(authSessionsTable.sessionToken, sessionToken))

      return true
    } catch (error) {
      console.error('Session invalidation error:', error)
      return false
    }
  }

  /**
   * Invalidate all sessions for a user
   */
  static async invalidateAllUserSessions(userId: string): Promise<boolean> {
    try {
      await db
        .update(authSessionsTable)
        .set({
          isActive: false,
          updatedAt: new Date(),
        })
        .where(eq(authSessionsTable.userId, userId))

      return true
    } catch (error) {
      console.error('User sessions invalidation error:', error)
      return false
    }
  }

  /**
   * Get all active sessions for a user
   */
  static async getUserActiveSessions(userId: string): Promise<SessionData[]> {
    try {
      const sessions = await db
        .select()
        .from(authSessionsTable)
        .where(
          and(
            eq(authSessionsTable.userId, userId),
            eq(authSessionsTable.isActive, true),
            gt(authSessionsTable.expiresAt, new Date())
          )
        )
        .orderBy(authSessionsTable.lastActiveAt)

      return sessions.map(session => ({
        id: session.id,
        userId: session.userId,
        sessionToken: session.sessionToken,
        deviceInfo: session.deviceInfo || undefined,
        ipAddress: session.ipAddress || undefined,
        isActive: session.isActive || false,
        lastActiveAt: session.lastActiveAt || new Date(),
        expiresAt: session.expiresAt,
        createdAt: session.createdAt || new Date(),
      }))
    } catch (error) {
      console.error('Get user sessions error:', error)
      return []
    }
  }

  /**
   * Clean up expired and inactive sessions
   */
  static async cleanupExpiredSessions(): Promise<void> {
    try {
      // Delete expired sessions that are older than cleanup interval
      const cleanupThreshold = new Date(Date.now() - this.CLEANUP_INTERVAL)
      await db
        .delete(authSessionsTable)
        .where(
          and(
            eq(authSessionsTable.isActive, false),
            // Delete expired sessions older than cleanup interval (expiresAt < cleanupThreshold)
            lt(authSessionsTable.expiresAt, cleanupThreshold)
          )
        )

      // Mark expired but still active sessions as inactive
      const now = new Date()
      await db
        .update(authSessionsTable)
        .set({
          isActive: false,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(authSessionsTable.isActive, true),
            // Sessions that have expired (expiresAt < now)
            lt(authSessionsTable.expiresAt, now)
          )
        )
    } catch (error) {
      console.error('Session cleanup error:', error)
    }
  }

  /**
   * Extend session expiration
   */
  static async extendSession(sessionToken: string): Promise<boolean> {
    try {
      const newExpiresAt = new Date(Date.now() + this.SESSION_DURATION)
      
      const result = await db
        .update(authSessionsTable)
        .set({
          expiresAt: newExpiresAt,
          lastActiveAt: new Date(),
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(authSessionsTable.sessionToken, sessionToken),
            eq(authSessionsTable.isActive, true)
          )
        )

      return true
    } catch (error) {
      console.error('Session extension error:', error)
      return false
    }
  }
}

export const sessionService = new SessionService()
