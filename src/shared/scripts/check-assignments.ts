import { db } from '@/shared/db'
import { usersTable, counselorsTable, studentsTable } from '@/shared/db/schema/users'
import { counselorStudentTable } from '@/shared/db/schema/counselor-student'
import { eq } from 'drizzle-orm'

async function checkAssignments() {
  console.log('=== Checking Counselor-Student Assignments ===\n')

  // Get all counselors
  const counselors = await db
    .select({
      id: counselorsTable.id,
      userId: counselorsTable.userId,
      employeeId: counselorsTable.employeeId,
      firstName: usersTable.firstName,
      lastName: usersTable.lastName,
      email: usersTable.email,
    })
    .from(counselorsTable)
    .innerJoin(usersTable, eq(counselorsTable.userId, usersTable.id))

  console.log(`Found ${counselors.length} counselors:\n`)

  for (const counselor of counselors) {
    console.log(`\nCounselor: ${counselor.firstName} ${counselor.lastName} (${counselor.email})`)
    console.log(`  - Counselor ID: ${counselor.id}`)
    console.log(`  - User ID: ${counselor.userId}`)
    console.log(`  - Employee ID: ${counselor.employeeId}`)

    // Get students assigned to this counselor
    const assignments = await db
      .select({
        studentId: studentsTable.studentId,
        firstName: usersTable.firstName,
        lastName: usersTable.lastName,
        email: usersTable.email,
        status: counselorStudentTable.status,
      })
      .from(counselorStudentTable)
      .innerJoin(studentsTable, eq(counselorStudentTable.studentId, studentsTable.id))
      .innerJoin(usersTable, eq(studentsTable.userId, usersTable.id))
      .where(eq(counselorStudentTable.counselorId, counselor.id))

    console.log(`  - Assigned students (${assignments.length}):`)

    if (assignments.length === 0) {
      console.log('    (No students assigned)')
    } else {
      assignments.forEach((student) => {
        console.log(
          `    • ${student.firstName} ${student.lastName} (${student.studentId}) - ${student.email} [${student.status}]`,
        )
      })
    }
  }

  // Check for unassigned students
  console.log('\n=== Checking for Unassigned Students ===\n')

  const allStudents = await db
    .select({
      id: studentsTable.id,
      userId: studentsTable.userId,
      studentId: studentsTable.studentId,
      firstName: usersTable.firstName,
      lastName: usersTable.lastName,
      email: usersTable.email,
    })
    .from(studentsTable)
    .innerJoin(usersTable, eq(studentsTable.userId, usersTable.id))

  const assignedStudents = await db
    .select({
      studentId: counselorStudentTable.studentId,
    })
    .from(counselorStudentTable)

  const assignedStudentIds = new Set(assignedStudents.map((a) => a.studentId))
  const unassignedStudents = allStudents.filter((s) => !assignedStudentIds.has(s.id))

  console.log(`Total students: ${allStudents.length}`)
  console.log(`Assigned students: ${assignedStudents.length}`)
  console.log(`Unassigned students: ${unassignedStudents.length}\n`)

  if (unassignedStudents.length > 0) {
    console.log('Unassigned students:')
    unassignedStudents.forEach((student) => {
      console.log(
        `  • ${student.firstName} ${student.lastName} (${student.studentId}) - ${student.email}`,
      )
    })
  }

  // Check for duplicate assignments
  console.log('\n=== Checking for Duplicate Assignments ===\n')

  const allAssignments = await db
    .select({
      counselorId: counselorStudentTable.counselorId,
      studentId: counselorStudentTable.studentId,
    })
    .from(counselorStudentTable)

  const assignmentMap = new Map<string, number>()
  allAssignments.forEach((a) => {
    const count = assignmentMap.get(a.studentId) || 0
    assignmentMap.set(a.studentId, count + 1)
  })

  const duplicates = Array.from(assignmentMap.entries()).filter(([_, count]) => count > 1)

  if (duplicates.length > 0) {
    console.log('Students assigned to multiple counselors:')
    for (const [studentId, count] of duplicates) {
      const student = allStudents.find((s) => s.id === studentId)
      if (student) {
        console.log(
          `  • ${student.firstName} ${student.lastName} is assigned to ${count} counselors`,
        )
      }
    }
  } else {
    console.log('No duplicate assignments found.')
  }
}

checkAssignments()
  .then(() => {
    console.log('\n✅ Check complete!')
    process.exit(0)
  })
  .catch((err) => {
    console.error('❌ Error:', err)
    process.exit(1)
  })
