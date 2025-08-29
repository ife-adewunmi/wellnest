import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/shared/db'
import { moodCheckInsTable } from '@/shared/db/schema/mood-checkins'
import { eq, desc } from 'drizzle-orm'
import { z } from 'zod'
import { MOOD_TYPE } from '@/shared/types/common.types'

// Validation schema for mood check-in data
const moodCheckInSchema = z.object({
  userId: z.uuid(),
  mood: z.enum(MOOD_TYPE),
  socialMediaImpact: z.boolean().optional(),
  influences: z.array(z.string()).optional(),
  reasons: z.array(z.string()).optional(),
  description: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = moodCheckInSchema.parse(body)

    // Insert mood check-in into database
    const newMoodCheckIn = await db
      .insert(moodCheckInsTable)
      .values({
        userId: validatedData.userId,
        mood: validatedData.mood,
        socialMediaImpact: validatedData.socialMediaImpact || false,
        influences: validatedData.influences || [],
        reasons: validatedData.reasons || [],
        description: validatedData.description,
        createdAt: new Date(),
      })
      .returning()

    return NextResponse.json(newMoodCheckIn[0], { status: 201 })
  } catch (error) {
    console.error('Error creating mood check-in:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data format', details: error.issues },
        { status: 400 },
      )
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || '30')

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const moodCheckIns = await db
      .select()
      .from(moodCheckInsTable)
      .where(eq(moodCheckInsTable.userId, userId))
      .orderBy(desc(moodCheckInsTable.createdAt))
      .limit(limit)

    return NextResponse.json(moodCheckIns)
  } catch (error) {
    console.error('Error fetching mood check-ins:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
