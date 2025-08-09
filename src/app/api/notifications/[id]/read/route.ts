import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/shared/db'
import { notifications } from '@/shared/db/schema'
import { eq } from 'drizzle-orm'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const notificationId = params.id

    const updatedNotification = await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, notificationId))
      .returning()

    if (updatedNotification.length === 0) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 })
    }

    return NextResponse.json(updatedNotification[0])
  } catch (error) {
    console.error('Error marking notification as read:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
