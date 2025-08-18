import { request } from '@/shared/service/request'
import { Endpoints } from '@/shared/enums/endpoints'
import { isLocalEnvironment } from '@/shared/enums/environment'
import {
  MOCK_DASHBOARD_DATA,
  MOCK_METRICS,
  MOCK_MOOD_CHECKINS,
  MOCK_ACTIVITIES,
} from '@/users/counselors/common/data/mock-dashboard'
import type {
  DashboardDataResponse,
  Metric,
  MoodCheckIn,
  ActivityData,
  StudentTableData,
} from '@/users/counselors/types/dashboard.types'

interface DashboardApiRequests {
  getDashboardData: (counselorId: string) => Promise<DashboardDataResponse>
  getMetrics: (counselorId: string, period?: string) => Promise<Metric[]>
  getMoodCheckIns: (counselorId: string, limit?: number) => Promise<MoodCheckIn[]>
  getActivities: (
    counselorId: string,
    dateFrom?: string,
    dateTo?: string,
  ) => Promise<ActivityData[]>
  markNotificationAsRead: (notificationId: string) => Promise<void>
  createMoodCheckIn: (checkIn: Omit<MoodCheckIn, 'id' | 'createdAt'>) => Promise<MoodCheckIn>
  updateActivity: (activityId: string, updates: Partial<ActivityData>) => Promise<ActivityData>
  deleteNotification: (notificationId: string) => Promise<void>
  getStudents: (counselorId: string) => Promise<StudentTableData[]>
}

export class DashboardApi implements DashboardApiRequests {
  /**
   * Fetch all dashboard data for a counselor
   */
  public async getDashboardData(counselorId: string): Promise<DashboardDataResponse> {
    try {
      const response = await request.get(Endpoints.COUNSELORS.API.DASHBOARD, undefined, {
        params: { counselorId },
      })
      return response.data
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      // Fallback to mock data in local environment when DB fails
      if (isLocalEnvironment()) {
        console.warn('Using mock dashboard data as fallback in local environment')
        return MOCK_DASHBOARD_DATA
      }
      throw error
    }
  }

  /**
   * Fetch metrics for a counselor
   */
  public async getMetrics(counselorId: string, period?: string): Promise<Metric[]> {
    try {
      // Since individual endpoints don't exist, get from main dashboard
      const response = await request.get(Endpoints.COUNSELORS.API.METRICS, undefined, {
        params: { counselorId },
      })
      return response.data?.metrics || response.metrics || []
    } catch (error) {
      console.error('Failed to fetch metrics:', error)
      // Fallback to mock data in local environment when DB fails
      if (isLocalEnvironment()) {
        console.warn('Using mock metrics as fallback in local environment')
        return MOCK_METRICS
      }
      throw error
    }
  }

  /**
   * Fetch mood check-ins for counselor's students
   */
  public async getMoodCheckIns(counselorId: string, limit: number = 10): Promise<MoodCheckIn[]> {
    try {
      // Since individual endpoints don't exist, get from main dashboard
      const response = await request.get(Endpoints.COUNSELORS.API.DASHBOARD, undefined, {
        params: { counselorId },
      })
      const checkIns = response.data?.moodCheckIns || response.moodCheckIns || []
      return checkIns.slice(0, limit)
    } catch (error) {
      console.error('Failed to fetch mood check-ins:', error)
      // Fallback to mock data in local environment when DB fails
      if (isLocalEnvironment()) {
        console.warn('Using mock mood check-ins as fallback in local environment')
        return MOCK_MOOD_CHECKINS.slice(0, limit)
      }
      throw error
    }
  }

