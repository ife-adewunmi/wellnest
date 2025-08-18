import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type {
  DashboardState,
  Metric,
  MoodCheckIn,
  ActivityData,
  Notification,
  StudentTableData,
} from '../../types/dashboard.types'
import { dashboardApi } from '../../services/models/dashboard-api'
import { ActionTypes } from '../actionTypes'

// Extended state with timestamp tracking
interface DashboardStoreState extends DashboardState {
  lastFetched?: Date | string
  lastFetchedByType: {
    metrics?: Date | string
    moodCheckIns?: Date | string
    activities?: Date | string
    notifications?: Date | string
    students?: Date | string
  }
}

interface DashboardStore extends DashboardStoreState {
  // General actions
  fetchDashboardData: (counselorId: string) => Promise<void>
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  resetStore: () => void
  clearCache: () => void
}

const initialState: DashboardStoreState = {
  metrics: [],
  moodCheckIns: [],
  activities: [],
  notifications: [],
  students: [],
  isLoading: false,
  error: null,
  lastFetched: undefined,
  lastFetchedByType: {},
}

export const useDashboardStore = create<DashboardStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        // General actions
        fetchDashboardData: async (counselorId: string) => {
          set({ isLoading: true, error: null })
          try {
            const data = await dashboardApi.getDashboardData(counselorId)
            const now = new Date().toISOString()
            set({
              metrics: data.metrics,
              moodCheckIns: data.moodCheckIns,
              activities: data.activities || data.recentActivities || [],
              notifications: data.notifications,
              students: data.students || [],
              isLoading: false,
              lastFetched: now,
              lastFetchedByType: {
                metrics: now,
                moodCheckIns: now,
                activities: now,
                notifications: now,
                students: now,
              },
            })
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to fetch dashboard data',
              isLoading: false,
            })
          }
        },

        setLoading: (loading: boolean) => set({ isLoading: loading }),

        setError: (error: string | null) => set({ error }),

        resetStore: () => set(initialState),

        clearCache: () =>
          set((state) => ({
            ...state,
            lastFetched: undefined,
            lastFetchedByType: {},
          })),
      }),
      {
        name: ActionTypes.DASHBOARD,
        partialize: (state) => ({
          // Persist data with timestamps for caching
          metrics: state.metrics,
          moodCheckIns: state.moodCheckIns.slice(0, 20), // Keep recent 20
          students: state.students, // Persist all students
          activities: state.activities.slice(0, 20), // Keep recent 20
          notifications: state.notifications.slice(0, 10), // Keep recent 10
          lastFetched: state.lastFetched,
          lastFetchedByType: state.lastFetchedByType,
        }),
      },
    ),
  ),
)
