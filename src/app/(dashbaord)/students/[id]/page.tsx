import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { LoadingSpinner } from '@/shared/components/loading-spinner'
import { ErrorMessage } from '@/shared/components/error-message'
import { Header } from '@/features/users/counselors/dashboard'
import { StudentProfileContainer } from '@/features/users/counselors/manage-student/student-profile-container'
import { StudentService } from '@/features/users/counselors/services/students.service'
import { SessionService } from '@/features/users/auth/services/session.service'
import { cookies } from 'next/headers'
import { StudentDetail } from '@/features/users/counselors/types/student.types'

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

    const counselorId = sessionData.user.id

    // Fetch student data
    const result = await StudentService.getStudentById(studentId)
    
    if (!result.success || !result.student) {
      return { student: null, error: result.error || 'Student not found' }
    }

    // Transform to StudentDetail format
    const studentData: StudentDetail = {
      // Base StudentTableData fields
      id: result.student.id,
      studentId: result.student.studentId,
      name: `${result.student.firstName} ${result.student.lastName}`,
      lastCheckIn: result.student.createdAt,
      riskLevel: 'LOW' as const,
      currentMood: 'NEUTRAL',
      screenTimeToday: 0,

      // Extended StudentDetail fields
      firstName: result.student.firstName,
      lastName: result.student.lastName,
      phoneNumber: result.student.phoneNumber,
      dateOfBirth: null,
      gender: null,
      faculty: null,
      admissionYear: null,
      graduationYear: null,
      nationality: null,
      stateOfOrigin: null,
      homeAddress: null,
      emergencyContact: null,
      medicalInfo: null,
      academicInfo: null,
      moodDescription: null,
      hasActiveCounselor: true,
      counselorId: counselorId,
      email: result.student.email,
      createdAt: result.student.createdAt
    }

    return { student: studentData, error: null }
  } catch (error) {
    console.error('Error fetching student data:', error)
    return { 
      student: null, 
      error: error instanceof Error ? error.message : 'Failed to fetch student data' 
    }
  }
}

// Server Component (SSR)
export default async function StudentProfilePage({ params }: StudentProfilePageProps) {
  const { id: studentId } = await params

  if (!studentId) {
    notFound()
  }

  // Fetch data on the server
  const { student, error } = await getStudentData(studentId)

  return (
    <>
      <Header />
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
