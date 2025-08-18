import { useMetricsStore } from './metricsStore'

// Basic selectors
export const useMetrics = () => useMetricsStore((state) => state.metrics)
export const useMetricsLoading = () => useMetricsStore((state) => state.isLoading)
export const useMetricsError = () => useMetricsStore((state) => state.error)

// Specific metric selectors
export const useMetricByTitle = (title: string) =>
  useMetricsStore((state) => state.metrics.find((metric) => metric.title === title))

export const useTotalStudentsMetric = () =>
  useMetricsStore((state) => state.metrics.find((metric) => metric.title === 'Total Students'))

export const useAtRiskCountMetric = () =>
  useMetricsStore((state) => state.metrics.find((metric) => metric.title === 'At-Risk Count'))

export const useAverageSessionsMetric = () =>
  useMetricsStore((state) => state.metrics.find((metric) => metric.title === 'Avg Sessions'))

export const useCompletionRateMetric = () =>
  useMetricsStore((state) => state.metrics.find((metric) => metric.title === 'Completion Rate'))

// Computed selectors
export const useMetricsSummary = () =>
  useMetricsStore((state) => {
    const metrics = state.metrics
    return {
      totalStudents: metrics.find((m) => m.title === 'Total Students')?.value || 0,
      atRiskCount: metrics.find((m) => m.title === 'At-Risk Count')?.value || 0,
      avgSessions: metrics.find((m) => m.title === 'Avg Sessions')?.value || 0,
      completionRate: metrics.find((m) => m.title === 'Completion Rate')?.value || 0,
    }
  })

// Action selectors
export const useMetricsActions = () => {
  const store = useMetricsStore()
  return {
    fetchMetrics: store.fetchMetrics,
    updateMetric: store.updateMetric,
    setError: store.setError,
    resetStore: store.resetStore,
  }
}

// Data freshness selectors
export const useMetricsDataStale = () => useMetricsStore((state) => state.isDataStale())
export const useMetricsLastFetched = () => useMetricsStore((state) => state.lastFetched)
