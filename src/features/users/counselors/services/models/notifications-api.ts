import { request } from '@/shared/service/request'
import { Endpoints } from '@/shared/enums/endpoints'
import { isLocalEnvironment } from '@/shared/enums/environment'
import { MOCK_NOTIFICATIONS } from '@/features/users/counselors/common/data/mock-dashboard'
import type { Notification } from '@/features/users/counselors/types/dashboard.types'

interface NotificationsApiRequests {
  getNotifications: (counselorId: string, unreadOnly?: boolean) => Promise<Notification[]>
  markNotificationAsRead: (notificationId: string) => Promise<void>
  deleteNotification: (notificationId: string) => Promise<void>
}

export class NotificationsApi implements NotificationsApiRequests {
  /**
   * Fetch notifications for a counselor
   */
  public async getNotifications(
    counselorId: string,
    unreadOnly: boolean = false,
  ): Promise<Notification[]> {
    try {
      const response = await request.get(Endpoints.COUNSELORS.API.DASHBOARD, undefined, {
        params: { counselorId, unreadOnly },
      })
      // return response.data
      return response.data?.notifications || response.notifications || []
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
      // Fallback to mock data in local environment when DB fails
      if (isLocalEnvironment()) {
        console.warn('Using mock notifications as fallback in local environment')
        const notifications = unreadOnly
          ? MOCK_NOTIFICATIONS.filter((n) => !n.isRead)
          : MOCK_NOTIFICATIONS
        return notifications
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
}

export const notificationsApi = new NotificationsApi()
