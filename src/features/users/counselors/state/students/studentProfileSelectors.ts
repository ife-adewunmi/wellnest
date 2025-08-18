import { StudentDetail } from '@/features/users/counselors/types/student.types'
import { useStudentProfileStore } from './studentProfileStore'
import { useMemo } from 'react'

// Data selectors
export const useStudentProfiles = () => useStudentProfileStore((state) => state.studentProfiles)

export const useStudentProfile = (studentId: string) =>
  useStudentProfileStore((state) => state.studentProfiles[studentId])

export const useHasStudentProfile = (studentId: string) =>
  useStudentProfileStore((state) => !!state.studentProfiles[studentId])

// State selectors
export const useStudentProfileLoading = () => useStudentProfileStore((state) => state.isLoading)

export const useStudentProfileError = () => useStudentProfileStore((state) => state.error)

export const useHasStudentProfileError = () => useStudentProfileStore((state) => !!state.error)

// Cache selectors
export const useIsStudentProfileStale = (studentId: string) =>
  useStudentProfileStore((state) => state.isDataStale(studentId))

export const useStudentProfileLastFetched = (studentId: string) =>
  useStudentProfileStore((state) => state.lastFetched[studentId])

// Computed selectors - Fixed to use useMemo to prevent infinite re-renders
export const useStudentProfileWithStatus = (studentId: string) => {
  const profile = useStudentProfileStore((state) => state.studentProfiles[studentId])
  const isStale = useStudentProfileStore((state) => state.isDataStale(studentId))
  const lastFetched = useStudentProfileStore((state) => state.lastFetched[studentId])

  return useMemo(() => ({
    profile,
    isStale,
    lastFetched,
    exists: !!profile,
    needsRefresh: !profile || isStale,
  }), [profile, isStale, lastFetched])
}

// Action selectors
export const useStudentProfileActions = () => {
  const store = useStudentProfileStore()

  return useMemo(() => ({
    fetchStudentProfile: store.fetchStudentProfile,
    setStudentProfile: store.setStudentProfile,
    updateStudentProfile: store.updateStudentProfile,
    removeStudentProfile: store.removeStudentProfile,
    refreshStudentProfile: store.refreshStudentProfile,
    setLoading: store.setLoading,
    setError: store.setError,
    clearError: store.clearError,
    clearCache: store.clearCache,
    clearStudentCache: store.clearStudentCache,
  }), [
    store.fetchStudentProfile,
    store.setStudentProfile,
    store.updateStudentProfile,
    store.removeStudentProfile,
    store.refreshStudentProfile,
    store.setLoading,
    store.setError,
    store.clearError,
    store.clearCache,
    store.clearStudentCache,
  ])
}

// Bulk selectors for performance
export const useMultipleStudentProfiles = (studentIds: string[]) =>
  useStudentProfileStore((state) =>
    studentIds.reduce(
      (acc, id) => {
        acc[id] = state.studentProfiles[id]
        return acc
      },
      {} as Record<string, StudentDetail | undefined>,
    ),
  )
  