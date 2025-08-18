import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/features/users/auth/services/auth.service'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    return NextResponse.json('result', { status: 201 })
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
