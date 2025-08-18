import { type NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { AuthService } from '@/users/auth/services/auth.service'
import { SessionService } from '@/users/auth/services/session.service'

const getDeviceInfo = (request: NextRequest): string => {
  const userAgent = request.headers.get('user-agent') || 'Unknown'
  return userAgent.slice(0, 255) // Limit length for database
}

const getClientIp = (request: NextRequest): string => {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')

  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }

  if (realIp) {
    return realIp
  }

  return 'unknown'
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body || {}

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email and password required',
          error: 'Email and password required',
        },
        { status: 400 },
      )
    }

    const result = await AuthService.login({ email, password })

    if (!result.success || !result.user) {
      return NextResponse.json(result, { status: 401 })
    }

    // Create a new session
    const deviceInfo = getDeviceInfo(request)
    const ipAddress = getClientIp(request)

    const session = await SessionService.createSession(result.user.id, deviceInfo, ipAddress)

    // Set secure session cookie
    const cookieStore = await cookies()
    cookieStore.set('session-token', session.sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    })

    // Update user's last login
    await AuthService.updateLastLogin(result.user.id)

    return NextResponse.json({
      ...result,
      session: {
        id: session.id,
        expiresAt: session.expiresAt,
      },
    })
  } catch (error) {
    console.error('Sign in error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: 'Internal server error' },
      { status: 500 },
    )
  }
}
