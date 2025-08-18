import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { MoodCheckIn } from '@/features/users/counselors/types/dashboard.types'
import { dashboardApi } from '@/features/users/counselors/services/models/dashboard-api'
import { ActionTypes } from '../actionTypes'

interface MoodCheckInsState {
  moodCheckIns: MoodCheckIn[]
  isLoading: boolean
  error: string | null
  lastFetched?: string
}

interface MoodCheckInsActions {
  fetchMoodCheckIns: (counselorId: string, force?: boolean) => Promise<void>
  addMoodCheckIn: (checkIn: MoodCheckIn) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  resetStore: () => void
  isDataStale: (maxAge?: number) => boolean
}

type MoodCheckInsStore = MoodCheckInsState & MoodCheckInsActions

const CACHE_DURATION = 2 * 60 * 1000 // 2 minutes

const initialState: MoodCheckInsState = {
  moodCheckIns: [],
  isLoading: false,
  error: null,
  lastFetched: undefined,
}

export const useMoodCheckInsStore = create<MoodCheckInsStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        fetchMoodCheckIns: async (counselorId: string, force = false) => {
          const state = get()

          // Check cache unless forced
          if (!force && state.moodCheckIns.length > 0 && !state.isDataStale()) {
            return
          }

          set({ isLoading: true, error: null })
          try {
            const moodCheckIns = await dashboardApi.getMoodCheckIns(counselorId)
            set({
              moodCheckIns,
              isLoading: false,
              lastFetched: new Date().toISOString(),
              error: null,
            })
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to fetch mood check-ins',
              isLoading: false,
            })
          }
        },

        addMoodCheckIn: (checkIn: MoodCheckIn) => {
          set((state) => ({
            moodCheckIns: [checkIn, ...state.moodCheckIns],
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
        name: ActionTypes.MOOD_CHECK_IN,
        partialize: (state) => ({
          moodCheckIns: state.moodCheckIns.slice(0, 20), // Keep recent 20
          lastFetched: state.lastFetched,
        }),
      },
    ),
    {
      name: ActionTypes.MOOD_CHECK_IN,
    },
  ),
)
