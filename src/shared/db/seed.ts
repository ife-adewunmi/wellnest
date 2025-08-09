import * as dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import { randomUUID } from 'crypto'
import { db } from '@/shared/db'
import {
  users,
  counselors,
  students,
  counselorStudent,
  sessions,
  counselorNotes,
  moodCheckIns,
  screenTimeData,
  screenTimeSessions,
  screenTimeThresholds,
  notifications,
  messages,
  riskThresholds,
} from '@/shared/db/schema'
import { inArray } from 'drizzle-orm'

// Helpful inferred insert types from Drizzle
type NewUser = typeof users.$inferInsert
type NewCounselor = typeof counselors.$inferInsert
type NewStudent = typeof students.$inferInsert
type NewAssignment = typeof counselorStudent.$inferInsert
type NewSession = typeof sessions.$inferInsert
type NewNote = typeof counselorNotes.$inferInsert
type NewMood = typeof moodCheckIns.$inferInsert
type NewScreenData = typeof screenTimeData.$inferInsert
type NewScreenSession = typeof screenTimeSessions.$inferInsert
type NewScreenThreshold = typeof screenTimeThresholds.$inferInsert
type NewNotification = typeof notifications.$inferInsert
type NewMessage = typeof messages.$inferInsert
type NewRiskThreshold = typeof riskThresholds.$inferInsert

// Load env (DATABASE_URL)
dotenv.config({ path: '.env.local' })

async function hashPassword(plain: string) {
  const saltRounds = 12
  return bcrypt.hash(plain, saltRounds)
}

