import { db } from '@/shared/db'
import { notificationsTable } from '@/shared/db/schema/communication'
import { eq, desc, and } from 'drizzle-orm'
import type { Notification } from '@/users/counselors/types/dashboard.types'

export class NotificationsService {
  /**
   * Get notifications for a counselor
   */
  static async getNotifications(
    counselorId: string,
    unreadOnly: boolean = false,
  ): Promise<Notification[]> {
    try {
      const conditions = [eq(notificationsTable.userId, counselorId)]

      if (unreadOnly) {
        conditions.push(eq(notificationsTable.isRead, false))
      }

      const counselorNotifications = await db
        .select()
        .from(notificationsTable)
        .where(and(...conditions))
        .orderBy(desc(notificationsTable.createdAt))
        .limit(20)

      return counselorNotifications.map((n) => ({
        id: n.id,
        userId: n.userId,
        type: n.type,
        title: n.title,
        message: n.message,
        data: n.data,
        isRead: n.isRead || false,
        createdAt: n.createdAt || new Date(),
      }))
    } catch (error) {
      console.error('Error fetching notifications:', error)
      throw new Error('Failed to fetch notifications')
    }
  }

  /**
   * Mark notification as read
   */
  static async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      await db
        .update(notificationsTable)
        .set({
          isRead: true,
        })
        .where(eq(notificationsTable.id, notificationId))
    } catch (error) {
      console.error('Error marking notification as read:', error)
      throw new Error('Failed to mark notification as read')
    }
  }

  /**
   * Create a new notification
   */
  static async createNotification(
    notification: Omit<Notification, 'id' | 'createdAt'>,
  ): Promise<Notification> {
    try {
      const [newNotification] = await db
        .insert(notificationsTable)
        .values({
          title: notification.title,
          message: notification.message,
          type: notification.type,
          isRead: false,
          userId: notification.userId,
          createdAt: new Date(),
        })
        .returning()

      return {
        id: newNotification.id,
        userId: newNotification.userId,
        type: newNotification.type,
        title: newNotification.title,
        message: newNotification.message,
        data: newNotification.data,
        isRead: newNotification.isRead || false,
        createdAt: newNotification.createdAt || new Date(),
      }
    } catch (error) {
      console.error('Error creating notification:', error)
      throw new Error('Failed to create notification')
    }
  }
}
