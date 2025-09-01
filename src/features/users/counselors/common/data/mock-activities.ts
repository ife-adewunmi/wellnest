import type { ActivityData } from '@/users/counselors/types/dashboard.types'

export const MOCK_ACTIVITIES: ActivityData[] = [
  {
    id: 'activity-1',
    counselorId: 'counselor-1',
    studentId: 'student-1',
    studentName: 'Sarah M.',
    title: 'Weekly Check-in',
    description: 'Discussed academic stress and coping strategies',
    scheduledAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    duration: 30,
    status: 'COMPLETED',
    type: 'session',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'activity-2',
    counselorId: 'counselor-1',
    studentId: 'student-2',
    studentName: 'Ethan R.',
    title: 'Mood Assessment',
    description: 'Completed weekly mood assessment',
    scheduledAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    duration: 15,
    status: 'COMPLETED',
    type: 'assessment',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'activity-3',
    counselorId: 'counselor-1',
    studentId: 'student-3',
    studentName: 'Olivia L.',
    title: 'Conflict Resolution',
    description: 'Peer conflict intervention session',
    scheduledAt: new Date().toISOString(), // Today
    duration: 45,
    status: 'SCHEDULED',
    type: 'intervention',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'activity-4',
    counselorId: 'counselor-1',
    studentId: 'student-4',
    studentName: 'Noah K.',
    title: 'Group Therapy',
    description: 'Social skills group session',
    scheduledAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    duration: 60,
    status: 'SCHEDULED',
    type: 'group',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
]