async function main() {
  console.log('🌱 Seeding database...')

  // 1) Create two counselor users and seven student users
  const counselorUsers: NewUser[] = [
    {
      firstName: 'Ada',
      lastName: 'Okafor',
      email: 'ada.okafor@wellnest.test',
      role: 'COUNSELOR',
      password: await hashPassword('Password123!'),
      phoneNumber: '+2348000000001',
    },
    {
      firstName: 'Kunle',
      lastName: 'Bello',
      email: 'kunle.bello@wellnest.test',
      role: 'COUNSELOR',
      password: await hashPassword('Password123!'),
      phoneNumber: '+2348000000002',
    },
  ]

  const studentUsers: NewUser[] = [
    {
      firstName: 'Ife',
      lastName: 'Adewunmi',
      email: 'ife.adewunmi@student.test',
      role: 'STUDENT',
      password: await hashPassword('Password123!'),
    },
    {
      firstName: 'Tunde',
      lastName: 'Balogun',
      email: 'tunde.balogun@student.test',
      role: 'STUDENT',
      password: await hashPassword('Password123!'),
    },
    {
      firstName: 'Bisi',
      lastName: 'Ojo',
      email: 'bisi.ojo@student.test',
      role: 'STUDENT',
      password: await hashPassword('Password123!'),
    },
    {
      firstName: 'Emeka',
      lastName: 'Nwosu',
      email: 'emeka.nwosu@student.test',
      role: 'STUDENT',
      password: await hashPassword('Password123!'),
    },
    {
      firstName: 'Zara',
      lastName: 'Ahmed',
      email: 'zara.ahmed@student.test',
      role: 'STUDENT',
      password: await hashPassword('Password123!'),
    },
    {
      firstName: 'Chidi',
      lastName: 'Okeke',
      email: 'chidi.okeke@student.test',
      role: 'STUDENT',
      password: await hashPassword('Password123!'),
    },
    {
      firstName: 'Sade',
      lastName: 'Adeyemi',
      email: 'sade.adeyemi@student.test',
      role: 'STUDENT',
      password: await hashPassword('Password123!'),
    },
  ]

  // Insert users if they don't already exist (idempotent-ish seeding)
  const existing = await db
    .select({ id: users.id, email: users.email })
    .from(users)
    .where(
      inArray(
        users.email,
        [...counselorUsers, ...studentUsers].map((u) => u.email),
      ),
    )

  const existingEmails = new Set(existing.map((e) => e.email))
  const usersToInsert = [...counselorUsers, ...studentUsers].filter(
    (u) => !existingEmails.has(u.email),
  )

  if (usersToInsert.length) {
    await db.insert(users).values(usersToInsert)
  }

  // Read back the users we care about
  const allSeedUsers = await db
    .select()
    .from(users)
    .where(
      inArray(
        users.email,
        [...counselorUsers, ...studentUsers].map((u) => u.email),
      ),
    )

  // Partition to counselors and students by role
  const counselorUserRows = allSeedUsers.filter((u) => u.role === 'COUNSELOR')
  const studentUserRows = allSeedUsers.filter((u) => u.role === 'STUDENT')

  // 2) Create counselor profiles
  const counselorProfilesInput: NewCounselor[] = [
    {
      userId: counselorUserRows.find((u) => u.email === 'ada.okafor@wellnest.test')!.id,
      employeeId: 'CNS-2001',
      department: 'Student Wellness',
      officeLocation: 'Block A, Room 12',
      specialization: ['Anxiety', 'Academic Stress'],
      qualifications: [
        { degree: 'BSc Psychology', institution: 'UNILAG', year: 2016 },
        { degree: 'MSc Counseling', institution: 'OAU', year: 2019 },
      ],
      workingHours: {
        monday: { start: '09:00', end: '16:00', available: true },
        tuesday: { start: '09:00', end: '16:00', available: true },
        wednesday: { start: '09:00', end: '16:00', available: true },
        thursday: { start: '09:00', end: '16:00', available: true },
        friday: { start: '09:00', end: '15:00', available: true },
        saturday: { start: '00:00', end: '00:00', available: false },
        sunday: { start: '00:00', end: '00:00', available: false },
      },
      maxStudents: 50,
      isAcceptingNewStudents: true,
      emergencyContact: {
        name: 'Ngozi Okafor',
        relationship: 'Sister',
        phone: '+2348000000101',
        email: 'ngozi.okafor@example.com',
      },
      settings: {
        notifications: {
          newAssignments: true,
          crisisAlerts: true,
          sessionReminders: true,
          studentMoodChanges: true,
          riskLevelChanges: true,
          emailDigest: false,
        },
        preferences: {
          autoAcceptAssignments: false,
          showStudentRiskScores: true,
          enableMoodTrends: true,
        },
      },
    },
    {
      userId: counselorUserRows.find((u) => u.email === 'kunle.bello@wellnest.test')!.id,
      employeeId: 'CNS-2002',
      department: 'Student Wellness',
      officeLocation: 'Block B, Room 3',
      specialization: ['Depression', 'Time Management'],
      qualifications: [
        { degree: 'BEd Guidance and Counseling', institution: 'UI', year: 2015 },
        { degree: 'MEd Counseling', institution: 'UI', year: 2018 },
      ],
      workingHours: {
        monday: { start: '10:00', end: '17:00', available: true },
        tuesday: { start: '10:00', end: '17:00', available: true },
        wednesday: { start: '10:00', end: '17:00', available: true },
        thursday: { start: '10:00', end: '17:00', available: true },
        friday: { start: '10:00', end: '15:00', available: true },
        saturday: { start: '00:00', end: '00:00', available: false },
        sunday: { start: '00:00', end: '00:00', available: false },
      },
      maxStudents: 40,
      isAcceptingNewStudents: true,
      emergencyContact: {
        name: 'Folake Bello',
        relationship: 'Wife',
        phone: '+2348000000102',
        email: 'folake.bello@example.com',
      },
      settings: {
        notifications: {
          newAssignments: true,
          crisisAlerts: true,
          sessionReminders: true,
          studentMoodChanges: true,
          riskLevelChanges: true,
          emailDigest: true,
        },
        preferences: {
          autoAcceptAssignments: true,
          showStudentRiskScores: true,
          enableMoodTrends: true,
        },
      },
    },
  ]

  // Insert counselor profiles if missing
  const existingCounselorProfiles = await db
    .select({ userId: counselors.userId })
    .from(counselors)
    .where(
      inArray(
        counselors.userId,
        counselorProfilesInput.map((c) => c.userId),
      ),
    )
  const existingCounselorUserIds = new Set(existingCounselorProfiles.map((c) => c.userId))
  const counselorProfilesToInsert = counselorProfilesInput.filter(
    (c) => !existingCounselorUserIds.has(c.userId),
  )
  if (counselorProfilesToInsert.length) {
    await db.insert(counselors).values(counselorProfilesToInsert)
  }

  const counselorProfiles = await db
    .select()
    .from(counselors)
    .where(
      inArray(
        counselors.userId,
        counselorProfilesInput.map((c) => c.userId),
      ),
    )

  // 3) Create student profiles
  // Student IDs based on provided patterns
  const studentIds = [
    'CSC/20/19283',
    'BOT/21/7547',
    'MCB/25/17293',
    'STA/19/2560',
    'CSC/23/6844',
    'PHY/22/10234', // added following same pattern
    'MAT/24/5678', // added following same pattern
  ]

  const departments = [
    'Computer Science',
    'Botany',
    'Microbiology',
    'Statistics',
    'Computer Science',
    'Physics',
    'Mathematics',
  ]
  const faculties = ['Science', 'Science', 'Science', 'Science', 'Science', 'Science', 'Science']
  const levels = ['300', '200', '100', '400', '200', '300', '100'] as const
  const admissionYears = [2020, 2021, 2025, 2019, 2023, 2022, 2024]

  const studentProfilesInput: NewStudent[] = studentUserRows.map((u, idx) => ({
    userId: u.id,
    studentId: studentIds[idx],
    matricNumber: `${studentIds[idx].replaceAll('/', '')}`,
    department: departments[idx],
    faculty: faculties[idx],
    level: levels[idx],
    admissionYear: admissionYears[idx],
    gender: idx % 2 === 0 ? 'MALE' : 'FEMALE',
    nationality: 'Nigerian',
    stateOfOrigin: 'Lagos',
    homeAddress: `No. ${10 + idx} Example Street, Lagos`,
    emergencyContact: {
      name: idx % 2 === 0 ? 'John Doe' : 'Jane Doe',
      relationship: 'Parent',
      phone: `+23480000002${(10 + idx).toString().padStart(2, '0')}`,
      email: `parent${idx + 1}@example.com`,
      address: '123 Parent Street, Lagos',
    },
    medicalInfo: {
      allergies: idx % 2 === 0 ? ['Peanuts'] : [],
      medications: [],
      conditions: [],
      emergencyMedicalContact: {
        name: 'Dr. Smith',
        phone: '+2348000000999',
        relationship: 'Family Doctor',
      },
    },
    academicInfo: {
      gpa: 3.0 + (idx % 5) * 0.2,
      currentCourses: ['GNS 101', 'CSC 201'],
      academicStanding: 'Good',
      previousInstitutions: [],
    },
    consentScreenTime: idx % 2 === 0,
    consentSocialMedia: idx % 3 === 0,
    consentDataSharing: true,
    settings: {
      notifications: {
        sessionReminders: true,
        moodCheckReminders: true,
        crisisSupport: true,
        generalUpdates: true,
      },
      privacy: {
        shareDataWithCounselor: true,
        allowMoodTracking: true,
        allowScreenTimeTracking: true,
        allowSocialMediaAnalysis: false,
      },
    },
  }))

  const existingStudentProfiles = await db
    .select({ userId: students.userId })
    .from(students)
    .where(
      inArray(
        students.userId,
        studentProfilesInput.map((s) => s.userId),
      ),
    )
  const existingStudentUserIds = new Set(existingStudentProfiles.map((s) => s.userId))
  const studentsToInsert = studentProfilesInput.filter((s) => !existingStudentUserIds.has(s.userId))
  if (studentsToInsert.length) {
    await db.insert(students).values(studentsToInsert)
  }

  const studentProfiles = await db
    .select()
    .from(students)
    .where(
      inArray(
        students.userId,
        studentProfilesInput.map((s) => s.userId),
      ),
    )

  // 4) Assign students to counselors via counselor_student
  // Counselor A -> 2 students, Counselor B -> 3 students (remaining 2 unassigned)
  const counselorA = counselorProfiles[0]
  const counselorB = counselorProfiles[1]

  const studentsForA = studentProfiles.slice(0, 2) // first two
  const studentsForB = studentProfiles.slice(2, 5) // next three

  const assignmentsInput: NewAssignment[] = [
    ...studentsForA.map((s) => ({
      counselorId: counselorA.id,
      studentId: s.id,
      status: 'ACTIVE' as const,
    })),
    ...studentsForB.map((s) => ({
      counselorId: counselorB.id,
      studentId: s.id,
      status: 'ACTIVE' as const,
    })),
  ]

  // Avoid duplicate assignments
  const existingAssignments = await db
    .select()
    .from(counselorStudent)
    .where(
      inArray(
        counselorStudent.studentId,
        assignmentsInput.map((a) => a.studentId),
      ),
    )

  const existingAssignmentKeys = new Set(
    existingAssignments.map((a) => `${a.counselorId}:${a.studentId}`),
  )

  const assignmentsToInsert = assignmentsInput.filter(
    (a) => !existingAssignmentKeys.has(`${a.counselorId}:${a.studentId}`),
  )
  if (assignmentsToInsert.length) {
    await db.insert(counselorStudent).values(assignmentsToInsert)
  }

  // 5) Create sample sessions (sessions table references users ids)
  const counselorAUserId = counselorUserRows.find((u) => u.email === 'ada.okafor@wellnest.test')!.id
  const counselorBUserId = counselorUserRows.find(
    (u) => u.email === 'kunle.bello@wellnest.test',
  )!.id
  const sessionsInput: NewSession[] = [
    {
      counselorId: counselorAUserId,
      studentId: studentUserRows[0].id,
      title: 'Initial Intake',
      description: 'Discuss general wellbeing and academic concerns',
      scheduledAt: new Date(Date.now() + 24 * 3600 * 1000),
      duration: 60,
      status: 'SCHEDULED' as const,
    },
    {
      counselorId: counselorBUserId,
      studentId: studentUserRows[2].id,
      title: 'Follow-up Session',
      description: 'Review progress and set new goals',
      scheduledAt: new Date(Date.now() + 48 * 3600 * 1000),
      duration: 45,
      status: 'SCHEDULED' as const,
    },
  ]
  await db.insert(sessions).values(sessionsInput)

  // 6) Counselor notes
  const notesInput: NewNote[] = [
    {
      counselorId: counselorAUserId,
      studentId: studentUserRows[0].id,
      title: 'Intake Summary',
      content:
        'Student reports moderate stress due to workload; recommend time management strategies.',
      tags: ['intake', 'stress'],
      isPrivate: false,
    },
    {
      counselorId: counselorBUserId,
      studentId: studentUserRows[2].id,
      title: 'Progress Note',
      content: 'Improvement observed in mood over past week.',
      tags: ['progress'],
      isPrivate: true,
    },
  ]
  await db.insert(counselorNotes).values(notesInput)

  // 7) Mood check-ins for a few students
  const moodInput: NewMood[] = [
    {
      userId: studentUserRows[0].id,
      mood: 'STRESSED' as const,
      socialMediaImpact: false,
      influences: ['Assignments', 'Exams'],
      reasons: ['Heavy workload'],
      description: 'Feeling overwhelmed with deadlines.',
      riskScore: 65,
      riskLevel: 'MEDIUM' as const,
      mlAnalysis: {
        riskScore: 65,
        category: 'moderate',
        recommendations: ['Take breaks'],
        confidence: 0.82,
      },
      createdAt: new Date(),
    },
    {
      userId: studentUserRows[1].id,
      mood: 'HAPPY' as const,
      socialMediaImpact: true,
      influences: ['Friends'],
      reasons: ['Completed a project'],
      description: 'Feeling good after finishing a task.',
      riskScore: 20,
      riskLevel: 'LOW' as const,
      mlAnalysis: {
        riskScore: 20,
        category: 'low',
        recommendations: ['Keep it up'],
        confidence: 0.9,
      },
      createdAt: new Date(),
    },
  ]
  await db.insert(moodCheckIns).values(moodInput)

  // 8) Screen time data and thresholds
  const screenDataInput: NewScreenData[] = [
    {
      userId: studentUserRows[0].id,
      date: new Date(),
      totalMinutes: 240,
      nightTimeMinutes: 30,
      appUsage: [
        { appName: 'YouTube', minutes: 90, category: 'Entertainment' },
        { appName: 'VSCode', minutes: 120, category: 'Productivity' },
      ],
    },
    {
      userId: studentUserRows[1].id,
      date: new Date(),
      totalMinutes: 180,
      nightTimeMinutes: 10,
      appUsage: [
        { appName: 'Chrome', minutes: 100, category: 'Productivity' },
        { appName: 'Instagram', minutes: 50, category: 'Social' },
      ],
    },
  ]
  await db.insert(screenTimeData).values(screenDataInput)

  const screenThresholdsInput: NewScreenThreshold[] = [
    {
      userId: studentUserRows[0].id,
      dailyLimit: 180,
      weeklyLimit: 900,
      breakReminder: 30,
      enabled: true,
    },
    {
      userId: studentUserRows[1].id,
      dailyLimit: 200,
      weeklyLimit: 1000,
      breakReminder: 20,
      enabled: true,
    },
  ]
  await db.insert(screenTimeThresholds).values(screenThresholdsInput)

  const screenSessionsInput: NewScreenSession[] = [
    {
      id: `sess_${randomUUID()}`,
      userId: studentUserRows[0].id,
      startTime: new Date(Date.now() - 60 * 60 * 1000),
      endTime: new Date(),
      duration: 60,
      isActive: false,
      url: 'https://example.com/docs',
      userAgent: 'Mozilla/5.0',
      deviceType: 'Desktop',
    },
  ]
  await db.insert(screenTimeSessions).values(screenSessionsInput)

  // 9) Risk thresholds (counselors -> optionally for a student)
  const riskThresholdsInput: NewRiskThreshold[] = [
    {
      counselorId: counselorAUserId,
      studentId: studentUserRows[0].id,
      moodThreshold: 3,
      screenTimeThreshold: 200,
      nightTimeThreshold: 45,
      socialMediaRiskThreshold: 70,
      isGlobal: false,
    },
    {
      counselorId: counselorBUserId,
      studentId: null, // global for all their students
      moodThreshold: 2,
      screenTimeThreshold: 180,
      nightTimeThreshold: 60,
      socialMediaRiskThreshold: 75,
      isGlobal: true,
    },
  ]
  await db.insert(riskThresholds).values(riskThresholdsInput)

  // 10) Notifications and messages
  const notificationsInput: NewNotification[] = [
    {
      userId: studentUserRows[0].id,
      type: 'SESSION_REMINDER' as const,
      title: 'Session Reminder',
      message: 'You have a counseling session tomorrow.',
      data: { sessionId: 'auto' },
      isRead: false,
    },
    {
      userId: counselorAUserId,
      type: 'NEW_ASSIGNMENT' as const,
      title: 'New Student Assigned',
      message: 'A new student has been assigned to you.',
      data: {},
      isRead: false,
    },
  ]
  await db.insert(notifications).values(notificationsInput)

  const messagesInput: NewMessage[] = [
    {
      senderId: counselorAUserId,
      receiverId: studentUserRows[0].id,
      content: 'Hi, please remember to complete your mood check-in before our session.',
      isRead: false,
      createdAt: new Date(),
    },
    {
      senderId: studentUserRows[0].id,
      receiverId: counselorAUserId,
      content: 'Thanks, I will do that.',
      isRead: false,
      createdAt: new Date(),
    },
  ]
  await db.insert(messages).values(messagesInput)

  console.log('✅ Seeding complete!')
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Seeding failed:', err)
      process.exit(1)
    })
}
