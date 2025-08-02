import { NextRequest, NextResponse } from 'next/server'
import { StudentService } from '@/features/student-management/services/student.service'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const result = await StudentService.createStudent(body)

    if (!result.success) {
      const status =
        result.error === 'Validation failed'
          ? 400
          : result.error === 'User already exists'
            ? 409
            : 500
      return NextResponse.json(result, { status })
    }

    return NextResponse.json(
      {
        success: true,
        user: result.student,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('Failed to create user:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal Server Error',
        details: 'An unexpected error occurred while creating the user',
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    const result = await StudentService.getAllStudents()

    if (!result.success) {
      return NextResponse.json(result, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      users: result.students,
    })
  } catch (error) {
    console.error('Failed to fetch users:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal Server Error',
        details: 'An unexpected error occurred while fetching users',
      },
      { status: 500 },
    )
  }
}
