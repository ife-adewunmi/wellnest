import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/user/auth/service/auth.service'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const result = await AuthService.login(body)

    if (!result.success) {
      const status =
        result.error === 'Validation failed'
          ? 400
          : result.error === 'Invalid credentials'
            ? 401
            : 500
      return NextResponse.json(result, { status })
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error('Failed to authenticate user:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal Server Error',
        details: 'An unexpected error occurred during authentication',
      },
      { status: 500 },
    )
  }
}
