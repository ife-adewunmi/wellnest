import { getSession } from '@/user/auth/lib/auth.server'
import { redirect } from 'next/navigation'
import { StudentDashboard } from '@/features/students/components/student-dashboard'
import { UserRole } from '@/user/auth/enums'

export default async function StudentPage() {
  const session = await getSession()

  if (!session || session.user.role !== UserRole.STUDENT) {
    redirect('/dashboard')
  }

  return <StudentDashboard user={session.user} />
}
