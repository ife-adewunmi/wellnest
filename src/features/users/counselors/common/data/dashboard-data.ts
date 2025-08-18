import type { Metric } from '../dashboard/metrics'

// Legacy mock data - use mock-dashboard.ts instead
// export const MOCK_MOOD_CHECK_INS = []

export const MOCK_METRICS: Metric[] = [
  { title: 'Total Students', value: '1,500', change: '+10%', positive: true },
  { title: 'At-Risk Count', value: '15', change: '-5%', positive: false },
  { title: 'Avg. Mood Score', value: '7.8', change: '+2%', positive: true },
  { title: 'Screen-Time', value: '2.5hr', change: '+15%', positive: true },
]
