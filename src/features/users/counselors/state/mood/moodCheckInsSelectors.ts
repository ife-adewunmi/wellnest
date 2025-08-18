import { useMoodCheckInsStore } from './moodCheckInsStore'

// Basic selectors
export const useMoodCheckIns = () => useMoodCheckInsStore((state) => state.moodCheckIns)
export const useMoodCheckInsLoading = () => useMoodCheckInsStore((state) => state.isLoading)
export const useMoodCheckInsError = () => useMoodCheckInsStore((state) => state.error)

// Filtered selectors
export const useRecentMoodCheckIns = (limit: number = 5) =>
  useMoodCheckInsStore((state) => state.moodCheckIns.slice(0, limit))

export const useUrgentMoodCheckIns = () =>
  useMoodCheckInsStore((state) =>
    state.moodCheckIns.filter((checkIn) => checkIn.riskScore && checkIn.riskScore >= 7),
  )

export const useMoodCheckInsByStudent = (studentId: string) =>
  useMoodCheckInsStore((state) =>
    state.moodCheckIns.filter((checkIn) => checkIn.userId === studentId),
  )

export const useMoodCheckInsByEmoji = (emoji: string) =>
  useMoodCheckInsStore((state) => state.moodCheckIns.filter((checkIn) => checkIn.emoji === emoji))

export const useHighRiskMoodCheckIns = () =>
  useMoodCheckInsStore((state) =>
    state.moodCheckIns.filter((checkIn) => checkIn.riskScore && checkIn.riskScore >= 8),
  )

// Computed selectors
export const useMoodCheckInsSummary = () =>
  useMoodCheckInsStore((state) => {
    const checkIns = state.moodCheckIns
    const highRisk = checkIns.filter((c) => c.riskScore && c.riskScore >= 7)
    const criticalRisk = checkIns.filter((c) => c.riskScore && c.riskScore >= 9)

    return {
      total: checkIns.length,
      highRisk: highRisk.length,
      criticalRisk: criticalRisk.length,
      averageRisk:
        checkIns.length > 0
          ? checkIns.reduce((sum, c) => sum + (c.riskScore || 0), 0) / checkIns.length
          : 0,
    }
  })

export const useMoodDistribution = () =>
  useMoodCheckInsStore((state) => {
    const distribution: Record<string, number> = {}
    state.moodCheckIns.forEach((checkIn) => {
      const emoji = checkIn.emoji || 'unknown'
      distribution[emoji] = (distribution[emoji] || 0) + 1
    })
    return distribution
  })

// Action selectors
export const useMoodCheckInsActions = () => {
  const store = useMoodCheckInsStore()
  return {
    fetchMoodCheckIns: store.fetchMoodCheckIns,
    addMoodCheckIn: store.addMoodCheckIn,
    setError: store.setError,
    resetStore: store.resetStore,
  }
}

// Data freshness selectors
export const useMoodCheckInsDataStale = () => useMoodCheckInsStore((state) => state.isDataStale())
export const useMoodCheckInsLastFetched = () => useMoodCheckInsStore((state) => state.lastFetched)
