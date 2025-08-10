import { NextResponse } from 'next/server'
import { SessionService } from '@/features/users/auth/services/session.service'

export async function POST() {
  try {
    // This endpoint can be called by cron jobs or scheduled tasks
    await SessionService.cleanupExpiredSessions()
    
    return NextResponse.json({ 
      success: true,
      message: 'Session cleanup completed'
    })
  } catch (error) {
    console.error('Session cleanup error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Session cleanup failed' 
      },
      { status: 500 }
    )
  }
}
