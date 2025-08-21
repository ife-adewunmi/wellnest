import { NextRequest, NextResponse } from 'next/server'
import { DashboardService } from '@/users/counselors/services/main.service'
import { SessionService } from '@/users/auth/services/session.service'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    // Get session token from cookies
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('session-token')?.value

    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized - No session token' }, { status: 401 })
    }

    // Validate session and get user data
    const sessionData = await SessionService.validateSession(sessionToken)

    if (!sessionData || !sessionData.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid or expired session' },
        { status: 401 },
      )
    }

    // Check if user is a counselor
    if (sessionData.user.role !== 'COUNSELOR') {
      return NextResponse.json(
        { error: 'Forbidden - Only counselors can access this resource' },
        { status: 403 },
      )
    }

    const searchParams = request.nextUrl.searchParams
    const days = parseInt(searchParams.get('days') || '30', 10)

    // Use the authenticated user's ID
    const counselorId = sessionData.user.id

    // Fetch mood history from service
    const moodHistory = await DashboardService.getMoodHistory(counselorId, days)

    return NextResponse.json(moodHistory)
  } catch (error) {
    console.error('Mood History API Error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch mood history',
      },
      { status: 500 },
    )
  }
}
