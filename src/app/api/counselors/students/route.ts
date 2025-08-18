import { NextRequest, NextResponse } from 'next/server'
import { SessionService } from '@/features/users/auth/services/session.service'
import { cookies } from 'next/headers'
import { StudentService } from '@/features/users/counselors/services/students.service'

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

    // Use the authenticated user's ID to fetch students data
    const counselorId = sessionData.user.id

    // Fetch students data from service
    const students = await StudentService.getStudents(counselorId)

    return NextResponse.json(students)
  } catch (error) {
    console.error('Students API Error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch students',
        status: 500,
      },
      { status: 500 },
    )
  }
}
