'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useUserStore } from '@/features/users/state'

export default function StudentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useUserStore()
  const studentId = searchParams.get('id')

  useEffect(() => {
    if (!user) {
      router.push('/signin')
      return
    }

    // If user is a student, redirect to their dashboard
    if (user.role === 'STUDENT') {
      router.push('/dashboard')
      return
    }

    // If counselor but no student ID provided, redirect to students list
    if (user.role === 'COUNSELOR' && !studentId) {
      router.push('/students')
      return
    }

    // If counselor with student ID, redirect to individual student view
    if (user.role === 'COUNSELOR' && studentId) {
      // For now redirect to students list until individual student page is implemented
      router.push('/students')
      return
    }
  }, [user, studentId, router])

  // Show loading while redirecting
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-gray-500">Redirecting...</div>
    </div>
  )
}
