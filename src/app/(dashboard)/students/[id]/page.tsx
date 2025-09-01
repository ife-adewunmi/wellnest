import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { LoadingSpinner } from '@/shared/components/loading-spinner'
import { Header } from '@/users/counselors/dashboard'
import { StudentProfileContainer } from '@/users/counselors/manage-student/student-profile-container'
import { StudentService } from '@/users/counselors/services/students.service'
import { SessionService } from '@/users/auth/services/session.service'
import { cookies } from 'next/headers'
import { StudentDetail } from '@/users/counselors/types/student.types'

interface StudentProfilePageProps {
  params: Promise<{ id: string }>
}

// Server-side data fetching function
async function getStudentData(studentId: string): Promise<{
  student: StudentDetail | null
  error: string | null
}> {
  try {
    // Get session token from cookies
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('session-token')?.value

    if (!sessionToken) {
      return { student: null, error: 'Unauthorized - No session token' }
    }

    // Validate session
    const sessionData = await SessionService.validateSession(sessionToken)
    if (!sessionData || !sessionData.user) {
      return { student: null, error: 'Unauthorized - Invalid session' }
    }

    if (sessionData.user.role !== 'COUNSELOR') {
      return { student: null, error: 'Forbidden - Only counselors can access this resource' }
    }

    // Fetch student data - StudentService now returns complete StudentDetail
    const result = await StudentService.getStudentById(studentId)

    if (!result.success || !result.student) {
      return { student: null, error: result.error || 'Student not found' }
    }

    return { student: result.student as StudentDetail, error: null }
  } catch (error) {
    console.error('Error fetching student data:', error)
    return {
      student: null,
      error: error instanceof Error ? error.message : 'Failed to fetch student data',
    }
  }
}

export default async function StudentProfilePage({ params }: StudentProfilePageProps) {
  const { id: studentId } = await params

  if (!studentId) {
    notFound()
  }

  // Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(studentId)) {
    console.error('Invalid student ID format:', studentId)
    notFound()
  }

  // Fetch data on the server
  const { student, error } = await getStudentData(studentId)

  return (
    <>
      <div className="mx-auto mt-[4rem] w-full max-w-[1152px] min-w-[320px] px-4 sm:px-6 lg:min-w-[1024px] lg:px-8 xl:px-0">
        <h1 className="mb-6 text-2xl font-bold">Students Management</h1>

        <Suspense
          fallback={
            <div className="flex h-64 items-center justify-center">
              <LoadingSpinner size="large" />
              <p className="ml-4 text-gray-600">Loading student profile...</p>
            </div>
          }
        >
          <StudentProfileContainer
            initialStudent={student}
            initialError={error}
            studentId={studentId}
          />
        </Suspense>
      </div>
    </>
  )
}
