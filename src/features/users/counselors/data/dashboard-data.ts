import { Metric } from "../components/sections/metrics-section"

export const MOCK_MOOD_CHECK_INS = [
  {
    name: 'Sarah M.',
    avatar: '/placeholder.svg?height=32&width=32',
    time: '10:30 AM',
    message: 'Feeling a bit overwhelmed with the workload this week.',
    emoji: '😔',
  },
  {
    name: 'Ethan R.',
    avatar: '/placeholder.svg?height=32&width=32',
    time: '1:30 PM',
    message: 'Had a great day at the science fair!',
    emoji: '😊',
  },
  {
    name: 'Olivia L.',
    avatar: '/placeholder.svg?height=32&width=32',
    time: '12:00 AM',
    message: 'Feeling down after a disagreement with a friend.',
    emoji: '😞',
  },
  {
    name: 'Noah K.',
    avatar: '/placeholder.svg?height=32&width=32',
    time: '9:30 AM',
    message: 'Excited about the upcoming field trip!',
    emoji: '😄',
  },
]

export const MOCK_METRICS: Metric[] = [
  { title: 'Total Students', value: '1,500', change: '+10%', positive: true },
  { title: 'At-Risk Count', value: '15', change: '-5%', positive: false },
  { title: 'Avg. Mood Score', value: '7.8', change: '+2%', positive: true },
  { title: 'Screen-Time', value: '2.5hr', change: '+15%', positive: true },
]