  /**
   * Fetch activity data for counselor's students
   */
  public async getActivities(
    counselorId: string,
    dateFrom?: string,
    dateTo?: string,
  ): Promise<ActivityData[]> {
    try {
      // Since individual endpoints don't exist, get from main dashboard
      const response = await request.get(Endpoints.COUNSELORS.API.DASHBOARD, undefined, {
        params: { counselorId },
      })
      return (
        response.data?.recentActivities ||
        response.data?.activities ||
        response.recentActivities ||
        response.activities ||
        []
      )
    } catch (error) {
      console.error('Failed to fetch activities:', error)
      // Fallback to mock data in local environment when DB fails
      if (isLocalEnvironment()) {
        console.warn('Using mock activities as fallback in local environment')
        return MOCK_ACTIVITIES
      }
      throw error
    }
  }

  /**
   * Mark a notification as read
   */
  public async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      await request.put(`${Endpoints.COUNSELORS.API.NOTIFICATIONS}/${notificationId}/read`)
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
      throw error
    }
  }

  /**
   * Create a new mood check-in
   */
  public async createMoodCheckIn(
    checkIn: Omit<MoodCheckIn, 'id' | 'createdAt'>,
  ): Promise<MoodCheckIn> {
    try {
      const response = await request.post(Endpoints.COUNSELORS.API.MOOD_CHECKINS, checkIn)
      return response.data
    } catch (error) {
      console.error('Failed to create mood check-in:', error)
      throw error
    }
  }

  /**
   * Update activity data
   */
  public async updateActivity(
    activityId: string,
    updates: Partial<ActivityData>,
  ): Promise<ActivityData> {
    try {
      const response = await request.put(
        `${Endpoints.COUNSELORS.API.ACTIVITIES}/${activityId}`,
        updates,
      )
      return response.data
    } catch (error) {
      console.error('Failed to update activity:', error)
      throw error
    }
  }

  /**
   * Delete a notification
   */
  public async deleteNotification(notificationId: string): Promise<void> {
    try {
      await request.delete(`${Endpoints.COUNSELORS.API.NOTIFICATIONS}/${notificationId}`)
    } catch (error) {
      console.error('Failed to delete notification:', error)
      throw error
    }
  }

  /**
   * Fetch students for a counselor
   */
  public async getStudents(counselorId: string): Promise<StudentTableData[]> {
    try {
      // Since individual endpoints don't exist, get from main dashboard
      const response = await request.get(Endpoints.COUNSELORS.API.DASHBOARD, undefined, {
        params: { counselorId },
      })
      const students = response.data?.students || response.students || []
      return students
    } catch (error) {
      // Fallback to mock data in local environment when DB fails
      if (isLocalEnvironment()) {
        console.warn('Using mock students as fallback in local environment')
        // Generate mock student data
        return [
          {
            id: '1',
            studentId: 'CSC/20/19283',
            name: 'Ife Adewunmi',
            lastCheckIn: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            riskLevel: 'MEDIUM',
            currentMood: 'STRESSED',
            screenTimeToday: 240,
            avatar: '/avatars/student1.jpg',
          },
          {
            id: '2',
            studentId: 'BOT/21/7547',
            name: 'Tunde Balogun',
            lastCheckIn: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            riskLevel: 'LOW',
            currentMood: 'HAPPY',
            screenTimeToday: 180,
            avatar: '/avatars/student2.jpg',
          },
          {
            id: '3',
            studentId: 'MCB/25/17293',
            name: 'Bisi Ojo',
            lastCheckIn: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
            riskLevel: 'HIGH',
            currentMood: 'ANXIOUS',
            screenTimeToday: 420,
            avatar: '/avatars/student3.jpg',
          },
          {
            id: '4',
            studentId: 'STA/19/2560',
            name: 'Emeka Nwosu',
            lastCheckIn: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
            riskLevel: 'LOW',
            currentMood: 'NEUTRAL',
            screenTimeToday: 120,
            avatar: '/avatars/student4.jpg',
          },
          {
            id: '5',
            studentId: 'CSC/23/6844',
            name: 'Zara Ahmed',
            lastCheckIn: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            riskLevel: 'CRITICAL',
            currentMood: 'VERY_SAD',
            screenTimeToday: 480,
            avatar: '/avatars/student5.jpg',
          },
        ]
      }
      throw error
    }
  }
}

export const dashboardApi = new DashboardApi()
