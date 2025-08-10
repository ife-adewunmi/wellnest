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
    DASHBOARD: '/dashboard',
    MANAGE_STUDENT: '/students',
  },

  // User Management
  USERS: {},

  // Mood Check-ins
  MOOD: {},

  // Sessions
  SESSIONS: {},

  // Messages
  MESSAGES: {},

  // Dashboard
  DASHBOARD: {},

  // Notifications
  NOTIFICATIONS: {},

  // Screen Time
  SCREEN_TIME: {},

  // ML & Analysis
  ML: {},

  // Push Notifications
  PUSH: {},

  // Reports
  REPORTS: {},
} as const

export type ApiEndpointsType = typeof Endpoints
