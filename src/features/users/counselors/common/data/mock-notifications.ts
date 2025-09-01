import type { Notification } from '@/users/counselors/types/dashboard.types'

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    userId: 'counselor-1',
    title: 'Urgent: Student Needs Attention',
    message: 'Olivia L. has reported feeling severely distressed',
    type: 'CRISIS_ALERT',
    isRead: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    studentId: 'student-3',
    data: { urgencyLevel: 'high', studentName: 'Olivia L.' },
  },
  {
    id: 'notif-2',
    userId: 'counselor-1',
    title: 'Session Reminder',
    message: 'You have a session with Noah K. tomorrow at 2:00 PM',
    type: 'SESSION_REMINDER',
    isRead: false,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    studentId: 'student-4',
    data: { sessionTime: '2:00 PM', studentName: 'Noah K.' },
  },
  {
    id: 'notif-3',
    userId: 'counselor-1',
    title: 'Mood Change Alert',
    message: 'Sarah M. has shown a significant mood decline',
    type: 'MOOD_CHANGE',
    isRead: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    studentId: 'student-1',
    data: { previousMood: 'NEUTRAL', currentMood: 'SAD' },
  },
  {
    id: 'notif-4',
    userId: 'counselor-1',
    title: 'New Student Assignment',
    message: 'Michael P. has been assigned to your caseload',
    type: 'NEW_ASSIGNMENT',
    isRead: true,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    studentId: 'student-6',
    data: { studentName: 'Michael P.', department: 'Computer Science' },
  },
]
