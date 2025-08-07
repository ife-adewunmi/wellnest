import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/shared/db'

// In-memory storage for development (this will reset when server restarts)
let mockSessionsStorage: any[] = []

const sessionSchema = z.object({
  counselorId: z.string(),
  studentId: z.string(),
  title: z.string(),
  description: z.string().optional(),
  scheduledAt: z.string().transform((str) => new Date(str)),
  duration: z.number(),
  status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED', 'PENDING']).optional(),
  notes: z.string().optional(),
  studentName: z.string().optional(),
})

// Function to ensure sessions table exists with all required columns
async function ensureSessionsTable() {
  console.log('🔧 Creating sessions table if it doesn\'t exist...')
  await db.execute(`
    CREATE TABLE IF NOT EXISTS sessions (
      id SERIAL PRIMARY KEY,
      counselor_id VARCHAR(255) NOT NULL,
      student_id VARCHAR(255) NOT NULL,
      student_name VARCHAR(255),
      title VARCHAR(255) NOT NULL,
      description TEXT,
      scheduled_at TIMESTAMP NOT NULL,
      duration INTEGER NOT NULL,
      status VARCHAR(50) DEFAULT 'SCHEDULED',
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Add student_name column if it doesn't exist (migration)
  try {
    console.log('🔧 Adding student_name column if it doesn\'t exist...')
    await db.execute(`
      ALTER TABLE sessions
      ADD COLUMN IF NOT EXISTS student_name VARCHAR(255)
    `)
    console.log('✅ student_name column ready')
  } catch (error) {
    console.log('ℹ️ student_name column already exists or migration not needed')
  }

  console.log('✅ Sessions table ready')
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const upcoming = searchParams.get('upcoming') === 'true'
    const role = searchParams.get('role') || 'STUDENT'

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    console.log(`Fetching sessions for userId: ${userId}, role: ${role}, upcoming: ${upcoming}`)

    // Try to fetch from database first
    try {
      // Ensure table exists and has the student_name column
      await ensureSessionsTable()

      // Build the WHERE clause based on role
      const roleCondition = role === 'COUNSELOR'
        ? `counselor_id = '${userId}'`
        : `student_id = '${userId}'`

      // Build the date condition for upcoming sessions
      const dateCondition = upcoming
        ? `AND scheduled_at > CURRENT_TIMESTAMP`
        : ''

      const query = `
        SELECT s.id, s.counselor_id, s.student_id, s.student_name, s.title, s.description, s.scheduled_at,
               s.duration, s.status, s.notes, s.created_at, s.updated_at
        FROM sessions s
        WHERE ${roleCondition} ${dateCondition}
        ORDER BY s.scheduled_at ${upcoming ? 'ASC' : 'DESC'}
      `

      console.log('📊 Executing database query:', query)
      const result = await db.execute(query)

      if (result.rows) {
        const dbSessions = result.rows.map((row: any) => ({
          id: row.id.toString(),
          counselorId: row.counselor_id,
          studentId: row.student_id,
          title: row.title,
          description: row.description,
          scheduledAt: row.scheduled_at,
          duration: row.duration,
          status: row.status,
          notes: row.notes,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
          studentName: row.student_name || 'Unknown Student',
        }))
        console.log('📊 Database sessions with student names:', dbSessions)

        console.log('📊 Sample session data:', dbSessions[0])

        console.log(`✅ Returning ${dbSessions.length} sessions from database for ${role} user ${userId}`)
        return NextResponse.json(dbSessions)
      }
    } catch (dbError) {
      console.error('❌ Database error, falling back to in-memory storage:', dbError)
    }

    // Fallback to in-memory storage
    let filteredSessions = mockSessionsStorage.filter(session => {
      // Filter by user role
      if (role === 'COUNSELOR') {
        return session.counselorId === userId
      } else {
        return session.studentId === userId
      }
    })

    // Filter based on upcoming flag
    if (upcoming) {
      const now = new Date()
      console.log(`Filtering for upcoming sessions. Current time: ${now.toISOString()}`)
      filteredSessions = filteredSessions.filter(session => {
        const sessionDate = new Date(session.scheduledAt)
        const isUpcoming = sessionDate > now
        console.log(`Session ${session.id}: ${session.scheduledAt} -> ${isUpcoming ? 'UPCOMING' : 'PAST'}`)
        return isUpcoming
      })
    }

    console.log(`📝 Returning ${filteredSessions.length} sessions from memory for ${role} user ${userId}`)
    console.log(`Total sessions in memory: ${mockSessionsStorage.length}`)
    return NextResponse.json(filteredSessions)
  } catch (error) {
    console.error('Error fetching sessions:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Creating session with body:', body)

    const validatedData = sessionSchema.parse(body)
    console.log('Validated session data:', validatedData)

    // Try to store in database first
    try {
      await ensureSessionsTable()

      // Insert the new session
      const insertQuery = `
        INSERT INTO sessions (counselor_id, student_id, student_name, title, description, scheduled_at, duration, status, notes)
        VALUES ('${validatedData.counselorId}', '${validatedData.studentId}', '${validatedData.studentName || ''}', '${validatedData.title}',
                '${validatedData.description || ''}', '${validatedData.scheduledAt.toISOString()}',
                ${validatedData.duration}, '${validatedData.status || 'SCHEDULED'}', '${validatedData.notes || ''}')
        RETURNING id, counselor_id, student_id, student_name, title, description, scheduled_at, duration, status, notes, created_at, updated_at
      `

      console.log('💾 Executing INSERT query:', insertQuery)
      const result = await db.execute(insertQuery)

      if (result.rows && result.rows.length > 0) {
        const dbSession = result.rows[0] as any
        console.log('📊 Raw database result:', dbSession)

        const newSession = {
          id: dbSession.id.toString(),
          counselorId: dbSession.counselor_id,
          studentId: dbSession.student_id,
          title: dbSession.title,
          description: dbSession.description,
          scheduledAt: dbSession.scheduled_at,
          duration: dbSession.duration,
          status: dbSession.status,
          notes: dbSession.notes,
          createdAt: dbSession.created_at,
          updatedAt: dbSession.updated_at,
          studentName: dbSession.student_name || 'Mock Student',
        }

        console.log('✅ Session created successfully in database:', newSession)

        // Verify the session was actually stored by querying it back
        try {
          const verifyResult = await db.execute(`SELECT COUNT(*) as count FROM sessions WHERE id = ${dbSession.id}`)
          console.log('🔍 Verification query result:', verifyResult.rows?.[0])
        } catch (verifyError) {
          console.error('❌ Failed to verify session storage:', verifyError)
        }

        return NextResponse.json(newSession, { status: 201 })
      } else {
        console.error('❌ No rows returned from INSERT query')
        throw new Error('Failed to insert session - no rows returned')
      }
    } catch (dbError) {
      console.error('❌ Database error, falling back to in-memory storage:', dbError)

      // Fallback to in-memory storage if database fails
      const newSession = {
        id: `session-${Date.now()}`,
        counselorId: validatedData.counselorId,
        studentId: validatedData.studentId,
        title: validatedData.title,
        description: validatedData.description,
        scheduledAt: validatedData.scheduledAt.toISOString(),
        duration: validatedData.duration,
        status: validatedData.status || 'SCHEDULED',
        notes: validatedData.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        studentName: validatedData.studentName || 'Unknown Student',
      }

      // Add to in-memory storage
      mockSessionsStorage.push(newSession)

      console.log('📝 Session created in memory storage:', newSession)
      console.log(`Total sessions in memory: ${mockSessionsStorage.length}`)
      return NextResponse.json(newSession, { status: 201 })
    }
  } catch (error) {
    console.error('Error creating session:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data format', details: error.issues },
        { status: 400 },
      )
    }

    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
