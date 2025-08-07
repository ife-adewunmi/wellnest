import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/shared/db'
import { messages } from '@/shared/db/schema'
import { eq, desc, or, and } from 'drizzle-orm'
import { z } from 'zod'

const messageSchema = z.object({
  senderId: z.string(),
  receiverId: z.string(),
  content: z.string(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const recent = searchParams.get('recent') === 'true'
    const limit = Number(searchParams.get('limit')) || 10

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const messagesList = await db
      .select()
      .from(messages)
      .where(or(eq(messages.senderId, userId), eq(messages.receiverId, userId)))
      .orderBy(desc(messages.createdAt))
      .limit(limit)

    return NextResponse.json(messagesList)
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = messageSchema.parse(body)

    const newMessage = await db
      .insert(messages)
      .values({
        senderId: validatedData.senderId,
        receiverId: validatedData.receiverId,
        content: validatedData.content,
        isRead: false,
        createdAt: new Date(),
      })
      .returning()

    return NextResponse.json(newMessage[0], { status: 201 })
  } catch (error) {
    console.error('Error creating message:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data format', details: error.errors },
        { status: 400 },
      )
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
