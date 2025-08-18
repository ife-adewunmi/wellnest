import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { ActivityData } from '../../types/dashboard.types'
import { dashboardApi } from '../../services/models/dashboard-api'
import { ActionTypes } from '../actionTypes'

interface ActivitiesState {
  activities: ActivityData[]
  isLoading: boolean
  error: string | null
  lastFetched?: string
}

interface ActivitiesActions {
  fetchActivities: (counselorId: string, force?: boolean) => Promise<void>
  updateActivity: (activity: ActivityData) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  resetStore: () => void
  isDataStale: (maxAge?: number) => boolean
}

type ActivitiesStore = ActivitiesState & ActivitiesActions

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

const initialState: ActivitiesState = {
  activities: [],
  isLoading: false,
  error: null,
  lastFetched: undefined,
}

export const useActivitiesStore = create<ActivitiesStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        fetchActivities: async (counselorId: string, force = false) => {
          const state = get()

          // Check cache unless forced
          if (!force && state.activities.length > 0 && !state.isDataStale()) {
            return
          }

          set({ isLoading: true, error: null })
          try {
            const activities = await dashboardApi.getActivities(counselorId)
            set({
              activities,
              isLoading: false,
              lastFetched: new Date().toISOString(),
              error: null,
            })
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to fetch activities',
              isLoading: false,
            })
          }
        },

        updateActivity: (activity: ActivityData) => {
          set((state) => ({
            activities: state.activities.map((a) => (a.id === activity.id ? activity : a)),
          }))
        },

        setLoading: (loading: boolean) => set({ isLoading: loading }),

        setError: (error: string | null) => set({ error }),

        resetStore: () => set(initialState),

        isDataStale: (maxAge = CACHE_DURATION) => {
          const lastFetch = get().lastFetched
          if (!lastFetch) return true

          const fetchTime = new Date(lastFetch).getTime()
          const now = Date.now()
          return now - fetchTime > maxAge
        },
      }),
      {
        name: ActionTypes.ACTIVITIES,
        partialize: (state) => ({
          activities: state.activities.slice(0, 20), // Keep recent 20
          lastFetched: state.lastFetched,
        }),
      },
    ),
    {
      name: ActionTypes.ACTIVITIES,
    },
  ),
)
