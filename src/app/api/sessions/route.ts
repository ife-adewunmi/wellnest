import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/shared/lib/db'
import { sessions } from '@/shared/db/schema'
import { eq, desc, gte, and } from 'drizzle-orm'
import { z } from 'zod'

const sessionSchema = z.object({
  counselorId: z.string(),
  studentId: z.string(),
  title: z.string(),
  description: z.string().optional(),
  scheduledAt: z.string().transform((str) => new Date(str)),
  duration: z.number(),
  status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED', 'PENDING']).optional(),
  notes: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const upcoming = searchParams.get('upcoming') === 'true'
    const limit = Number(searchParams.get('limit')) || 10

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    let query = db
      .select()
      .from(sessions)
      .where(
        and(
          eq(sessions.studentId, userId),
          upcoming ? gte(sessions.scheduledAt, new Date()) : undefined,
        ),
      )
      .orderBy(desc(sessions.scheduledAt))
      .limit(limit)

    const sessionsList = await query

    return NextResponse.json(sessionsList)
  } catch (error) {
    console.error('Error fetching sessions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = sessionSchema.parse(body)

    const newSession = await db
      .insert(sessions)
      .values({
        counselorId: validatedData.counselorId,
        studentId: validatedData.studentId,
        title: validatedData.title,
        description: validatedData.description,
        scheduledAt: validatedData.scheduledAt,
        duration: validatedData.duration,
        status: validatedData.status || 'SCHEDULED',
        notes: validatedData.notes,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()

    return NextResponse.json(newSession[0], { status: 201 })
  } catch (error) {
    console.error('Error creating session:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data format', details: error.errors },
        { status: 400 },
      )
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
