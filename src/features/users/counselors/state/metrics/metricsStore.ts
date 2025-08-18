import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { Metric } from '../../types/dashboard.types'
import { dashboardApi } from '../../services/models/dashboard-api'
import { ActionTypes } from '../actionTypes'

interface MetricsState {
  metrics: Metric[]
  isLoading: boolean
  error: string | null
  lastFetched?: string
}

interface MetricsActions {
  fetchMetrics: (counselorId: string, force?: boolean) => Promise<void>
  updateMetric: (metric: Metric) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  resetStore: () => void
  isDataStale: (maxAge?: number) => boolean
}

type MetricsStore = MetricsState & MetricsActions

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

const initialState: MetricsState = {
  metrics: [],
  isLoading: false,
  error: null,
  lastFetched: undefined,
}

export const useMetricsStore = create<MetricsStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        fetchMetrics: async (counselorId: string, force = false) => {
          const state = get()

          // Check cache unless forced
          if (!force && state.metrics.length > 0 && !state.isDataStale()) {
            return
          }

          set({ isLoading: true, error: null })
          try {
            const metrics = await dashboardApi.getMetrics(counselorId)
            set({
              metrics,
              isLoading: false,
              lastFetched: new Date().toISOString(),
              error: null,
            })
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to fetch metrics',
              isLoading: false,
            })
          }
        },

        updateMetric: (metric: Metric) => {
          set((state) => ({
            metrics: state.metrics.map((m) => (m.id === metric.id ? metric : m)),
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
        name: ActionTypes.METRICS,
        partialize: (state) => ({
          metrics: state.metrics,
          lastFetched: state.lastFetched,
        }),
      },
    ),
    {
      name: ActionTypes.METRICS,
    },
  ),
)
