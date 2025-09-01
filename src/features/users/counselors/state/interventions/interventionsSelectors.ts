import { useCallback } from 'react'
import { InterventionsState, useInterventionsStore } from './interventionsStore'

// Data selectors
export const useUpcomingSessions = () =>
  useInterventionsStore(useCallback((state: InterventionsState) => state.upcomingSessions, []))

export const useSessionHistory = () =>
  useInterventionsStore(useCallback((state: InterventionsState) => state.sessionHistory, []))

// Status selectors
export const useInterventionsLoading = () =>
  useInterventionsStore(useCallback((state: InterventionsState) => state.isLoading, []))

export const useInterventionsError = () =>
  useInterventionsStore(useCallback((state: InterventionsState) => state.error, []))

export const useInterventionsLastFetched = () =>
  useInterventionsStore(useCallback((state: InterventionsState) => state.lastFetched, []))

// Computed selectors
export const useUpcomingSessionsCount = () =>
  useInterventionsStore(
    useCallback((state: InterventionsState) => state.upcomingSessions.length, []),
  )

export const useCompletedSessionsCount = () =>
  useInterventionsStore(
    useCallback(
      (state: InterventionsState) =>
        state.sessionHistory.filter((session) => session.status === 'COMPLETED').length,
      [],
    ),
  )

export const useTodaysSessions = () =>
  useInterventionsStore(
    useCallback((state: InterventionsState) => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)

      return state.upcomingSessions.filter((session) => {
        const sessionDate = new Date(session.scheduledAt)
        return sessionDate >= today && sessionDate < tomorrow
      })
    }, []),
  )

// Action selectors
const actionsSelector = (state: InterventionsState) => state

export const useInterventionsActions = () => {
  const store = useInterventionsStore(actionsSelector)
  return useCallback(
    () => ({
      fetchUpcomingSessions: store.fetchUpcomingSessions,
      fetchSessionHistory: store.fetchSessionHistory,
      createSession: store.createSession,
      updateSessionStatus: store.updateSessionStatus,
      deleteSession: store.deleteSession,
      clearError: store.clearError,
      reset: store.reset,
    }),
    [store],
  )()
}
