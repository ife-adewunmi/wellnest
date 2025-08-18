import { db } from '@/shared/db'
import { counselorStudentTable } from '@/shared/db/schema/counselor-student'
import { moodCheckInsTable } from '@/shared/db/schema/mood-checkins'
import { screenTimeDataTable } from '@/shared/db/schema/screen-time-monitoring'
import { usersTable, studentsTable, counselorsTable } from '@/shared/db/schema/users'
import { MoodType } from '@/shared/types/common.types'
import bcrypt from 'bcryptjs'
import { eq, and, desc, gte, inArray, sql } from 'drizzle-orm'
import { StudentTableData } from '../state'

export interface CreateStudentData {
  email: string
  firstName: string
  lastName: string
  password: string
  studentId: string
  department?: string
  level?: string
  phoneNumber?: string
}

export interface StudentResult {
  success: boolean
  student?: any
  students?: any[]
  error?: string
  details?: string
}

export class StudentService {
  static async createStudent(data: CreateStudentData): Promise<StudentResult> {
    try {
      // Validate required fields
      if (!data.email || !data.firstName || !data.lastName || !data.password || !data.studentId) {
        return {
          success: false,
          error: 'Validation failed',
          details: 'Missing required fields',
        }
      }

      // Check if user already exists
      const existingUser = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, data.email))
        .limit(1)

      if (existingUser.length > 0) {
        return {
          success: false,
          error: 'User already exists',
          details: 'A user with this email already exists',
        }
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 12)

      // Create user
      const [newUser] = await db
        .insert(usersTable)
        .values({
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          password: hashedPassword,
          role: 'STUDENT',
          phoneNumber: data.phoneNumber || null,
          isActive: true,
        })
        .returning()

      // Create student record
      const [studentRecord] = await db
        .insert(studentsTable)
        .values({
          userId: newUser.id,
          studentId: data.studentId,
          department: data.department || 'Unknown',
          level: (data.level || '100') as '100' | '200' | '300' | '400' | '500' | 'MASTERS' | 'PHD',
          admissionYear: new Date().getFullYear(),
        })
        .returning()

