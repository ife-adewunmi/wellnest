import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { SessionService } from '@/features/users/auth/services/session.service'

export async function POST() {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('session-token')?.value

    // Invalidate the session in the database if it exists
    if (sessionToken) {
      await SessionService.invalidateSession(sessionToken)
    }

    // Clear the session cookie
    const response = NextResponse.json({ success: true })
    response.cookies.delete('session-token')

    return response
  } catch (error) {
    console.error('Sign out error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
