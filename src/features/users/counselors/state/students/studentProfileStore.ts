import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { StudentDetail } from '@/users/counselors/types/student.types'
import { studentsApi } from '../../services/models/students-api'
import { ActionTypes } from '../actionTypes'

interface StudentProfileState {
  // Student profiles cache
  studentProfiles: Record<string, StudentDetail>

  // UI state
  isLoading: boolean
  error: string | null

  // Cache management
  lastFetched: Record<string, string> // studentId -> timestamp
}

interface StudentProfileActions {
  // Profile actions
  fetchStudentProfile: (studentId: string, force?: boolean) => Promise<void>
  setStudentProfile: (studentId: string, profile: StudentDetail) => void
  updateStudentProfile: (studentId: string, updates: Partial<StudentDetail>) => void
  removeStudentProfile: (studentId: string) => void

  // UI state actions
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void

  // Cache management
  clearCache: () => void
  clearStudentCache: (studentId: string) => void
  isDataStale: (studentId: string, maxAge?: number) => boolean
  refreshStudentProfile: (studentId: string) => Promise<void>
}

type StudentProfileStore = StudentProfileState & StudentProfileActions

const CACHE_DURATION = 5 * 60 * 1000

const initialState: StudentProfileState = {
  studentProfiles: {},
  isLoading: false,
  error: null,
  lastFetched: {},
}

export const useStudentProfileStore = create<StudentProfileStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Profile actions
        fetchStudentProfile: async (studentId: string, force = false) => {
          const state = get()

          // Check cache first unless forced
          if (!force && state.studentProfiles[studentId] && !state.isDataStale(studentId)) {
            return
          }

          set({ isLoading: true, error: null })
          try {
            const profile = await studentsApi.getStudentById(studentId)

            if (profile) {
              set((state) => ({
                studentProfiles: {
                  ...state.studentProfiles,
                  [studentId]: profile,
                },
                lastFetched: {
                  ...state.lastFetched,
                  [studentId]: new Date().toISOString(),
                },
                isLoading: false,
                error: null,
              }))
            } else {
              set({
                error: 'Student not found',
                isLoading: false,
              })
            }
          } catch (error) {
            console.error('Error fetching student profile:', error)
            set({
              error: error instanceof Error ? error.message : 'Failed to fetch student profile',
              isLoading: false,
            })
          }
        },

        setStudentProfile: (studentId: string, profile: StudentDetail) => {
          set((state) => ({
            studentProfiles: {
              ...state.studentProfiles,
              [studentId]: profile,
            },
            lastFetched: {
              ...state.lastFetched,
              [studentId]: new Date().toISOString(),
            },
          }))
        },

        updateStudentProfile: async (studentId: string, updates: Partial<StudentDetail>) => {
          const state = get()
          const currentProfile = state.studentProfiles[studentId]

          if (!currentProfile) {
            set({ error: 'Student profile not found in cache' })
            return
          }

          // Optimistic update
          const updatedProfile = { ...currentProfile, ...updates }
          set((state) => ({
            studentProfiles: {
              ...state.studentProfiles,
              [studentId]: updatedProfile,
            },
          }))

          try {
            // Call API to persist changes
            const result = await studentsApi.updateStudent(studentId, updates)

            // Update with server response
            set((state) => ({
              studentProfiles: {
                ...state.studentProfiles,
                [studentId]: result,
              },
              lastFetched: {
                ...state.lastFetched,
                [studentId]: new Date().toISOString(),
              },
            }))
          } catch (error) {
            console.error('Error updating student profile:', error)
            // Revert optimistic update on error
            set((state) => ({
              studentProfiles: {
                ...state.studentProfiles,
                [studentId]: currentProfile,
              },
              error: error instanceof Error ? error.message : 'Failed to update student profile',
            }))
          }
        },

        removeStudentProfile: (studentId: string) => {
          set((state) => {
            const { [studentId]: removed, ...remainingProfiles } = state.studentProfiles
            const { [studentId]: removedFetch, ...remainingFetched } = state.lastFetched

            return {
              studentProfiles: remainingProfiles,
              lastFetched: remainingFetched,
            }
          })
        },

        // UI state actions
        setLoading: (loading: boolean) => set({ isLoading: loading }),
        setError: (error: string | null) => set({ error }),
        clearError: () => set({ error: null }),

        // Cache management
        clearCache: () =>
          set({
            studentProfiles: {},
            lastFetched: {},
            error: null,
          }),

        clearStudentCache: (studentId: string) => {
          set((state) => {
            const { [studentId]: removed, ...remaining } = state.studentProfiles
            const { [studentId]: removedFetch, ...remainingFetched } = state.lastFetched

            return {
              studentProfiles: remaining,
              lastFetched: remainingFetched,
            }
          })
        },

        isDataStale: (studentId: string, maxAge = CACHE_DURATION) => {
          const lastFetch = get().lastFetched[studentId]
          if (!lastFetch) return true

          const fetchTime = new Date(lastFetch).getTime()
          const now = Date.now()
          return now - fetchTime > maxAge
        },

        refreshStudentProfile: async (studentId: string) => {
          await get().fetchStudentProfile(studentId, true)
        },
      }),
      {
        name: ActionTypes.STUDENTS_PROFILE,
        partialize: (state) => ({
          studentProfiles: state.studentProfiles,
          lastFetched: state.lastFetched,
        }),
      },
    ),
    {
      name: ActionTypes.STUDENTS_PROFILE,
    },
  ),
)
