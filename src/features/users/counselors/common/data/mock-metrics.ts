import type { Metric } from '@/users/counselors/types/dashboard.types'

export const MOCK_METRICS: Metric[] = [
  {
    id: '1',
    title: 'Total Students',
    value: '25',
    change: '+3',
    positive: true,
    description: 'Total number of students assigned to you',
  },
  {
    id: '2',
    title: 'At-Risk Count',
    value: '8',
    change: '+2',
    positive: false,
    description: 'Students flagged as at-risk based on distress score',
  },
  {
    id: '3',
    title: 'Average Mood Score',
    value: '6.5/10',
    change: '-0.5',
    positive: false,
    description: 'Cumulative mood score of all students',
  },
  {
    id: '4',
    title: 'Screen Time',
    value: '5.2h',
    change: '+0.8h',
    positive: false,
    description: 'Average daily screen time across all students',
  },
]
