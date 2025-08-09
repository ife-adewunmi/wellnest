import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/shared/db'
import { moodCheckIns } from '@/shared/db/schema'
import { eq, desc } from 'drizzle-orm'
import { getSession } from '@/user/auth/lib/auth.server'

const moodCheckInSchema = z.object({
  mood: z.enum(['HAPPY', 'GOOD', 'NEUTRAL', 'BAD', 'STRESSED']),
  reasons: z.array(z.string()).optional(),
  description: z.string().optional(),
  socialMediaImpact: z.boolean().optional(),
})

// GET /api/mood-check-in/history - Get mood check-in history
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

    return NextResponse.json(checkIns)
  } catch (error) {
    console.error('Error fetching mood check-ins:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/mood-check-in - Create new mood check-in
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    console.log('📝 Creating mood check-in with body:', body)

    const validatedData = moodCheckInSchema.parse(body)
    console.log('✅ Validated mood check-in data:', validatedData)

    // Calculate basic risk score based on mood
    let riskScore = 0
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW'

    switch (validatedData.mood) {
      case 'HAPPY':
        riskScore = 10
        riskLevel = 'LOW'
        break
      case 'GOOD':
        riskScore = 25
        riskLevel = 'LOW'
        break
      case 'NEUTRAL':
        riskScore = 50
        riskLevel = 'MEDIUM'
        break
      case 'BAD':
        riskScore = 75
        riskLevel = 'HIGH'
        break
      case 'STRESSED':
        riskScore = 90
        riskLevel = 'HIGH'
        break
    }

    // Adjust risk score based on reasons
    if (validatedData.reasons && validatedData.reasons.length > 0) {
      const highRiskReasons = ['Health', 'Sleep', 'Finances', 'Family']
      const hasHighRiskReasons = validatedData.reasons.some(reason => 
        highRiskReasons.includes(reason)
      )
      if (hasHighRiskReasons) {
        riskScore = Math.min(100, riskScore + 10)
        if (riskScore >= 70) riskLevel = 'HIGH'
        else if (riskScore >= 40) riskLevel = 'MEDIUM'
      }
    }

    // Adjust risk score based on social media impact
    if (validatedData.socialMediaImpact === true) {
      riskScore = Math.min(100, riskScore + 15)
      if (riskScore >= 70) riskLevel = 'HIGH'
      else if (riskScore >= 40) riskLevel = 'MEDIUM'
    }

    console.log(`📊 Calculated risk score: ${riskScore}, level: ${riskLevel}`)

    // Create the mood check-in record
    const newCheckIn = await db
      .insert(moodCheckIns)
      .values({
        userId: session.user.id,
        mood: validatedData.mood,
        reasons: validatedData.reasons || [],
        description: validatedData.description,
        socialMediaImpact: validatedData.socialMediaImpact,
        riskScore,
        riskLevel,
      })
      .returning()

    console.log('✅ Created mood check-in:', newCheckIn[0])

    return NextResponse.json(newCheckIn[0], { status: 201 })
  } catch (error) {
    console.error('Error creating mood check-in:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data format', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
