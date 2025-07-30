import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/features/auth/services/auth.service'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const result = await AuthService.signup(body)
    console.log('result', result)

    if (!result.success) {
      const status =
        result.error === 'Validation failed'
          ? 400
          : result.error === 'User already exists'
            ? 409
            : 500
      return NextResponse.json(result, { status })
    }

    return NextResponse.json(result, { status: 201 })
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
