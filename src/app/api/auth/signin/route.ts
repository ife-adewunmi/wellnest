import { type NextRequest, NextResponse } from 'next/server'
import { signInServer, createToken } from '@/user/auth/lib/auth.server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    const user = await signInServer(email, password)

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Create JWT token
    const token = await createToken(user)

    // Set cookie
    const cookieStore = cookies()
    ;(await cookieStore).set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
    })

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Sign in error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
