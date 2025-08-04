import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/shared/db'
import { notifications } from '@/shared/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const limit = Number(searchParams.get('limit')) || 20
    const unreadOnly = searchParams.get('unreadOnly') === 'true'

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const conditions = [eq(notifications.userId, userId)]
    if (unreadOnly) {
      conditions.push(eq(notifications.isRead, false))
    }

    const whereClause =
      conditions.length > 1 ? (await import('drizzle-orm')).and(...conditions) : conditions[0]

    const notificationsList = await db
      .select()
      .from(notifications)
      .where(whereClause)
      .orderBy(desc(notifications.createdAt))
      .limit(limit)

    return NextResponse.json(notificationsList)
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
