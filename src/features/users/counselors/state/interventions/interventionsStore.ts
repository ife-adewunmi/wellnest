import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import {
  interventionsApi,
  SessionTableData,
  CreateSessionData,
  InterventionResult,
} from '../../services/models/interventions-api'

export interface InterventionsState {
  // Data
  upcomingSessions: SessionTableData[]
  sessionHistory: SessionTableData[]
  isLoading: boolean
  error: string | null
  lastFetched: Date | null

  // Actions
  fetchUpcomingSessions: (counselorId: string) => Promise<void>
  fetchSessionHistory: (counselorId: string) => Promise<void>
  createSession: (sessionData: any) => Promise<boolean>
  updateSessionStatus: (sessionId: string, status: string, notes?: string) => Promise<boolean>
  deleteSession: (sessionId: string) => Promise<boolean>
  clearError: () => void
  reset: () => void
}

const initialState = {
  upcomingSessions: [],
  sessionHistory: [],
  isLoading: false,
  error: null,
  lastFetched: null,
}

export const useInterventionsStore = create<InterventionsState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      fetchUpcomingSessions: async (counselorId: string) => {
        set({ isLoading: true, error: null })
        try {
          const sessions = await interventionsApi.getUpcomingSessions(counselorId)
          set({
            upcomingSessions: sessions,
            isLoading: false,
            lastFetched: new Date(),
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch upcoming sessions',
            isLoading: false,
          })
        }
      },

      fetchSessionHistory: async (counselorId: string) => {
        set({ isLoading: true, error: null })
        try {
          const sessions = await interventionsApi.getSessionHistory(counselorId)
          set({
            sessionHistory: sessions,
            isLoading: false,
            lastFetched: new Date(),
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch session history',
            isLoading: false,
          })
        }
      },

      createSession: async (sessionData: CreateSessionData) => {
        set({ isLoading: true, error: null })
        try {
          const result = await interventionsApi.createSession(sessionData)
          if (result.success) {
            // Refresh upcoming sessions
            await get().fetchUpcomingSessions(sessionData.counselorId)
            return true
          } else {
            set({ error: result.error || 'Failed to create session', isLoading: false })
            return false
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to create session',
            isLoading: false,
          })
          return false
        }
      },

      updateSessionStatus: async (sessionId: string, status: string, notes?: string) => {
        set({ isLoading: true, error: null })
        try {
          const result = await interventionsApi.updateSessionStatus(sessionId, status, notes)
          if (result.success) {
            // Update local state
            const { upcomingSessions, sessionHistory } = get()

            const updateSession = (session: SessionTableData) =>
              session.id === sessionId ? { ...session, status, notes } : session

            set({
              upcomingSessions: upcomingSessions.map(updateSession),
              sessionHistory: sessionHistory.map(updateSession),
              isLoading: false,
            })
            return true
          } else {
            set({ error: result.error || 'Failed to update session', isLoading: false })
            return false
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to update session',
            isLoading: false,
          })
          return false
        }
      },

      deleteSession: async (sessionId: string) => {
        set({ isLoading: true, error: null })
        try {
          const result = await interventionsApi.deleteSession(sessionId)
          if (result.success) {
            // Remove from local state
            const { upcomingSessions, sessionHistory } = get()
            set({
              upcomingSessions: upcomingSessions.filter((s) => s.id !== sessionId),
              sessionHistory: sessionHistory.filter((s) => s.id !== sessionId),
              isLoading: false,
            })
            return true
          } else {
            set({ error: result.error || 'Failed to delete session', isLoading: false })
            return false
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to delete session',
            isLoading: false,
          })
          return false
        }
      },

      clearError: () => set({ error: null }),

      reset: () => set(initialState),
    }),
    {
      name: 'interventions-store',
    },
  ),
)
