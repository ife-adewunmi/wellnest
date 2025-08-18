'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { LoadingSpinner } from '@/shared/components/loading-spinner'
import { ErrorMessage } from '@/shared/components/error-message'
import { EnhancedStudentProfile } from '@/features/users/counselors/manage-student/student-profile'
import { studentsApi } from '@/features/users/counselors/services/models/students-api'
import { navigateTo } from '@/shared/state/navigation'
import { Endpoints } from '@/shared/enums/endpoints'
import { Button } from '@/shared/components/ui/custom-button'
import { Header } from '@/features/users/counselors/dashboard'

export default function StudentProfilePage() {
  const params = useParams()
  const router = useRouter()
  const studentId = params.id as string

  const [student, setStudent] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStudent = async () => {
      if (!studentId) {
        setError('No student ID provided')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        // Fetch student data from API
        const studentData = await studentsApi.getStudentById(studentId)

        console.log('Fetched student data:', studentData)

        if (!studentData) {
          setError('Student not found')
        } else {
          setStudent(studentData)
        }
      } catch (err) {
        console.error('Error fetching student:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch student data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchStudent()
  }, [studentId])

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <LoadingSpinner size="large" />
        <p className="mt-4 text-gray-600">Loading student profile...</p>
      </div>
    )
  }

  const handleBack = () => {
    return (
      <Button
        onClick={() => navigateTo(router, Endpoints.COUNSELORS.MANAGE_STUDENT)}
        className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Back to Students
      </Button>
    )
  }

  // Handle error state
  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <ErrorMessage message={error} />
        {handleBack()}
      </div>
    )
  }

  // If student not found, show a message
  if (!student) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <p className="text-gray-500">Student not found</p>
        {handleBack()}
      </div>
    )
  }

  return (
    <>
      <Header />
      <div className="mx-auto mt-[4rem] w-full max-w-[1152px] min-w-[320px] px-4 sm:px-6 lg:min-w-[1024px] lg:px-8 xl:px-0">
        <h1 className="mb-6 text-2xl font-bold">Students Management</h1>
        <EnhancedStudentProfile studentId={studentId} />
      </div>
    </>
  )
}
