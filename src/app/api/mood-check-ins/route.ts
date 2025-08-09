import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/shared/db'
import { moodCheckIns } from '@/shared/db/schema'
import { eq, desc } from 'drizzle-orm'
import { getSession } from '@/user/auth/lib/auth.server'

// GET /api/mood-check-ins - Get mood check-ins (plural endpoint for compatibility)
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || session.user.id
    const limit = Number(searchParams.get('limit')) || 30

    // Verify user can access this data (either their own or they're a counselor)
    if (userId !== session.user.id && session.user.role !== 'COUNSELOR') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    console.log(`📊 Fetching mood check-ins for user ${userId} (limit: ${limit})`)

    const checkIns = await db
      .select()
      .from(moodCheckIns)
      .where(eq(moodCheckIns.userId, userId))
      .orderBy(desc(moodCheckIns.createdAt))
      .limit(limit)

    console.log(`✅ Found ${checkIns.length} mood check-ins`)

    // Transform the data to match the expected format
    const transformedCheckIns = checkIns.map(checkIn => ({
      id: checkIn.id,
      userId: checkIn.userId,
      mood: checkIn.mood,
      reasons: checkIn.reasons || [],
      description: checkIn.description,
      socialMediaImpact: checkIn.socialMediaImpact,
      riskScore: checkIn.riskScore,
      riskLevel: checkIn.riskLevel,
      mlAnalysis: checkIn.mlAnalysis,
      createdAt: checkIn.createdAt?.toISOString() || new Date().toISOString(),
      syncedAt: checkIn.syncedAt?.toISOString(),
    }))

    return NextResponse.json(transformedCheckIns)
  } catch (error) {
    console.error('Error fetching mood check-ins:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
