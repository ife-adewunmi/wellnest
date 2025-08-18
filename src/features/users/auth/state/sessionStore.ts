import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { sessionApi, AuthSession, SessionResponse } from '../services/session-api'

export interface SessionStore {
  // Session state
  session: AuthSession | null
  isSessionValid: boolean
  lastChecked: number | null
  checkInterval: NodeJS.Timeout | null
  isValidating: boolean

  // Actions
  setSession: (session: AuthSession | null) => void
  validateSession: () => Promise<SessionResponse | null>
  clearSession: () => void
  startPeriodicCheck: () => void
  stopPeriodicCheck: () => void
  extendSession: () => Promise<boolean>
  invalidateSession: (sessionId?: string) => Promise<boolean>
  invalidateAllSessions: () => Promise<boolean>
  refreshActivity: () => Promise<boolean>

  // Navigation helpers
  shouldRedirectToAuth: () => boolean
  shouldRedirectFromAuth: () => boolean
}

export const useSessionStore = create<SessionStore>()(
  persist(
    (set, get) => ({
      session: null,
      isSessionValid: false,
      lastChecked: null,
      checkInterval: null,
      isValidating: false,

      setSession: (session) => {
        set({
          session,
          isSessionValid: !!session && new Date(session.expiresAt) > new Date(),
          lastChecked: Date.now(),
        })
      },

      validateSession: async () => {
        const { isValidating } = get()

        // Prevent multiple simultaneous validation requests
        if (isValidating) {
          return null
        }

        set({ isValidating: true })

        try {
          const response = await sessionApi.validateSession()

          if (response.isAuthenticated && response.user && response.session) {
            const session: AuthSession = {
              ...response.session,
              expiresAt: new Date(response.session.expiresAt),
              lastActiveAt: new Date(response.session.lastActiveAt),
            }

            set({
              session,
              isSessionValid: true,
              lastChecked: Date.now(),
              isValidating: false,
            })
          } else {
            set({
              session: null,
              isSessionValid: false,
              lastChecked: Date.now(),
              isValidating: false,
            })
          }

          return response
        } catch (error) {
          console.error('Session validation error:', error)
          set({
            session: null,
            isSessionValid: false,
            lastChecked: Date.now(),
            isValidating: false,
          })
          return null
        }
      },

      clearSession: () => {
        const { checkInterval } = get()
        if (checkInterval) {
          clearInterval(checkInterval)
        }

        set({
          session: null,
          isSessionValid: false,
          lastChecked: null,
          checkInterval: null,
          isValidating: false,
        })
      },

      startPeriodicCheck: () => {
        const { checkInterval } = get()

        // Clear existing interval if any
        if (checkInterval) {
          clearInterval(checkInterval)
        }

        // Start new interval - check every 5 minutes
        const newInterval = setInterval(
          async () => {
            const { validateSession, isSessionValid } = get()
            if (isSessionValid) {
              await validateSession()
            }
          },
          5 * 60 * 1000,
        )

        set({ checkInterval: newInterval })
      },

      stopPeriodicCheck: () => {
        const { checkInterval } = get()
        if (checkInterval) {
          clearInterval(checkInterval)
          set({ checkInterval: null })
        }
      },

      extendSession: async () => {
        const { session } = get()
        if (!session) return false

        try {
          const response = await sessionApi.extendSession()

          if (response.success && response.session) {
            const extendedSession: AuthSession = {
              ...response.session,
              expiresAt: new Date(response.session.expiresAt),
              lastActiveAt: new Date(response.session.lastActiveAt),
            }

            set({
              session: extendedSession,
              lastChecked: Date.now(),
            })
            return true
          }
        } catch (error) {
          console.error('Session extension error:', error)
        }

        return false
      },

      invalidateSession: async (sessionId?: string) => {
        try {
          const response = await sessionApi.invalidateSession(sessionId)

          if (response.success) {
            // If invalidating current session, clear local state
            if (!sessionId) {
              get().clearSession()
            }
            return true
          }
        } catch (error) {
          console.error('Session invalidation error:', error)
        }

        return false
      },

      invalidateAllSessions: async () => {
        try {
          const response = await sessionApi.invalidateAllSessions()

          if (response.success) {
            get().clearSession()
            return true
          }
        } catch (error) {
          console.error('All sessions invalidation error:', error)
        }

        return false
      },

      refreshActivity: async () => {
        try {
          const response = await sessionApi.refreshActivity()
          return response.success
        } catch (error) {
          console.error('Activity refresh error:', error)
          return false
        }
      },

      shouldRedirectToAuth: () => {
        const { isSessionValid, session } = get()

        if (!isSessionValid || !session) {
          return true
        }

        // Check if session is expired
        const now = new Date()
        const expiresAt = new Date(session.expiresAt)

        return now >= expiresAt
      },

      shouldRedirectFromAuth: () => {
        const { isSessionValid, session } = get()

        if (!isSessionValid || !session) {
          return false
        }

        // Check if session is still valid
        const now = new Date()
        const expiresAt = new Date(session.expiresAt)

        return now < expiresAt
      },
    }),
    {
      name: 'session-storage',
      partialize: (state) => ({
        session: state.session,
        isSessionValid: state.isSessionValid,
        lastChecked: state.lastChecked,
      }),
      onRehydrateStorage: () => (state) => {
        // Check if session is expired after rehydration
        if (state?.session) {
          const now = new Date()
          const expiresAt = new Date(state.session.expiresAt)

          if (now >= expiresAt) {
            state.clearSession()
          }
        }
      },
    },
  ),
)
