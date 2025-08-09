import { NextRequest, NextResponse } from 'next/server'
import { signUpServer, createToken } from '@/user/auth/lib/auth.server'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('📝 Signup request body:', body)
    const { firstName, lastName, email, password, role } = body

    if (!firstName || !lastName || !email || !password) {
      console.log('❌ Missing required fields:', { firstName: !!firstName, lastName: !!lastName, email: !!email, password: !!password })
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    const user = await signUpServer({
      firstName,
      lastName,
      email,
      password,
      role: role || 'STUDENT',
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      )
    }

    // Create JWT token and set cookie (same as signin)
    const token = await createToken(user)
    const cookieStore = cookies()
    ;(await cookieStore).set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
    })

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      user
    }, { status: 201 })
  } catch (error) {
    console.error('Failed to create user:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal Server Error',
        details: 'An unexpected error occurred during user creation',
      },
      { status: 500 },
    )
  }
}
