import { pgTable, timestamp, uuid } from 'drizzle-orm/pg-core'
import { assignmentStatusEnum } from '@/shared/enums/database'
import { counselorsTable } from './users'
import { studentsTable } from './users'

// Counselor-Student table
export const counselorStudentTable = pgTable('counselor_student', {
  id: uuid('id').primaryKey().defaultRandom(),
  counselorId: uuid('counselor_id')
    .references(() => counselorsTable.id)
    .notNull(),
  studentId: uuid('student_id')
    .references(() => studentsTable.id)
    .notNull(),
  status: assignmentStatusEnum('status').default('ACTIVE'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})
