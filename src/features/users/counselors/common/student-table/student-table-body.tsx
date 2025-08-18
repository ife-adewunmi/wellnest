import { StudentTableRow } from './student-table-row'
import type { StudentTableBodyProps } from './types'

export function StudentTableBody({
  students,
  isLoading = false,
  maxRows = 5,
}: StudentTableBodyProps) {
  if (isLoading) {
    return (
      <tbody className="divide-y divide-gray-200 bg-white">
        <tr>
          <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-500">
            Loading students...
          </td>
        </tr>
      </tbody>
    )
  }

  if (students.length === 0) {
    return (
      <tbody className="divide-y divide-gray-200 bg-white">
        <tr>
          <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-500">
            No students assigned yet
          </td>
        </tr>
      </tbody>
    )
  }

  const displayedStudents = students.slice(0, maxRows)

  return (
    <tbody className="divide-y divide-gray-200 bg-white">
      {displayedStudents.map((student) => (
        <StudentTableRow key={student.id} student={student} />
      ))}
    </tbody>
  )
}
