import { pgTable, text, timestamp, integer, boolean, jsonb, uuid, date } from 'drizzle-orm/pg-core'
import { userRoleEnum, genderEnum, levelEnum } from '@/shared/enums/database'

// Base Users table - contains only essential shared data
export const usersTable = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  role: userRoleEnum('role').notNull().default('STUDENT'),
  avatar: text('avatar'),
  phoneNumber: text('phone_number'),
  password: text('password').notNull(),
  isActive: boolean('is_active').default(true),
  lastLoginAt: timestamp('last_login_at'),
  emailVerifiedAt: timestamp('email_verified_at'),
  screenTimeConsent: boolean('screen_time_consent').default(false),
  screenTimeConsentDate: timestamp('screen_time_consent_date'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Counselors table - specific data for counselors
export const counselorsTable = pgTable('counselors', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => usersTable.id)
    .notNull()
    .unique(),
  employeeId: text('employee_id').unique(),
  specialization: jsonb('specialization').$type<string[]>(),
  qualifications: jsonb('qualifications').$type<
    {
      degree: string
      institution: string
      year: number
      certification?: string
    }[]
  >(),
  department: text('department'),
  officeLocation: text('office_location'),
  workingHours: jsonb('working_hours').$type<{
    monday: { start: string; end: string; available: boolean }
    tuesday: { start: string; end: string; available: boolean }
    wednesday: { start: string; end: string; available: boolean }
    thursday: { start: string; end: string; available: boolean }
    friday: { start: string; end: string; available: boolean }
    saturday: { start: string; end: string; available: boolean }
    sunday: { start: string; end: string; available: boolean }
  }>(),
  maxStudents: integer('max_students').default(50),
  isAcceptingNewStudents: boolean('is_accepting_new_students').default(true),
  emergencyContact: jsonb('emergency_contact').$type<{
    name: string
    relationship: string
    phone: string
    email?: string
  }>(),
  settings: jsonb('settings').$type<{
    notifications: {
      newAssignments: boolean
      crisisAlerts: boolean
      sessionReminders: boolean
      studentMoodChanges: boolean
      riskLevelChanges: boolean
      emailDigest: boolean
    }
    preferences: {
      autoAcceptAssignments: boolean
      showStudentRiskScores: boolean
      enableMoodTrends: boolean
    }
  }>(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Students table - specific data for students
export const studentsTable = pgTable('students', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => usersTable.id)
    .notNull()
    .unique(),
  studentId: text('student_id').notNull().unique(),
  matricNumber: text('matric_number').unique(),
  department: text('department').notNull(),
  faculty: text('faculty'),
  level: levelEnum('level').notNull(),
  admissionYear: integer('admission_year').notNull(),
  gender: genderEnum('gender'),
  dateOfBirth: date('date_of_birth'),
  nationality: text('nationality'),
  stateOfOrigin: text('state_of_origin'),
  homeAddress: text('home_address'),
  emergencyContact: jsonb('emergency_contact').$type<{
    name: string
    relationship: string
    phone: string
    email?: string
    address?: string
  }>(),
  medicalInfo: jsonb('medical_info').$type<{
    allergies?: string[]
    medications?: string[]
    conditions?: string[]
    emergencyMedicalContact?: {
      name: string
      phone: string
      relationship: string
    }
  }>(),
  academicInfo: jsonb('academic_info').$type<{
    gpa?: number
    currentCourses?: string[]
    academicStanding?: string
    previousInstitutions?: {
      name: string
      degree: string
      year: number
    }[]
  }>(),
  consentScreenTime: boolean('consent_screen_time').default(false),
  consentSocialMedia: boolean('consent_social_media').default(false),
  consentDataSharing: boolean('consent_data_sharing').default(false),
  settings: jsonb('settings').$type<{
    notifications: {
      sessionReminders: boolean
      moodCheckReminders: boolean
      crisisSupport: boolean
      generalUpdates: boolean
    }
    privacy: {
      shareDataWithCounselor: boolean
      allowMoodTracking: boolean
      allowScreenTimeTracking: boolean
      allowSocialMediaAnalysis: boolean
    }
  }>(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})
