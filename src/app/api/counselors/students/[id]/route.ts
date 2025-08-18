import { SessionService } from '@/users/auth/services/session.service'
import { DashboardService } from '@/users/counselors/services/main.service'
import { StudentService } from '@/users/counselors/services/students.service'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Await the params as required in Next.js 15
    const { id } = await params

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

    const studentUserId = id

    if (!studentUserId) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 })
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(studentUserId)) {
      return NextResponse.json(
        {
          error: 'Invalid student ID format. Expected UUID format.',
        },
        { status: 400 },
      )
    }

    // Use the authenticated user's ID to fetch students data
    const counselorId = sessionData.user.id

    // Fetch student user and profile data
    const students = await StudentService.getStudentById(studentUserId)

    return NextResponse.json(students)
  } catch (error) {
    console.error('Error fetching student:', error)
    return NextResponse.json({ error: 'Failed to fetch student data' }, { status: 500 })
  }
}
