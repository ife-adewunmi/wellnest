import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
  serial,
  bigint,
  unique,
  uuid,
  foreignKey,
  jsonb,
  date,
  pgEnum,
} from 'drizzle-orm/pg-core'

export const assignmentStatus = pgEnum('assignment_status', [
  'ACTIVE',
  'INACTIVE',
  'TRANSFERRED',
  'COMPLETED',
])
export const gender = pgEnum('gender', ['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'])
export const level = pgEnum('level', ['100', '200', '300', '400', '500', 'MASTERS', 'PHD'])
export const moodType = pgEnum('mood_type', [
  'HAPPY',
  'NEUTRAL',
  'SAD',
  'VERY_SAD',
  'ANXIOUS',
  'STRESSED',
])
export const notificationType = pgEnum('notification_type', [
  'MOOD_CHANGE',
  'SESSION_REMINDER',
  'CHECK_IN_REMINDER',
  'FLAGGED_POST',
  'SCREEN_TIME_RISK',
  'SYSTEM_UPDATE',
  'NEW_ASSIGNMENT',
  'CRISIS_ALERT',
])
export const pushSubscriptionStatus = pgEnum('push_subscription_status', ['ACTIVE', 'INACTIVE'])
export const riskLevel = pgEnum('risk_level', ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])
export const sessionStatus = pgEnum('session_status', [
  'SCHEDULED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
  'NO_SHOW',
  'RESCHEDULED',
])
export const sessionType = pgEnum('session_type', [
  'INDIVIDUAL',
  'GROUP',
  'CRISIS',
  'FOLLOW_UP',
  'INTAKE',
  'EMERGENCY',
])
export const userRole = pgEnum('user_role', ['STUDENT', 'COUNSELOR', 'ADMIN'])

export const screenTimeSessions = pgTable('screen_time_sessions', {
  id: text().primaryKey().notNull(),
  userId: text('user_id').notNull(),
  startTime: timestamp('start_time', { mode: 'string' }).notNull(),
  endTime: timestamp('end_time', { mode: 'string' }),
  duration: integer().default(0).notNull(),
  isActive: boolean('is_active').default(true),
  url: text().notNull(),
  userAgent: text('user_agent').notNull(),
  deviceType: text('device_type').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow(),
})

export const screenTimeThresholds = pgTable('screen_time_thresholds', {
  userId: text('user_id').primaryKey().notNull(),
  dailyLimit: integer('daily_limit').default(120).notNull(),
  weeklyLimit: integer('weekly_limit').default(600).notNull(),
  breakReminder: integer('break_reminder').default(30).notNull(),
  enabled: boolean().default(true),
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow(),
})

export const drizzleMigrations = pgTable('__drizzle_migrations__', {
  id: serial().primaryKey().notNull(),
  hash: text().notNull(),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  createdAt: bigint('created_at', { mode: 'number' }),
})

export const users = pgTable(
  'users',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    email: text().notNull(),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    role: userRole().default('STUDENT').notNull(),
    avatar: text(),
    phoneNumber: text('phone_number'),
    password: text().notNull(),
    isActive: boolean('is_active').default(true),
    lastLoginAt: timestamp('last_login_at', { mode: 'string' }),
    emailVerifiedAt: timestamp('email_verified_at', { mode: 'string' }),
    screenTimeConsent: boolean('screen_time_consent').default(false),
    screenTimeConsentDate: timestamp('screen_time_consent_date', { mode: 'string' }),
    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow(),
  },
  (table) => [unique('users_email_unique').on(table.email)],
)

export const counselors = pgTable(
  'counselors',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userId: uuid('user_id').notNull(),
    employeeId: text('employee_id'),
    specialization: jsonb(),
    qualifications: jsonb(),
    department: text(),
    officeLocation: text('office_location'),
    workingHours: jsonb('working_hours'),
    maxStudents: integer('max_students').default(50),
    isAcceptingNewStudents: boolean('is_accepting_new_students').default(true),
    emergencyContact: jsonb('emergency_contact'),
    settings: jsonb(),
    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'counselors_user_id_users_id_fk',
    }),
    unique('counselors_user_id_unique').on(table.userId),
    unique('counselors_employee_id_unique').on(table.employeeId),
  ],
)

export const students = pgTable(
  'students',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userId: uuid('user_id').notNull(),
    studentId: text('student_id').notNull(),
    matricNumber: text('matric_number'),
    department: text().notNull(),
    faculty: text(),
    level: level().notNull(),
    admissionYear: integer('admission_year').notNull(),
    gender: gender(),
    dateOfBirth: date('date_of_birth'),
    nationality: text(),
    stateOfOrigin: text('state_of_origin'),
    homeAddress: text('home_address'),
    emergencyContact: jsonb('emergency_contact'),
    medicalInfo: jsonb('medical_info'),
    academicInfo: jsonb('academic_info'),
    consentScreenTime: boolean('consent_screen_time').default(false),
    consentSocialMedia: boolean('consent_social_media').default(false),
    consentDataSharing: boolean('consent_data_sharing').default(false),
    settings: jsonb(),
    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'students_user_id_users_id_fk',
    }),
    unique('students_user_id_unique').on(table.userId),
    unique('students_student_id_unique').on(table.studentId),
    unique('students_matric_number_unique').on(table.matricNumber),
  ],
)

