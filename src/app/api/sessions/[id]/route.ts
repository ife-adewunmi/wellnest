import { NextRequest, NextResponse } from 'next/server'
import { sessions } from '@/shared/db/schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/shared/db'

const updateSessionSchema = z.object({
  status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED', 'PENDING']).optional(),
  notes: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  scheduledAt: z.string().transform((str) => new Date(str)).optional(),
  duration: z.number().optional(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id
    const body = await request.json()
    const validatedData = updateSessionSchema.parse(body)

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 })
    }

    // Check if session exists
    const existingSession = await db
      .select()
      .from(sessions)
      .where(eq(sessions.id, sessionId))
      .limit(1)

    if (existingSession.length === 0) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Update session
    const updatedSession = await db
      .update(sessions)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(eq(sessions.id, sessionId))
      .returning()

    return NextResponse.json(updatedSession[0])
  } catch (error) {
    console.error('Error updating session:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data format', details: error.issues },
        { status: 400 },
      )
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 })
    }

    // Check if session exists
    const existingSession = await db
      .select()
      .from(sessions)
      .where(eq(sessions.id, sessionId))
      .limit(1)

    if (existingSession.length === 0) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Delete session
    await db.delete(sessions).where(eq(sessions.id, sessionId))

    return NextResponse.json({ message: 'Session deleted successfully' })
  } catch (error) {
    console.error('Error deleting session:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 })
    }

    const session = await db
      .select()
      .from(sessions)
      .where(eq(sessions.id, sessionId))
      .limit(1)

    if (session.length === 0) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    return NextResponse.json(session[0])
  } catch (error) {
    console.error('Error fetching session:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