      return {
        success: true,
        student: {
          ...newUser,
          student: studentRecord,
        },
      }
    } catch (error) {
      console.error('Error creating student:', error)
      return {
        success: false,
        error: 'Database error',
        details: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  static async getAllStudents(): Promise<StudentResult> {
    try {
      const students = await db
        .select({
          id: usersTable.id,
          email: usersTable.email,
          firstName: usersTable.firstName,
          lastName: usersTable.lastName,
          phoneNumber: usersTable.phoneNumber,
          isActive: usersTable.isActive,
          createdAt: usersTable.createdAt,
          studentId: studentsTable.studentId,
          department: studentsTable.department,
          level: studentsTable.level,
        })
        .from(usersTable)
        .leftJoin(studentsTable, eq(usersTable.id, studentsTable.userId))
        .where(eq(usersTable.role, 'STUDENT'))

      return {
        success: true,
        students,
      }
    } catch (error) {
      console.error('Error fetching students:', error)
      return {
        success: false,
        error: 'Database error',
        details: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  static async getStudentById(userId: string): Promise<StudentResult> {
    try {
      const [student] = await db
        .select({
          id: usersTable.id,
          email: usersTable.email,
          firstName: usersTable.firstName,
          lastName: usersTable.lastName,
          phoneNumber: usersTable.phoneNumber,
          isActive: usersTable.isActive,
          createdAt: usersTable.createdAt,
          avatar: usersTable.avatar,
          // Student-specific fields
          studentId: studentsTable.studentId,
          department: studentsTable.department,
          faculty: studentsTable.faculty,
          level: studentsTable.level,
          admissionYear: studentsTable.admissionYear,
          gender: studentsTable.gender,
          dateOfBirth: studentsTable.dateOfBirth,
          nationality: studentsTable.nationality,
          stateOfOrigin: studentsTable.stateOfOrigin,
          homeAddress: studentsTable.homeAddress,
          emergencyContact: studentsTable.emergencyContact,
          medicalInfo: studentsTable.medicalInfo,
          academicInfo: studentsTable.academicInfo,
        })
        .from(usersTable)
        .leftJoin(studentsTable, eq(usersTable.id, studentsTable.userId))
        .where(and(eq(usersTable.id, userId), eq(usersTable.role, 'STUDENT')))
        .limit(1)

      if (!student) {
        return {
          success: false,
          error: 'Student not found',
        }
      }

      // Get additional student data: latest mood check-in, sessions, etc.
      const [latestMoodCheckIn] = await db
        .select({
          mood: moodCheckInsTable.mood,
          riskScore: moodCheckInsTable.riskScore,
          createdAt: moodCheckInsTable.createdAt,
          description: moodCheckInsTable.description,
        })
        .from(moodCheckInsTable)
        .where(eq(moodCheckInsTable.userId, userId))
        .orderBy(desc(moodCheckInsTable.createdAt))
        .limit(1)

      // Get today's screen time
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const [screenTimeToday] = await db
        .select({
          totalMinutes: sql<number>`COALESCE(SUM(${screenTimeDataTable.totalMinutes}), 0)::int`,
        })
        .from(screenTimeDataTable)
        .where(
          and(
            eq(screenTimeDataTable.userId, userId),
            gte(screenTimeDataTable.date, today),
          ),
        )
        .groupBy(screenTimeDataTable.userId)
        .limit(1)

      // Get session counts (requires importing sessions table)
      let totalSessions = 0
      let upcomingSessions = 0
      try {
        const { sessionsTable } = await import('@/shared/db/schema/sessions')
        
        const [sessionCounts] = await db
          .select({
            total: sql<number>`COUNT(*)::int`,
            upcoming: sql<number>`COUNT(CASE WHEN ${sessionsTable.scheduledAt} > NOW() THEN 1 END)::int`,
          })
          .from(sessionsTable)
          .where(eq(sessionsTable.studentId, userId))
          .limit(1)
        
        if (sessionCounts) {
          totalSessions = sessionCounts.total || 0
          upcomingSessions = sessionCounts.upcoming || 0
        }
      } catch (error) {
        console.warn('Sessions table not available or error fetching session counts:', error)
      }

      // Calculate risk level based on mood and risk score
      const calculateRiskLevel = (
        riskScore?: number | null,
        mood?: string | null,
      ): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' => {
        if (!riskScore) return 'LOW'
        if (riskScore >= 8 || mood === 'VERY_SAD') return 'CRITICAL'
        if (riskScore >= 6 || mood === 'SAD' || mood === 'ANXIOUS') return 'HIGH'
        if (riskScore >= 4 || mood === 'STRESSED') return 'MEDIUM'
        return 'LOW'
      }

      // Transform the data to match StudentDetail interface
      const studentDetail = {
        // Base fields
        id: student.id,
        studentId: student.studentId,
        name: `${student.firstName} ${student.lastName}`,
        email: student.email,
        firstName: student.firstName,
        lastName: student.lastName,
        phoneNumber: student.phoneNumber,
        avatar: student.avatar,
        createdAt: student.createdAt,
        
        // Student detail fields
        department: student.department,
        faculty: student.faculty,
        level: student.level,
        admissionYear: student.admissionYear,
        gender: student.gender,
        dateOfBirth: student.dateOfBirth,
        nationality: student.nationality,
        stateOfOrigin: student.stateOfOrigin,
        homeAddress: student.homeAddress,
        emergencyContact: student.emergencyContact,
        medicalInfo: student.medicalInfo,
        academicInfo: student.academicInfo,
        
        // Dynamic data based on database queries
        riskLevel: calculateRiskLevel(latestMoodCheckIn?.riskScore, latestMoodCheckIn?.mood),
        currentMood: latestMoodCheckIn?.mood as MoodType | undefined,
        screenTimeToday: screenTimeToday?.totalMinutes || 0,
        lastCheckIn: latestMoodCheckIn?.createdAt || student.createdAt,
        
        // Additional StudentDetail fields
        moodDescription: latestMoodCheckIn?.description || null,
        hasActiveCounselor: true,
        counselorId: null, // TODO: Get actual counselor ID from relationship
        latestMood: latestMoodCheckIn?.mood || null,
        latestMoodDate: latestMoodCheckIn?.createdAt || null,
        riskScore: latestMoodCheckIn?.riskScore || null,
        totalSessions,
        upcomingSessions,
        graduationYear: null,
      }

      return {
        success: true,
        student: studentDetail,
      }
    } catch (error) {
      console.error('Error fetching student:', error)
      return {
        success: false,
        error: 'Database error',
        details: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  /**
     * Get students assigned to a counselor with their latest data
     */
    static async getStudents(counselorId: string): Promise<StudentTableData[]> {
      try {
        // Get counselor record
        const counselor = await db
          .select()
          .from(counselorsTable)
          .where(eq(counselorsTable.userId, counselorId))
          .limit(1)
  
        if (!counselor[0]) {
          console.log('Counselor not found for userId:', counselorId)
          return []
        }
  
        // Get students assigned to this counselor
        const studentRelations = await db
          .select({
            studentId: studentsTable.studentId,
            userId: studentsTable.userId,
            id: studentsTable.id,
            firstName: usersTable.firstName,
            lastName: usersTable.lastName,
            avatar: usersTable.avatar,
          })
          .from(counselorStudentTable)
          .innerJoin(studentsTable, eq(counselorStudentTable.studentId, studentsTable.id))
          .innerJoin(usersTable, eq(studentsTable.userId, usersTable.id))
          .where(eq(counselorStudentTable.counselorId, counselor[0].id))
  
        if (studentRelations.length === 0) {
          console.log('No students found for counselor:', counselor[0].id)
          return []
        }
  
        // Get latest mood check-ins for each student
        const studentUserIds = studentRelations.map((s) => s.userId)
  
        const latestMoodCheckIns = await db
          .select({
            userId: moodCheckInsTable.userId,
            mood: moodCheckInsTable.mood,
            riskScore: moodCheckInsTable.riskScore,
            createdAt: moodCheckInsTable.createdAt,
          })
          .from(moodCheckInsTable)
          .where(inArray(moodCheckInsTable.userId, studentUserIds))
          .orderBy(desc(moodCheckInsTable.createdAt))
  
        // Get today's screen time for each student
        const today = new Date()
        today.setHours(0, 0, 0, 0)
  
        const screenTimeData = await db
          .select({
            userId: screenTimeDataTable.userId,
            totalMinutes: sql<number>`COALESCE(SUM(${screenTimeDataTable.totalMinutes}), 0)::int`,
          })
          .from(screenTimeDataTable)
          .where(
            and(
              inArray(screenTimeDataTable.userId, studentUserIds),
              gte(screenTimeDataTable.date, today),
            ),
          )
          .groupBy(screenTimeDataTable.userId)
  
        // Create a map for quick lookup
        const moodMap = new Map()
        const screenTimeMap = new Map()
  
        // Group mood check-ins by user (keep only latest per user)
        latestMoodCheckIns.forEach((checkIn) => {
          if (!moodMap.has(checkIn.userId)) {
            moodMap.set(checkIn.userId, checkIn)
          }
        })
  
        screenTimeData.forEach((data) => {
          screenTimeMap.set(data.userId, data.totalMinutes)
        })
  
        // Calculate risk level based on mood and risk score
        const calculateRiskLevel = (
          riskScore?: number | null,
          mood?: string | null,
        ): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' => {
          if (!riskScore) return 'LOW'
          if (riskScore >= 8 || mood === 'VERY_SAD') return 'CRITICAL'
          if (riskScore >= 6 || mood === 'SAD' || mood === 'ANXIOUS') return 'HIGH'
          if (riskScore >= 4 || mood === 'STRESSED') return 'MEDIUM'
          return 'LOW'
        }
  
        // Map student data to StudentTableData format
        return studentRelations.map((student) => {
          const moodCheckIn = moodMap.get(student.userId)
          const screenTime = screenTimeMap.get(student.userId) || 0
  
          return {
            id: student.userId,
            studentId: student.studentId,
            name: `${student.firstName} ${student.lastName}`,
            lastCheckIn: moodCheckIn?.createdAt || undefined,
            riskLevel: calculateRiskLevel(moodCheckIn?.riskScore, moodCheckIn?.mood),
            currentMood: moodCheckIn?.mood as MoodType | undefined,
            screenTimeToday: screenTime,
            avatar: student.avatar || undefined,
          }
        })
      } catch (error) {
        console.error('Error fetching students:', error)
        return []
      }
    }
}
