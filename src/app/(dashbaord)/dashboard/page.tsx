import { getSession } from '@/user/auth/lib/auth.server'
import { redirect } from 'next/navigation'
import Dashboard from '@/features/dashboard/components/dashboard'
import React from 'react'

const page = async () => {
  const session = await getSession()

  if (!session || session.user.role !== 'COUNSELOR') {
    redirect('/student')
  }

  return (
    <div>
      <Dashboard />
    </div>
  )
}

export default page
