import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/shared/db'
import { usersTable, studentsTable } from '@/shared/db/schema/users'
import { counselorStudentTable } from '@/shared/db/schema/counselor-student'
import { moodCheckInsTable } from '@/shared/db/schema/mood-checkins'
import { screenTimeDataTable } from '@/shared/db/schema/screen-time-monitoring'
import { sessionsTable } from '@/shared/db/schema/sessions'
import { eq, desc, and, gte, sql } from 'drizzle-orm'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const studentUserId = params.id

    if (!studentUserId) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 })
    }

    // Fetch student user and profile data
    const studentData = await db
      .select({
        id: usersTable.id,
        firstName: usersTable.firstName,
        lastName: usersTable.lastName,
        email: usersTable.email,
        phoneNumber: usersTable.phoneNumber,
        avatar: usersTable.avatar,
        createdAt: usersTable.createdAt,
        studentId: studentsTable.studentId,
        department: studentsTable.department,
        faculty: studentsTable.faculty,
        level: studentsTable.level,
        admissionYear: studentsTable.admissionYear,
        gender: studentsTable.gender,
        nationality: studentsTable.nationality,
        stateOfOrigin: studentsTable.stateOfOrigin,
        homeAddress: studentsTable.homeAddress,
        emergencyContact: studentsTable.emergencyContact,
        medicalInfo: studentsTable.medicalInfo,
        academicInfo: studentsTable.academicInfo,
      })
      .from(usersTable)
      .leftJoin(studentsTable, eq(studentsTable.userId, usersTable.id))
      .where(eq(usersTable.id, studentUserId))
      .limit(1)

    if (studentData.length === 0) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    const student = studentData[0]

    // Get latest mood check-in
    const latestMoodCheckIn = await db
      .select({
        mood: moodCheckInsTable.mood,
        riskScore: moodCheckInsTable.riskScore,
        createdAt: moodCheckInsTable.createdAt,
        description: moodCheckInsTable.description,
      })
      .from(moodCheckInsTable)
      .where(eq(moodCheckInsTable.userId, studentUserId))
      .orderBy(desc(moodCheckInsTable.createdAt))
      .limit(1)

    // Get today's screen time
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const screenTimeToday = await db
      .select({
        totalMinutes: sql<number>`COALESCE(SUM(${screenTimeDataTable.totalMinutes}), 0)::int`,
      })
      .from(screenTimeDataTable)
      .where(
        and(eq(screenTimeDataTable.userId, studentUserId), gte(screenTimeDataTable.date, today)),
      )

    // Get assigned counselor
    const counselorAssignment = await db
      .select({
        counselorId: counselorStudentTable.counselorId,
        status: counselorStudentTable.status,
      })
      .from(counselorStudentTable)
      .where(
        and(
          eq(counselorStudentTable.studentId, student.studentId || ''),
          eq(counselorStudentTable.status, 'ACTIVE'),
        ),
      )
      .limit(1)

    // Count total and upcoming sessions
    const sessionCounts = await db
      .select({
        totalSessions: sql<number>`COUNT(*)::int`,
        upcomingSessions: sql<number>`COUNT(CASE WHEN ${sessionsTable.scheduledAt} > NOW() AND ${sessionsTable.status} = 'SCHEDULED' THEN 1 END)::int`,
      })
      .from(sessionsTable)
      .where(eq(sessionsTable.studentId, studentUserId))

    // Calculate risk level
    const calculateRiskLevel = (riskScore?: number | null, mood?: string | null): string => {
      if (!riskScore) return 'Low'
      if (riskScore >= 8 || mood === 'VERY_SAD') return 'Critical'
      if (riskScore >= 6 || mood === 'SAD' || mood === 'ANXIOUS') return 'High'
      if (riskScore >= 4 || mood === 'STRESSED') return 'Medium'
      return 'Low'
    }

    const latestMood = latestMoodCheckIn[0]
    const riskLevel = calculateRiskLevel(latestMood?.riskScore, latestMood?.mood)

    // Prepare response
    const response = {
      id: student.id,
      firstName: student.firstName,
      lastName: student.lastName,
      name: `${student.firstName} ${student.lastName}`,
      email: student.email,
      phoneNumber: student.phoneNumber,
      avatar: student.avatar,
      createdAt: student.createdAt,

      // Student specific data
      studentId: student.studentId,
      department: student.department,
      faculty: student.faculty,
      level: student.level,
      admissionYear: student.admissionYear,
      gender: student.gender,
      nationality: student.nationality,
      stateOfOrigin: student.stateOfOrigin,
      homeAddress: student.homeAddress,
      emergencyContact: student.emergencyContact,
      medicalInfo: student.medicalInfo,
      academicInfo: student.academicInfo,

      // Mood and wellness data
      lastCheckIn: latestMood?.createdAt?.toISOString(),
      currentMood: latestMood?.mood,
      mood: latestMood?.mood || 'Unknown',
      moodDescription: latestMood?.description,
      riskScore: latestMood?.riskScore || 0,
      riskLevel,

      // Screen time data
      screenTimeToday: screenTimeToday[0]?.totalMinutes || 0,
      screenTime: `${Math.floor((screenTimeToday[0]?.totalMinutes || 0) / 60)} hours`,

      // Session data
      totalSessions: sessionCounts[0]?.totalSessions || 0,
      upcomingSessions: sessionCounts[0]?.upcomingSessions || 0,

      // Counselor assignment
      hasActiveCounselor: counselorAssignment.length > 0,
      counselorId: counselorAssignment[0]?.counselorId,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching student:', error)
    return NextResponse.json({ error: 'Failed to fetch student data' }, { status: 500 })
  }
}
