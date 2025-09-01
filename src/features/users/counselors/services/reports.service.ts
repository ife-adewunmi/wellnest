import { db } from '@/shared/db'
import { users, students, moodCheckIns, screenTimeData, sessions } from '@/shared/db/schema'
import { eq, and, desc, sql, between } from 'drizzle-orm'
import { ReportFilters, ReportResult, Reports, StudentReportData } from '@/users/counselors/types'
import { RiskLevel, RiskTrend } from '@/shared/types/common.types'

export class ReportService {
  /**
   * Generate comprehensive report for a specific student
   */
  static async generateStudentReport(
    studentUserId: string,
    filters: ReportFilters,
  ): Promise<ReportResult> {
    try {
      const startDate = new Date(filters.startDate)
      const endDate = new Date(filters.endDate)

      // Get student basic info
      const [student] = await db
        .select({
          id: users.id,
          name: sql<string>`${users.firstName} || ' ' || ${users.lastName}`,
          email: users.email,
          studentId: students.studentId,
          department: students.department,
          level: students.level,
          gender: students.gender,
        })
        .from(users)
        .innerJoin(students, eq(users.id, students.userId))
        .where(eq(users.id, studentUserId))

      if (!student) {
        return {
          success: false,
          error: 'Student not found',
        }
      }

      // Get mood check-ins for the period
      const moodData = await db
        .select({
          date: moodCheckIns.createdAt,
          mood: moodCheckIns.mood,
          riskScore: moodCheckIns.riskScore,
          description: moodCheckIns.description,
        })
        .from(moodCheckIns)
        .where(
          and(
            eq(moodCheckIns.userId, studentUserId),
            between(moodCheckIns.createdAt, startDate, endDate),
          ),
        )
        .orderBy(desc(moodCheckIns.createdAt))

      // Get screen time data for the period
      const screenTime = await db
        .select({
          date: screenTimeData.date,
          totalHours: screenTimeData.totalScreenTimeHours,
          socialMediaHours: screenTimeData.socialMediaUsageHours,
        })
        .from(screenTimeData)
        .where(
          and(
            eq(screenTimeData.userId, studentUserId),
            between(screenTimeData.date, filters.startDate, filters.endDate),
          ),
        )
        .orderBy(desc(screenTimeData.date))

      // Get sessions for the period
      const sessionData = await db
        .select({
          scheduledAt: sessions.scheduledAt,
          title: sessions.title,
          duration: sessions.duration,
          status: sessions.status,
          notes: sessions.notes,
        })
        .from(sessions)
        .where(
          and(
            eq(sessions.studentId, studentUserId),
            between(sessions.scheduledAt, startDate, endDate),
          ),
        )
        .orderBy(desc(sessions.scheduledAt))

      // Calculate metrics
      const avgMood =
        moodData.length > 0
          ? moodData.reduce((sum, m) => sum + parseInt(m.mood || '0'), 0) / moodData.length
          : 0

      const avgRiskScore =
        moodData.length > 0
          ? moodData.reduce((sum, m) => sum + (m.riskScore || 0), 0) / moodData.length
          : 0

      const avgDailyScreenTime =
        screenTime.length > 0
          ? screenTime.reduce((sum, s) => sum + (parseFloat(s.totalHours as string) || 0), 0) /
            screenTime.length
          : 0

      const totalScreenTime = screenTime.reduce(
        (sum, s) => sum + (parseFloat(s.totalHours as string) || 0),
        0,
      )

      const totalSessions = sessionData.length
      const completedSessions = sessionData.filter((s) => s.status === 'COMPLETED').length

      // Determine risk level and trend
      const currentRiskLevel = this.calculateRiskLevel(avgRiskScore, avgMood)
      const riskTrend = this.calculateRiskTrend(
        moodData.filter((m) => m.date !== null) as Array<{ riskScore: number | null; date: Date }>,
      )

      const reportData: StudentReportData = {
        id: student.id,
        name: student.name,
        email: student.email,
        studentId: student.studentId,
        department: student.department,
        level: student.level,
        gender: student.gender || null,

        moodCheckins: moodData
          .filter((m) => m.date !== null)
          .map((m) => ({
            date: m.date!.toISOString().split('T')[0],
            mood: m.mood || 'Unknown',
            riskScore: m.riskScore || 0,
            description: m.description || undefined,
          })),
        avgMood,
        avgRiskScore,

        screenTimeData: screenTime.map((s) => ({
          date: s.date,
          totalHours: parseFloat(s.totalHours as string) || 0,
          socialMediaHours: parseFloat(s.socialMediaHours as string) || 0,
        })),
        avgDailyScreenTime,
        totalScreenTime,

        sessions: sessionData.map((s) => ({
          date: s.scheduledAt.toISOString().split('T')[0],
          title: s.title,
          duration: s.duration,
          status: s.status || 'SCHEDULED',
          notes: s.notes || undefined,
        })),
        totalSessions,
        completedSessions,

        currentRiskLevel,
        riskTrend,

        reportPeriod: {
          start: filters.startDate,
          end: filters.endDate,
        },
        generatedAt: new Date().toISOString(),
      }

      return {
        success: true,
        data: reportData,
      }
    } catch (error) {
      console.error('Error generating student report:', error)
      return {
        success: false,
        error: 'Database error',
        details: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  /**
   * Generate summary reports for multiple students
   */
  static async generateStudentsSummaryReport(
    counselorId: string,
    filters: ReportFilters,
  ): Promise<ReportResult> {
    try {
      // Get students assigned to counselor
      const { counselorStudentTable } = await import('@/shared/db/schema/counselor-student')
      const { counselorsTable } = await import('@/shared/db/schema/users')

      // Get counselor record
      const [counselor] = await db
        .select()
        .from(counselorsTable)
        .where(eq(counselorsTable.userId, counselorId))

      if (!counselor) {
        return {
          success: false,
          error: 'Counselor not found',
        }
      }

      // Build the where conditions dynamically
      const whereConditions = [eq(counselorStudentTable.counselorId, counselor.id)]

      if (filters.department) {
        whereConditions.push(eq(students.department, filters.department))
      }

      if (filters.level) {
        whereConditions.push(eq(students.level, filters.level as any))
      }

      // Get assigned students with optional filtering
      let assignedStudents = await db
        .select({
          userId: users.id,
          name: sql<string>`${users.firstName} || ' ' || ${users.lastName}`,
          email: users.email,
          studentId: students.studentId,
          department: students.department,
          level: students.level,
        })
        .from(counselorStudentTable)
        .innerJoin(students, eq(counselorStudentTable.studentId, students.id))
        .innerJoin(users, eq(students.userId, users.id))
        .where(and(...whereConditions))

      // If a specific studentId is provided, filter further
      if (filters.studentId) {
        assignedStudents = assignedStudents.filter((s) => s.userId === filters.studentId)
      }

      // Generate reports for each student
      const reports: StudentReportData[] = []
      for (const student of assignedStudents) {
        const result = await this.generateStudentReport(student.userId, filters)
        if (result.success && result.data) {
          reports.push(result.data as StudentReportData)
        }
      }

      return {
        success: true,
        data: reports,
      }
    } catch (error) {
      console.error('Error generating summary report:', error)
      return {
        success: false,
        error: 'Database error',
        details: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  /**
   * Get available students for report generation
   */
  static async getAvailableStudents(counselorId: string): Promise<Reports[]> {
    try {
      const { counselorStudentTable } = await import('@/shared/db/schema/counselor-student')
      const { counselorsTable } = await import('@/shared/db/schema/users')

      // Get counselor record
      const [counselor] = await db
        .select()
        .from(counselorsTable)
        .where(eq(counselorsTable.userId, counselorId))

      if (!counselor) {
        return []
      }

      const studentsList = await db
        .select({
          id: users.id,
          name: sql<string>`${users.firstName} || ' ' || ${users.lastName}`,
          studentId: students.studentId,
          department: students.department,
          level: students.level,
        })
        .from(counselorStudentTable)
        .innerJoin(students, eq(counselorStudentTable.studentId, students.id))
        .innerJoin(users, eq(students.userId, users.id))
        .where(eq(counselorStudentTable.counselorId, counselor.id))

      return studentsList
    } catch (error) {
      console.error('Error fetching available students:', error)
      return []
    }
  }

  private static calculateRiskLevel(riskScore: number, mood: number): RiskLevel {
    if (riskScore >= 8 || mood <= 2) return 'CRITICAL'
    if (riskScore >= 6 || mood <= 4) return 'HIGH'
    if (riskScore >= 4 || mood <= 6) return 'MEDIUM'
    return 'LOW'
  }

  private static calculateRiskTrend(
    moodData: Array<{ riskScore: number | null; date: Date }>,
  ): RiskTrend {
    if (moodData.length < 3) return 'STABLE'

    const recent = moodData.slice(0, 3).map((m) => m.riskScore || 0)
    const older = moodData.slice(-3).map((m) => m.riskScore || 0)

    const recentAvg = recent.reduce((sum, r) => sum + r, 0) / recent.length
    const olderAvg = older.reduce((sum, r) => sum + r, 0) / older.length

    const diff = recentAvg - olderAvg

    if (diff < -0.5) return 'IMPROVING'
    if (diff > 0.5) return 'WORSENING'
    return 'STABLE'
  }
}
