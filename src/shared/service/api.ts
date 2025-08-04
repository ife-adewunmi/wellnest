import { MoodCheckIn } from '../types/mood'

// Enhanced error types for better error handling
export interface ApiError {
  message: string
  status: number
  code?: string
  details?: any
}

export class ApiErrorHandler {
  static createError(response: Response, message?: string): ApiError {
    return {
      message: message || `HTTP error! status: ${response.status}`,
      status: response.status,
      code: response.statusText,
    }
  }

  static handleError(error: any): ApiError {
    if (error instanceof TypeError) {
      return {
        message: 'Network error. Please check your connection.',
        status: 0,
        code: 'NETWORK_ERROR',
      }
    }

    if (error.status) {
      return error
    }

    return {
      message: error.message || 'An unexpected error occurred',
      status: 500,
      code: 'UNKNOWN_ERROR',
    }
  }
}

class ApiClient {
  private baseURL: string
  private defaultTimeout: number = 10000

  constructor(baseURL = '') {
    this.baseURL = baseURL
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<{ data: T }> {
    const url = `${this.baseURL}${endpoint}`

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.defaultTimeout)

    try {
      const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        signal: controller.signal,
        ...options,
      }

      const response = await fetch(url, config)
      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw ApiErrorHandler.createError(response, errorData?.message)
      }

      const data = await response.json()
      return { data }
    } catch (error) {
      clearTimeout(timeoutId)
      throw ApiErrorHandler.handleError(error)
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<{ data: T }> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  async post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<{ data: T }> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any, options?: RequestInit): Promise<{ data: T }> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<{ data: T }> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }
}

export const api = new ApiClient()

// Generic API call wrapper with consistent error handling
type ApiResult<T> = {
  data: T | null
  error: ApiError | null
  loading: boolean
}

class ApiService {
  private static async safeCall<T>(
    apiCall: () => Promise<{ data: T }>,
    fallback: T,
  ): Promise<ApiResult<T>> {
    try {
      const result = await apiCall()

      return {
        data: result.data,
        error: null,
        loading: false,
      }
    } catch (error) {
      const apiError = ApiErrorHandler.handleError(error)
      console.error('API Error:', apiError)
      return {
        data: fallback,
        error: apiError,
        loading: false,
      }
    }
  }

  private static async safeCallWithError<T>(
    apiCall: () => Promise<{ data: T }>,
  ): Promise<ApiResult<T>> {
    try {
      const result = await apiCall()
      return { data: result.data, error: null, loading: false }
    } catch (error) {
      const apiError = ApiErrorHandler.handleError(error)
      console.error('API Error:', apiError)
      throw apiError
    }
  }

  // Mood check-ins
  static async fetchMoodCheckIns(userId: string): Promise<ApiResult<MoodCheckIn[]>> {
    return this.safeCall(() => api.get(`/api/mood-check-ins?userId=${userId}`), [])
  }

  // Sessions
  static async fetchUpcomingSessions(userId: string) {
    return this.safeCall(() => api.get(`/api/sessions?userId=${userId}&upcoming=true`), [])
  }

  static async createSession(sessionData: any) {
    return this.safeCallWithError(() => api.post('/api/sessions', sessionData))
  }

  // Messages
  static async fetchRecentMessages(userId: string) {
    return this.safeCall(() => api.get(`/api/messages?userId=${userId}&recent=true`), [])
  }

  static async sendMessage(messageData: any) {
    return this.safeCallWithError(() => api.post('/api/messages', messageData))
  }

  // Students
  static async fetchStudentsList(): Promise<ApiResult<any[]>> {
    return this.safeCall(() => api.get('/api/students'), [])
  }

  static async fetchStudentStats(userId: string) {
    return this.safeCall(() => api.get(`/api/students/${userId}/stats`), {
      weeklyCheckIns: 0,
      totalCheckIns: 7,
      averageMood: 'Good',
      moodEmoji: '🙂',
      nextSession: null,
    })
  }

  // Dashboard
  static async fetchDashboardStats() {
    return this.safeCall(() => api.get('/api/dashboard/stats'), {
      totalStudents: 0,
      highRiskStudents: 0,
      activeSessions: 0,
      messagesToday: 0,
    })
  }

  // Notifications
  static async fetchNotifications(userId: string) {
    return this.safeCall(() => api.get(`/api/notifications?userId=${userId}`), [])
  }

  static async markNotificationAsRead(notificationId: string) {
    return this.safeCall(() => api.put(`/api/notifications/${notificationId}/read`), false)
  }

  // Screen time
  static async fetchScreenTimeStats(userId: string) {
    return this.safeCall(() => api.get(`/api/screen-time/stats?userId=${userId}`), {
      dailyAverage: 0,
      weeklyTotal: 0,
      todayTotal: 0,
      threshold: 8 * 60 * 60 * 1000, // 8 hours in milliseconds
    })
  }
}

// Export individual functions for backward compatibility
export const fetchMoodCheckIns = ApiService.fetchMoodCheckIns
export const fetchUpcomingSessions = ApiService.fetchUpcomingSessions
export const fetchRecentMessages = ApiService.fetchRecentMessages
export const fetchStudentsList = ApiService.fetchStudentsList
export const fetchDashboardStats = ApiService.fetchDashboardStats
export const fetchNotifications = ApiService.fetchNotifications
export const markNotificationAsRead = ApiService.markNotificationAsRead
export const createSession = ApiService.createSession
export const sendMessage = ApiService.sendMessage
export const fetchScreenTimeStats = ApiService.fetchScreenTimeStats
export const fetchStudentStats = ApiService.fetchStudentStats

// Export the service for direct use
export { ApiService }
