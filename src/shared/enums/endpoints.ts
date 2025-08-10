export const Endpoints = {
  // Base API
  API: '/api',

  // Auth Endpoints
  AUTH: {
    SIGNIN: '/auth/signin',
    SIGNUP: '/auth/signup',
    SIGNOUT: '/auth/signout',
    AUTH_SESSION: '/auth/session',
  },

  AUTH_PAGE: {
    SIGNIN: '/signin',
    SIGNUP: '/signup',
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
