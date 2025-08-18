import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { StudentTableData } from '../../types/dashboard.types'
import { dashboardApi } from '../../services/models/dashboard-api'
import { ActionTypes } from '../actionTypes'

interface StudentsState {
  students: StudentTableData[]
  isLoading: boolean
  error: string | null
  lastFetched?: string
}

interface StudentsActions {
  fetchStudents: (counselorId: string, force?: boolean) => Promise<void>
  updateStudent: (student: StudentTableData) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  resetStore: () => void
  isDataStale: (maxAge?: number) => boolean
}

type StudentsStore = StudentsState & StudentsActions

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

const initialState: StudentsState = {
  students: [],
  isLoading: false,
  error: null,
  lastFetched: undefined,
}

export const useStudentsStore = create<StudentsStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        fetchStudents: async (counselorId: string, force = false) => {
          const state = get()

          // Check cache unless forced
          if (!force && state.students.length > 0 && !state.isDataStale()) {
            return
          }

          set({ isLoading: true, error: null })
          try {
            const students = await dashboardApi.getStudents(counselorId)
            set({
              students: students || [],
              isLoading: false,
              lastFetched: new Date().toISOString(),
              error: null,
            })
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to fetch students',
              isLoading: false,
            })
          }
        },

        updateStudent: (student: StudentTableData) => {
          set((state) => ({
            students: state.students.map((s) => (s.id === student.id ? student : s)),
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
        name: ActionTypes.STUDENTS,
        partialize: (state) => ({
          students: state.students,
          lastFetched: state.lastFetched,
        }),
      },
    ),
    {
      name: ActionTypes.STUDENTS,
    },
  ),
)
