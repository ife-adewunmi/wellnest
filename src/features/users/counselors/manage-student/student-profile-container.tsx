'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LoadingSpinner } from '@/shared/components/loading-spinner'
import { ErrorMessage } from '@/shared/components/error-message'
import { Button } from '@/shared/components/ui/button'
import { EnhancedStudentProfile } from '@/features/users/counselors/manage-student/student-profile'
import { navigateTo } from '@/shared/state/navigation'
import { Endpoints } from '@/shared/enums/endpoints'
import { studentsApi } from '@/features/users/counselors/services/models/students-api'
import { StudentDetail } from '@/features/users/counselors/types/student.types'

interface StudentProfileContainerProps {
  initialStudent: StudentDetail | null
  initialError: string | null
  studentId: string
}

export function StudentProfileContainer({ 
  initialStudent, 
  initialError, 
  studentId 
}: StudentProfileContainerProps) {
  const router = useRouter()
  const [student, setStudent] = useState<StudentDetail | null>(initialStudent)
  const [error, setError] = useState<string | null>(initialError)
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Function to refresh student data
  const refreshStudent = async () => {
    try {
      setIsRefreshing(true)
      setError(null)
      
      const studentData = await studentsApi.getStudentById(studentId)
      
      if (!studentData) {
        setError('Student not found')
      } else {
        setStudent(studentData)
      }
    } catch (err) {
      console.error('Error refreshing student:', err)
      setError(err instanceof Error ? err.message : 'Failed to refresh student data')
    } finally {
      setIsRefreshing(false)
    }
  }

  // Function to retry loading if initial load failed
  const retryLoad = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const studentData = await studentsApi.getStudentById(studentId)
      
      if (!studentData) {
        setError('Student not found')
      } else {
        setStudent(studentData)
      }
    } catch (err) {
      console.error('Error retrying student load:', err)
      setError(err instanceof Error ? err.message : 'Failed to load student data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    navigateTo(router, Endpoints.COUNSELORS.MANAGE_STUDENT)
  }

  // Handle error state
  if (error && !student) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <ErrorMessage message={error} />
          <div className="mt-4 space-x-2">
            <Button
              onClick={retryLoad}
              variant="outline"
              disabled={isLoading}
              className="inline-flex items-center"
            >
              {isLoading && <LoadingSpinner size="small" className="mr-2" />}
              Try Again
            </Button>
            <Button onClick={handleBack} variant="outline">
              Back to Students
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // If no student data
  if (!student && !isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-gray-500">Student not found</p>
          <div className="space-x-2">
            <Button
              onClick={retryLoad}
              variant="outline"
              disabled={isLoading}
              className="inline-flex items-center"
            >
              {isLoading && <LoadingSpinner size="small" className="mr-2" />}
              Try Again
            </Button>
            <Button onClick={handleBack} variant="outline">
              Back to Students
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Loading state for initial client-side loads
  if (isLoading && !student) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingSpinner size="large" />
        <p className="ml-4 text-gray-600">Loading student profile...</p>
      </div>
    )
  }

  // Render the enhanced student profile with refresh capability
  return (
    <div className="relative">
      {/* Refresh indicator */}
      {isRefreshing && (
        <div className="absolute top-0 left-0 right-0 z-10 bg-blue-50 border border-blue-200 rounded-md p-2 mb-4">
          <div className="flex items-center justify-center">
            <LoadingSpinner size="small" />
            <span className="ml-2 text-sm text-blue-600">Refreshing data...</span>
          </div>
        </div>
      )}

      {/* Error banner for non-critical errors */}
      {error && student && (
        <div className="mb-4 rounded-md border border-yellow-200 bg-yellow-50 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-yellow-600">
              Warning: {error} (showing cached data)
            </p>
            <Button onClick={() => setError(null)} variant="ghost" size="sm">
              ×
            </Button>
          </div>
        </div>
      )}

      {student && (
        <EnhancedStudentProfile 
          studentId={studentId}
          student={student}
          onBack={handleBack}
          onRefresh={refreshStudent}
          isRefreshing={isRefreshing}
        />
      )}
    </div>
  )
}