export const counselorStudent = pgTable(
  'counselor_student',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    counselorId: uuid('counselor_id').notNull(),
    studentId: uuid('student_id').notNull(),
    status: assignmentStatus().default('ACTIVE'),
    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.counselorId],
      foreignColumns: [counselors.id],
      name: 'counselor_student_counselor_id_counselors_id_fk',
    }),
    foreignKey({
      columns: [table.studentId],
      foreignColumns: [students.id],
      name: 'counselor_student_student_id_students_id_fk',
    }),
  ],
)

export const moodCheckIns = pgTable(
  'mood_check_ins',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userId: uuid('user_id').notNull(),
    mood: moodType().notNull(),
    socialMediaImpact: boolean('social_media_impact').default(false),
    influences: jsonb().default([]),
    reasons: jsonb(),
    description: text(),
    riskScore: integer('risk_score'),
    riskLevel: riskLevel('risk_level'),
    mlAnalysis: jsonb('ml_analysis'),
    syncedAt: timestamp('synced_at', { mode: 'string' }),
    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'mood_check_ins_user_id_users_id_fk',
    }),
  ],
)

export const riskThresholds = pgTable(
  'risk_thresholds',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    counselorId: uuid('counselor_id').notNull(),
    studentId: uuid('student_id'),
    moodThreshold: integer('mood_threshold').default(3),
    screenTimeThreshold: integer('screen_time_threshold').default(180),
    nightTimeThreshold: integer('night_time_threshold').default(60),
    socialMediaRiskThreshold: integer('social_media_risk_threshold').default(70),
    isGlobal: boolean('is_global').default(false),
    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.counselorId],
      foreignColumns: [users.id],
      name: 'risk_thresholds_counselor_id_users_id_fk',
    }),
    foreignKey({
      columns: [table.studentId],
      foreignColumns: [users.id],
      name: 'risk_thresholds_student_id_users_id_fk',
    }),
  ],
)

export const screenTimeData = pgTable(
  'screen_time_data',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userId: uuid('user_id').notNull(),
    date: timestamp({ mode: 'string' }).notNull(),
    totalMinutes: integer('total_minutes').notNull(),
    nightTimeMinutes: integer('night_time_minutes').notNull(),
    appUsage: jsonb('app_usage'),
    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'screen_time_data_user_id_users_id_fk',
    }),
  ],
)

export const counselorNotes = pgTable(
  'counselor_notes',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    counselorId: uuid('counselor_id').notNull(),
    studentId: uuid('student_id').notNull(),
    title: text().notNull(),
    content: text().notNull(),
    tags: jsonb(),
    isPrivate: boolean('is_private').default(false),
    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.counselorId],
      foreignColumns: [users.id],
      name: 'counselor_notes_counselor_id_users_id_fk',
    }),
    foreignKey({
      columns: [table.studentId],
      foreignColumns: [users.id],
      name: 'counselor_notes_student_id_users_id_fk',
    }),
  ],
)

export const sessions = pgTable(
  'sessions',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    counselorId: uuid('counselor_id').notNull(),
    studentId: uuid('student_id').notNull(),
    title: text().notNull(),
    description: text(),
    scheduledAt: timestamp('scheduled_at', { mode: 'string' }).notNull(),
    duration: integer().notNull(),
    status: sessionStatus().default('SCHEDULED'),
    notes: text(),
    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.counselorId],
      foreignColumns: [users.id],
      name: 'sessions_counselor_id_users_id_fk',
    }),
    foreignKey({
      columns: [table.studentId],
      foreignColumns: [users.id],
      name: 'sessions_student_id_users_id_fk',
    }),
  ],
)

export const messages = pgTable(
  'messages',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    senderId: uuid('sender_id').notNull(),
    receiverId: uuid('receiver_id').notNull(),
    content: text().notNull(),
    isRead: boolean('is_read').default(false),
    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.senderId],
      foreignColumns: [users.id],
      name: 'messages_sender_id_users_id_fk',
    }),
    foreignKey({
      columns: [table.receiverId],
      foreignColumns: [users.id],
      name: 'messages_receiver_id_users_id_fk',
    }),
  ],
)

export const notifications = pgTable(
  'notifications',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userId: uuid('user_id').notNull(),
    type: notificationType().notNull(),
    title: text().notNull(),
    message: text().notNull(),
    data: jsonb(),
    isRead: boolean('is_read').default(false),
    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'notifications_user_id_users_id_fk',
    }),
  ],
)

export const pushSubscriptions = pgTable(
  'push_subscriptions',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userId: uuid('user_id').notNull(),
    endpoint: text().notNull(),
    p256Dh: text().notNull(),
    auth: text().notNull(),
    status: pushSubscriptionStatus().default('ACTIVE'),
    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'push_subscriptions_user_id_users_id_fk',
    }),
    unique('push_subscriptions_endpoint_unique').on(table.endpoint),
  ],
)
