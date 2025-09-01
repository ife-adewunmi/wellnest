import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/shared/db'
import { users, students } from '@/shared/db/schema'
import { eq, sql } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number(searchParams.get('limit')) || 50
    const offset = Number(searchParams.get('offset')) || 0

    // Get all students with their latest mood check-in and session info
    const studentsList = await db
      .select({
        id: users.id,
        name: sql`${users.firstName} || ' ' || ${users.lastName}`.as('name'),
        email: users.email,
        department: students.department,
        studentId: students.studentId,
        level: students.level,
        avatar: users.avatar,
        createdAt: users.createdAt,
        // Latest mood check-in
        latestMood: sql`(
          SELECT mood FROM mood_check_ins 
          WHERE user_id = ${users.id} 
          ORDER BY created_at DESC 
          LIMIT 1
        )`,
        latestMoodDate: sql`(
          SELECT created_at FROM mood_check_ins 
          WHERE user_id = ${users.id} 
          ORDER BY created_at DESC 
          LIMIT 1
        )`,
        // Risk score
        riskScore: sql`(
          SELECT risk_score FROM mood_check_ins 
          WHERE user_id = ${users.id} 
          ORDER BY created_at DESC 
          LIMIT 1
        )`,
        // Total sessions
        totalSessions: sql`(
          SELECT COUNT(*) FROM sessions 
          WHERE student_id = ${users.id}
        )`,
        // Upcoming sessions
        upcomingSessions: sql`(
          SELECT COUNT(*) FROM sessions 
          WHERE student_id = ${users.id} 
          AND scheduled_at > NOW()
          AND status = 'SCHEDULED'
        )`,
      })
      .from(users)
      .innerJoin(students, eq(students.userId, users.id))
      .where(eq(users.role, 'STUDENT'))
      .limit(limit)
      .offset(offset)

    return NextResponse.json(studentsList)
  } catch (error) {
    console.error('Error fetching students:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
