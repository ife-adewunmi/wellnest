import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { SessionService } from '@/features/users/auth/services/session.service'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('session-token')?.value

    if (!sessionToken) {
      return NextResponse.json({ user: null, isAuthenticated: false })
    }

    const sessionData = await SessionService.validateSession(sessionToken)

    if (!sessionData || !sessionData.user) {
      // Invalid or expired session, clear the cookie
      const response = NextResponse.json({ user: null, isAuthenticated: false })
      response.cookies.delete('session-token')
      return response
    }

    return NextResponse.json({
      user: sessionData.user,
      isAuthenticated: true,
      session: {
        id: sessionData.id,
        expiresAt: sessionData.expiresAt,
        lastActiveAt: sessionData.lastActiveAt,
        deviceInfo: sessionData.deviceInfo,
      },
    })
  } catch (error) {
    console.error('Session error:', error)
    return NextResponse.json({ user: null, isAuthenticated: false }, { status: 500 })
  }
}
