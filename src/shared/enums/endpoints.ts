import { ReportFilters } from '@/users/counselors/types'

export const Endpoints = {
  // Base API
  API: '/api',

  // Auth Endpoints
  AUTH_ROUTES: {
    SIGNIN: '/auth/signin',
    SIGNUP: '/auth/signup',
    SIGNOUT: '/auth/signout',
  },

  AUTH_SESSION: {
    VALIDATE: '/auth/session',
    EXTEND: '/auth/session/extend',
    INVALIDATE: '/auth/session/invalidate',
    INVALIDATE_ALL: '/auth/session/invalidate-all',
    ACTIVE: '/auth/session/active',
    REFRESH: '/auth/session/refresh',
    INVALIDATE_BY_ID: (sessionId: string) => `/auth/session/${sessionId}/invalidate`,
  },

  AUTH_PAGE: {
    SIGNIN: '/signin',
    SIGNUP: '/signup',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
  },

  // Students
  STUDENTS: {
    DASHBOARD: '/student',
    PROFILE: '/student/profile',
    UPDATE_PROFILE: '/student/update-profile',
  },

  COUNSELORS: {
    API: {
      DASHBOARD: '/api/counselors/dashboard',
      METRICS: '/api/counselors/dashboard/metrics',
      MOOD_CHECKINS: '/api/counselors/dashboard/mood-checkins',
      ACTIVITIES: '/api/counselors/dashboard/activities',
      NOTIFICATIONS: '/api/counselors/dashboard/notifications',
      STUDENTS: '/api/counselors/students',
      STUDENT_PROFILE: (id: string) => `/api/counselors/students/${id}`,
      REPORTS: '/api/counselors/reports',
      SESSIONS: {
        BASE: '/api/counselors/sessions',
      },
    },
    DASHBOARD: '/dashboard',
    MANAGE_STUDENT: '/students',
    STUDENT_PROFILE_PAGE: (id: string) => `/students/${id}`,
    REPORTS: '/reports',
    INTERVENTION: '/intervention',
  },

  // ML & Analysis
  ML: {
    PREDICT: '/api/ml/predict',
  },
} as const

export type ApiEndpointsType = typeof Endpoints
