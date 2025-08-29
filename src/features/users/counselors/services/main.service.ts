import { db } from '@/shared/db'
import { usersTable, studentsTable, counselorsTable } from '@/shared/db/schema/users'
import { counselorStudentTable } from '@/shared/db/schema/counselor-student'
import { moodCheckInsTable } from '@/shared/db/schema/mood-checkins'
import { eq, desc, and, gte, sql, lt, inArray } from 'drizzle-orm'
import type {
  DashboardDataResponse,
  Metric,
  MoodCheckIn,
  ActivityData,
} from '@/users/counselors/types/dashboard.types'
import { NotificationsService } from './notification.service'
import { StudentService } from './students.service'

export class DashboardService {
  /**
   * Get complete dashboard data for a counselor
   */
  static async getDashboardData(counselorId: string): Promise<DashboardDataResponse> {
    try {
      const getNotificationsData = await NotificationsService.getNotifications(counselorId)
      const getStudentsData = await StudentService.getStudents(counselorId)

      // Fetch all data in parallel for better performance
      const [metrics, moodCheckIns, recentActivities, notifications, moodHistory, students] =
        await Promise.all([
          this.getMetrics(counselorId),
          this.getMoodCheckIns(counselorId),
          this.getRecentActivities(counselorId),
          getNotificationsData,
          this.getMoodHistory(counselorId),
          getStudentsData,
        ])

      return {
        metrics,
        moodCheckIns,
        recentActivities,
        notifications,
        moodHistory,
        students,
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      throw new Error('Failed to fetch dashboard data')
    }
  }

  /**
   * Calculate and fetch metrics for the counselor's students
   */
  static async getMetrics(
    counselorId: string,
    period: 'daily' | 'weekly' | 'monthly' = 'weekly',
  ): Promise<Metric[]> {
    try {
      // Get all students assigned to this counselor through counselor-student relationship
      const counselor = await db
        .select()
        .from(counselorsTable)
        .where(eq(counselorsTable.userId, counselorId))
        .limit(1)

      if (!counselor[0]) {
        throw new Error('Counselor not found')
      }

      const studentRelations = await db
        .select({
          student: studentsTable,
          user: usersTable,
        })
        .from(counselorStudentTable)
        .innerJoin(studentsTable, eq(counselorStudentTable.studentId, studentsTable.id))
        .innerJoin(usersTable, eq(studentsTable.userId, usersTable.id))
        .where(eq(counselorStudentTable.counselorId, counselor[0].id))

      const totalStudents = studentRelations.length

      // Calculate at-risk count (mock implementation - should be based on actual criteria)
      const atRiskCount = studentRelations.filter(
        (s) =>
          // Add your at-risk criteria here
          false, // Placeholder
      ).length

      // Calculate average mood score (mock - should query mood data)
      const avgMoodScore = 7.8 // Placeholder

      // Calculate average screen time (mock - should query activity data)
      const avgScreenTime = 2.5 // hours

      // Calculate percentage changes (mock - should compare with previous period)
      const metrics: Metric[] = [
        {
          title: 'Total Students',
          value: totalStudents.toString(),
          change: '+10%', // Mock change
          positive: true,
          period,
          counselorId,
        },
        {
          title: 'At-Risk Count',
          value: atRiskCount.toString(),
          change: atRiskCount > 0 ? '+5%' : '0%',
          positive: false,
          period,
          counselorId,
        },
        {
          title: 'Avg. Mood Score',
          value: avgMoodScore.toFixed(1),
          change: '+2%',
          positive: true,
          period,
          counselorId,
        },
        {
          title: 'Avg. Screen Time',
          value: `${avgScreenTime}hr`,
          change: '+15%',
          positive: false,
          period,
          counselorId,
        },
      ]

      return metrics
    } catch (error) {
      console.error('Error fetching metrics:', error)
      throw new Error('Failed to fetch metrics')
    }
  }

  /**
   * Get recent mood check-ins from students
   */
  static async getMoodCheckIns(counselorId: string, limit: number = 10): Promise<MoodCheckIn[]> {
    try {
      // Get counselor record
      const counselor = await db
        .select()
        .from(counselorsTable)
        .where(eq(counselorsTable.userId, counselorId))
        .limit(1)

      if (!counselor[0]) {
        return []
      }

      // Get students assigned to this counselor
      const studentRelations = await db
        .select({
          studentId: studentsTable.id,
          userId: studentsTable.userId,
        })
        .from(counselorStudentTable)
        .innerJoin(studentsTable, eq(counselorStudentTable.studentId, studentsTable.id))
        .where(eq(counselorStudentTable.counselorId, counselor[0].id))

      if (studentRelations.length === 0) {
        return []
      }

      const studentUserIds = studentRelations.map((s) => s.userId)

      // Get recent mood check-ins from these students
      const checkIns = await db
        .select({
          id: moodCheckInsTable.id,
          userId: moodCheckInsTable.userId,
          mood: moodCheckInsTable.mood,
          description: moodCheckInsTable.description,
          riskScore: moodCheckInsTable.riskScore,
          createdAt: moodCheckInsTable.createdAt,
          firstName: usersTable.firstName,
          lastName: usersTable.lastName,
          avatar: usersTable.avatar,
        })
        .from(moodCheckInsTable)
        .innerJoin(usersTable, eq(moodCheckInsTable.userId, usersTable.id))
        .where(inArray(moodCheckInsTable.userId, studentUserIds))
        .orderBy(desc(moodCheckInsTable.createdAt))
        .limit(limit)

      // Map to the expected format
      const moodEmojis: Record<string, string> = {
        GOOD: '😊',
        HAPPY: '😄',
        NEUTRAL: '😐',
        BAD: '😞',
        SAD: '😔',
      }

      return checkIns.map((checkIn) => {
        const createdAt = checkIn.createdAt || new Date()

        return {
          id: checkIn.id,
          userId: checkIn.userId,
          studentId: checkIn.userId, // For display purposes
          studentName: `${checkIn.firstName} ${checkIn.lastName?.charAt(0)}.`,
          avatar: checkIn.avatar || '/placeholder.svg?height=32&width=32',
          mood: checkIn.mood as 'GOOD' | 'HAPPY' | 'NEUTRAL' | 'BAD' | 'SAD',
          description:
            checkIn.description || `Feeling ${checkIn.mood?.toLowerCase() || 'okay'} today`,
          emoji: moodEmojis[checkIn.mood || 'NEUTRAL'] || '😐',
          riskScore: checkIn.riskScore || 5,
          createdAt: createdAt.toISOString(),
        } as MoodCheckIn
      })
    } catch (error) {
      console.error('Error fetching mood check-ins:', error)
      throw new Error('Failed to fetch mood check-ins')
    }
  }

  /**
   * Get recent sessions/activities for students
   */
  static async getRecentActivities(counselorId: string, days: number = 7): Promise<ActivityData[]> {
    try {
      // Get counselor record
      const counselor = await db
        .select()
        .from(counselorsTable)
        .where(eq(counselorsTable.userId, counselorId))
        .limit(1)

      if (!counselor[0]) {
        return []
      }

      // Get students assigned to this counselor
      const studentRelations = await db
        .select({
          userId: studentsTable.userId,
        })
        .from(counselorStudentTable)
        .innerJoin(studentsTable, eq(counselorStudentTable.studentId, studentsTable.id))
        .where(eq(counselorStudentTable.counselorId, counselor[0].id))

      if (studentRelations.length === 0) {
        return []
      }

      const studentUserIds = studentRelations.map((s) => s.userId)
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      // Get recent sessions for these students
      const { sessionsTable } = await import('@/shared/db/schema/sessions')

      const sessions = await db
        .select({
          id: sessionsTable.id,
          counselorId: sessionsTable.counselorId,
          studentId: sessionsTable.studentId,
          title: sessionsTable.title,
          description: sessionsTable.description,
          scheduledAt: sessionsTable.scheduledAt,
          duration: sessionsTable.duration,
          status: sessionsTable.status,
          notes: sessionsTable.notes,
          createdAt: sessionsTable.createdAt,
          updatedAt: sessionsTable.updatedAt,
          firstName: usersTable.firstName,
          lastName: usersTable.lastName,
        })
        .from(sessionsTable)
        .innerJoin(usersTable, eq(sessionsTable.studentId, usersTable.id))
        .where(
          and(
            eq(sessionsTable.counselorId, counselorId),
            gte(sessionsTable.scheduledAt, startDate),
          ),
        )
        .orderBy(desc(sessionsTable.scheduledAt))
        .limit(50)

      // Transform sessions to ActivityData format
      return sessions.map((session) => ({
        id: session.id,
        counselorId: session.counselorId,
        studentId: session.studentId,
        studentName: `${session.firstName} ${session.lastName}`,
        title: session.title,
        description: session.description || undefined,
        scheduledAt: session.scheduledAt || new Date(),
        duration: session.duration,
        status: session.status as
          | 'SCHEDULED'
          | 'IN_PROGRESS'
          | 'COMPLETED'
          | 'CANCELLED'
          | 'NO_SHOW'
          | 'RESCHEDULED',
        notes: session.notes || undefined,
        type: 'session' as const,
        createdAt: session.createdAt || new Date(),
        updatedAt: session.updatedAt || undefined,
      }))
    } catch (error) {
      console.error('Error fetching activities:', error)
      throw new Error('Failed to fetch activities')
    }
  }

  /**
   * Get mood history data for chart
   */
  static async getMoodHistory(counselorId: string, days: number = 30): Promise<any[]> {
    try {
      // Get counselor record
      const counselor = await db
        .select()
        .from(counselorsTable)
        .where(eq(counselorsTable.userId, counselorId))
        .limit(1)

      if (!counselor[0]) {
        return []
      }

      // Get students assigned to this counselor
      const studentRelations = await db
        .select({
          userId: studentsTable.userId,
        })
        .from(counselorStudentTable)
        .innerJoin(studentsTable, eq(counselorStudentTable.studentId, studentsTable.id))
        .where(eq(counselorStudentTable.counselorId, counselor[0].id))

      if (studentRelations.length === 0) {
        return []
      }

      const studentUserIds = studentRelations.map((s) => s.userId)
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      // Get mood check-ins grouped by date
      const moodHistory = await db
        .select({
          date: sql<string>`DATE(${moodCheckInsTable.createdAt})`,
          avgMood: sql<number>`AVG(CASE
            WHEN "mood" = 'HAPPY' THEN 9
            WHEN "mood" = 'GOOD' THEN 7
            WHEN "mood" = 'BOREDOM' THEN 5
            WHEN "mood" = 'STRESSED' THEN 3
            WHEN "mood" = 'SAD' THEN 1
            ELSE 5
          END)`,
          avgRiskScore: sql<number>`AVG(${moodCheckInsTable.riskScore})`,
          count: sql<number>`COUNT(*)::int`,
          totalCheckIns: sql<number>`COUNT(*)::int`,
        })
        .from(moodCheckInsTable)
        .where(
          and(
            inArray(moodCheckInsTable.userId, studentUserIds),
            gte(moodCheckInsTable.createdAt, startDate),
          ),
        )
        .groupBy(sql`DATE(${moodCheckInsTable.createdAt})`)
        .orderBy(sql`DATE(${moodCheckInsTable.createdAt})`)

      // Fill in missing dates with null values
      const dateMap = new Map(moodHistory.map((item) => [item.date, item]))
      const filledHistory = []
      const currentDate = new Date(startDate)

      while (currentDate <= new Date()) {
        const dateStr = currentDate.toISOString().split('T')[0]
        const data = dateMap.get(dateStr)

        filledHistory.push({
          date: dateStr,
          mood: data ? parseFloat(String(data.avgMood ?? 5).substring(0, 3)) : null,
          wellbeing: data ? 10 - parseFloat(String(data.avgRiskScore ?? 5).substring(0, 3)) : null,
          count: data?.count || 0,
        })

        currentDate.setDate(currentDate.getDate() + 1)
      }

      return filledHistory
    } catch (error) {
      console.error('Error fetching mood history:', error)
      return []
    }
  }

  /**
   * Get students assigned to a counselor with their latest data
   */
  // static async getStudents(counselorId: string): Promise<StudentTableData[]> {
  //   try {
  //     // Get counselor record
  //     const counselor = await db
  //       .select()
  //       .from(counselorsTable)
  //       .where(eq(counselorsTable.userId, counselorId))
  //       .limit(1)

  //     if (!counselor[0]) {
  //       console.log('Counselor not found for userId:', counselorId)
  //       return []
  //     }

  //     // Get students assigned to this counselor
  //     const studentRelations = await db
  //       .select({
  //         studentId: studentsTable.studentId,
  //         userId: studentsTable.userId,
  //         id: studentsTable.id,
  //         firstName: usersTable.firstName,
  //         lastName: usersTable.lastName,
  //         avatar: usersTable.avatar,
  //       })
  //       .from(counselorStudentTable)
  //       .innerJoin(studentsTable, eq(counselorStudentTable.studentId, studentsTable.id))
  //       .innerJoin(usersTable, eq(studentsTable.userId, usersTable.id))
  //       .where(eq(counselorStudentTable.counselorId, counselor[0].id))

  //     if (studentRelations.length === 0) {
  //       console.log('No students found for counselor:', counselor[0].id)
  //       return []
  //     }

  //     // Get latest mood check-ins for each student
  //     const studentUserIds = studentRelations.map((s) => s.userId)

  //     const latestMoodCheckIns = await db
  //       .select({
  //         userId: moodCheckInsTable.userId,
  //         mood: moodCheckInsTable.mood,
  //         riskScore: moodCheckInsTable.riskScore,
  //         createdAt: moodCheckInsTable.createdAt,
  //       })
  //       .from(moodCheckInsTable)
  //       .where(inArray(moodCheckInsTable.userId, studentUserIds))
  //       .orderBy(desc(moodCheckInsTable.createdAt))

  //     // Get today's screen time for each student
  //     const today = new Date()
  //     today.setHours(0, 0, 0, 0)

  //     const screenTimeData = await db
  //       .select({
  //         userId: screenTimeDataTable.userId,
  //         totalMinutes: sql<number>`COALESCE(SUM(${screenTimeDataTable.totalMinutes}), 0)::int`,
  //       })
  //       .from(screenTimeDataTable)
  //       .where(
  //         and(
  //           inArray(screenTimeDataTable.userId, studentUserIds),
  //           gte(screenTimeDataTable.date, today),
  //         ),
  //       )
  //       .groupBy(screenTimeDataTable.userId)

  //     // Create a map for quick lookup
  //     const moodMap = new Map()
  //     const screenTimeMap = new Map()

  //     // Group mood check-ins by user (keep only latest per user)
  //     latestMoodCheckIns.forEach((checkIn) => {
  //       if (!moodMap.has(checkIn.userId)) {
  //         moodMap.set(checkIn.userId, checkIn)
  //       }
  //     })

  //     screenTimeData.forEach((data) => {
  //       screenTimeMap.set(data.userId, data.totalMinutes)
  //     })

  //     // Calculate risk level based on mood and risk score
  //     const calculateRiskLevel = (
  //       riskScore?: number | null,
  //       mood?: string | null,
  //     ): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' => {
  //       if (!riskScore) return 'LOW'
  //       if (riskScore >= 8 || mood === 'SAD') return 'CRITICAL'
  //       if (riskScore >= 6 || mood === 'BAD') return 'HIGH'
  //       if (riskScore >= 4 || mood === 'NEUTRAL') return 'MEDIUM'
  //       return 'LOW'
  //     }

  //     // Map student data to StudentTableData format
  //     return studentRelations.map((student) => {
  //       const moodCheckIn = moodMap.get(student.userId)
  //       const screenTime = screenTimeMap.get(student.userId) || 0

  //       return {
  //         id: student.userId,
  //         studentId: student.studentId,
  //         name: `${student.firstName} ${student.lastName}`,
  //         lastCheckIn: moodCheckIn?.createdAt || undefined,
  //         riskLevel: calculateRiskLevel(moodCheckIn?.riskScore, moodCheckIn?.mood),
  //         currentMood: moodCheckIn?.mood as MoodType | undefined,
  //         screenTimeToday: screenTime,
  //         avatar: student.avatar || undefined,
  //       }
  //     })
  //   } catch (error) {
  //     console.error('Error fetching students:', error)
  //     return []
  //   }
  // }

  /**
   * Get notifications for a counselor
   */
  // static async getNotifications(
  //   counselorId: string,
  //   unreadOnly: boolean = false,
  // ): Promise<Notification[]> {
  //   try {
  //     const conditions = [eq(notificationsTable.userId, counselorId)]

  //     if (unreadOnly) {
  //       conditions.push(eq(notificationsTable.isRead, false))
  //     }

  //     const counselorNotifications = await db
  //       .select()
  //       .from(notificationsTable)
  //       .where(and(...conditions))
  //       .orderBy(desc(notificationsTable.createdAt))
  //       .limit(20)

  //     return counselorNotifications.map((n) => ({
  //       id: n.id,
  //       userId: n.userId,
  //       type: n.type,
  //       title: n.title,
  //       message: n.message,
  //       data: n.data,
  //       isRead: n.isRead || false,
  //       createdAt: n.createdAt || new Date(),
  //     }))
  //   } catch (error) {
  //     console.error('Error fetching notifications:', error)
  //     throw new Error('Failed to fetch notifications')
  //   }
  // }
}
