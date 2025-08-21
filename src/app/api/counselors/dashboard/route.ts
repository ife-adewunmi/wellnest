import { NextResponse } from 'next/server'
import { DashboardService } from '@/users/counselors/services/main.service'
import { SessionService } from '@/users/auth/services/session.service'
import { cookies } from 'next/headers'

export async function GET() {
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

    // Use the authenticated user's ID to fetch dashboard data
    const counselorId = sessionData.user.id

    // Fetch dashboard data from service
    const dashboardData = await DashboardService.getDashboardData(counselorId)

    return NextResponse.json({
      data: dashboardData,
      status: 200,
      message: 'Dashboard data fetched successfully',
    })
  } catch (error) {
    console.error('Dashboard API Error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch dashboard data',
        status: 500,
      },
      { status: 500 },
    )
  }
}
