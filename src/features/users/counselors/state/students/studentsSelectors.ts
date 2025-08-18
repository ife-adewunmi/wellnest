import { useStudentsStore } from './studentsStore'
import { RiskLevel } from '@/shared/types/common.types'

// Basic selectors
export const useStudents = () => useStudentsStore((state) => state.students)
export const useStudentsLoading = () => useStudentsStore((state) => state.isLoading)
export const useStudentsError = () => useStudentsStore((state) => state.error)

// Filtered selectors
export const useStudentById = (studentId: string) =>
  useStudentsStore((state) => state.students.find((student) => student.id === studentId))

export const useStudentsByRiskLevel = (riskLevel: RiskLevel) =>
  useStudentsStore((state) => state.students.filter((student) => student.riskLevel === riskLevel))

export const useAtRiskStudents = () =>
  useStudentsStore((state) =>
    state.students.filter(
      (student) => student.riskLevel === 'HIGH' || student.riskLevel === 'CRITICAL',
    ),
  )

export const useLowRiskStudents = () =>
  useStudentsStore((state) => state.students.filter((student) => student.riskLevel === 'LOW'))

export const useStudentsNeedingAttention = () =>
  useStudentsStore((state) =>
    state.students.filter((student) => {
      const lastCheckIn = student.lastCheckIn ? new Date(student.lastCheckIn) : null
      const daysSinceCheckIn = lastCheckIn
        ? (Date.now() - lastCheckIn.getTime()) / (1000 * 60 * 60 * 24)
        : Infinity

      return (
        student.riskLevel === 'CRITICAL' || student.riskLevel === 'HIGH' || daysSinceCheckIn > 3
      )
    }),
  )

export const useStudentsWithHighScreenTime = (threshold: number = 240) =>
  useStudentsStore((state) =>
    state.students.filter((student) => (student.screenTimeToday || 0) > threshold),
  )

// Computed selectors
export const useStudentCount = () => useStudentsStore((state) => state.students.length)

export const useStudentsSummary = () =>
  useStudentsStore((state) => {
    const students = state.students
    return {
      total: students.length,
      atRisk: students.filter((s) => s.riskLevel === 'HIGH' || s.riskLevel === 'CRITICAL').length,
      critical: students.filter((s) => s.riskLevel === 'CRITICAL').length,
      high: students.filter((s) => s.riskLevel === 'HIGH').length,
      medium: students.filter((s) => s.riskLevel === 'MEDIUM').length,
      low: students.filter((s) => s.riskLevel === 'LOW').length,
    }
  })

export const useStudentRiskDistribution = () =>
  useStudentsStore((state) => {
    const distribution: Record<string, number> = {
      CRITICAL: 0,
      HIGH: 0,
      MEDIUM: 0,
      LOW: 0,
    }

    state.students.forEach((student) => {
      const level = student.riskLevel || 'LOW'
      distribution[level] = (distribution[level] || 0) + 1
    })

    return distribution
  })

export const useEnrichedStudents = () =>
  useStudentsStore((state) =>
    state.students.map((student) => {
      const lastCheckIn = student.lastCheckIn ? new Date(student.lastCheckIn) : null
      const daysSinceCheckIn = lastCheckIn
        ? (Date.now() - lastCheckIn.getTime()) / (1000 * 60 * 60 * 24)
        : Infinity

      return {
        ...student,
        needsAttention: student.riskLevel === 'HIGH' || student.riskLevel === 'CRITICAL',
        screenTimeExceeded: (student.screenTimeToday || 0) > 240, // 4 hours
        checkInOverdue: daysSinceCheckIn > 2,
        daysSinceCheckIn: Math.floor(daysSinceCheckIn),
      }
    }),
  )

// Action selectors
export const useStudentsActions = () => {
  const store = useStudentsStore()
  return {
    fetchStudents: store.fetchStudents,
    updateStudent: store.updateStudent,
    setError: store.setError,
    resetStore: store.resetStore,
  }
}

// Data freshness selectors
export const useStudentsDataStale = () => useStudentsStore((state) => state.isDataStale())
export const useStudentsLastFetched = () => useStudentsStore((state) => state.lastFetched)
